import Image from "next/image";
import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";
import { profile } from "@/data/profile";

export default function AboutSection() {
  return (
    <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
      <Reveal className="mx-auto w-full max-w-xs lg:mx-0">
        <div className="group relative overflow-hidden rounded-xl border border-line-strong bg-ink-2/50">
          <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
            <span className="h-2 w-2 rounded-full bg-gold shadow-[0_0_6px_1px_rgba(227,168,87,0.6)]" />
            <span className="font-mono text-[11px] text-muted">{profile.shortName.toLowerCase()}.jpg</span>
          </div>
          <div className="relative aspect-[2/3] w-full overflow-hidden">
            <Image
              src="/images/profile.jpg"
              alt={`${profile.name}, ${profile.role}`}
              fill
              sizes="(min-width: 1024px) 340px, 60vw"
              className="object-cover grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
          </div>
        </div>
      </Reveal>

      <div>
        <Reveal>
          <Eyebrow>Who&apos;s building this</Eyebrow>
          <h2 className="mt-4 text-balance font-display text-3xl leading-tight text-fg sm:text-4xl">
            {profile.name} — {profile.role}.
          </h2>
        </Reveal>
        <Reveal delay={0.08} className="mt-5 max-w-xl space-y-4 text-pretty leading-relaxed text-muted">
          <p>{profile.summary}</p>
        </Reveal>
        <Reveal delay={0.14} className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6">
          {[
            { label: "Based in", value: profile.location },
            { label: "Currently", value: profile.currentRole },
            { label: "Reach him at", value: profile.email },
          ].map((f) => (
            <div key={f.label}>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{f.label}</p>
              <p className="mt-1 text-sm text-fg/90">{f.value}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </div>
  );
}
