"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import StackSculpture from "@/components/StackSculpture";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { downloads } from "@/data/downloads";

export default function Hero() {
  const story = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: story, offset: ["start start", "end end"] });
  return (
    <div ref={story} className="hero-scroll-story">
    <section className="intro-hero page-shell">
      <div className="intro-heading">
        <p className="eyebrow">Bhadresh Malankiya / Forward Deployed Engineer</p>
        <h1>
          Engineer by trade.
          <br />
          <em>Builder by habit.</em>
        </h1>
        <p className="intro-description">
          From customer problems to production.
          <br />
          Full stack. Applied AI. Eight years of building.
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
      <StackSculpture progress={scrollYProgress} />
      <div className="intro-bottom">
        <span>Currently building at AscendXI</span>
        <a href="#work">
          The work comes next <ArrowDown size={15} />
        </a>
      </div>
    </section>
    </div>
  );
}
