"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { MotionValue } from "framer-motion";
import LazyMount from "@/components/LazyMount";

const scenes = {
  hero: dynamic(() => import("@/components/three/LaptopScene"), { ssr: false }),
  impact: dynamic(() => import("@/components/three/ImpactBars"), { ssr: false }),
  network: dynamic(() => import("@/components/three/ProjectNetwork"), { ssr: false }),
};

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getReducedMotionServerSnapshot() {
  return false;
}

// Subscribes to the OS-level motion preference without an effect+setState
// round trip — the recommended pattern for external browser state like this.
function useReducedMotionPref() {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot);
}

export default function Scene3D({
  variant,
  className = "",
  progress,
}: {
  variant: "hero" | "impact" | "network";
  className?: string;
  /** Hero-only: 0 (top of page) → 1 (scrolled past), drives the laptop lid. */
  progress?: MotionValue<number>;
}) {
  const reduced = useReducedMotionPref();
  const Scene = scenes[variant];
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  // Once mounted, a WebGL canvas keeps rendering every frame forever unless
  // told otherwise — including while scrolled far out of view, which is a
  // real source of scroll jank. Pause the render loop (not the mount) once
  // it leaves the viewport, and resume the moment it's back.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      rootMargin: "80px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <LazyMount
      className={className}
      rootMargin="240px"
      fallback={<div className="h-full w-full bg-blueprint opacity-40" aria-hidden="true" />}
    >
      <div ref={wrapRef} className="h-full w-full" aria-hidden="true">
        <Scene reduced={reduced} active={active} progress={progress} />
      </div>
    </LazyMount>
  );
}
