"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { downloads } from "@/data/downloads";
import { scrollToPosition } from "@/components/SmoothScroll";
import { flightStops as stops, flightScrollStops as scrollStops, flightTimelineProgress as timelineProgress, flightChapterAt as chapterAt } from "@/lib/hero-flight";
import "@/app/hero-story.css";

const PaperPlaneScene = dynamic(() => import("@/components/three/PaperPlaneScene"), { ssr: false });
const pinnedQuery = "(min-width: 900px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)";
function subscribe(callback: () => void) {
  const media = window.matchMedia(pinnedQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const pinnedSnapshot = () => window.matchMedia(pinnedQuery).matches;
const serverSnapshot = () => false;
const acts = [
  { label: "Find the question", short: "Sketch it", title: "First, a question.", detail: "I find the problem worth solving.", word: "QUESTION" },
  { label: "Make the pieces work", short: "Make it work", title: "Then, something that works.", detail: "Frontend. Backend. AI. One working product.", word: "BUILD" },
  { label: "Put it in the world", short: "Ship it", title: "Finally, out in the world.", detail: "Ship, learn, improve. Then do it again.", word: "SHIP" },
];

class FlightBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function PlaneSketch() {
  return <svg viewBox="0 0 800 370" className="flight-fallback" aria-hidden="true"><path d="M145 210 668 65 454 315 371 211 145 210Z" fill="#eee9de" stroke="#b8b4ac" strokeWidth="2" /><path d="m668 65-297 146 35 94 48 10Z" fill="#8994a0" /><path d="m145 210 264 32 259-177-297 146Z" fill="#fffaf0" /><path d="m371 211 38 31-3 63Z" fill="#34404d" /><path d="m145 210 523-145-259 177M371 211l297-146M409 242l45 73" fill="none" stroke="#d6ad78" strokeWidth="1.2" /></svg>;
}

export default function Hero() {
  const story = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const pinned = useSyncExternalStore(subscribe, pinnedSnapshot, serverSnapshot);
  const activeInView = useInView(story, { margin: "100px" });
  const [act, setAct] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const rawProgress = useMotionValue<number>(stops[0]);
  const springProgress = useSpring(rawProgress, { stiffness: 180, damping: 31, mass: .65 });
  const progress = reduced ? rawProgress : springProgress;
  const routeProgress = useTransform(progress, [.08, .86], [0, 1]);
  const routeOpacity = useTransform(progress, [.08, .5, .86], [.5, .3, 0]);
  const gridOpacity = useTransform(progress, [.08, .86], [.65, .08]);
  const horizonY = useTransform(progress, [.08, .5, .86], [26, 0, -24]);
  const horizonScale = useTransform(progress, [.08, .86], [1, 1.08]);
  const currentOpacity = useTransform(progress, [.08, .5, .86], [.3, .7, 1]);
  const { scrollYProgress } = useScroll({ target: story, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", value => { if (pinned) rawProgress.set(timelineProgress(value)); });
  useMotionValueEvent(progress, "change", value => {
    const next = chapterAt(value);
    setAct(current => current === next ? current : next);
  });
  useEffect(() => {
    rawProgress.set(pinned ? timelineProgress(scrollYProgress.get()) : stops[chapterAt(rawProgress.get())]);
  }, [pinned, rawProgress, scrollYProgress]);
  const onReady = useCallback(() => setReady(true), []);
  const onUnavailable = useCallback(() => setFailed(true), []);
  function selectAct(index: number) {
    if (pinned && story.current) {
      const top = story.current.getBoundingClientRect().top + window.scrollY;
      scrollToPosition(top + (story.current.offsetHeight - window.innerHeight) * scrollStops[index]);
    } else {
      rawProgress.set(stops[index]);
    }
  }
  return <section ref={story} id="hero" className="flight-story" data-pinned={pinned} data-act={act} data-active={activeInView} aria-label="From a question to a working product">
    <div className="flight-theatre">
      <motion.div className="flight-atmosphere" aria-hidden="true" style={{ y: reduced ? 0 : horizonY, scale: reduced ? 1 : horizonScale }}>
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
          <defs>
            <linearGradient id="flight-horizon-wash" x1="720" y1="390" x2="720" y2="850" gradientUnits="userSpaceOnUse"><stop stopColor="#b58b57" stopOpacity=".12" /><stop offset=".5" stopColor="#324456" stopOpacity=".1" /><stop offset="1" stopColor="#0b111a" stopOpacity="0" /></linearGradient>
            <linearGradient id="flight-horizon-edge" x1="0" y1="530" x2="1440" y2="440" gradientUnits="userSpaceOnUse"><stop stopColor="#d6ad78" stopOpacity="0" /><stop offset=".55" stopColor="#d6ad78" stopOpacity=".5" /><stop offset="1" stopColor="#e7dccb" stopOpacity="0" /></linearGradient>
          </defs>
          <path d="M-100 595C250 540 400 484 715 477S1200 464 1540 337V950H-100Z" fill="url(#flight-horizon-wash)" />
          <path d="M-100 595C250 540 400 484 715 477S1200 464 1540 337" stroke="url(#flight-horizon-edge)" strokeWidth="1.2" />
          <g className="flight-air-contours">
            <path d="M-100 639C241 557 445 505 727 493S1252 451 1540 317" />
            <path d="M-100 698C226 586 448 537 744 511S1310 442 1540 295" />
            <path d="M-100 775C214 624 491 565 763 532S1328 438 1540 269" />
            <path d="M-100 875C187 682 504 601 787 558S1370 435 1540 235" />
          </g>
          <motion.g className="flight-air-currents" style={{ opacity: reduced ? .5 : currentOpacity }}>
            <path d="M-100 639C241 557 445 505 727 493S1252 451 1540 317" pathLength="100" />
            <path d="M-100 775C214 624 491 565 763 532S1328 438 1540 269" pathLength="100" />
          </motion.g>
        </svg>
      </motion.div>
      <div className="flight-rule" aria-hidden="true"><span>BH / 01</span><i /><span>IDEA → REALITY</span></div>
      <header className="flight-heading">
        <motion.p initial={{ y: reduced ? 0 : 12 }} animate={{ y: 0 }} transition={{ duration: .6 }} className="flight-byline">Bhadresh Malankiya <span aria-hidden="true">/</span> Forward Deployed Engineer</motion.p>
        <h1><span>Ideas don’t</span><em>ship themselves<span className="flight-fullstop">.</span></em></h1>
      </header>
      <div className="flight-stage" role="img" aria-label={`A paper plane becoming an aircraft: ${acts[act].label.toLowerCase()}`}>
        <motion.div className="flight-stage-grid" aria-hidden="true" style={{ opacity: reduced ? .2 : gridOpacity }} />
        <motion.svg className="flight-path" viewBox="0 0 1200 420" fill="none" aria-hidden="true" style={{ opacity: reduced ? .2 : routeOpacity }}>
          <path className="flight-pencil-line" d="M85 315C350 315 550 245 740 200S1030 145 1120 95" />
          <motion.path d="M85 315C350 315 550 245 740 200S1030 145 1120 95" stroke="#d6ad78" strokeWidth="1.3" style={{ pathLength: reduced ? 1 : routeProgress }} />
        </motion.svg>
        <div className="flight-object" data-ready={ready && !failed}>
          <PlaneSketch />
          {!failed && <FlightBoundary onError={onUnavailable}><PaperPlaneScene progress={progress} reducedMotion={!!reduced} active={activeInView} onReady={onReady} onUnavailable={onUnavailable} /></FlightBoundary>}
        </div>
        <span className="flight-stage-caption" aria-hidden="true">0{act + 1} / {acts[act].word}</span>
      </div>
      <div className="flight-bottom">
        <div className="flight-narrative" aria-live="polite" aria-atomic="true">
          <span className="flight-act-number" aria-hidden="true">0{act + 1}</span>
          <div className="flight-copy">
            <AnimatePresence initial={false} mode="wait">
              <motion.div key={act} initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : -3 }} transition={{ duration: reduced ? 0 : .18, ease: "easeOut" }}>
                <h2>{acts[act].title}</h2><p>{acts[act].detail}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <Link href="#work" className="flight-work-link">See what I’ve built <ArrowDown size={17} /></Link>
        <a className="flight-resume" href={downloads.resume.file} download={downloads.resume.filename}>Take the résumé <ArrowUpRight size={14} /></a>
      </div>
      <div className="flight-chapters" role="group" aria-label="Explore the opening story">{acts.map((item,index) => <button key={item.label} type="button" onClick={() => selectAct(index)} aria-label={`${item.short} — ${item.label}`} aria-pressed={act === index}><span>0{index + 1}</span>{item.short}<i aria-hidden="true" /></button>)}<span className="flight-scroll-note">{pinned ? "SCROLL TO UNFOLD ↓" : "EXPLORE THE STORY ↗"}</span></div>
    </div>
  </section>;
}
