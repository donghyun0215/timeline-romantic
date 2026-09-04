"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/*
  ── Love Actually style sketchbook timeline ──
  Landscape sketchbook, spiral-bound on the left,
  viewed from a person's POV. Each moment is one page:
  text types out letter by letter, then the page turns
  like a real book — rotating around the left binding,
  showing the paper's backside and a travelling shadow.
  The bottom-right corner sits slightly curled,
  inviting you to turn the page.
*/

export interface SketchPage {
  emoji: string;
  time: string;
  date: string;
  title: string;
  description: string;
  image: string | null;
}

const TYPE_SPEED = 55; // ms per character — higher = slower
const TITLE_SPEED = 75; // title types slightly slower
const PAGE_PAUSE = 2200; // ms to rest on a finished page before turning
const FLIP_DURATION = 1.1; // seconds for the page turn

/* Spiral rings down the left edge — part of the book, so they never rotate */
function SpiralBinding() {
  return (
    <div className="absolute -left-2.5 top-0 bottom-0 z-40 flex flex-col justify-around py-4 sm:-left-3.5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="relative h-3 w-5 sm:h-4 sm:w-7">
          {/* ring */}
          <div
            className="absolute inset-y-0 left-0 w-5 rounded-full border-2 border-neutral-400 sm:w-7"
            style={{
              borderColor: "#8a8a8a",
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.45)",
            }}
          />
          {/* punched hole in the paper */}
          <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 translate-x-0.5 rounded-full bg-[#1a1523] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] sm:h-2.5 sm:w-2.5" />
        </div>
      ))}
    </div>
  );
}

