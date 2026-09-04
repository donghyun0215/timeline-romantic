"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/animations";
import { FloatingHearts } from "@/components/floating-hearts";
import { SectionDivider } from "@/components/section-divider";
import { FoldCard, FoldSection } from "@/components/fold-card";
import { ImageModal } from "@/components/image-modal";
import Image from "next/image";



/*
  ╔══════════════════════════════════════════════════╗
  ║  ✏️  EDIT YOUR TIMELINE HERE                    ║
  ║  Each object = one card on the page.            ║
  ║  Change title, time, date, description freely.  ║
  ╚══════════════════════════════════════════════════╝
*/

interface TimelineItem {
  emoji: string;
  time: string;
  date: string;
  title: string;
  description: string;
  image: string | null;
}

const TIMELINE: TimelineItem[] = [
  {
    emoji: "💬",
    time: "00:00",
    date: "DD Month YYYY",
    title: "The First Message",
    description:
      "Replace this with how your story began. That first message, that first hello - the moment that started everything.",
    image: null,
  },
  {
    emoji: "💘",
    time: "00:00",
    date: "DD Month YYYY",
    title: "The Confession",
    description:
      "Replace this with your confession story. How did you tell them how you feel? What made it special?",
    image: null,
  },
  {
    emoji: "💍",
    time: "00:00",
    date: "DD Month YYYY",
    title: "They Said Yes",
    description:
      "Replace this with the moment they said yes. That one word that changed everything.",
    image: null,
  },
  {
    emoji: "💕",
    time: "00:00",
    date: "DD Month YYYY",
    title: "First \"I Love You\"",
    description:
      "Replace this with your first \"I love you\" moment. The words that made it all real.",
    image: null,
  },
  {
    emoji: "🦋",
    time: "00:00",
    date: "DD Month YYYY",
    title: "Getting to Know Each Other",
    description:
      "Replace this with a meaningful conversation or detail you discovered about each other.",
    image: null,
  },
  {
    emoji: "🤗",
    time: "00:00",
    date: "DD Month YYYY",
    title: "A Sweet Moment",
    description:
      "Replace this with a sweet, tender moment you shared - a virtual hug, a kind gesture, or a warm exchange.",
    image: null,
  },
  {
    emoji: "🧸",
    time: "00:00",
    date: "DD Month YYYY",
    title: "Making It Official ♥",
    description:
      "Replace this with the moment it all became official. When the labels stopped mattering because the love was already real.",
    image: null,
  },
];

/*
  ╔══════════════════════════════════════════════════╗
  ║  ✏️  EDIT YOUR "YOU & ME" WORDS HERE            ║
  ║  These float around the centre piece.           ║
  ╚══════════════════════════════════════════════════╝
*/
/*
  ╔══════════════════════════════════════════════════╗
  ║  ✏️  EDIT YOUR LETTER HERE                      ║
  ║  Each line types out letter-by-letter on scroll ║
  ╚══════════════════════════════════════════════════╝
*/
const LETTER_LINES: { text: string; className: string }[] = [
  {
    text: "Dear Mee So,",
    className: "font-signature text-2xl text-plum sm:text-3xl md:text-4xl",
  },
  {
    text: "Replace this paragraph with your own words. Tell them how you feel, what made you notice them, why they matter to you.",
    className: "mt-4 text-xs leading-relaxed text-white/60 sm:mt-6 sm:text-sm",
  },
  {
    text: "Write something honest. Something that sounds like you. You don't need perfect words - just real ones.",
    className: "mt-3 text-xs leading-relaxed text-white/60 sm:mt-4 sm:text-sm",
  },
  {
    text: "Talk about your hopes, your dreams for the two of you. What do you want to build together? What kind of future do you picture?",
    className: "mt-3 text-xs leading-relaxed text-white/60 sm:mt-4 sm:text-sm",
  },
  {
    text: "And finally, tell them what you need from them. Honesty. Patience. A chance. Whatever feels true.",
    className: "mt-3 text-xs leading-relaxed text-white/60 sm:mt-4 sm:text-sm",
  },
  {
    text: "Sign it with something personal. A time, a date, a feeling. Make it yours.",
    className: "mt-3 text-xs leading-relaxed text-white/80 sm:mt-4 sm:text-sm",
  },
  {
    text: "Forever yours \u2665",
    className: "mt-6 font-signature text-xl text-saffron/60 sm:mt-8 sm:text-2xl",
  },
];

