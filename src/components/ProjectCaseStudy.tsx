"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import ProjectGallery from "@/components/ProjectGallery";
import Reveal from "@/components/Reveal";
import type { PortfolioProject } from "@/data/portfolio";
import { getProjectWorld, type ProjectWorld } from "@/data/project-themes";
import { profile } from "@/data/profile";

function WorldDrawing({ motif }: { motif: ProjectWorld["motif"] }) {
  const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.5 };
  return (
    <svg viewBox="0 0 500 400" className={`case-drawing drawing-${motif}`} aria-hidden="true">
      {motif === "voice" && <g>{Array.from({ length: 31 }, (_, i) => {
        const height = Math.round((24 + Math.pow(Math.sin(i * .61), 2) * (160 - Math.abs(i - 15) * 7)) * 100) / 100;
        return <rect key={i} x={37 + i * 14} y={200 - height / 2} width="5" height={height} rx="2.5" style={{ animationDelay: `${i * -.13}s`, transformOrigin: `${40 + i * 14}px 200px` }} />;
      })}<path {...line} d="M40 280H460M40 120H460" strokeDasharray="2 10" /></g>}
      {motif === "jewel" && <g {...line}><ellipse cx="250" cy="208" rx="109" ry="139" transform="rotate(-28 250 208)" strokeWidth="14" opacity=".28" /><ellipse cx="250" cy="208" rx="109" ry="139" transform="rotate(-28 250 208)" /><path d="m263 65 49 22 6 49-62 26-41-48 18-43Z M233 71l23 91M312 87l-56 75M215 114l103 22M263 65l-8 55 57-33M255 120l63 16" /><path d="M355 48v30m-15-15h30M136 282v22m-11-11h22" /></g>}
      {motif === "assessment" && <g {...line}>{[2, 1, 0].map(i => <g key={i} transform={`translate(${i * 23} ${i * -22})`}><rect x="90" y="105" width="258" height="205" rx="12" fill="var(--case-paper)" /><path d="M120 142h114M120 165h180" opacity=".5" /><rect x="120" y="196" width="18" height="18" rx="3" /><path d="m123 204 5 5 12-15M155 205h100M120 248h162M120 271h107" /></g>)}</g>}
      {motif === "forms" && <g {...line}><rect x="104" y="50" width="235" height="305" rx="14" fill="var(--case-paper)" /><path d="M139 96h91M139 114h160" />{[0, 1, 2].map(i => <g key={i} transform={`translate(0 ${i * 57})`}><circle cx="150" cy="161" r="11" /><path d="m145 160 4 5 8-10M177 154h112M177 168h77" /></g>)}<circle cx="343" cy="287" r="58" fill="var(--case-paper)" strokeWidth="3" /><path d="M343 246v43l28 17" strokeWidth="3" /><path d="M343 229v-12m-17 0h34" /></g>}
      {motif === "support" && <g {...line}><rect x="87" y="83" width="264" height="191" rx="20" /><path d="m88 105 129 88 133-88M88 251l89-86M351 251l-89-86" /><rect x="251" y="229" width="166" height="102" rx="20" fill="var(--case-paper)" /><path d="m293 332-17 26v-29M282 260h103M282 281h68" /><circle cx="112" cy="58" r="8" /><path d="M395 89v32m-16-16h32" /></g>}
      {motif === "publishing" && <g {...line}>{[0, 1, 2].map(i => <g key={i} transform={`translate(${i * 87} ${i * 29}) rotate(${i * 7 - 7} 185 184)`}><rect x="87" y="65" width="173" height="243" rx="8" fill="var(--case-paper)" /><rect x="109" y="91" width="129" height="90" rx="3" opacity=".55" /><path d="m112 163 40-47 31 37 26-26 26 40M109 208h129M109 229h98M109 250h117M109 272h65" /></g>)}</g>}
      {motif === "kiosk" && <g {...line}><path d="m143 136 108-51 108 51v145l-108 58-108-58Z M143 136l108 53 108-53M251 189v150" /><path d="M222 98V68h58v31M111 138H83v147h28M379 138h28v147h-28" /><path className="case-scan-line" d="m121 195 131 63 130-63" strokeWidth="3" /><path d="M153 357h196" strokeDasharray="3 8" /></g>}
      {motif === "workspace" && <g {...line}>{[0, 1, 2].map(i => <g key={i} transform={`translate(${i * 116} 0)`}><rect x="70" y="64" width="103" height="266" rx="9" /><path d="M84 89h60" /><rect x="82" y={116 + i * 17} width="79" height="62" rx="5" fill="var(--case-soft)" /><rect x="82" y={200 + i * 13} width="79" height="47" rx="5" /></g>)}</g>}
      {motif === "market" && <g {...line}><path d="M60 60v270h385M60 130h385M60 200h385M60 270h385" opacity=".25" />{[113, 161, 150, 198, 211, 180, 253, 266].map((v, i) => <g key={i}><path d={`M${91 + i * 46} ${360 - v}v-91`} /><rect x={82 + i * 46} y={299 - v} width="18" height="40" fill={i % 3 ? "currentColor" : "var(--case-paper)"} /></g>)}<path d="M72 302 139 246 172 269 219 193 265 211 311 154 355 155 419 85" strokeDasharray="3 7" /></g>}
      {motif === "medical" && <g {...line}><circle cx="250" cy="200" r="129" /><circle cx="250" cy="200" r="105" opacity=".3" /><path d="M65 204h91l19-43 27 88 30-114 28 101 19-32h156" strokeWidth="2.5" /><path d="M250 51v28M250 321v28M101 200h28M371 200h28" /></g>}
      {motif === "restaurant" && <g {...line}><ellipse cx="250" cy="202" rx="124" ry="122" /><circle cx="250" cy="202" r="93" /><path d="M74 79v91q0 22 21 22t21-22V79M95 79v252M412 79v252M412 79q-35 39-29 106h29" /><path d="M226 151c-22 16 29 29 5 48M256 140c-23 18 27 32 6 51M280 149c-15 16 23 24 9 40" /><path d="M196 222q54 62 108 0Z" /></g>}
      {motif === "pet" && <g {...line}><path d="M71 297c51-160 72 64 142-66S380 318 429 82" strokeDasharray="5 9" strokeWidth="2.5" /><circle cx="71" cy="297" r="18" /><path d="M400 104c-48-55 10-83 29-58 22-23 72 8 28 58l-28 32Z" fill="var(--case-soft)" /><g transform="rotate(-15 233 176)" fill="var(--case-soft)"><ellipse cx="215" cy="130" rx="17" ry="24" /><ellipse cx="258" cy="130" rx="17" ry="24" /><ellipse cx="181" cy="167" rx="16" ry="22" /><ellipse cx="288" cy="167" rx="16" ry="22" /><path d="M199 215c-2-25 19-52 36-52s41 29 39 52c-3 21-25 10-39 10s-35 13-36-10Z" /></g></g>}
      {motif === "legal" && <g {...line}><path d="M250 71v246M183 318h134M155 342h190M111 131h278M250 87l-20 44h40Z" /><path d="m132 133-48 109h96ZM368 133l-48 109h96Z" /><path d="M84 242q48 72 96 0M320 242q48 72 96 0" fill="var(--case-soft)" /></g>}
      {motif === "route" && <g {...line}><path d="M41 324 163 262l41-132 139 27 109-79M72 66l87 102 121 65 54 124M27 203l91-56 160-40 147 155" opacity=".25" /><path d="M96 289c106-12 76-112 159-84S408 149 372 84" strokeDasharray="6 9" strokeWidth="3" /><circle cx="96" cy="289" r="17" fill="var(--case-paper)" /><path d="M345 75a27 27 0 1 1 54 0c0 26-27 50-27 50s-27-24-27-50Z" fill="var(--case-soft)" /><circle cx="372" cy="75" r="8" /></g>}
      {motif === "studio" && <g {...line}><rect x="81" y="71" width="232" height="171" rx="9" transform="rotate(-8 197 156)" fill="var(--case-paper)" /><path d="m116 145 28-23m-28 23 28 23M212 122l28 23-28 23M189 112l-21 66" /><rect x="235" y="206" width="161" height="100" rx="7" transform="rotate(8 316 256)" fill="var(--case-soft)" /><path d="M267 246h92M267 266h62M121 313h65M153 281v64" /><circle cx="366" cy="107" r="32" /></g>}
    </svg>
  );
}

