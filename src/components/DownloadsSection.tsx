import { ArrowDown, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { downloads } from "@/data/downloads";

export default function DownloadsSection() {
  return <div className="reading-table">
    <Reveal className="reading-book-wrap" y={35}>
      <a className="reading-book" href={downloads.ebook.file} download={downloads.ebook.filename} aria-label="Download The Weekend Builder book">
        <div className="reading-book-spine" aria-hidden="true">THE WEEKEND BUILDER / BHADRESH MALANKIYA</div>
        <div className="reading-book-cover">
          <span className="book-edition">A life in code & ownership</span>
          <strong>The<br />Weekend<br /><em>Builder.</em></strong>
          <div className="book-sculpture" aria-hidden="true"><i /><i /><i /><i /><i /></div>
          <span className="book-author">Bhadreshkumar<br />Malankiya <ArrowDown size={20} /></span>
        </div>
      </a>
      <p className="reading-object-note">16 chapters. The habit of starting again.</p>
    </Reveal>
    <div className="reading-notes">
      <Reveal y={20}><p className="eyebrow">The longer version</p><h3>There’s a person<br /><em>behind the commits.</em></h3><p className="reading-description">The starts, the detours, and the projects that shaped the way I build. I wrote them down.</p><a className="reading-download" href={downloads.ebook.file} download={downloads.ebook.filename}>{downloads.ebook.cta}<ArrowDown size={15} /><span>PDF · {downloads.ebook.sizeLabel}</span></a><Link href="/journey" className="reading-online">Or read the chapters here <ArrowUpRight size={14} /></Link></Reveal>
      <Reveal y={20} delay={.1}><div className="resume-slip"><span className="resume-punch" aria-hidden="true" /><p className="eyebrow">For the hiring conversation</p><h3>The résumé.</h3><p>Experience, responsibility, and the work in between.</p><a href={downloads.resume.file} download={downloads.resume.filename}>{downloads.resume.cta}<ArrowDown size={15} /></a></div></Reveal>
    </div>
  </div>;
}
