"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * A big kinetic-typography band: two oversized lines of text drifting in
 * opposite horizontal directions as the section passes through the
 * viewport — one hollow/outlined, one solid gold. A deliberate "look what
 * this site can do" moment, used sparingly (twice: mid-page and near the
 * close) rather than everywhere.
 */
export default function KineticMarquee({
  lineA,
  lineB,
  className = "",
}: {
  lineA: string;
  lineB: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const xA = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-18%", "6%"]);
  const xB = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["10%", "-16%"]);

  const repeat = (s: string) => `${s} · ${s} · ${s} · `;

  return (
    <div ref={ref} className={`relative overflow-hidden border-y border-line bg-ink py-14 sm:py-20 ${className}`}>
      <motion.p
        style={{ x: xA, WebkitTextStroke: "1.5px var(--color-line-strong)" }}
        className="whitespace-nowrap font-display text-[15vw] italic leading-[0.9] text-transparent sm:text-[8vw]"
      >
        {repeat(lineA)}
      </motion.p>
      <motion.p
        style={{ x: xB }}
        className="mt-3 whitespace-nowrap font-display text-[15vw] italic leading-[0.9] text-gold-bright/90 sm:mt-5 sm:text-[8vw]"
      >
        {repeat(lineB)}
      </motion.p>
    </div>
  );
}
