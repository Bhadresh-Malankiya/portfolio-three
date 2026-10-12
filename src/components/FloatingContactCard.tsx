"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Download, Mail, MessageCircle, X } from "lucide-react";
import { profile } from "@/data/profile";
import { downloads } from "@/data/downloads";
import { companionChapters, getCompanionChapter, type CompanionChapter } from "@/lib/companion-sections";
import "@/app/companion.css";

const BuilderAvatar = dynamic(() => import("@/components/three/BuilderAvatar"), { ssr: false });
const BARCODE = [2, 1, 3, 1, 1, 4, 2, 1, 3, 2, 1, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 3];

function Companion({ pathname }: { pathname: string }) {
  const reduced = Boolean(useReducedMotion());
  const initialChapter = getCompanionChapter(pathname);
  const [chapter, setChapter] = useState<CompanionChapter>(initialChapter);
  const [expanded, setExpanded] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [avatarReady, setAvatarReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const dock = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const currentChapter = useRef(initialChapter.id);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const speechTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const suppressFocus = useRef(false);
  const pointerInside = useRef(false);
  const openedByClick = useRef(false);

  const cancelClose = useCallback(() => clearTimeout(closeTimer.current), []);
  const closeCard = useCallback((restoreFocus = false) => {
    clearTimeout(closeTimer.current);
    clearTimeout(hoverTimer.current);
    openedByClick.current = false;
    setExpanded(false);
    if (restoreFocus) {
      suppressFocus.current = true;
      trigger.current?.focus({ preventScroll: true });
    }
  }, []);
  const showNote = useCallback(() => {
    clearTimeout(speechTimer.current);
    setSpeaking(true);
    speechTimer.current = setTimeout(() => setSpeaking(false), 5500);
  }, []);

  useEffect(() => {
    let frame = 0;
    let chapters: { chapter: CompanionChapter; element: Element }[] = [];
    const collect = () => {
      chapters = pathname === "/" ? companionChapters.flatMap((item) => {
        const element = document.querySelector(item.selector);
        return element ? [{ chapter: item, element }] : [];
      }) : [];
    };
    const measure = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.max(0, Math.min(1, window.scrollY / scrollable)) : 1;
      dock.current?.style.setProperty("--companion-progress", String(progress));
      let next = initialChapter;
      const readingLine = Math.min(window.innerHeight * 0.35, 260);
      for (const item of chapters) {
        if (item.element.getBoundingClientRect().top <= readingLine) next = item.chapter;
      }
      if (next.id !== currentChapter.current) {
        currentChapter.current = next.id;
        setChapter(next);
        if (!reduced && window.matchMedia("(min-width: 700px)").matches) showNote();
      }
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(measure); };
    const resize = () => { collect(); schedule(); };
    collect();
    schedule();
    const observer = new ResizeObserver(resize);
    observer.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", resize);
    };
  }, [pathname, initialChapter, reduced, showNote]);

  useEffect(() => {
    const visibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, []);
  useEffect(() => {
    if (!expanded) return;
    const outside = (event: PointerEvent) => { if (!dock.current?.contains(event.target as Node)) closeCard(); };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); closeCard(true); }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [expanded, closeCard]);
  useEffect(() => () => {
    clearTimeout(closeTimer.current);
    clearTimeout(hoverTimer.current);
    clearTimeout(speechTimer.current);
  }, []);
  const onAvatarReady = useCallback(() => setAvatarReady(true), []);
  const onAvatarUnavailable = useCallback(() => setUnavailable(true), []);

  return <div className="builder-companion" data-expanded={expanded} ref={dock}
    onPointerEnter={() => { pointerInside.current = true; cancelClose(); }}
    onPointerLeave={() => {
      pointerInside.current = false;
      clearTimeout(hoverTimer.current);
      if (!dock.current?.contains(document.activeElement)) closeTimer.current = setTimeout(() => closeCard(), 240);
    }}
    onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node)) {
        suppressFocus.current = false;
        if (!pointerInside.current) closeCard();
      }
    }}>
    <AnimatePresence>
      {speaking && !expanded && <motion.div className="companion-thought" key={chapter.id}
        initial={{ opacity: 0, y: reduced ? 0 : 7, rotate: reduced ? 0 : -2 }} animate={{ opacity: 1, y: 0, rotate: 0 }}
        exit={{ opacity: 0, y: reduced ? 0 : 4 }} transition={{ duration: reduced ? 0 : 0.24 }}>
        <span className="companion-thought-name">A note from Bhadresh</span><p>{chapter.note}</p>
        <button type="button" onClick={() => setSpeaking(false)} aria-label="Dismiss guide note"><X size={12} /></button>
      </motion.div>}
    </AnimatePresence>
    <button className="companion-character" type="button" ref={trigger} aria-label="Meet Bhadresh — profile and CV" aria-haspopup="dialog" aria-expanded={expanded} aria-controls="builder-id-card"
      onClick={() => {
        clearTimeout(hoverTimer.current);
        cancelClose();
        if (openedByClick.current && expanded) closeCard();
        else { openedByClick.current = true; setExpanded(true); }
      }}
      onFocus={() => { if (!suppressFocus.current && trigger.current?.matches(":focus-visible")) setExpanded(true); }}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") hoverTimer.current = setTimeout(() => setExpanded(true), 180); }}>
      <span className="companion-model" aria-hidden="true">
        {(!avatarReady || unavailable) && <span className="companion-fallback"><Image src="/images/profile.png" alt="" width={96} height={96} /><span>hi.</span></span>}
        {!unavailable && <BuilderAvatar mood={expanded ? "wave" : chapter.mood} reducedMotion={reduced} active={pageVisible} onReady={onAvatarReady} onUnavailable={onAvatarUnavailable} />}
      </span>
      <span className="companion-plinth" aria-hidden="true" /><span className="companion-character-hint" aria-hidden="true">Meet the builder ↗</span>
    </button>
    <AnimatePresence>
      {expanded && <motion.section className="companion-id" id="builder-id-card" role="dialog" aria-label="Bhadresh’s profile card" data-lenis-prevent
        initial={{ opacity: 0, y: reduced ? 0 : 12, rotate: reduced ? 0 : 2 }} animate={{ opacity: 1, y: 0, rotate: 0 }}
        exit={{ opacity: 0, y: reduced ? 0 : 8 }} transition={{ duration: reduced ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }} onPointerEnter={cancelClose}>
        <div className="companion-id-punch" aria-hidden="true" />
        <header className="companion-id-top"><span>THE WEEKEND BUILDER</span><button type="button" onClick={() => closeCard(true)} aria-label="Close profile card"><X size={16} /></button></header>
        <div className="companion-id-person">
          <div className="companion-id-photo"><Image src="/images/profile.png" alt="Bhadresh Malankiya" width={156} height={188} sizes="78px" /></div>
          <div><span className="companion-id-number">BUILDER PASS / 001</span><h2>Bhadresh<br />Malankiya<span aria-hidden="true">.</span></h2><p>Forward Deployed<br />Engineer</p></div>
        </div>
        <p className="companion-id-intro">The human behind the little guide.</p>
        <div className="companion-id-facts"><span>Full stack · Applied AI</span><span>Surat, India ↗</span></div>
        <div className="companion-id-bottom"><div className="companion-id-barcode" aria-hidden="true">{BARCODE.map((width, index) => <i key={index} style={{ width }} />)}</div><span>8+ YEARS<br />BUILDING THINGS</span></div>
        <a className="companion-cv" href={downloads.resume.file} download={downloads.resume.filename}><Download size={16} /><span>Take my CV</span><span>PDF <ArrowUpRight size={13} /></span></a>
        <a className="companion-email" href={`mailto:${profile.email}`}><Mail size={13} />Say hello<ArrowUpRight size={13} /></a>
      </motion.section>}
    </AnimatePresence>
    <button className="companion-chapter" type="button" onClick={() => {
      if (expanded) { closeCard(); showNote(); }
      else if (speaking) setSpeaking(false);
      else showNote();
    }} aria-label={`${chapter.label}. ${speaking && !expanded ? "Hide" : "Show"} Bhadresh’s guide note`} aria-expanded={speaking && !expanded}>
      <span className="companion-chapter-top"><MessageCircle size={11} /><span>{chapter.label}</span><b>{chapter.number}</b></span>
      <span className="companion-journey" aria-hidden="true"><i /></span>
    </button>
  </div>;
}

export default function FloatingContactCard() {
  const pathname = usePathname();
  return <Companion key={pathname} pathname={pathname} />;
}
