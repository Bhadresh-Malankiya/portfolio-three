"use client";

import { motion, useMotionValue, useSpring, useReducedMotion, type Variants } from "framer-motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "span" | "li";
  once?: boolean;
  tilt?: boolean;
};

export default function Reveal({
  children,
  className,
  delay = 0,
  y = 22,
  as = "div",
  once = true,
  tilt = false,
}: RevealProps) {
  const reduced = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(pointerX, { stiffness: 150, damping: 25 });
  const rotateY = useSpring(pointerY, { stiffness: 150, damping: 25 });
  const variants: Variants = {
    hidden: { opacity: 1, y: reduced ? 0 : y },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduced ? 0 : 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={`${className ?? ""}${tilt ? " depth-surface" : ""}`}
      style={tilt && !reduced ? { rotateX, rotateY, transformPerspective: 1000 } : undefined}
      onPointerMove={(event) => {
        if (!tilt || reduced || event.pointerType !== "mouse") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        pointerX.set(-((event.clientY - bounds.top) / bounds.height - 0.5) * 5);
        pointerY.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 5);
      }}
      onPointerLeave={() => { pointerX.set(0); pointerY.set(0); }}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-30px" }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  once?: boolean;
}) {
  const reduced = useReducedMotion();
  const variants: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduced ? 0 : stagger },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-30px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};
