"use client";

import { useMemo, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";

// Deterministic PRNG so server and client render identical markup (no hydration drift).
function mulberry32(seed: number) {
  return function rand() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const COLS = 48;
const ROWS = 7; // Mon..Sun
const WEEKEND_ROWS = [5, 6];

type Cell = { col: number; row: number; level: number; peak: boolean };

function buildGrid(): Cell[] {
  const rand = mulberry32(19940214);
  const cells: Cell[] = [];
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      const isWeekend = WEEKEND_ROWS.includes(row);
      const r = rand();
      let level: number;
      if (isWeekend) {
        level = Math.min(4, Math.floor(r * 5));
      } else {
        level = Math.min(2, Math.floor(r * 3));
      }
      cells.push({ col, row, level, peak: false });
    }
  }
  // scatter a handful of "peak" weekend nights — the ones that shipped something
  const weekendCells = cells.filter((c) => WEEKEND_ROWS.includes(c.row));
  const peakCount = 11;
  for (let i = 0; i < peakCount; i++) {
    const idx = Math.floor(rand() * weekendCells.length);
    weekendCells[idx].level = 4;
    weekendCells[idx].peak = true;
  }
  return cells;
}

const WEEKDAY_SHADE: Record<number, string> = {
  0: "bg-white/[0.03]",
  1: "bg-silver/15",
  2: "bg-silver/35",
};

const WEEKEND_SHADE: Record<number, string> = {
  0: "bg-white/[0.03]",
  1: "bg-gold/20",
  2: "bg-gold/40",
  3: "bg-gold/65",
  4: "bg-gold-bright",
};

export default function WeekendHeatmap({ className }: { className?: string }) {
  const grid = useMemo(() => buildGrid(), []);
  const ref = useRef<HTMLDivElement>(null);
  // `once: true` latches to true permanently the moment the grid enters view,
  // so it can drive the reveal directly without mirroring it into extra state.
  const revealed = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();

  const columns = useMemo(() => {
    const byCol: Cell[][] = Array.from({ length: COLS }, () => []);
    grid.forEach((c) => byCol[c.col].push(c));
    return byCol;
  }, [grid]);

  return (
    <div className={className}>
      <div
        ref={ref}
        className="grid gap-[3px] sm:gap-[4px]"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        role="img"
        aria-label="Stylized activity grid: quiet silver weekdays, glowing gold weekends — a visual habit, not literal commit data."
      >
        {columns.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-[3px] sm:gap-[4px]">
            {col.map((cell) => {
              const isWeekend = WEEKEND_ROWS.includes(cell.row);
              const shade = isWeekend ? WEEKEND_SHADE[cell.level] : WEEKDAY_SHADE[cell.level];
              return (
                <div
                  key={cell.row}
                  className={[
                    "aspect-square rounded-[2px] sm:rounded-[3px]",
                    shade,
                    cell.peak ? "shadow-[0_0_10px_2px_rgba(244,197,114,0.65)]" : "",
                  ].join(" ")}
                  style={{
                    opacity: reduced ? 1 : revealed ? 1 : 0,
                    transform: reduced ? "none" : revealed ? "scale(1)" : "scale(0.4)",
                    transition: reduced
                      ? undefined
                      : `opacity 0.5s ease ${ci * 14}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${ci * 14}ms`,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
