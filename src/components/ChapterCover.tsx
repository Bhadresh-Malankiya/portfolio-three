function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return function rand() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A small, deterministic "cover band" unique to each chapter — a stand-in
 * for real cover art, generated from the chapter id rather than uploaded.
 */
export default function ChapterCover({ seed, className = "" }: { seed: string; className?: string }) {
  const rand = mulberry32(hashSeed(seed));

  const rings = Array.from({ length: 3 }, () => ({
    cx: 8 + rand() * 84,
    cy: 10 + rand() * 40,
    r: 8 + rand() * 30,
    gold: rand() > 0.72,
  }));

  const dots = Array.from({ length: 22 }, () => ({
    x: rand() * 100,
    y: rand() * 60,
    r: 0.5 + rand() * 1,
  }));

  const lineAngle = -18 + rand() * 36;

  return (
    <svg
      viewBox="0 0 100 60"
      preserveAspectRatio="none"
      className={className}
      role="img"
      aria-label="Generative chapter cover art"
    >
      <rect width="100" height="60" fill="#0d0d0f" />
      <rect width="100" height="60" fill="url(#cover-fade)" />
      <g opacity="0.5" stroke="#ffffff" strokeWidth="0.15">
        <line x1={-10} y1={30 + lineAngle * 0.3} x2={110} y2={30 - lineAngle * 0.3} />
      </g>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#ffffff" opacity={0.18} />
      ))}
      {rings.map((r, i) => (
        <circle
          key={i}
          cx={r.cx}
          cy={r.cy}
          r={r.r}
          fill="none"
          stroke={r.gold ? "#f4c572" : "#8f8f95"}
          strokeWidth={r.gold ? 0.6 : 0.35}
          opacity={r.gold ? 0.85 : 0.4}
        />
      ))}
      <defs>
        <linearGradient id="cover-fade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1b1b1e" />
          <stop offset="100%" stopColor="#0a0a0b" />
        </linearGradient>
      </defs>
    </svg>
  );
}
