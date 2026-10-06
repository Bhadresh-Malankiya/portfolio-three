import Link from "next/link";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { downloads } from "@/data/downloads";

export default function Hero() {
  return (
    <section className="intro-hero page-shell">
      <div className="intro-heading">
        <p className="eyebrow">Bhadresh Malankiya / Full-stack & AI engineer</p>
        <h1>
          Engineer by trade.
          <br />
          <em>Builder by habit.</em>
        </h1>
        <p className="intro-description">
          Eight years turning ideas into software.
          <br />
          Still curious about what comes next.
        </p>
        <div className="builder-actions">
          <Link href="#work" className="button-primary glow-border">
            Explore selected work <ArrowUpRight size={17} />
          </Link>
          <a
            href={downloads.resume.file}
            download={downloads.resume.filename}
            className="hero-resume"
          >
            Résumé <Download size={15} />
          </a>
        </div>
      </div>
      <div className="signature-art" aria-hidden="true">
        <div className="signature-orbit" />
        <div className="signature-orbit orbit-two" />
        <div className="signature-glass">
          <span>b.</span>
          <i />
        </div>
        <span className="signature-coordinates">SURAT, INDIA</span>
        <span className="signature-note">a life in building / since 2018</span>
      </div>
      <div className="intro-bottom">
        <span>Currently building at AscendXI</span>
        <a href="#work">
          The work comes next <ArrowDown size={15} />
        </a>
      </div>
    </section>
  );
}
