"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function scrollToPosition(top: number) {
  window.dispatchEvent(
    new CustomEvent<number>("portfolio:scroll-to", { detail: top }),
  );
}

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
    const onScrollRequest = (event: Event) => {
      const top = (event as CustomEvent<number>).detail;
      if (!Number.isFinite(top)) return;
      if (lenis) lenis.scrollTo(top, { duration: 1, force: true });
      else window.scrollTo({ top, behavior: "instant" });
    };
    window.addEventListener("portfolio:scroll-to", onScrollRequest);
    syncMotionPreference();
    preference.addEventListener("change", syncMotionPreference);
    return () => {
      window.removeEventListener("portfolio:scroll-to", onScrollRequest);
      preference.removeEventListener("change", syncMotionPreference);
      cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, []);
  return <>{children}</>;
}
