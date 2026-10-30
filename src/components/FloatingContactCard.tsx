"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { afterHeroSettled } from "@/lib/hero-settled";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Download, Mail, Phone, X } from "lucide-react";
import { WhatsAppIcon } from "@/components/SocialIcons";
import { phoneHref, whatsappHref } from "@/lib/contact-links";
import { downloads } from "@/data/downloads";
import { getCompanionChapter, type CompanionChapter } from "@/lib/companion-sections";
import type { CompanionTravel } from "@/components/three/BuilderAvatar";
import { useCompanionJourney } from "@/components/useCompanionJourney";
import "@/app/companion.css";

const BuilderAvatar = dynamic(() => import("@/components/three/BuilderAvatar"), { ssr: false });
const BARCODE = [2, 1, 3, 1, 1, 4, 2, 1, 3, 2, 1, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 3];

function Companion({ pathname }: { pathname: string }) {
  const reduced = Boolean(useReducedMotion());
  const initialChapter = getCompanionChapter(pathname);
  const [chapter, setChapter] = useState<CompanionChapter>(initialChapter);
  const [expanded, setExpanded] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [side, setSide] = useState<"left" | "right">("right");
  const [downloadsOpen, setDownloadsOpen] = useState(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [avatarReady, setAvatarReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [compactContact, setCompactContact] = useState(false);
  // The 3D avatar mounts once the hero plane has settled; the photo shows until then.
  const [avatarAllowed, setAvatarAllowed] = useState(false);
  useEffect(() => afterHeroSettled(() => setAvatarAllowed(true)), []);
  const dock = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const currentSide = useRef<"left" | "right">("right");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const suppressFocus = useRef(false);
  const pointerInside = useRef(false);
  const openedByClick = useRef(false);
  const travel = useRef<CompanionTravel>({ flight: 0, journeyVelocity: 0, pointDirection: -1, pointElevation: 0, pointing: false, speaking: false });

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

  useEffect(() => {
    const update = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
      setCompactContact(pathname === "/contact" && window.innerWidth < 700);
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, [pathname]);

  const updateChapter = useCallback((next: CompanionChapter) => {
    setChapter(next);
  }, []);
  const updateSide = useCallback((next: "left" | "right") => {
    currentSide.current = next;
    setSide(next);
  }, []);
  useCompanionJourney({ pathname, viewport, reduced, paused: !pageVisible, ready: avatarReady || unavailable, expanded, downloadsOpen, dock, travel, x, y, onChapter: updateChapter, onSide: updateSide, onCue: setSpeaking });

  useEffect(() => {
    const downloads = document.querySelector('button[aria-label="Résumé and book downloads"]');
    if (!downloads) return;
    const update = () => setDownloadsOpen(downloads.getAttribute("aria-expanded") === "true");
    update();
    const observer = new MutationObserver(update);
    observer.observe(downloads, { attributes: true, attributeFilter: ["aria-expanded"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!viewport.width || !dock.current) return;
    const element = dock.current;
    if (!expanded) { element.style.removeProperty("--companion-card-left"); delete element.dataset.cardLayout; return; }
    // An open CV card stays put and remains reachable after a viewport resize.
    const availableWidth = document.documentElement.clientWidth;
    const mobile = viewport.width < 700;
    const rightInset = Number.parseFloat(window.getComputedStyle(element).right);
    const dockWidth = element.offsetWidth;
    const boundedX = mobile ? 0 : Math.max(-(availableWidth - dockWidth - rightInset - 20), Math.min(0, x.get()));
    const clearance = element.offsetHeight + (mobile ? 50 : 52);
    const boundedY = Math.max(-Math.max(0, viewport.height - clearance - 120), Math.min(0, y.get()));
    x.set(boundedX);
    y.set(boundedY);
    element.style.setProperty("--companion-lift", `${-boundedY}px`);
    const left = availableWidth - rightInset - dockWidth + boundedX;
    const cardWidth = Math.min(288, availableWidth - 24);
    const beside = travel.current.flight > .2 && viewport.width >= 1000 && viewport.height >= 600;
    element.dataset.cardLayout = beside ? "beside" : "above";
    const preferred = beside ? -cardWidth - 20 : currentSide.current === "left" ? 0 : dockWidth - cardWidth;
    const offset = Math.max(12 - left, Math.min(preferred, availableWidth - 12 - cardWidth - left));
    element.style.setProperty("--companion-card-left", `${offset}px`);
  }, [viewport, expanded, x, y]);

  useEffect(() => {
    const visibility = () => {
      setPageVisible(!document.hidden);
      if (document.hidden) {
        travel.current.journeyVelocity = 0;
        if (dock.current) dock.current.dataset.walking = "false";
      }
    };
    visibility();
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
  }, []);
  const onAvatarReady = useCallback(() => setAvatarReady(true), []);
  const onAvatarUnavailable = useCallback(() => setUnavailable(true), []);

  return <motion.div className="builder-companion" style={{ x, y }} data-side={side} data-chapter={chapter.id} data-section-label={chapter.label} data-expanded={expanded} data-speaking={speaking && !expanded} data-contact-page={pathname === "/contact"} ref={dock}
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
      {speaking && !expanded && <motion.div className="companion-tooltip" id="companion-tooltip" role="tooltip" key={chapter.id}
        initial={{ opacity: 0, x: reduced ? 0 : side === "left" ? -5 : 5 }} animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ duration: reduced ? 0 : 0.18 }}>
        <span className="companion-tooltip-label">{chapter.label}</span>
        <span className="companion-tooltip-message">{chapter.note}</span>
      </motion.div>}
    </AnimatePresence>
    <button className="companion-character" type="button" ref={trigger} aria-label="Meet Bhadresh: profile and CV" aria-haspopup="dialog" aria-expanded={expanded} aria-controls="builder-id-card" aria-describedby={speaking && !expanded ? "companion-tooltip" : undefined}
      onClick={() => {
        clearTimeout(hoverTimer.current);
        cancelClose();
        if (openedByClick.current && expanded) closeCard();
        else { openedByClick.current = true; setExpanded(true); }
      }}
      onFocus={() => { if (!suppressFocus.current && trigger.current?.matches(":focus-visible")) setExpanded(true); }}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") hoverTimer.current = setTimeout(() => setExpanded(true), 650); }}>
      <span className="companion-model" aria-hidden="true">
        {(!avatarReady || unavailable) && <span className="companion-fallback"><Image src="/images/profile.png" alt="" width={96} height={96} /><span>hi.</span></span>}
        {!unavailable && !compactContact && avatarAllowed && <BuilderAvatar mood={expanded ? "wave" : chapter.mood} travel={travel} interacting={expanded} reducedMotion={reduced} active={pageVisible} onReady={onAvatarReady} onUnavailable={onAvatarUnavailable} />}
      </span>
      <span className="companion-plinth" aria-hidden="true" /><span className="companion-footsteps" aria-hidden="true"><i /><i /><i /></span>
    </button>
    <AnimatePresence>
      {expanded && <motion.section className="companion-id" id="builder-id-card" role="dialog" aria-label="Bhadresh’s profile card" data-lenis-prevent
        initial={{ opacity: 0, y: reduced ? 0 : 12, rotate: reduced ? 0 : 2 }} animate={{ opacity: 1, y: 0, rotate: 0 }}
        exit={{ opacity: 0, y: reduced ? 0 : 8 }} transition={{ duration: reduced ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }} onPointerEnter={cancelClose}>
        <div className="companion-id-punch" aria-hidden="true" />
        <header className="companion-id-top"><span>BHADRESH MALANKIYA</span><button type="button" onClick={() => closeCard(true)} aria-label="Close profile card"><X size={16} /></button></header>
        <div className="companion-id-person">
          <div className="companion-id-photo"><Image src="/images/profile.png" alt="Bhadresh Malankiya" width={156} height={188} sizes="78px" /></div>
          <div><span className="companion-id-number">FULL STACK · TECH LEAD</span><h2>Bhadresh<br />Malankiya<span aria-hidden="true">.</span></h2><p>Senior Full Stack<br />Engineer · Tech Lead</p></div>
        </div>
        <p className="companion-id-intro">Call me. WhatsApp me. I answer.</p>
        <div className="companion-id-facts"><span>Full stack · Applied AI</span><span>Surat, India ↗</span></div>
        <div className="companion-id-bottom"><div className="companion-id-barcode" aria-hidden="true">{BARCODE.map((width, index) => <i key={index} style={{ width }} />)}</div><span>8+ YEARS<br />BUILDING THINGS</span></div>
        <a className="companion-cv" href={downloads.resume.file} download={downloads.resume.filename}><Download size={16} /><span>Take my CV</span><span>PDF <ArrowUpRight size={13} /></span></a>
        <div className="companion-reach">
          <a className="companion-reach-whatsapp" href={whatsappHref} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={15} />WhatsApp me</a>
          <a className="companion-reach-call" href={phoneHref}><Phone size={14} aria-hidden="true" />Call me</a>
        </div>
        <Link className="companion-email" href="/contact" onClick={() => closeCard()}><Mail size={13} />Or send a message<ArrowUpRight size={13} /></Link>
      </motion.section>}
    </AnimatePresence>
  </motion.div>;
}

export default function FloatingContactCard() {
  const pathname = usePathname();
  return <Companion key={pathname} pathname={pathname} />;
}
