"use client";

import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; r: number; vx: number; vy: number; hue: "gold" | "fg" };

/**
 * A quiet field of drifting motes on a 2D canvas — kept deliberately small
 * and low-opacity ("lighter, if required" per the brief) rather than a full
 * interactive particle system. Freezes on prefers-reduced-motion.
 */
export default function ParticleField({
  count = 46,
  className = "",
  goldRatio = 0.18,
}: {
  count?: number;
  className?: string;
  goldRatio?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    let raf = 0;
    let running = true;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 0.4,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12 - 0.04,
        hue: Math.random() < goldRatio ? "gold" : "fg",
      }));
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      for (const p of particles) {
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;
        }
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = p.hue === "gold" ? "rgba(227,168,87,0.55)" : "rgba(242,241,238,0.28)";
        ctx!.fill();
      }
      if (!reduced && running) raf = requestAnimationFrame(draw);
    }

    resize();
    seed();
    draw();

    const onResize = () => {
      resize();
      seed();
      if (reduced) draw();
    };
    window.addEventListener("resize", onResize);

    // Pause the loop entirely once scrolled out of view — cheap on its own,
    // but every idle rAF loop competes for the same frame budget as smooth
    // scrolling, so it's not free once several of these are on a page.
    const observer = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running && !reduced) {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(draw);
        }
      },
      { rootMargin: "100px" }
    );
    observer.observe(canvas);

    return () => {
      window.removeEventListener("resize", onResize);
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [count, goldRatio]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
