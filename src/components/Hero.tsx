"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { downloads } from "@/data/downloads";
import { scrollToPosition } from "@/components/SmoothScroll";
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
const stops = [.08, .5, .86];
const acts = [
  { label: "Find the question", title: "First, a question.", detail: "I find the problem worth solving.", word: "QUESTION" },
  { label: "Make the pieces work", title: "Then, something that works.", detail: "Frontend. Backend. AI. One working product.", word: "BUILD" },
  { label: "Put it in the world", title: "Finally, out in the world.", detail: "Ship, learn, improve. Then do it again.", word: "SHIP" },
];

class FlightBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function PlaneSketch() {
  return <svg viewBox="0 0 800 370" className="flight-fallback" aria-hidden="true"><path d="M145 210 668 65 454 315 371 211 145 210Z" fill="#ecebe2" stroke="#adb4a3" strokeWidth="2" /><path d="m668 65-297 146 35 94 48 10Z" fill="#c6d4f3" /><path d="m145 210 264 32 259-177-297 146Z" fill="#fffdf2" /><path d="m371 211 38 31-3 63Z" fill="#354eab" /><path d="m145 210 523-145-259 177M371 211l297-146M409 242l45 73" fill="none" stroke="#9fa8a0" strokeWidth="1.2" /></svg>;
}

export default function Hero() {
  const story = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const pinned = useSyncExternalStore(subscribe, pinnedSnapshot, serverSnapshot);
  const activeInView = useInView(story, { margin: "100px" });
  const [act, setAct] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const rawProgress = useMotionValue(stops[0]);
  const progress = useSpring(rawProgress, { stiffness: 115, damping: 25, mass: .7 });
  const { scrollYProgress } = useScroll({ target: story, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", value => { if (pinned) rawProgress.set(value); });
  useMotionValueEvent(progress, "change", value => {
    if (!pinned) return;
    const next = value < .32 ? 0 : value < .7 ? 1 : 2;
    setAct(current => current === next ? current : next);
  });
  useEffect(() => {
    rawProgress.set(pinned ? scrollYProgress.get() : stops[act]);
  }, [pinned, act, rawProgress, scrollYProgress]);
  const onReady = useCallback(() => setReady(true), []);
  const onUnavailable = useCallback(() => setFailed(true), []);
  function selectAct(index: number) {
    if (pinned && story.current) {
      const top = story.current.getBoundingClientRect().top + window.scrollY;
      scrollToPosition(top + (story.current.offsetHeight - window.innerHeight) * stops[index]);
    } else {
      setAct(index);
      rawProgress.set(stops[index]);
    }
  }
  return <section ref={story} id="hero" className="flight-story" data-pinned={pinned} data-act={act} aria-label="From a question to a working product">
    <div className="flight-theatre">
      <div className="flight-rule" aria-hidden="true"><span>BH / 01</span><i /><span>IDEA → REALITY</span></div>
      <header className="flight-heading">
        <motion.p initial={{ y: reduced ? 0 : 12 }} animate={{ y: 0 }} transition={{ duration: .6 }} className="flight-byline">Bhadresh Malankiya <span>/</span> Forward Deployed Engineer</motion.p>
        <h1><span>Ideas don’t</span><em>ship themselves<span className="flight-fullstop">.</span></em></h1>
      </header>
      <div className="flight-stage" role="img" aria-label={`A paper plane becoming an aircraft: ${acts[act].label.toLowerCase()}`}>
        <div className="flight-stage-grid" aria-hidden="true" />
        <svg className="flight-path" viewBox="0 0 1200 420" fill="none" aria-hidden="true">
          <path className="flight-pencil-line" d="M55 320C155 350 328 320 310 245C294 183 176 230 231 278C293 332 496 276 612 209C773 116 891 107 1115 86" />
          <motion.path d="M55 320C155 350 328 320 310 245C294 183 176 230 231 278C293 332 496 276 612 209C773 116 891 107 1115 86" stroke="#d7eea8" strokeWidth="1.3" style={{ pathLength: reduced ? 1 : progress }} />
          <path d="m1094 70 22 16-21 17M55 309v22m-11-11h22" stroke="#aab995" strokeWidth="1" />
        </svg>
        <div className="flight-object" data-ready={ready && !failed}>
          <PlaneSketch />
          {!failed && <FlightBoundary onError={onUnavailable}><PaperPlaneScene progress={progress} reducedMotion={!!reduced} active={activeInView} onReady={onReady} onUnavailable={onUnavailable} /></FlightBoundary>}
        </div>
        <span className="flight-stage-caption" aria-hidden="true">0{act + 1} / {acts[act].word}</span>
      </div>
      <div className="flight-bottom">
        <div className="flight-narrative" aria-live="polite"><span className="flight-act-number">0{act + 1}</span><div><h2>{acts[act].title}</h2><p>{acts[act].detail}</p></div></div>
        <Link href="#work" className="flight-work-link">See what I’ve built <ArrowDown size={17} /></Link>
        <a className="flight-resume" href={downloads.resume.file} download={downloads.resume.filename}>Take the résumé <ArrowUpRight size={14} /></a>
      </div>
      <div className="flight-chapters" role="group" aria-label="Explore the opening story">{acts.map((item,index) => <button key={item.label} onClick={() => selectAct(index)} aria-pressed={act === index}><span>0{index + 1}</span>{item.label}<i /></button>)}<span className="flight-scroll-note">{pinned ? "SCROLL TO UNFOLD ↓" : "PICK A CHAPTER ↗"}</span></div>
    </div>
  </section>;
}
