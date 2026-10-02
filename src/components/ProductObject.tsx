"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion, type MotionValue } from "framer-motion";
import { Layers, Pause, Play } from "lucide-react";

function Fallback() {
  return (
    <div className="stack-fallback" aria-hidden="true">
      <span>interface.tsx</span>
      <span>api / services</span>
      <span>data / storage</span>
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
  const [expanded, setExpanded] = useState(true);
  const [project, setProject] = useState<"vocalxi" | "jewelxi">("vocalxi");
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
    <div className="scene-shell" ref={ref}>
      <div className="scene-toolbar">
        <span>
          <i /> product.stack
        </span>
        <span>interactive / 3D</span>
      </div>
      <div
        className="product-object"
        aria-label="Interactive exploded view of an application: interface, services, and data"
      >
        <div className="scene-grid" />
        <div className="object-canvas" aria-hidden="true">
          <SceneBoundary>
            <Core
              active={visible && foreground && !paused && !reduced}
              expanded={expanded}
              project={project}
              progress={progress}
            />
          </SceneBoundary>
        </div>
        <span className="stack-label stack-ui">01 / interface</span>
        <span className="stack-label stack-api">02 / services</span>
        <span className="stack-label stack-data">03 / data</span>
      </div>
      <div
        className="scene-projects"
        role="group"
        aria-label="Choose a project for the 3D preview"
      >
        {(["vocalxi", "jewelxi"] as const).map((name) => (
          <button
            key={name}
            aria-pressed={project === name}
            onClick={() => setProject(name)}
          >
            {name}
            <span>.{name === "vocalxi" ? "com" : "app"}</span>
          </button>
        ))}
      </div>
      <div className="scene-controls">
        <button onClick={() => setExpanded(!expanded)} aria-pressed={expanded}>
          <Layers size={14} />
          {expanded ? "collapse layers" : "inspect layers"}
        </button>
        <button
          onClick={() => setPaused(!paused)}
          disabled={!!reduced}
          aria-label={paused ? "Resume 3D motion" : "Pause 3D motion"}
        >
          {paused || reduced ? <Play size={13} /> : <Pause size={13} />}
          {reduced ? "static" : paused ? "paused" : "pause"}
        </button>
      </div>
      <p className="scene-note">
        {"// Move your pointer. Inspect the layers. Scroll to rotate."}
      </p>
    </div>
  );
}
