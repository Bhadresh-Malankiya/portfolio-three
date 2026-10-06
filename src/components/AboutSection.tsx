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
          Still curious.
          <br />
          <em>Still building.</em>
        </h2>
        <p>
          I’m Bhadresh, an engineer from Surat. Since 2018, I’ve moved from
          building web apps to leading product engineering at ExpressTech.
        </p>
        <p>
          Now I’m building VocalXI through AscendXI. The weekend habit stuck:
          see an idea, open the editor, find out.
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
