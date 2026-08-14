import Link from "next/link";
import { profile } from "@/data/profile";
import WeekendHeatmap from "@/components/WeekendHeatmap";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-line bg-ink-2/40">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl text-fg">Still building, most weekends.</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              {profile.summary.split(".")[0]}. Currently {profile.currentRole}.
            </p>
            <div className="mt-6 max-w-xs opacity-80">
              <WeekendHeatmap />
            </div>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold">Reach out</p>
            <ul className="mt-4 space-y-2 text-sm text-fg/90">
              <li>
                <a className="hover:text-gold" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
              </li>
              <li>
                <a className="hover:text-gold" href={`tel:${profile.phone.replace(/\s/g, "")}`}>
                  {profile.phone}
                </a>
              </li>
              <li className="text-muted">{profile.location}</li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold">Explore</p>
            <ul className="mt-4 space-y-2 text-sm text-fg/90">
              <li>
                <Link className="hover:text-gold" href="/journey">
                  The Story
                </Link>
              </li>
              <li>
                <Link className="hover:text-gold" href="/projects">
                  Projects
                </Link>
              </li>
              <li>
                <Link className="hover:text-gold" href="/field-guide">
                  Field Guide
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} Bhadreshkumar Malankiya — built badly at first, then again until it worked.</span>
          <span>{profile.site}</span>
        </div>
      </div>
    </footer>
  );
}
