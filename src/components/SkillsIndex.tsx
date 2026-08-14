import { skillGroups } from "@/data/skills";
import Reveal from "@/components/Reveal";

export default function SkillsIndex() {
  return (
    <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
      {skillGroups.map((group, i) => (
        <Reveal key={group.id} delay={(i % 6) * 0.05}>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
            {String(i + 1).padStart(2, "0")} / {group.label}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {group.items.map((item) => (
              <span
                key={item}
                className="rounded border border-line px-2.5 py-1 text-xs text-fg/85 transition-colors hover:border-gold/40 hover:text-gold-bright"
              >
                {item}
              </span>
            ))}
          </div>
        </Reveal>
      ))}
    </div>
  );
}
