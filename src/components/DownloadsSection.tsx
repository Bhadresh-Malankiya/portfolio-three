import { ArrowDown, ArrowUpRight, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/SocialIcons";
import Reveal from "@/components/Reveal";
import { downloads } from "@/data/downloads";
import { profile } from "@/data/profile";

const facts = [
  ["Role", "Senior Full Stack Engineer · Technical Lead"],
  ["Experience", "8+ years · team of 5 led"],
  ["Core stack", "Node.js · React · Next.js · TypeScript · PostgreSQL"],
  ["AI", "OpenAI · Claude · Gemini · RAG with pgvector"],
  ["Availability", "Immediate · relocation or remote"],
];

export default function DownloadsSection() {
  return <div className="reading-table">
    <Reveal className="reading-book-wrap" y={35}>
      <div className="glance-card">
        <p className="eyebrow">At a glance</p>
        <dl>{facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        <div className="glance-links">
          <a href={`mailto:${profile.email}`}><Mail size={15} aria-hidden="true" />Email</a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><LinkedinIcon size={15} />LinkedIn</a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer"><GithubIcon size={15} />GitHub</a>
        </div>
      </div>
    </Reveal>
    <div className="reading-notes">
      <Reveal y={20}><div className="resume-slip"><span className="resume-punch" aria-hidden="true" /><p className="eyebrow">For the hiring conversation</p><h3>The résumé.</h3><p>ExtendedForms, Quzo.ai, team leadership and the numbers behind them, on one page.</p><a href={downloads.resume.file} download={downloads.resume.filename}>{downloads.resume.cta}<ArrowDown size={15} /></a></div></Reveal>
      <Reveal y={20} delay={.1}><a className="reading-online" href={profile.linkedin} target="_blank" rel="noopener noreferrer">Connect on LinkedIn <ArrowUpRight size={14} /></a></Reveal>
    </div>
  </div>;
}
