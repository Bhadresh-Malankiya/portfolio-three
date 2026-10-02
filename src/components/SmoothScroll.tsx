"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;
    let rafId = 0;
    function syncMotionPreference() {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      lenis = undefined;
      if (preference.matches) return;
      lenis = new Lenis({
        lerp: 0.12,
        anchors: true,
        smoothWheel: true,
      });
      function raf(time: number) {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
    }
    syncMotionPreference();
    preference.addEventListener("change", syncMotionPreference);
    return () => {
      preference.removeEventListener("change", syncMotionPreference);
      cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, []);
  return <>{children}</>;
}
