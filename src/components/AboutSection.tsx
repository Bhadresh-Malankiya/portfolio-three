import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { profile } from "@/data/profile";
import { downloads } from "@/data/downloads";

export default function AboutSection() {
  return (
    <div className="about-grid">
      <Reveal className="portrait-panel">
        <div className="portrait-grid" />
        <span className="portrait-caption">{"// profile.ts"}</span>
        <Image
          src="/images/profile.png"
          alt="Bhadreshkumar Malankiya, Senior Full Stack Engineer and Technical Lead"
          width={1440}
          height={1917}
          sizes="(min-width: 1024px) 410px, 85vw"
          className="portrait-photo"
        />
        <div className="portrait-signature">
          <span>Bhadresh.</span>
          <span>Surat, India</span>
        </div>
      </Reveal>
      <Reveal className="about-copy">
        <p className="eyebrow">03 // about_me</p>
        <h2>
          Hello, I’m
          <br />
          <em>Bhadresh.</em>
        </h2>
        <p>
          I’m a full-stack engineer based in Surat, India. I started building
          web applications in 2018. My engineering work at ExpressTech Systems
          ran from June 2022 to September 2026. I now build through AscendXI.
        </p>
        <p>
          At ExpressTech, I worked across ExtendedForms.io, Quzo.ai, and
          HelpDesk AI — from interfaces and AI features to backend performance.
          VocalXI is my own product: a voice-first way to complete forms.
        </p>
        <p>
          I ran MB Systems for a year alongside my full-time role. The studio
          closed. The experience changed how I estimate work, manage a team, and
          talk to clients.
        </p>
        <dl className="about-details">
          <div>
            <dt>Currently</dt>
            <dd>Senior Full-Stack & AI Engineer · AscendXI</dd>
          </div>
          <div>
            <dt>My focus</dt>
            <dd>Product engineering · AI systems · Scalable SaaS</dd>
          </div>
          <div>
            <dt>Based in</dt>
            <dd>{profile.location}</dd>
          </div>
        </dl>
        <div className="flex flex-wrap gap-6 mt-7">
          <a
            className="text-link"
            href={downloads.resume.file}
            download={downloads.resume.filename}
          >
            Download résumé <ArrowUpRight size={16} />
          </a>
          <Link className="text-link" href="/journey">
            read my story <ArrowUpRight size={16} />
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
