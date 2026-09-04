"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/*
  ── Love Actually style sketchbook timeline ──
  One white sketchbook page per moment.
  Text types out letter by letter; when a page
  finishes typing, it flips over the spiral
  binding to reveal the next page.
  Tap the page to skip / advance.
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
const PAGE_PAUSE = 2000; // ms to rest on a finished page before flipping

function SpiralBinding() {
  return (
    <div className="absolute -top-3 left-0 right-0 flex justify-around px-6 sm:-top-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="relative h-6 w-3 sm:h-8 sm:w-4">
          {/* ring */}
          <div className="absolute inset-x-0 top-0 h-6 w-3 rounded-full border-2 border-neutral-500/80 sm:h-8 sm:w-4" />
          {/* hole punched in the paper */}
          <div className="absolute bottom-0 left-1/2 h-2.5 w-2.5 -translate-x-1/2 translate-y-1 rounded-full bg-[#0e0b16] sm:h-3 sm:w-3" />
        </div>
      ))}
    </div>
  );
}

export function SketchbookTimeline({
  pages,
  onImageClick,
}: {
  pages: SketchPage[];
  onImageClick?: (src: string, alt: string) => void;
}) {
  const [started, setStarted] = useState(false);
  const [pageIdx, setPageIdx] = useState(0);
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

  // auto-flip when the page finishes typing
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
    setPageIdx(Math.max(0, Math.min(idx, pages.length - 1)));
    setTitleChars(0);
    setDescChars(0);
  }

  function handleTap() {
    if (!pageDone) {
      // finish typing instantly
      setTitleChars(page.title.length);
      setDescChars(page.description.length);
    } else if (!isLast) {
      goTo(pageIdx + 1);
    }
  }

  return (
    <motion.div
      className="relative mx-auto mt-10 max-w-lg sm:mt-16"
      onViewportEnter={() => setStarted(true)}
      viewport={{ once: true, amount: 0.3 }}
      style={{ perspective: 1400 }}
    >
      <div className="relative">
        {/* stack shadow pages behind, for sketchbook depth */}
        <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-lg bg-white/70" />
        <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-lg bg-white/40" />

        <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={pageIdx}
          onClick={handleTap}
          className="relative min-h-[420px] cursor-pointer rounded-lg bg-white px-6 pb-8 pt-10 text-neutral-800 shadow-2xl sm:min-h-[480px] sm:px-10 sm:pt-12 select-none"
          style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -100, opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
        >
          <SpiralBinding />

          {/* date corner */}
          <p className="text-right font-display text-xs tracking-wide text-neutral-400 sm:text-sm">
            {page.emoji} {page.date} · {page.time}
          </p>

          {/* title — typed */}
          <h3 className="mt-6 font-display text-2xl leading-snug text-neutral-900 sm:mt-8 sm:text-4xl">
            {page.title.slice(0, titleChars)}
            {started && !titleDone && <Cursor dark />}
          </h3>

          {/* description — typed */}
          <p className="mt-4 min-h-[80px] font-display text-base leading-relaxed text-neutral-600 sm:mt-6 sm:text-xl">
            {page.description.slice(0, descChars)}
            {titleDone && !descDone && <Cursor dark />}
          </p>

          {/* polaroid photo */}
          {page.image && pageDone && (
            <motion.button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onImageClick?.(page.image!, page.title);
              }}
              className="mx-auto mt-4 block rotate-[-2deg] bg-white p-2 pb-6 shadow-lg ring-1 ring-black/5"
              initial={{ opacity: 0, y: 12, rotate: -6 }}
              animate={{ opacity: 1, y: 0, rotate: -2 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={page.image}
                alt={page.title}
                width={320}
                height={220}
                className="max-h-[180px] w-auto object-cover sm:max-h-[220px]"
              />
            </motion.button>
          )}

          {/* hint / end mark */}
          <div className="absolute bottom-3 left-0 right-0 text-center font-display text-[11px] text-neutral-300 sm:text-xs">
            {pageDone && (isLast ? "the end ♥" : "tap to continue →")}
          </div>
        </motion.div>
        </AnimatePresence>
      </div>

      {/* nav: arrows + dots */}
      <div className="mt-6 flex items-center justify-center gap-4">
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

function Cursor({ dark = false }: { dark?: boolean }) {
  return (
    <motion.span
      className={`inline-block ${dark ? "text-neutral-500" : ""}`}
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