/*
  Typewriter effect \u2014 types each line character by character
  (with a blinking cursor), one line after another,
  starting when the letter scrolls into view.
*/
function TypewriterLetter({ lines }: { lines: { text: string; className: string }[] }) {
  const [started, setStarted] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    if (!started || lineIdx >= lines.length) return;
    const current = lines[lineIdx].text;
    if (charIdx < current.length) {
      // ⬇ typing speed per character (ms) — higher = slower
      const t = setTimeout(() => setCharIdx((c) => c + 1), 70);
      return () => clearTimeout(t);
    }
    // ⬇ pause between lines (ms)
    const t = setTimeout(() => {
      setLineIdx((i) => i + 1);
      setCharIdx(0);
    }, 600);
    return () => clearTimeout(t);
  }, [started, lineIdx, charIdx, lines]);

  const allDone = lineIdx >= lines.length;

  return (
    <motion.div
      className="min-h-[220px]"
      onViewportEnter={() => setStarted(true)}
      viewport={{ once: true, amount: 0.2 }}
    >
      {lines.map((line, i) => {
        if (i > lineIdx) return null; // not reached yet
        const done = i < lineIdx;
        const shown = done ? line.text : line.text.slice(0, charIdx);
        const typing = i === lineIdx && started && !allDone;
        return (
          <p key={i} className={line.className}>
            {shown}
            {typing && (
              <motion.span
                className="inline-block"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
              >
                _
              </motion.span>
            )}
          </p>
        );
      })}
    </motion.div>
  );
}

const FLOATING_WORDS = [
  "chase your dreams",
  "i'm rooting for you",
  "proud of you",
  "you appeared",
  "grateful",
  "shine on",
  "my miracle",
  "always cheering",
];

