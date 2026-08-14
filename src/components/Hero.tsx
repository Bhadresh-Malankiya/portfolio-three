"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ArrowDownRight } from "lucide-react";
import WeekendHeatmap from "@/components/WeekendHeatmap";
import ParticleField from "@/components/ParticleField";
import Scene3D from "@/components/Scene3D";
import { profile } from "@/data/profile";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function Hero() {
  const glowRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const laptopTrackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const atmosphereY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 140]);
  const particlesY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 70]);

  // The laptop's own scroll moment: pinned top-right beside the headline, it
  // drifts down and re-centers as this (desktop-only) track scrolls by, the
  // lid swings shut near the end, then it releases into the next section.
  const { scrollYProgress: laptopRaw } = useScroll({ target: laptopTrackRef, offset: ["start start", "end end"] });
  const laptop = useSpring(laptopRaw, { stiffness: 95, damping: 26, mass: 0.3 });

  const lidProgress = useTransform(laptop, [0, 0.35, 0.75, 1], [0, 0, 1, 1]);
  const laptopX = useTransform(laptop, [0, 1], [0, reduced ? 0 : -260]);
  const laptopY = useTransform(laptop, [0, 1], [0, reduced ? 0 : 260]);
  const laptopScale = useTransform(laptop, [0, 0.5, 1], [0.92, 1, 0.9]);

  const line1Opacity = useTransform(laptop, [0.06, 0.2, 0.48, 0.6], [0, 1, 1, 0]);
  const line1Y = useTransform(laptop, [0.06, 0.2], [16, 0]);
  const line2Opacity = useTransform(laptop, [0.66, 0.82], [0, 1]);
  const line2Y = useTransform(laptop, [0.66, 0.82], [16, 0]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = glowRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <section ref={sectionRef} className="relative pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <motion.div className="absolute inset-x-0 -top-40 h-[560px]" style={{ y: atmosphereY }}>
          <div
            className="absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2 rounded-full opacity-[0.16] blur-3xl"
            style={{ background: "radial-gradient(closest-side, var(--color-gold), transparent 72%)" }}
          />
          <div
            className="absolute left-1/4 top-40 h-[320px] w-[520px] -translate-x-1/2 rounded-full opacity-[0.08] blur-3xl"
            style={{ background: "radial-gradient(closest-side, var(--color-fg), transparent 72%)" }}
          />
        </motion.div>

        <motion.div style={{ y: particlesY }} className="absolute inset-0">
          <ParticleField className="absolute inset-0 h-full w-full opacity-60" count={50} />
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 lg:gap-10">
          <motion.div initial="hidden" animate="show" variants={container}>
            <motion.p
              variants={item}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.18em] text-gold"
            >
              <span>{profile.location}</span>
              <span className="text-muted">·</span>
              <span>sole owner, 2 SaaS products</span>
              <span className="text-muted">·</span>
              <span>{profile.yearsExperience}+ years</span>
            </motion.p>

            <motion.h1
              variants={item}
              className="mt-6 max-w-4xl font-display text-[13vw] leading-[0.98] tracking-tight text-fg text-balance sm:text-[6.4rem] sm:leading-[0.96]"
            >
              The Weekend
              <br />
              <span className="italic text-gold-bright">Builder.</span>
            </motion.h1>

            <motion.p variants={item} className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
              {profile.subtitle}
            </motion.p>

            <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-ink transition-colors hover:bg-gold-bright"
              >
                See the work
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/journey"
                className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-fg transition-colors hover:border-gold hover:text-gold"
              >
                Read the story
                <ArrowDownRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </Link>
            </motion.div>

            {/* Small screens: no room to pin a column beside the headline —
                the laptop just sits inline here, lid open, idle sway only. */}
            <motion.div variants={item} className="relative mt-10 h-[300px] w-full max-w-md lg:hidden">
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
                style={{ background: "radial-gradient(closest-side, var(--color-gold), transparent 70%)" }}
                aria-hidden="true"
              />
              <Scene3D variant="hero" className="relative z-10 h-full w-full" />
            </motion.div>
          </motion.div>

          {/* Desktop: laptop pinned top-right next to the headline. As this
              tall track scrolls underneath, it drifts down, re-centers, and
              the lid swings shut — then the pin releases into the ticker. */}
          <div ref={laptopTrackRef} className="relative hidden lg:block lg:h-[160vh]">
            <div className="sticky top-28 flex h-[70vh] items-start justify-end">
              <motion.div style={{ x: laptopX, y: laptopY, scale: laptopScale }} className="relative w-full max-w-lg">
                <div
                  className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
                  style={{ background: "radial-gradient(closest-side, var(--color-gold), transparent 70%)" }}
                  aria-hidden="true"
                />
                <Scene3D variant="hero" className="relative z-10 h-[380px] w-full" progress={lidProgress} />
              </motion.div>

              <div className="pointer-events-none absolute inset-x-0 bottom-[10%] flex justify-center px-4">
                <motion.p
                  style={{ opacity: line1Opacity, y: line1Y }}
                  className="absolute max-w-xs text-balance text-center font-display text-xl italic text-fg/90"
                >
                  The cursor blinks. He starts anyway.
                </motion.p>
                <motion.p
                  style={{ opacity: line2Opacity, y: line2Y }}
                  className="absolute max-w-xs text-balance text-center font-display text-xl italic text-gold-bright"
                >
                  Then he ships it.
                </motion.p>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          ref={glowRef}
          onMouseMove={handleMove}
          className="relative mt-16 overflow-hidden rounded-xl border border-line bg-ink-2/40 p-5 sm:mt-20 sm:p-8"
          style={
            {
              "--mx": "50%",
              "--my": "50%",
            } as React.CSSProperties
          }
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 hover:opacity-100"
            style={{
              background:
                "radial-gradient(320px circle at var(--mx) var(--my), rgba(227,168,87,0.14), transparent 70%)",
            }}
          />
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">a decade of weekends, stylized</p>
              <p className="mt-1 max-w-md font-display text-lg italic text-fg/90">
                Weekdays keep the lights on. Weekends are where things get built.
              </p>
            </div>
            <div className="flex items-center gap-4 font-mono text-[11px] text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-silver/40" /> weekday
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-gold-bright shadow-[0_0_6px_1px_rgba(244,197,114,0.6)]" /> shipped on a weekend
              </span>
            </div>
          </div>
          <div className="relative z-10 mt-6">
            <WeekendHeatmap />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
