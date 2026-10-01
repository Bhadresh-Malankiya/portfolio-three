import Link from "next/link";
import MobileNav from "@/components/MobileNav";
import { identity } from "@/data/portfolio";
import "@/app/portfolio-polish.css";

const links = [{ href: "/#work", label: "Work" }, { href: "/#expertise", label: "Expertise" }, { href: "/#about", label: "About" }, { href: "/#contact", label: "Contact" }];

export default function Nav() {
  return <header className="pf-nav"><nav className="pf-shell pf-nav-inner" aria-label="Main navigation"><Link href="/" className="pf-brand"><span className="pf-monogram" aria-hidden="true">BM</span><span>Bhadresh Malankiya</span></Link><div className="pf-nav-links">{links.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}<a href={identity.resume} download className="pf-button">Résumé ↓</a></div><MobileNav links={links} resume={identity.resume} /></nav></header>;
}
