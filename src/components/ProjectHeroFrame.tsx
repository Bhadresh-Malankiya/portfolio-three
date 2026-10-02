"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * Wraps the project screenshot frame with two independent interactions:
 * a mouse-follow tilt (pointer position → subtle rotateX/rotateY), and a
 * scroll-linked scale-in + parallax drift as the block passes through the
 * viewport. Both are inert under prefers-reduced-motion.
 */
export default function ProjectHeroFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [1.5, -1.5]), {
    stiffness: 220,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-2, 2]), {
    stiffness: 220,
    damping: 22,
  });

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.35], [0.95, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [12, -12]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced) return;
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  function handleLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <div
      ref={wrapRef}
      style={{ perspective: 1400 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <motion.div
        style={
          reduced
            ? undefined
            : {
                rotateX,
                rotateY,
                scale,
                y,
              }
        }
      >
        {children}
      </motion.div>
    </div>
  );
}
