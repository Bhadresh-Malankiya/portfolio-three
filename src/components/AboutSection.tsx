"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";
import { profile } from "@/data/profile";

// The source cutout's real pixel size — used so next/image never has to
// guess an aspect ratio, and the photo is never boxed/cropped, only faded.
const PORTRAIT_W = 1440;
const PORTRAIT_H = 1917;

const fadeMask = {
  maskImage: "linear-gradient(to bottom, black 74%, transparent 96%)",
  WebkitMaskImage: "linear-gradient(to bottom, black 74%, transparent 96%)",
};

/**
 * The portrait is a background-free cutout, not a screenshot — so instead of
 * boxing it in the site's usual "browser chrome" card, it stands directly on
 * the page: a warm glow for contrast against the dark background, a soft
 * fade at its own feet instead of a hard crop, an unveiling reveal (masked
 * rise) the first time it scrolls into view, a slow scroll parallax against
 * the copy beside it, and a gentle lift + brightened glow on hover — all
 * independent so they don't fight each other. (A 3D mouse-tilt was here
 * first but looked wrong on a flat cutout — a paper doll wobbling in space
 * — so it's a plain hover state instead.)
 *
 * The reveal is driven by the same `scrollYProgress` as the parallax rather
 * than a separate `whileInView`/IntersectionObserver trigger — that second
 * mechanism turned out to silently never fire on some narrow viewports,
 * leaving the photo stuck at opacity 0. One proven scroll signal for both.
 */
export default function AboutSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 34, reduced ? 0 : -34]);

  const revealClip = useTransform(
    scrollYProgress,
    [0, 0.18],
    reduced ? ["inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)"] : ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"]
  );
  const revealOpacity = useTransform(scrollYProgress, [0, 0.18], reduced ? [1, 1] : [0, 1]);
  const revealY = useTransform(scrollYProgress, [0, 0.18], reduced ? [0, 0] : [48, 0]);

  const [hovered, setHovered] = useState(false);

  return (
    <div ref={wrapRef} className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-12">
      <motion.div style={{ y: parallaxY }} className="relative mx-auto w-full max-w-[360px] lg:mx-0 lg:-ml-4">
        <motion.div
          className="pointer-events-none absolute left-1/2 top-[42%] h-[95%] w-[145%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          animate={{ opacity: hovered ? 0.38 : 0.24 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: "radial-gradient(closest-side, var(--color-gold), transparent 70%)" }}
          aria-hidden="true"
        />
        <motion.div style={{ clipPath: revealClip, opacity: revealOpacity, y: revealY }}>
          <motion.div
            className="group relative"
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            animate={{ y: hovered && !reduced ? -6 : 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src="/images/profile.png"
              alt={`${profile.name}, ${profile.role}`}
              width={PORTRAIT_W}
              height={PORTRAIT_H}
              sizes="(min-width: 1024px) 360px, 78vw"
              priority
              style={fadeMask}
              className="h-auto w-full grayscale transition-[filter] duration-700 ease-out group-hover:grayscale-0"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      <div>
        <Reveal>
          <Eyebrow>Who&apos;s building this</Eyebrow>
          <p className="mt-5 max-w-xl text-balance font-display text-2xl italic leading-snug text-fg sm:text-3xl">
            Full-stack by title. Product owner by instinct.{" "}
            <span className="text-gold-bright">Weekend builder by a habit that never really turned off.</span>
          </p>
        </Reveal>

        <Reveal delay={0.06} className="mt-5">
          <p className="font-mono text-sm text-fg/80">{profile.name}</p>
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">{profile.role}</p>
        </Reveal>

        <Reveal delay={0.12} className="mt-5 max-w-xl text-pretty leading-relaxed text-muted">
          <p>{profile.summary}</p>
        </Reveal>

        <Reveal delay={0.18} className="mt-7 flex flex-wrap gap-x-8 gap-y-4 border-t border-line pt-6">
          {[
            { label: "Based in", value: profile.location },
            { label: "Currently", value: profile.currentRole },
            { label: "Reach him at", value: profile.email },
          ].map((f) => (
            <div key={f.label} className="border-l-2 border-gold/50 pl-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{f.label}</p>
              <p className="mt-1 text-sm text-fg/90">{f.value}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </div>
  );
}
