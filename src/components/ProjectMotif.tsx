"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Motif } from "@/data/projects";

const loop = (duration: number, reduced: boolean) =>
  reduced ? undefined : ({ repeat: Infinity, duration, ease: "easeInOut" } as const);

function Sparkline({ accent, reduced }: { accent: string; reduced: boolean }) {
  const heights = [40, 65, 45, 80, 55, 95, 70];
  return (
    <div className="flex h-full w-full items-end justify-between gap-1.5 px-1">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          className={`w-full rounded-sm bg-current ${accent}`}
          style={{ height: `${h}%` }}
          initial={{ scaleY: 0.3, opacity: 0.5 }}
          animate={reduced ? { scaleY: 1, opacity: 1 } : { scaleY: [0.4, 1, 0.7, 1], opacity: [0.5, 1, 0.8, 1] }}
          transition={reduced ? undefined : { repeat: Infinity, duration: 2.6, delay: i * 0.12, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function RadarSweep({ accent, reduced }: { accent: string; reduced: boolean }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className={`h-16 w-16 rounded-full border ${accent} border-current/25`} />
      <div className={`absolute h-10 w-10 rounded-full border ${accent} border-current/40`} />
      <motion.div
        className="absolute h-16 w-16 rounded-full"
        style={{
          background: "conic-gradient(from 0deg, transparent 0deg, currentColor 28deg, transparent 70deg)",
        }}
        animate={reduced ? {} : { rotate: 360 }}
        transition={reduced ? undefined : { repeat: Infinity, duration: 3.2, ease: "linear" }}
      />
      <span className={`absolute h-1.5 w-1.5 rounded-full ${accent} bg-current`} />
    </div>
  );
}

function StackedCards({ accent, reduced }: { accent: string; reduced: boolean }) {
  return (
    <div className="relative h-full w-full">
      {[2, 1, 0].map((i) => (
        <motion.div
          key={i}
          className={`absolute left-1/2 top-1/2 h-9 w-24 rounded-md border ${accent} border-current/60 bg-current/[0.12]`}
          initial={{ x: "-50%", y: `calc(-50% + ${i * 10 - 10}px)` }}
          animate={
            reduced
              ? {}
              : i === 0
              ? { y: [`calc(-50% - 10px)`, "-90%", `calc(-50% - 10px)`], opacity: [1, 0, 1] }
              : {}
          }
          transition={loop(2.6, reduced)}
        />
      ))}
    </div>
  );
}

function Candlestick({ accent, reduced }: { accent: string; reduced: boolean }) {
  const bars = [30, 55, 40, 70, 50, 85, 60, 45];
  return (
    <div className="flex h-full w-full items-center justify-between gap-1.5 px-1">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className={`w-full rounded-[2px] bg-current ${accent} ${i % 3 === 0 ? "opacity-40" : "opacity-90"}`}
          initial={{ height: `${h}%` }}
          animate={reduced ? {} : { height: [`${h}%`, `${Math.max(20, h - 25)}%`, `${h}%`] }}
          transition={reduced ? undefined : { repeat: Infinity, duration: 1.8, delay: i * 0.1, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function PulseMap({ accent, reduced }: { accent: string; reduced: boolean }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 100 60">
        <path d="M8 45 Q 35 10 55 30 T 92 15" fill="none" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1" />
      </svg>
      <span className={`relative h-2.5 w-2.5 rounded-full ${accent} bg-current`} />
      {!reduced && (
        <motion.span
          className={`absolute h-2.5 w-2.5 rounded-full ${accent} bg-current`}
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: [1, 3.2], opacity: [0.6, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut" }}
        />
      )}
    </div>
  );
}

function ECG({ accent, reduced }: { accent: string; reduced: boolean }) {
  const d = "M0 25 H50 L58 8 L66 42 L74 25 H100 L108 12 L116 38 L124 25 H200";
  return (
    <div className="flex h-full w-full items-center">
      <svg viewBox="0 0 200 50" className={`h-full w-full ${accent}`} preserveAspectRatio="none">
        {/* base line — always visible, so the card never reads as empty */}
        <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={0.28} />
        {/* traveling pulse sweeping along the same line */}
        <motion.path
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="36 340"
          initial={{ strokeDashoffset: 0 }}
          animate={reduced ? { strokeDashoffset: 0 } : { strokeDashoffset: -376 }}
          transition={reduced ? undefined : { repeat: Infinity, duration: 2.2, ease: "linear" }}
        />
      </svg>
    </div>
  );
}

function ScannerLine({ accent, reduced }: { accent: string; reduced: boolean }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className={`h-16 w-24 overflow-hidden rounded border ${accent} border-current/35 bg-current/10`}>
        {!reduced && (
          <motion.div
            className={`h-0.5 w-full ${accent} bg-current shadow-[0_0_8px_currentColor]`}
            initial={{ y: 0 }}
            animate={{ y: [0, 62, 0] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          />
        )}
        {reduced && <div className={`h-0.5 w-full translate-y-8 ${accent} bg-current`} />}
      </div>
    </div>
  );
}

function BalanceScale({ accent, reduced }: { accent: string; reduced: boolean }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <motion.div
        className="relative h-10 w-24"
        animate={reduced ? {} : { rotate: [-6, 6, -6] }}
        transition={loop(3, reduced)}
        style={{ transformOrigin: "50% 0%" }}
      >
        <div className={`absolute left-1/2 top-0 h-8 w-px -translate-x-1/2 ${accent} bg-current/50`} />
        <div className={`absolute inset-x-0 top-0 h-px ${accent} bg-current/70`} />
        <div className={`absolute left-0 top-8 h-3 w-3 -translate-x-1/2 rounded-full border ${accent} border-current/60`} />
        <div className={`absolute right-0 top-8 h-3 w-3 translate-x-1/2 rounded-full border ${accent} border-current/60`} />
      </motion.div>
    </div>
  );
}

function Kanban({ accent, reduced }: { accent: string; reduced: boolean }) {
  return (
    <div className="relative flex h-full w-full items-center justify-between gap-2 px-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className={`h-16 w-full rounded border ${accent} border-current/20`} />
      ))}
      <motion.div
        className={`absolute top-1/2 h-6 w-8 -translate-y-1/2 rounded-sm ${accent} bg-current/70`}
        initial={{ left: "4%" }}
        animate={reduced ? {} : { left: ["4%", "38%", "72%", "72%", "4%"] }}
        transition={reduced ? undefined : { repeat: Infinity, duration: 3.6, times: [0, 0.3, 0.6, 0.85, 1], ease: "easeInOut" }}
      />
    </div>
  );
}

function Orbit({ accent, reduced }: { accent: string; reduced: boolean }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <span className={`h-2 w-2 rounded-full ${accent} bg-current`} />
      <div className={`absolute h-14 w-14 rounded-full border ${accent} border-current/20`} />
      <motion.div
        className="absolute h-14 w-14"
        animate={reduced ? {} : { rotate: 360 }}
        transition={reduced ? undefined : { repeat: Infinity, duration: 5, ease: "linear" }}
      >
        <span className={`absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full ${accent} bg-current`} />
      </motion.div>
    </div>
  );
}

const MOTIFS: Record<Motif, (p: { accent: string; reduced: boolean }) => React.ReactElement> = {
  forms: Sparkline,
  proctor: RadarSweep,
  inbox: StackedCards,
  ticker: Candlestick,
  map: PulseMap,
  medical: ECG,
  cms: StackedCards,
  kiosk: ScannerLine,
  restaurant: Sparkline,
  legal: BalanceScale,
  pm: Kanban,
  petmap: PulseMap,
  freelance: Orbit,
};

export default function ProjectMotif({
  motif,
  accent = "text-gold",
  className = "",
}: {
  motif: Motif;
  accent?: string;
  className?: string;
}) {
  const reduced = !!useReducedMotion();
  const Component = MOTIFS[motif];
  return (
    <div className={className}>
      <Component accent={accent} reduced={reduced} />
    </div>
  );
}
