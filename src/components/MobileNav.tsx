"use client";
import Link from "next/link";
import { useRef } from "react";

type Props = { links: { href: string; label: string }[]; resume: string };
export default function MobileNav({ links, resume }: Props) {
  const menu = useRef<HTMLDetailsElement>(null);
  function close() { if (menu.current) menu.current.open = false; }
  return <details className="pf-mobile-menu" ref={menu} onKeyDown={(event) => { if (event.key === "Escape") { close(); menu.current?.querySelector("summary")?.focus(); } }} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) close(); }}><summary>Menu <span aria-hidden="true">+</span></summary><div className="pf-mobile-menu-panel">{links.map((link) => <Link onClick={close} href={link.href} key={link.href}>{link.label}</Link>)}<Link onClick={close} href="/projects">All projects ↗</Link><a onClick={close} href={resume} download>Download résumé ↓</a></div></details>;
}
