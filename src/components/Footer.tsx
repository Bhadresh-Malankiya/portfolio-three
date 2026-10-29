import Link from "next/link";
import { profile } from "@/data/profile";
import { GithubIcon, LinkedinIcon } from "@/components/SocialIcons";

export default function Footer() {
  return (
    <footer className="border-t border-line py-8">
      <div className="page-shell flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="font-display text-xl">
            Bhadresh<span className="text-gold">.</span>
          </Link>
          <p className="mt-2 text-xs text-muted">
            {"// Senior Full Stack Engineer \u00b7 Technical Lead \u00b7 Available now"}
          </p>
        </div>
        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-6 text-xs text-muted"
        >
          <Link href="/projects" className="hover:text-gold">
            Projects
          </Link>
          <Link href="/field-guide" className="hover:text-gold">
            Field notes
          </Link>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-gold">
            <LinkedinIcon size={13} /> LinkedIn
          </a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-gold">
            <GithubIcon size={13} /> GitHub
          </a>
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
