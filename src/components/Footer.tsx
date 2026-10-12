import Link from "next/link";
import { profile } from "@/data/profile";

export default function Footer() {
  return (
    <footer className="border-t border-line py-8">
      <div className="page-shell flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="font-display text-xl">
            Bhadresh<span className="text-gold">.</span>
          </Link>
          <p className="mt-2 text-xs text-muted">
            {"// The Weekend Builder \u00b7 still building."}
          </p>
        </div>
        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-6 text-xs text-muted"
        >
          <Link href="/projects" className="hover:text-gold">
            Projects
          </Link>
          <Link href="/journey" className="hover:text-gold">
            My story
          </Link>
          <Link href="/field-guide" className="hover:text-gold">
            Field notes
          </Link>
          <Link href="/contact" className="hover:text-gold">
            Get in touch ↗
          </Link>
        </nav>
        <p className="text-[10px] text-muted">
          © {new Date().getFullYear()} {profile.shortName} Malankiya
        </p>
      </div>
    </footer>
  );
}
