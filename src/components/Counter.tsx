"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

export default function Counter({
  value,
  suffix = "",
  prefix = "",
  duration = 1.4,
  className,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView) return;
    const effectiveDuration = reduced ? 0 : duration;
    let raf: number;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 4);

    function tick(now: number) {
      const elapsed = (now - start) / 1000;
      const t = effectiveDuration <= 0 ? 1 : Math.min(elapsed / effectiveDuration, 1);
      setDisplay(Math.round(ease(t) * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