export default function ProjectCaseStudy({ project, next }: { project: PortfolioProject; next: PortfolioProject }) {
  const world = getProjectWorld(project.slug);
  const nextWorld = getProjectWorld(next.slug);
  const context = project.narrative.filter(paragraph => paragraph !== project.oneLiner && paragraph !== project.problem && paragraph !== `My contribution: ${project.role}.`);
  const cover = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: cover, offset: ["start start", "end start"] });
  const artworkY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const artworkRotate = useTransform(scrollYProgress, [0, 1], [-4, 7]);
  const variables = { "--case-paper": world.paper, "--case-ink": world.ink, "--case-accent": world.accent, "--case-soft": world.soft, "--case-signal": world.signal } as CSSProperties;
  return (
    <article className={`project-world world-${world.motif}`} style={variables}>
      <section className="case-cover" ref={cover}>
        <div className="case-cover-grid" aria-hidden="true" />
        <div className="case-container">
          <div className="case-topline"><Link href="/projects"><ArrowLeft size={15} /> All projects</Link><span>Field notes / {project.category}</span></div>
          <div className="case-cover-content">
            <Reveal className="case-cover-copy"><p className="case-label">{project.kind}</p><h1>{project.name}</h1><p className="case-cover-line">{world.line}</p></Reveal>
            <motion.div className="case-cover-art" style={reduced ? undefined : { y: artworkY, rotate: artworkRotate }}><WorldDrawing motif={world.motif} /><span className="case-art-caption">A study in {project.category.toLowerCase()}</span></motion.div>
          </div>
          <Reveal className="case-cover-bottom"><p>{project.oneLiner}</p><a href="#project-screens" className="case-round-link" aria-label={`Explore ${project.name}`}><ArrowDown size={23} /></a></Reveal>
        </div>
      </section>

      <section className="case-exhibit" id="project-screens" aria-labelledby="exhibit-heading">
        <div className="case-container">
          <div className="case-exhibit-heading"><div><span className="case-label">01 / In the product</span><h2 id="exhibit-heading">{project.images?.length ? "Take a closer look." : "The shape of the work."}</h2></div>{project.url && <a href={project.url} target="_blank" rel="noreferrer noopener" className="case-live-link">Visit the live site <ArrowUpRight size={17} /></a>}</div>
          {project.images?.length ? <Reveal className={`case-product-screens ${project.frame === "phone" ? "case-mobile-screens" : ""}`}><ProjectGallery images={project.images} name={project.name} url={project.url} frame={project.frame} big imageCaptions={project.imageCaptions} /></Reveal> : <div className="case-no-screens"><WorldDrawing motif={world.motif} /><p>{project.visualNote ?? "This project is represented by its engineering scope below. Public product screenshots are not available."}</p></div>}
          <div className="case-sequence" aria-label="Product workflow">{world.sequence.map((step, i) => <span key={step}><i>0{i + 1}</i>{step}{i < 2 && <ArrowRight size={17} />}</span>)}</div>
        </div>
      </section>

      <section className="case-story case-container" aria-labelledby="story-heading">
        <aside className="case-margin"><span className="case-label">02 / The build notes</span><h2 id="story-heading">{world.chapter}</h2><div className="case-role"><span>My role</span><p>{project.role}</p><span>Project status</span><p>{project.status}</p></div></aside>
        <div className="case-narrative">
          <Reveal className="case-note"><span className="case-note-number">01</span><div><h3>The starting point</h3><p>{project.problem}</p></div></Reveal>
          <Reveal className="case-note"><span className="case-note-number">02</span><div><h3>Where I came in</h3><p>{project.contribution}</p></div></Reveal>
          {project.decisions.length > 0 && <Reveal className="case-decisions"><span className="case-label">Decisions that shaped it</span><ol>{project.decisions.map((decision, i) => <li key={decision}><span>{String(i + 1).padStart(2, "0")}</span><p>{decision}</p></li>)}</ol></Reveal>}
          {context.length > 0 && <Reveal className="case-context"><h3>A little more context</h3>{context.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</Reveal>}
        </div>
      </section>

      {(project.metrics.length > 0 || project.outcomes.length > 0) && <section className="case-outcomes"><div className="case-container"><span className="case-label">03 / What came out of it</span>{project.metrics.length > 0 && <dl className="case-metrics">{project.metrics.map(metric => <Reveal key={metric.label}><div><dt>{metric.label}</dt><dd>{metric.value}</dd></div></Reveal>)}</dl>}{project.outcomes.length > 0 && <div className="case-outcome-list">{project.outcomes.map(outcome => <p key={outcome}><ArrowUpRight size={19} />{outcome}</p>)}</div>}</div></section>}

      <section className="case-tools case-container"><span className="case-label">{project.techLabel ?? "Tools behind the work"}</span><ul>{project.tech.map(tool => <li key={tool}>{tool}</li>)}</ul></section>
      <section className="case-next" style={{ "--next-paper": nextWorld.soft } as CSSProperties}><Link href={`/projects/${next.slug}`} className="case-container"><div><span className="case-label">Keep turning the pages</span><h2>{next.name}</h2><p>{next.category}</p></div><div className="case-next-preview">{next.images?.[0] ? <Image src={next.images[0]} alt={`${next.name} product preview`} fill sizes="(max-width: 680px) 40vw, 300px" className="object-contain" /> : <WorldDrawing motif={nextWorld.motif} />}</div><ArrowRight className="case-next-arrow" size={36} /></Link></section>
      <div className="case-endnote case-container"><p>A product starts with a conversation.</p><a href={`mailto:${profile.email}`}>Let’s have one <ArrowUpRight size={17} /></a></div>
    </article>
  );
}
