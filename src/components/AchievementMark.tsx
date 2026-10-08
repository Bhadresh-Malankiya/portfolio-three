type AchievementKind = "reach" | "exams" | "team" | "growth";

/** Small etched illustrations, drawn for the portfolio's actual milestones. */
export default function AchievementMark({ kind }: { kind: AchievementKind }) {
  return (
    <svg className={`achievement-mark mark-${kind}`} viewBox="0 0 88 88" fill="none" aria-hidden="true">
      <circle cx="44" cy="44" r="39" stroke="currentColor" strokeOpacity=".13" />
      <circle className="mark-orbit" cx="44" cy="44" r="34" stroke="currentColor" strokeOpacity=".3" strokeDasharray="2 7" />
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {kind === "reach" && <>
          <ellipse cx="44" cy="44" rx="26" ry="12" transform="rotate(-32 44 44)" strokeOpacity=".45" />
          <ellipse cx="44" cy="44" rx="12" ry="26" transform="rotate(-32 44 44)" strokeOpacity=".45" />
          <circle cx="44" cy="44" r="7" fill="currentColor" fillOpacity=".13" />
          <circle className="mark-node" cx="23" cy="54" r="4" fill="currentColor" />
          <circle cx="62" cy="28" r="3" fill="currentColor" fillOpacity=".5" />
        </>}
        {kind === "exams" && <>
          <path d="M24 29 45 18 65 29 44 40Z" fill="currentColor" fillOpacity=".12" />
          <path d="m24 39 20 11 21-11M24 49l20 11 21-11M24 59l20 11 21-11" strokeOpacity=".45" />
          <path className="mark-check" d="m36 29 6 4 10-7" />
          <path d="M65 29v16" strokeOpacity=".5" />
        </>}
        {kind === "team" && <>
          <path d="M23 48v12h42V48M44 39v21" strokeOpacity=".4" />
          <circle cx="44" cy="28" r="8" fill="currentColor" fillOpacity=".13" />
          <circle cx="23" cy="41" r="6" /><circle cx="65" cy="41" r="6" />
          <path d="M33 69c0-13 22-13 22 0M17 55h12M59 55h12" />
          <circle className="mark-node" cx="44" cy="60" r="3" fill="currentColor" />
        </>}
        {kind === "growth" && <>
          <path d="M22 24v42h46" strokeOpacity=".35" />
          <path d="M30 62V50h7v12M44 62V40h7v22M58 62V26h7v36" fill="currentColor" fillOpacity=".09" strokeOpacity=".6" />
          <path className="mark-check" d="m27 43 14-11 10 2 16-17m-8 0h8v8" />
        </>}
      </g>
    </svg>
  );
}
