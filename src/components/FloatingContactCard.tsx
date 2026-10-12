"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { ArrowUpLeft, ArrowUpRight, Download, Mail, X } from "lucide-react";
import { downloads } from "@/data/downloads";
import { companionChapters, companionDestination, getCompanionChapter, type CompanionChapter } from "@/lib/companion-sections";
import type { CompanionTravel } from "@/components/three/BuilderAvatar";
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
  const lastViewportWidth = useRef(0);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [avatarReady, setAvatarReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [compactContact, setCompactContact] = useState(false);
  const dock = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const currentChapter = useRef(initialChapter.id);
  const currentSide = useRef<"left" | "right">("right");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const speechTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const suppressFocus = useRef(false);
  const pointerInside = useRef(false);
  const openedByClick = useRef(false);
  const travel = useRef<CompanionTravel>({ velocity: 0, updatedAt: 0, arrivedAt: 0, flight: 0, journeyVelocity: 0, pointDirection: -1 });

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
    speechTimer.current = setTimeout(() => setSpeaking(false), 3200);
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

  useEffect(() => {
    const travelState = travel.current;
    const dockElement = dock.current;
    let frame = 0;
    let stopTimer: ReturnType<typeof setTimeout> | undefined;
    let previousY = window.scrollY;
    let previousTime = performance.now();
    let chapters: { chapter: CompanionChapter; element: Element }[] = [];
    const collect = () => {
      chapters = pathname === "/" ? companionChapters.flatMap((item) => {
        const element = document.querySelector(item.selector);
        return element ? [{ chapter: item, element }] : [];
      }) : [];
    };
    const measure = () => {
      frame = 0;
      if (document.hidden) return;
      const now = performance.now();
      const distance = window.scrollY - previousY;
      const elapsed = Math.max(16, now - previousTime);
      const velocity = Math.max(-2400, Math.min(2400, distance / elapsed * 1000));
      previousY = window.scrollY;
      previousTime = now;
      travelState.velocity = reduced ? 0 : velocity;
      travelState.updatedAt = now;
      if (dockElement && !reduced && Math.abs(velocity) > 22) {
        dockElement.dataset.walking = "true";
        dockElement.dataset.direction = velocity > 0 ? "forward" : "back";
        clearTimeout(stopTimer);
        stopTimer = setTimeout(() => { dockElement.dataset.walking = "false"; }, 240);
      }
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.max(0, Math.min(1, window.scrollY / scrollable)) : 1;
      dockElement?.style.setProperty("--companion-progress", String(progress));
      let next = initialChapter;
      const readingLine = Math.min(window.innerHeight * 0.35, 260);
      for (const item of chapters) {
        if (item.element.getBoundingClientRect().top <= readingLine) next = item.chapter;
      }
      if (next.id !== currentChapter.current) {
        currentChapter.current = next.id;
        setChapter(next);
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
      clearTimeout(stopTimer);
      travelState.velocity = 0;
      if (dockElement) dockElement.dataset.walking = "false";
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", resize);
    };
  }, [pathname, initialChapter, reduced]);

  useEffect(() => {
    const downloads = document.querySelector('button[aria-label="Résumé and book downloads"]');
    if (!downloads) return;
    const update = () => setDownloadsOpen(downloads.getAttribute("aria-expanded") === "true");
    const observer = new MutationObserver(update);
    observer.observe(downloads, { attributes: true, attributeFilter: ["aria-expanded"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!viewport.width || !dock.current) return;
    const element = dock.current;
    const state = travel.current;
    let controls: { stop: () => void } | undefined;
    const stop = () => {
      controls?.stop();
      state.journeyVelocity = 0;
      state.flight = 0;
      element.dataset.travelling = "false";
      element.dataset.flying = "false";
      element.style.setProperty("--companion-flight", "0");
    };
    const frame = window.requestAnimationFrame(() => {
      // An open CV card stays where the visitor put it, even while the page scrolls.
      if (expanded) {
        const mobile = viewport.width < 700;
        const availableWidth = document.documentElement.clientWidth;
        const styles = window.getComputedStyle(element);
        const dockWidth = element.offsetWidth;
        const rightInset = Number.parseFloat(styles.right);
        // A viewport resize may change the available margin while the card is open.
        const boundedX = mobile ? 0 : Math.max(-(availableWidth - dockWidth - rightInset - 20), Math.min(0, x.get()));
        x.set(boundedX);
        const cardClearance = mobile ? 126 : viewport.height <= 560 ? 158 : 196;
        const maximumLift = Math.max(0, viewport.height - cardClearance - 120);
        const boundedY = Math.max(-maximumLift, Math.min(0, y.get()));
        y.set(boundedY);
        element.style.setProperty("--companion-lift", `${-boundedY}px`);
        if (mobile) { currentSide.current = "right"; setSide("right"); }
        const left = availableWidth - rightInset - dockWidth + boundedX;
        const cardWidth = Math.min(288, availableWidth - 24);
        const preferred = currentSide.current === "left" ? 0 : dockWidth - cardWidth;
        const offset = Math.max(12 - left, Math.min(preferred, availableWidth - 12 - cardWidth - left));
        element.style.setProperty("--companion-card-left", `${offset}px`);
        return;
      }
      element.style.removeProperty("--companion-card-left");
      const resized = lastViewportWidth.current !== viewport.width;
      lastViewportWidth.current = viewport.width;
      const downloads = document.querySelector<HTMLButtonElement>('button[aria-label="Résumé and book downloads"]');
      const downloadsVisible = Boolean(downloads?.getClientRects().length && downloads.offsetWidth);
      const location = downloadsOpen ? { ...chapter, side: "right" as const } : chapter;
      const target = companionDestination(location, viewport.width, viewport.height, downloadsVisible, reduced);
      if (target.side === "left") target.x += viewport.width - document.documentElement.clientWidth;
      currentSide.current = target.side;
      setSide(target.side);
      state.pointDirection = target.side === "left" ? 1 : -1;
      setSpeaking(false);
      element.style.setProperty("--companion-lift", `${-target.y}px`);
      const finish = () => {
        stop();
        state.arrivedAt = performance.now();
        if (!reduced && pageVisible && viewport.width >= 700) showNote();
      };
      const distance = target.x - x.get();
      if (reduced || !pageVisible || resized) {
        x.set(target.x);
        y.set(target.y);
        finish();
        return;
      }
      const fromX = x.get();
      const fromY = y.get();
      const crossing = Math.abs(distance) >= 8;
      element.dataset.travelling = crossing ? "true" : "false";
      const duration = crossing ? Math.min(1.7, Math.max(1.05, Math.abs(distance) / 900)) : .65;
      const lift = crossing ? Math.min(44, viewport.height * .055) : 0;
      controls = animate(0, 1, {
        duration,
        ease: [0.4, 0, 0.25, 1],
        onUpdate: (progress) => {
          x.set(fromX + distance * progress);
          y.set(fromY + (target.y - fromY) * progress - Math.sin(progress * Math.PI) * lift);
          state.flight = crossing ? Math.sin(progress * Math.PI) ** 2 : 0;
          state.journeyVelocity = crossing ? Math.sign(distance) * 1100 * Math.sin(progress * Math.PI) : 0;
          element.dataset.flying = state.flight > .3 ? "true" : "false";
          element.style.setProperty("--companion-flight", String(state.flight));
        },
        onComplete: finish,
      });
    });
    return () => { window.cancelAnimationFrame(frame); stop(); };
  }, [chapter, viewport, expanded, reduced, pageVisible, downloadsOpen, showNote, x, y]);

  useEffect(() => {
    const visibility = () => {
      setPageVisible(!document.hidden);
      if (document.hidden) {
        travel.current.velocity = 0;
        if (dock.current) dock.current.dataset.walking = "false";
      }
    };
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

  return <motion.div className="builder-companion" style={{ x, y }} data-side={side} data-chapter={chapter.id} data-section-label={chapter.label} data-expanded={expanded} data-contact-page={pathname === "/contact"} ref={dock}
    onPointerEnter={() => { pointerInside.current = true; cancelClose(); if (!expanded) showNote(); }}
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
        exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.2 }}>
        {side === "right" && <ArrowUpLeft size={14} aria-hidden="true" />}<span>{chapter.note}</span>{side === "left" && <ArrowUpRight size={14} aria-hidden="true" />}
      </motion.div>}
    </AnimatePresence>
    <button className="companion-character" type="button" ref={trigger} aria-label="Meet Bhadresh — profile and CV" aria-haspopup="dialog" aria-expanded={expanded} aria-controls="builder-id-card" aria-describedby={speaking && !expanded ? "companion-tooltip" : undefined}
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
        {!unavailable && !compactContact && <BuilderAvatar mood={expanded ? "wave" : chapter.mood} travel={travel} interacting={expanded} reducedMotion={reduced} active={pageVisible} onReady={onAvatarReady} onUnavailable={onAvatarUnavailable} />}
      </span>
      <span className="companion-plinth" aria-hidden="true" /><span className="companion-footsteps" aria-hidden="true"><i /><i /><i /></span>
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
        <Link className="companion-email" href="/contact" onClick={() => closeCard()}><Mail size={13} />Say hello<ArrowUpRight size={13} /></Link>
      </motion.section>}
    </AnimatePresence>
  </motion.div>;
}

export default function FloatingContactCard() {
  const pathname = usePathname();
  return <Companion key={pathname} pathname={pathname} />;
}