/* The curled bottom-right corner — classic "turn me" page curl */
function PageCurl() {
  return (
    <motion.div
      className="pointer-events-none absolute bottom-0 right-0 z-20 h-10 w-10 sm:h-14 sm:w-14"
      animate={{ scale: [1, 1.12, 1] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "bottom right" }}
    >
      {/* dark gap revealed beneath the lifted corner */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(315deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.12) 12%, transparent 48%)",
          borderBottomRightRadius: 10,
        }}
      />
      {/* the folded-over paper (its backside) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(315deg, transparent 46%, #d9d9d9 50%, #ffffff 62%, #f2f2f2 78%, #e6e6e6 100%)",
          clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
          filter: "drop-shadow(-3px -3px 4px rgba(0,0,0,0.18))",
        }}
      />
    </motion.div>
  );
}

/* Paper surface shared by page front & back */
const PAPER_STYLE: React.CSSProperties = {
  background:
    // faint grain + soft vignette on plain white paper
    "radial-gradient(ellipse at 30% 20%, #ffffff 0%, #fdfdfd 55%, #f6f6f6 100%)",
};

export function SketchbookTimeline({
  pages,
  onImageClick,
}: {
  pages: SketchPage[];
  onImageClick?: (src: string, alt: string) => void;
}) {
  const [started, setStarted] = useState(false);
  const [pageIdx, setPageIdx] = useState(0);
  const [dir, setDir] = useState(1); // 1 = forward, -1 = back
  const [titleChars, setTitleChars] = useState(0);
  const [descChars, setDescChars] = useState(0);
  const flipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const page = pages[Math.min(pageIdx, pages.length - 1)];
  const titleDone = titleChars >= page.title.length;
  const descDone = descChars >= page.description.length;
  const pageDone = titleDone && descDone;
  const isLast = pageIdx >= pages.length - 1;

  // typewriter: title first, then description
  useEffect(() => {
    if (!started) return;
    if (!titleDone) {
      const t = setTimeout(() => setTitleChars((c) => c + 1), TITLE_SPEED);
      return () => clearTimeout(t);
    }
    if (!descDone) {
      const t = setTimeout(() => setDescChars((c) => c + 1), TYPE_SPEED);
      return () => clearTimeout(t);
    }
  }, [started, titleChars, descChars, titleDone, descDone, pageIdx]);

  // auto-turn the page when it finishes typing
  useEffect(() => {
    if (!started || !pageDone || isLast) return;
    flipTimer.current = setTimeout(() => goTo(pageIdx + 1), PAGE_PAUSE);
    return () => {
      if (flipTimer.current) clearTimeout(flipTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, pageDone, isLast, pageIdx]);

  function goTo(idx: number) {
    if (flipTimer.current) clearTimeout(flipTimer.current);
    const clamped = Math.max(0, Math.min(idx, pages.length - 1));
    if (clamped === pageIdx) return;
    setDir(clamped > pageIdx ? 1 : -1);
    setPageIdx(clamped);
    setTitleChars(0);
    setDescChars(0);
  }

  function handleTap() {
    if (!pageDone) {
      setTitleChars(page.title.length);
      setDescChars(page.description.length);
    } else if (!isLast) {
      goTo(pageIdx + 1);
    }
  }

  /*
    Page-turn choreography (book POV):
    - forward: the CURRENT page lifts from the right and rotates
      around the left binding (rotateY 0 → -178) on top of the
      next page, which is already lying flat beneath it.
    - back: the previous page swings back over from the left
      (rotateY -178 → 0) on top of the current one.
  */
  const variants = {
    enter: (d: number) =>
      d === 1
        ? { rotateY: 0, zIndex: 1 } // new page lies flat beneath
        : { rotateY: -178, zIndex: 40 }, // flips back over from the left
    center: (d: number) => ({
      rotateY: 0,
      zIndex: 10,
      transition:
        d === 1
          ? { duration: 0 }
          : { duration: FLIP_DURATION, ease: [0.45, 0.05, 0.35, 1] as const },
    }),
    exit: (d: number) =>
      d === 1
        ? {
            rotateY: -178,
            zIndex: 40,
            transition: { duration: FLIP_DURATION, ease: [0.45, 0.05, 0.35, 1] as const },
          }
        : { rotateY: 0, zIndex: 1, transition: { duration: FLIP_DURATION } },
  };

  /* travelling shade on the turning page (inherits variant timing) */
  const shadeVariants = {
    enter: { opacity: 0 },
    center: { opacity: 0 },
    exit: (d: number) =>
      d === 1
        ? { opacity: [0, 0.35, 0.15, 0], transition: { duration: FLIP_DURATION } }
        : { opacity: 0 },
  };

  return (
    <motion.div
      className="relative mx-auto mt-12 w-full max-w-3xl sm:mt-20"
      onViewportEnter={() => setStarted(true)}
      viewport={{ once: true, amount: 0.3 }}
      style={{ perspective: 1800 }}
    >
      <div className="relative ml-3 sm:ml-4" style={{ transformStyle: "preserve-3d" }}>
        {/* ── book body: remaining pages stacked beneath (right & bottom edges) ── */}
        <div className="absolute inset-0 translate-x-[3px] translate-y-[3px] rounded-r-lg rounded-bl-sm bg-[#efefef] shadow-md" />
        <div className="absolute inset-0 translate-x-[6px] translate-y-[6px] rounded-r-lg rounded-bl-sm bg-[#e2e2e2]" />
        <div className="absolute inset-0 translate-x-[9px] translate-y-[9px] rounded-r-lg rounded-bl-sm bg-[#d4d4d4] shadow-xl" />
        {/* cardboard back cover */}
        <div className="absolute inset-0 translate-x-[13px] translate-y-[13px] rounded-r-lg rounded-bl-sm bg-[#8a6f52] shadow-2xl" />

        <SpiralBinding />

        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={pageIdx}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            onClick={handleTap}
            className="relative min-h-[300px] cursor-pointer select-none rounded-r-lg rounded-bl-sm sm:min-h-[380px]"
            style={{
              transformOrigin: "left center",
              transformStyle: "preserve-3d",
            }}
          >
            {/* ══ FRONT of the page ══ */}
            <div
              className="relative flex min-h-[300px] flex-col rounded-r-lg rounded-bl-sm px-7 py-6 text-neutral-800 sm:min-h-[380px] sm:px-12 sm:py-9"
              style={{
                ...PAPER_STYLE,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                boxShadow:
                  "0 18px 45px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.25)",
              }}
            >
              {/* binding-side inner shadow (paper dips into the spiral) */}
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-10 rounded-bl-sm"
                style={{
                  background:
                    "linear-gradient(to right, rgba(0,0,0,0.10), rgba(0,0,0,0.03) 55%, transparent)",
                }}
              />

              {/* date corner */}
              <p className="text-right font-display text-xs tracking-wide text-neutral-400 sm:text-sm">
                {page.emoji} {page.date} · {page.time}
              </p>

              <div className={`mt-3 flex-1 gap-8 sm:mt-5 ${page.image ? "sm:flex sm:items-start" : ""}`}>
                <div className="flex-1">
                  {/* title — typed */}
                  <h3 className="font-display text-2xl leading-snug text-neutral-900 sm:text-4xl">
                    {page.title.slice(0, titleChars)}
                    {started && !titleDone && <Cursor />}
                  </h3>

                  {/* description — typed */}
                  <p className="mt-3 font-display text-base leading-relaxed text-neutral-600 sm:mt-5 sm:text-xl">
                    {page.description.slice(0, descChars)}
                    {titleDone && !descDone && <Cursor />}
                  </p>
                </div>

                {/* polaroid photo */}
                {page.image && pageDone && (
                  <motion.button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onImageClick?.(page.image!, page.title);
                    }}
                    className="mx-auto mt-5 block shrink-0 rotate-[2.5deg] bg-white p-2 pb-6 shadow-[0_6px_16px_rgba(0,0,0,0.25)] ring-1 ring-black/5 sm:mx-0 sm:mt-1"
                    initial={{ opacity: 0, y: 12, rotate: 8 }}
                    animate={{ opacity: 1, y: 0, rotate: 2.5 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Image
                      src={page.image}
                      alt={page.title}
                      width={280}
                      height={200}
                      className="max-h-[150px] w-auto object-cover sm:max-h-[190px]"
                    />
                  </motion.button>
                )}
              </div>

              {/* hint / end mark */}
              <div className="mt-4 text-center font-display text-[11px] text-neutral-300 sm:text-xs">
                {pageDone && (isLast ? "the end ♥" : "")}
              </div>

              <PageCurl />

              {/* travelling shade while this page turns */}
              <motion.div
                custom={dir}
                variants={shadeVariants}
                className="pointer-events-none absolute inset-0 rounded-r-lg rounded-bl-sm"
                style={{
                  background:
                    "linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0.15) 45%, transparent 80%)",
                }}
              />
            </div>

            {/* ══ BACK of the page (visible mid-turn) ══ */}
            <div
              className="absolute inset-0 rounded-r-lg rounded-bl-sm"
              style={{
                ...PAPER_STYLE,
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
              }}
            >
              {/* faint ink bleed-through */}
              <div
                className="absolute inset-0 rounded-r-lg rounded-bl-sm opacity-[0.05]"
                style={{
                  background:
                    "repeating-linear-gradient(0deg, transparent, transparent 26px, #777 27px)",
                }}
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 w-10"
                style={{
                  background:
                    "linear-gradient(to left, rgba(0,0,0,0.10), rgba(0,0,0,0.03) 55%, transparent)",
                }}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* nav: arrows + dots */}
      <div className="mt-8 flex items-center justify-center gap-4 sm:mt-10">
        <button
          type="button"
          aria-label="previous page"
          onClick={() => goTo(pageIdx - 1)}
          disabled={pageIdx === 0}
          className="rounded-full border border-white/10 px-3 py-1 text-sm text-white/50 transition hover:border-plum/40 hover:text-plum disabled:opacity-20"
        >
          ‹
        </button>
        <div className="flex gap-1.5">
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`page ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === pageIdx ? "w-5 bg-plum" : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="next page"
          onClick={() => goTo(pageIdx + 1)}
          disabled={isLast}
          className="rounded-full border border-white/10 px-3 py-1 text-sm text-white/50 transition hover:border-plum/40 hover:text-plum disabled:opacity-20"
        >
          ›
        </button>
      </div>
    </motion.div>
  );
}

function Cursor() {
  return (
    <motion.span
      className="inline-block text-neutral-500"
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
    >
      _
    </motion.span>
  );
}

/*
  ── Background music toggle ──
  Browsers block autoplay with sound, so music
  starts only when the user taps the button.
  Track: "Heartwarming" — Kevin MacLeod (incompetech.com)
  Licensed under Creative Commons: By Attribution 4.0
*/
export function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.volume = 0.5;
      el.play().then(() => setPlaying(true)).catch(() => {});
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/music/bg-music.mp3" loop preload="none" />
      <motion.button
        type="button"
        onClick={toggle}
        aria-label={playing ? "pause music" : "play music"}
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-orchid/40 bg-[#0e0b16]/80 text-lg backdrop-blur-md transition hover:border-plum/60 sm:bottom-6 sm:right-6"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        animate={playing ? { boxShadow: ["0 0 0px rgba(255,170,234,0.0)", "0 0 24px rgba(255,170,234,0.35)", "0 0 0px rgba(255,170,234,0.0)"] } : {}}
        transition={playing ? { duration: 2, repeat: Infinity } : {}}
      >
        {playing ? "🎵" : "🔇"}
      </motion.button>
    </>
  );
}
