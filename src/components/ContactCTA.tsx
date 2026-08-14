import { ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";
import Reveal from "@/components/Reveal";

export default function ContactCTA() {
  return (
    <Reveal className="relative overflow-hidden rounded-xl border border-line bg-ink-2/50 px-6 py-14 sm:px-14 sm:py-20">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-gold), transparent 70%)" }}
      />
      <div className="relative z-10 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">Open to the next thing</p>
        <h2 className="mt-4 text-balance font-display text-3xl leading-tight text-fg sm:text-4xl">
          I don&apos;t know what I&apos;m building next. I know exactly how I&apos;ll start —{" "}
          <span className="italic text-gold-bright">badly, immediately, and without waiting to feel ready.</span>
        </h2>
        <p className="mt-5 max-w-lg leading-relaxed text-muted">
          If you&apos;re hiring for something senior and technical, want a sole owner&apos;s eye on your product, or
          just want to talk about charts that lag, I read every email myself.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href={`mailto:${profile.email}`}
            className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-ink transition-colors hover:bg-gold-bright"
          >
            {profile.email}
            <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <a
            href={`tel:${profile.phone.replace(/\s/g, "")}`}
            className="font-mono text-xs uppercase tracking-[0.14em] text-muted hover:text-fg"
          >
            {profile.phone}
          </a>
        </div>
      </div>
    </Reveal>
  );
}
