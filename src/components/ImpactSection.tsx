"use client";

import { motion, useReducedMotion } from "framer-motion";
import Reveal from "@/components/Reveal";
import Scene3D from "@/components/Scene3D";
import { impactMetrics, uniquenessBadges } from "@/data/impact";

function ImpactRow({ metric, index }: { metric: (typeof impactMetrics)[number]; index: number }) {
  const reduced = useReducedMotion();
  return (
    <Reveal delay={Math.min(index * 0.07, 0.35)}>
      <div className="py-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="font-mono text-sm text-fg">{metric.label}</p>
          <p className="font-mono text-xs text-muted">{metric.context}</p>
        </div>
        <div className="relative mt-3 h-2.5 w-full overflow-hidden rounded-full bg-ink-3">
          {/* the "before" ghost track */}
          <div className="absolute inset-y-0 left-0 w-full rounded-full bg-white/[0.06]" />
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-gold to-gold-bright shadow-[0_0_10px_1px_rgba(227,168,87,0.45)]"
            initial={{ width: reduced ? `${metric.pct}%` : "0%" }}
            whileInView={{ width: `${metric.pct}%` }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[11px] text-muted">
          <span>
            was <span className="text-fg/70 line-through decoration-muted/60">{metric.before}</span>
          </span>
          <span className="text-gold-bright">now {metric.after}</span>
        </div>
      </div>
    </Reveal>
  );
}

export default function ImpactSection() {
  return (
    <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
      <div>
        <div className="divide-y divide-line">
          {impactMetrics.map((m, i) => (
            <ImpactRow key={m.label} metric={m} index={i} />
          ))}
        </div>

        <Reveal delay={0.15} className="mt-8 flex flex-wrap gap-2">
          {uniquenessBadges.map((b) => (
            <span
              key={b}
              className="rounded-full border border-line-strong bg-ink-2/60 px-3.5 py-1.5 font-mono text-[11px] text-fg/80"
            >
              {b}
            </span>
          ))}
        </Reveal>
      </div>

      <Reveal delay={0.1} className="relative">
        <div className="sticky top-28 overflow-hidden rounded-xl border border-line bg-ink-2/40">
          <div className="border-b border-line px-5 py-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              the same numbers, rendered
            </p>
          </div>
          <div className="h-72 sm:h-80">
            <Scene3D variant="impact" className="h-full w-full" />
          </div>
          <p className="border-t border-line px-5 py-3 text-xs text-muted">
            A literal chart — because he builds these for a living, at a scale where a slow one is the only kind
            of slow database a user can actually see.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
