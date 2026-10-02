"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useReducedMotion,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/#work", label: "work()" },
  { href: "/#about", label: "about()" },
  { href: "/#experience", label: "timeline()" },
  { href: "/projects", label: "projects/" },
];

export default function Nav() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu when the route changes — adjusted during render
  // (React's recommended pattern) rather than in an effect.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-line bg-ink/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-gold"
        style={{ scaleX: scrollYProgress }}
      />
      <nav className="page-shell flex items-center justify-between py-5">
        <Link
          href="/"
          className="group flex items-baseline gap-2 font-display text-lg tracking-tight text-fg"
        >
          <span className="font-display text-2xl">
            Bhadresh<span className="text-gold">.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => {
            const active =
              pathname === l.href ||
              (l.href !== "/" && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "font-mono text-xs uppercase tracking-[0.14em] transition-colors",
                  active ? "text-gold" : "text-muted hover:text-fg",
                )}
              >
                {l.label}
              </Link>
            );
          })}
          <a
            href="mailto:bhadreshm3418@gmail.com"
            className="rounded-full border border-line-strong px-4 py-1.5 font-mono text-xs uppercase tracking-[0.14em] text-fg transition-colors hover:border-gold hover:text-gold"
          >
            contact()
          </a>
        </div>

        <button
          className="p-2 text-fg md:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: reduced ? 0 : 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            id="mobile-navigation"
            className="overflow-hidden border-b border-line bg-ink md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded px-2 py-2.5 font-mono text-sm uppercase tracking-wide text-fg/90 hover:bg-ink-2"
                >
                  {l.label}
                </Link>
              ))}
              <a
                href="mailto:bhadreshm3418@gmail.com"
                className="mt-2 rounded px-2 py-2.5 font-mono text-sm uppercase tracking-wide text-gold"
              >
                contact() →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
