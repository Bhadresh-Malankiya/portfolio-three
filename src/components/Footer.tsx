import Link from "next/link";
import { identity } from "@/data/portfolio";

export default function Footer() {
  return <footer className="pf-footer"><div className="pf-shell pf-footer-inner"><div><p><strong>Bhadresh Malankiya</strong> · Full-stack & AI engineering</p><p>© {new Date().getFullYear()} · Thoughtful products. Reliable delivery.</p></div><nav aria-label="Footer navigation" className="pf-footer-links"><Link href="/projects">All work</Link><Link href="/journey">The Weekend Builder</Link><Link href="/field-guide">Field guides</Link><a href="https://ascendxi.com" target="_blank" rel="noopener noreferrer">AscendXI ↗</a><a href={`mailto:${identity.email}`}>Email ↗</a></nav></div></footer>;
}
