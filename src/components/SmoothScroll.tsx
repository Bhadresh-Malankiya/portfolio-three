"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

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
        lerp: 0.1,
        anchors: { duration: 0.85 },
        smoothWheel: true,
        syncTouch: false,
        stopInertiaOnNavigate: true,
        prevent: node => node.tagName === "DIALOG" || node.getAttribute("aria-modal") === "true",
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
      if (document.querySelector("dialog[open]")) return;
      const distance = Math.abs(top - window.scrollY);
      if (lenis) lenis.scrollTo(top, { duration: Math.min(1.1, Math.max(0.45, distance / 1800)) });
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
