"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Quote, Star } from "lucide-react";
import type { UpworkTestimonial } from "@/data/upwork";

/**
 * Same idiom as ProjectShowcase's pinned panels — one scroll-tracked ref per
 * card, transformed into scale/opacity/y — but here each card's wrapper is
 * shorter than a full viewport, so instead of replacing one another they
 * physically stack: card N stays `sticky` while card N+1 slides up from
 * below and settles on top of it, dimming and shrinking whatever's under it.
 */
function StackCard({ item, index, total }: { item: UpworkTestimonial; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isLast = index === total - 1;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const scale = useTransform(scrollYProgress, [0, 1], reduced || isLast ? [1, 1] : [1, 0.93]);
  const opacity = useTransform(scrollYProgress, [0, 1], reduced || isLast ? [1, 1] : [1, 0.4]);
  const y = useTransform(scrollYProgress, [0, 1], reduced || isLast ? [0, 0] : [0, -22]);

  return (
    <div ref={ref} className="h-screen">
      <div className="sticky top-20 sm:top-28" style={{ zIndex: index + 1 }}>
        <motion.div
          style={{ scale, opacity, y }}
          className="relative mx-auto max-w-3xl origin-top overflow-hidden rounded-2xl border border-line-strong bg-ink-2/85 p-7 shadow-[0_30px_80px_-25px_rgba(0,0,0,0.65)] backdrop-blur sm:p-11"
        >
          <Quote size={44} className="text-gold/20" />
          <p className="mt-3 text-pretty font-display text-xl italic leading-relaxed text-fg sm:text-2xl">
            &ldquo;{item.quote}&rdquo;
          </p>
          {item.response && (
            <p className="mt-4 border-l-2 border-gold/40 pl-4 text-sm italic leading-relaxed text-muted">
              His reply: &ldquo;{item.response}&rdquo;
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-fg">{item.job}</p>
              <p className="mt-1 font-mono text-[11px] text-muted">Upwork · {item.period}</p>
            </div>
            <div className="flex items-center gap-3">
              {item.tags?.map((tag) => (
                <span key={tag} className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] text-muted">
                  {tag}
                </span>
              ))}
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} className="fill-gold text-gold" />
                ))}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function UpworkTestimonials({ items }: { items: UpworkTestimonial[] }) {
  return (
    <div className="relative">
      {items.map((item, i) => (
        <StackCard key={item.job} item={item} index={i} total={items.length} />
      ))}
    </div>
  );
}