export default function Home() {
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <main className="relative overflow-x-hidden">
      <FloatingHearts />

      {/* ═══════════ HERO ═══════════ */}
      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 text-center sm:px-6"
      >
        {/* Gradient orbs — smaller on mobile */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-48 w-48 rounded-full bg-orchid/20 blur-[80px] sm:h-96 sm:w-96 sm:blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 h-40 w-40 rounded-full bg-plum/15 blur-[60px] sm:h-80 sm:w-80 sm:blur-[100px]" />
          <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-powder/10 blur-[50px] sm:h-64 sm:w-64 sm:blur-[80px]" />
        </div>

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="relative z-10"
        >
          <Reveal variant="fadeDown" duration={0.8}>
            <motion.p
              className="text-xs font-medium tracking-[0.3em] uppercase text-plum sm:text-sm"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              They said yes 💍
            </motion.p>
          </Reveal>

          <Reveal variant="scaleUp" delay={0.2} duration={1}>
            <h1 className="mt-4 font-display text-5xl leading-tight tracking-tight sm:mt-6 sm:text-8xl md:text-9xl">
              <motion.span
                className="bg-gradient-to-r from-plum via-saffron to-powder bg-[length:300%_100%] bg-clip-text text-transparent"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              >
                Mee So 미소
              </motion.span>
            </h1>
          </Reveal>

          <Reveal variant="blur" delay={0.5}>
            <p className="mx-auto mt-4 max-w-sm font-signature text-xl text-plum/70 sm:mt-6 sm:max-w-lg sm:text-2xl md:text-3xl">
              my forever, my everything
            </p>
          </Reveal>

          <Reveal variant="fadeUp" delay={0.7}>
            <p className="mx-auto mt-4 max-w-xs text-xs leading-relaxed text-white/50 sm:mt-6 sm:max-w-md sm:text-sm">
              Replace this with the date and time your story began. This little corner
              of the internet is yours to fill.
            </p>
          </Reveal>

          <Reveal variant="fadeUp" delay={0.9}>
            <motion.a
              href="#our-story"
              className="animate-pulse-glow group mt-8 inline-flex items-center gap-2 rounded-full border border-orchid/30 bg-orchid/10 px-6 py-2.5 text-xs font-medium text-plum backdrop-blur-sm transition-all duration-300 hover:border-orchid/60 hover:bg-orchid/20 sm:mt-10 sm:px-8 sm:py-3 sm:text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Our Story
              <motion.span
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ↓
              </motion.span>
            </motion.a>
          </Reveal>
        </motion.div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0e0b16] to-transparent sm:h-32" />
      </section>

      {/* ═══════════ TIMELINE — folding cards ═══════════ */}
      <section id="our-story" className="relative px-4 py-20 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-3xl">
          <Reveal variant="fadeUp">
            <h2 className="text-center font-heading text-3xl tracking-wide text-plum sm:text-4xl md:text-5xl">
              <motion.span
                whileInView={{ backgroundSize: ["0% 2px", "100% 2px"] }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                style={{
                  backgroundImage: "linear-gradient(to right, #FFAAEA, #98C1D9)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "bottom center",
                  backgroundSize: "0% 2px",
                  paddingBottom: 4,
                }}
              >
                Our Story
              </motion.span>
            </h2>
            <p className="mt-3 text-center text-xs text-white/40 sm:mt-4 sm:text-sm">
              One day. Many moments. A lifetime beginning.
            </p>
          </Reveal>

          {/* Timeline with fold-in cards */}
          <div className="relative mt-8 sm:mt-20">
            {/* Vertical line — desktop only */}
            <motion.div
              className="absolute left-1/2 top-0 hidden h-full w-px sm:block"
              style={{ background: "linear-gradient(to bottom, rgba(99,29,118,0.6), rgba(255,170,234,0.3), transparent)", transformOrigin: "top" }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />

            {TIMELINE.map((item, i) => (
              <FoldCard key={i} index={i} className="relative mb-5 last:mb-0 sm:mb-16">
                <div
                  className={`flex items-start sm:gap-16 ${
                    i % 2 === 0
                      ? "sm:flex-row"
                      : "sm:flex-row-reverse sm:text-right"
                  }`}
                >
                  {/* Dot on timeline — desktop only */}
                  <div className="absolute left-1/2 top-6 z-10 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:flex">
                    <motion.span
                      className="absolute h-4 w-4 rounded-full border-2 border-orchid bg-[#0e0b16]"
                      whileInView={{ scale: [0, 1.2, 1] }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    />
                    <motion.span
                      className="absolute h-2 w-2 rounded-full bg-plum"
                      whileInView={{ scale: [0, 1] }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.1 + 0.2 }}
                    />
                  </div>

                  {/* Content card */}
                  <div
                    className={`w-full overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] transition-all duration-300 hover:border-orchid/20 hover:bg-white/[0.06] sm:w-[calc(50%-2rem)] ${
                      i % 2 === 0 ? "" : "sm:ml-auto"
                    }`}
                  >
                    {/* Text content */}
                    <div className="p-4 sm:p-6">
                      <div
                        className={`flex items-center gap-2 sm:gap-3 ${
                          i % 2 !== 0 ? "sm:flex-row-reverse" : ""
                        }`}
                      >
                        <motion.span
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-orchid/20 text-base sm:h-8 sm:w-8"
                          whileInView={{ rotate: [0, 10, -10, 0] }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: i * 0.15 }}
                        >
                          {item.emoji}
                        </motion.span>
                        <div className="flex items-center gap-2">
                          <time className="text-[10px] font-medium tracking-wider text-saffron/70 uppercase sm:text-xs">
                            {item.time}
                          </time>
                          <span className="text-[9px] text-white/20 sm:text-[10px]">•</span>
                          <span className="text-[9px] text-white/25 sm:text-[10px]">
                            {item.date}
                          </span>
                        </div>
                      </div>
                      <h3 className="mt-2 font-display text-lg text-white sm:mt-3 sm:text-xl">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-white/50 sm:mt-2 sm:text-sm">
                        {item.description}
                      </p>
                    </div>

                    {/* Chat screenshot — tap to open modal */}
                    {item.image && (
                      <button
                        type="button"
                        onClick={() => setModalImage({ src: item.image!, alt: item.title })}
                        className="block w-full border-t border-white/5 active:opacity-80"
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={400}
                          height={300}
                          className="w-full object-cover"
                        />
                      </button>
                    )}
                  </div>
                </div>
              </FoldCard>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════ YOU & ME ═══════════ */}
      <FoldSection className="relative px-4 py-16 sm:px-6 sm:py-28">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orchid/8 blur-[80px] sm:h-96 sm:w-96 sm:blur-[120px]" />
          <div className="absolute left-1/3 top-1/3 h-32 w-32 rounded-full bg-tomato/5 blur-[60px] sm:h-48 sm:w-48" />
          <div className="absolute right-1/3 bottom-1/3 h-32 w-32 rounded-full bg-plum/5 blur-[60px] sm:h-48 sm:w-48" />
        </div>

        <div className="relative mx-auto max-w-lg text-center">
          {/* Floating words orbit */}
          <div className="relative mx-auto mb-8 h-48 w-48 sm:mb-12 sm:h-64 sm:w-64">
            {FLOATING_WORDS.map((word, i) => {
              const angle = (360 / FLOATING_WORDS.length) * i;
              const radius = 38;
              return (
                <motion.span
                  key={word}
                  className="absolute left-1/2 top-1/2 font-signature text-xs text-white/15 sm:text-sm"
                  style={{
                    x: `calc(-50% + ${Math.cos((angle * Math.PI) / 180) * radius}%)`,
                    y: `calc(-50% + ${Math.sin((angle * Math.PI) / 180) * radius}%)`,
                  }}
                  animate={{
                    opacity: [0.1, 0.35, 0.1],
                    scale: [0.9, 1.05, 0.9],
                  }}
                  transition={{
                    duration: 4 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.6,
                  }}
                >
                  {word}
                </motion.span>
              );
            })}

            {/* Centre heart */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className="text-5xl sm:text-6xl"
                animate={{
                  scale: [1, 1.15, 1],
                  filter: [
                    "drop-shadow(0 0 8px rgba(255,170,234,0.3))",
                    "drop-shadow(0 0 20px rgba(255,170,234,0.6))",
                    "drop-shadow(0 0 8px rgba(255,170,234,0.3))",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                💕
              </motion.span>
            </div>
          </div>

          {/* Main text */}
          <Reveal variant="fadeUp">
            <h2 className="font-heading text-3xl tracking-wide text-plum sm:text-4xl md:text-5xl">
              <motion.span
                whileInView={{ backgroundSize: ["0% 2px", "100% 2px"] }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                style={{
                  backgroundImage: "linear-gradient(to right, #FB4D3D, #FFAAEA)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "bottom center",
                  backgroundSize: "0% 2px",
                  paddingBottom: 4,
                }}
              >
                You & Me
              </motion.span>
            </h2>
          </Reveal>

          <Reveal variant="fadeUp" delay={0.15}>
            <p className="mt-4 font-signature text-lg text-white/30 sm:mt-5 sm:text-xl">
              this is just the beginning
            </p>
          </Reveal>

          {/* Verse */}
          <Reveal variant="fadeUp" delay={0.3}>
            <div className="mt-8 space-y-3 sm:mt-10 sm:space-y-4">
              <p className="text-sm leading-relaxed text-white/50 sm:text-base">
                I don&apos;t know what tomorrow looks like,
              </p>
              <p className="text-sm leading-relaxed text-white/50 sm:text-base">
                but I know who I want next to me when it comes.
              </p>
              <motion.p
                className="pt-2 font-signature text-lg text-plum/60 sm:text-xl"
                whileInView={{ opacity: [0, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.8 }}
              >
                it&apos;s you. it was always you.
              </motion.p>
            </div>
          </Reveal>

          {/* Day 1 badge */}
          <Reveal variant="scaleUp" delay={0.5}>
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.03] px-5 py-2.5 sm:mt-10 sm:px-6 sm:py-3">
              <motion.span
                className="text-sm text-saffron/70 sm:text-base"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✦
              </motion.span>
              <span className="text-xs tracking-widest text-white/40 uppercase sm:text-sm">
                Day 1 of Forever
              </span>
              <motion.span
                className="text-sm text-saffron/70 sm:text-base"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                ✦
              </motion.span>
            </div>
          </Reveal>
        </div>
      </FoldSection>

      <SectionDivider />

      {/* ═══════════ LETTER — folds open ═══════════ */}
      <FoldSection className="px-4 py-20 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-2xl">
          <motion.div
            className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] p-6 sm:rounded-3xl sm:p-10 md:p-14"
            whileInView={{
              boxShadow: [
                "0 0 0px rgba(99,29,118,0)",
                "0 0 60px rgba(99,29,118,0.15)",
              ],
            }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.3 }}
          >
            {/* Animated border shimmer */}
            <motion.div
              className="absolute inset-0 rounded-2xl border border-transparent sm:rounded-3xl"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,170,234,0.1), transparent) border-box",
                backgroundSize: "200% 100%",
              }}
              animate={{ backgroundPosition: ["-200% 0", "200% 0"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />

            {/* Corner decorations */}
            <motion.div
              className="absolute right-4 top-4 text-2xl text-orchid/10 sm:right-6 sm:top-6 sm:text-4xl"
              animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              ✦
            </motion.div>
            <motion.div
              className="absolute bottom-4 left-4 text-xl text-plum/10 sm:bottom-6 sm:left-6 sm:text-3xl"
              animate={{ rotate: [360, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              ✦
            </motion.div>
            <motion.div
              className="absolute left-4 top-4 text-lg text-saffron/5 sm:left-6 sm:top-6 sm:text-2xl"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              ✶
            </motion.div>

            <TypewriterLetter lines={LETTER_LINES} />
          </motion.div>
        </div>
      </FoldSection>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="relative border-t border-white/5 py-12 text-center sm:py-16">
        <Reveal variant="fadeUp">
          <motion.p
            className="font-signature text-xl text-plum/40 sm:text-2xl"
            whileInView={{ scale: [0.9, 1] }}
            viewport={{ once: true }}
          >
            Made with{" "}
            <motion.span
              className="inline-block text-tomato/60"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              ♥
            </motion.span>
            {" "}for someone special
          </motion.p>
          <p className="mt-3 text-xs text-white/30 sm:mt-4 sm:text-sm">
            your little corner of the internet
          </p>
          <p className="mt-2 text-[10px] text-white/15 sm:text-xs">
            [Date] ♥ the night everything began
          </p>
        </Reveal>
      </footer>
      {/* Image lightbox modal */}
      <ImageModal
        src={modalImage?.src ?? null}
        alt={modalImage?.alt ?? ""}
        onClose={() => setModalImage(null)}
      />
    </main>
  );
}
