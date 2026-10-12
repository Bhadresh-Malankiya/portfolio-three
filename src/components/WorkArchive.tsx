"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { portfolioProjects } from "@/data/portfolio";

const picks = ["jewelxi", "zwopr", "helpdesk-ai"].map(slug => portfolioProjects.find(project => project.slug === slug)!);
const notes = ["A storefront for the finer details.", "A workspace for a world of content.", "A little more room for the human questions."];

export default function WorkArchive() {
  const rail = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  function move(direction: number) {
    const width = rail.current?.firstElementChild?.getBoundingClientRect().width ?? 600;
    rail.current?.scrollBy({ left: direction * (width + 28), behavior: reduced ? "instant" : "smooth" });
  }
  return <section className="workbench" aria-labelledby="workbench-title">
    <div className="workbench-heading">
      <div><p className="eyebrow">03 / Other corners of my work</p><h2 id="workbench-title">Still curious?<br /><em>Pull up a project.</em></h2></div>
      <div className="workbench-navigation"><button onClick={() => move(-1)} aria-label="Previous projects"><ArrowLeft size={20} /></button><button onClick={() => move(1)} aria-label="Next projects"><ArrowRight size={20} /></button></div>
    </div>
    <div className="workbench-rail" ref={rail} tabIndex={0} aria-label="More project stories; scroll horizontally">
      {picks.map((project, index) => <motion.article key={project.slug} className={`workbench-poster poster-${project.slug}`} initial={{ opacity: 0, y: reduced ? 0 : 45 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .7 }}>
        <Link href={`/projects/${project.slug}`}>
          <div className="poster-meta"><span>{project.category}</span><span>0{index + 5} ↗</span></div>
          <h3>{project.slug === "zwopr" ? "ZWOPR" : project.name}</h3>
          <p>{notes[index]}</p>
          <div className="poster-screen"><Image src={project.images![0]} alt={`${project.name} interface`} fill sizes="(max-width: 700px) 85vw, 600px" className="object-contain" /></div>
          <div className="poster-caption"><span>{project.kind}</span><span>Open the story <ArrowUpRight size={15} /></span></div>
        </Link>
      </motion.article>)}
    </div>
    <div className="workbench-end"><p>Different teams. Different problems. The same hands-on approach.</p><Link href="/projects">Explore all {portfolioProjects.length} projects <ArrowUpRight size={17} /></Link></div>
  </section>;
}
