"use client";

import Link from "next/link";
import { useRef, useState, useSyncExternalStore } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { AIRequestPathDiagram, QuzoMonolithDiagram, RealtimeFlowDiagram } from "@/components/Diagrams";
import { scrollToPosition } from "@/components/SmoothScroll";
import "@/app/scroll-flow.css";

export type FlowStep = { title: string; what: string; why: string };
type Kind = "ai" | "quzo" | "realtime";

const DIAGRAMS: Record<Kind, (props: { step?: number }) => React.ReactElement> = {
  ai: AIRequestPathDiagram,
  quzo: QuzoMonolithDiagram,
  realtime: RealtimeFlowDiagram,
};

const query = "(min-width: 900px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)";
function subscribe(callback: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const snapshot = () => window.matchMedia(query).matches;
const serverSnapshot = () => false;

type Props = {
  kind: Kind;
  kicker: string;
  title: string;
  summary: string;
  steps: FlowStep[];
  link?: { href: string; label: string };
};

/**
 * A diagram that builds as the reader scrolls. Each step reveals its part of
 * the system, sends a pulse along the new connection, and explains what that
 * part does and why it is there. Small screens and reduced motion get the
 * finished diagram with every step listed underneath.
 */
export default function ScrollFlow({ kind, kicker, title, summary, steps, link }: Props) {
  const ref = useRef<HTMLElement>(null);
  const pinned = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const reduced = useReducedMotion();
  const live = pinned && !reduced;
  const [step, setStep] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!live) return;
    const next = Math.min(steps.length - 1, Math.max(0, Math.floor(value * steps.length * 0.999)));
    setStep((current) => (current === next ? current : next));
  });
  const Diagram = DIAGRAMS[kind];

  function goTo(index: number) {
    if (!live || !ref.current) { setStep(index); return; }
    const top = ref.current.getBoundingClientRect().top + window.scrollY;
    const range = ref.current.offsetHeight - window.innerHeight;
    scrollToPosition(top + range * ((index + 0.5) / steps.length));
  }

  return (
    <section ref={ref} className="flow" data-live={live} style={live ? { height: `${60 + steps.length * 42}svh` } : undefined} aria-label={title}>
      <div className="flow-stage">
        <header className="flow-head">
          <p className="diagram-kicker">{kicker}</p>
          <h3 className="flow-title">{title}</h3>
          <p className="flow-summary">{summary}</p>
        </header>
        <div className="flow-body">
          <ol className="flow-steps">
            {steps.map((item, index) => {
              const state = !live ? "done" : index === step ? "active" : index < step ? "done" : "next";
              return (
                <li key={item.title} data-state={state}>
                  <button type="button" onClick={() => goTo(index)} aria-current={live && index === step ? "step" : undefined}>
                    <span className="flow-step-index">{String(index + 1).padStart(2, "0")}</span>
                    <span className="flow-step-title">{item.title}</span>
                  </button>
                  <div className="flow-step-detail">
                    <div>
                      <p><b>What</b>{item.what}</p>
                      <p><b>Why</b>{item.why}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="flow-figure">
            <Diagram step={live ? step : undefined} />
            {live && (
              <div className="flow-progress" aria-hidden="true">
                <span style={{ transform: `scaleX(${(step + 1) / steps.length})` }} />
                <small>Step {step + 1} of {steps.length}</small>
              </div>
            )}
            {link && <Link href={link.href} className="pattern-proof flow-link">{link.label} <ArrowUpRight size={14} /></Link>}
          </div>
        </div>
      </div>
    </section>
  );
}
