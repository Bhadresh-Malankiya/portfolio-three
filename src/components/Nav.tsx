"use client";

import Link from "next/link";
import { useRef } from "react";
import { identity } from "@/data/portfolio";

const links = [{ href: "/#work", label: "Work" }, { href: "/#expertise", label: "Expertise" }, { href: "/#about", label: "About" }, { href: "/#contact", label: "Contact" }];

export default function Nav() {
  const menu = useRef<HTMLDetailsElement>(null);
  function closeMenu() { if (menu.current) menu.current.open = false; }
  return <header className="pf-nav"><nav className="pf-shell pf-nav-inner" aria-label="Main navigation"><Link href="/" className="pf-brand"><span className="pf-monogram" aria-hidden="true">BM</span><span>Bhadresh Malankiya</span></Link><div className="pf-nav-links">{links.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}<a href={identity.resume} download className="pf-button">Résumé ↓</a></div><details className="pf-mobile-menu" ref={menu} onKeyDown={(event) => { if (event.key === "Escape") { closeMenu(); menu.current?.querySelector("summary")?.focus(); } }} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) closeMenu(); }}><summary>Menu <span aria-hidden="true">+</span></summary><div className="pf-mobile-menu-panel">{links.map((link) => <Link onClick={closeMenu} href={link.href} key={link.href}>{link.label}</Link>)}<Link onClick={closeMenu} href="/projects">All projects ↗</Link><a onClick={closeMenu} href={identity.resume} download>Download résumé ↓</a></div></details></nav></header>;
}
