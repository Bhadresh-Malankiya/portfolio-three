import { profile } from "@/data/profile";

export default function Ticker() {
  const items = profile.tickerStats;
  const doubled = [...items, ...items];

  return (
    <div className="relative w-full overflow-hidden border-y border-line bg-ink-2/60 py-3">
      <div className="flex w-max animate-marquee gap-10 [animation-play-state:running] hover:[animation-play-state:paused] motion-reduce:animate-none">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-10 whitespace-nowrap font-mono text-xs tracking-wide text-muted">
            <span className="text-gold">●</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
}
