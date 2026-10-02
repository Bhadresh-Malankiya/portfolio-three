"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion, type MotionValue } from "framer-motion";
import { Pause, Play } from "lucide-react";

function Fallback() {
  return (
    <div className="ribbon-fallback" aria-hidden="true">
      <i />
      <i />
      <i />
    </div>
  );
}
const Core = dynamic(() => import("@/components/three/ProductCore"), {
  ssr: false,
  loading: Fallback,
});
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <Fallback /> : this.props.children;
  }
}
export default function ProductObject({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(true);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    if (ref.current) observer.observe(ref.current);
    const onVisibility = () => setForeground(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
  return (
    <div className="ribbon-scene" ref={ref}>
      <span className="ribbon-watermark" aria-hidden="true">
        build()
      </span>
      <div className="ribbon-halo" aria-hidden="true" />
      <div
        className="ribbon-canvas"
        role="img"
        aria-label="A continuous gold ribbon twisting in three dimensions, rotating with your pointer and scroll"
      >
        <SceneBoundary>
          <Core
            active={visible && foreground && !paused && !reduced}
            progress={progress}
          />
        </SceneBoundary>
      </div>
      <span className="ribbon-coordinate" aria-hidden="true">
        01 — ideas in motion
      </span>
      <div className="ribbon-footnote">
        <span>{"// a continuous work in progress"}</span>
        <button
          onClick={() => setPaused(!paused)}
          disabled={!!reduced}
          aria-label={paused ? "Resume 3D motion" : "Pause 3D motion"}
        >
          {paused || reduced ? <Play size={14} /> : <Pause size={14} />}
          {reduced ? "static" : paused ? "play" : "pause"}
        </button>
      </div>
    </div>
  );
}
