"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import type { Chapter } from "@/data/chapters";
import ChapterCard from "@/components/ChapterCard";

function Station({ chapter, position, progress }: { chapter: Chapter; position: number; progress: MotionValue<number> }) {
  // Continuous, style-driven "have we reached this station yet" — no boolean
  // state, so it never fights the spring that's already animating `progress`.
  const passed = useTransform(progress, (v) => (v * 100 >= position ? 1 : 0));

  return (
    <a
      href={`#${chapter.id}`}
      title={chapter.title}
      className="group absolute left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
      style={{ top: `${position}%` }}
    >
      <span className="absolute right-4 whitespace-nowrap rounded-full border border-line-strong bg-ink px-2 py-0.5 font-mono text-[10px] text-muted opacity-0 transition-opacity group-hover:opacity-100">
        {chapter.number}
      </span>
      <span className="relative block h-2.5 w-2.5 rounded-full border border-line-strong bg-ink transition-colors group-hover:border-gold">
        <motion.span
          className="absolute inset-[-1px] rounded-full bg-gold"
          style={{ opacity: passed }}
        />
      </span>
    </a>
  );
}

/**
 * A single connected rail running the length of the chapter list — real
 * station positions (measured from the DOM, not guessed/evenly spaced), a
 * gold fill that grows as you read, and a marker that travels smoothly
 * along it. Chapters are a genuine sequence, so a track that encodes real
 * progress through them earns its place here (unlike a decorative 01/02/03).
 */
export default function JourneyTrack({ chapters }: { chapters: Chapter[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<number[]>(() => chapters.map(() => 0));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function measure() {
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const total = container.offsetHeight || 1;
      setPositions(
        chapters.map((c) => {
          const el = document.getElementById(c.id);
          if (!el) return 0;
          const top = el.getBoundingClientRect().top - containerRect.top;
          return Math.max(0, Math.min(100, (top / total) * 100));
        })
      );
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapters.length]);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start center", "end center"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.3 });
  const fillHeight = useTransform(smooth, (v) => `${Math.max(0, Math.min(100, v * 100))}%`);

  return (
    <div className="flex gap-6 sm:gap-8">
      <div className="relative hidden w-6 shrink-0 lg:block">
        <div className="absolute inset-x-0 top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-line-strong" />
        <motion.div
          className="absolute inset-x-0 top-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-gold to-gold-bright"
          style={{ height: fillHeight }}
        />
        {chapters.map((c, i) => (
          <Station key={c.id} chapter={c} position={positions[i]} progress={smooth} />
        ))}
        <motion.div
          className="pointer-events-none absolute left-1/2 z-20 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_10px_3px_rgba(227,168,87,0.65)]"
          style={{ top: fillHeight }}
        />
      </div>

      <div ref={containerRef} className="flex-1 space-y-6 sm:space-y-8">
        {chapters.map((chapter, i) => (
          <ChapterCard key={chapter.id} chapter={chapter} index={i} />
        ))}
      </div>
    </div>
  );
}
