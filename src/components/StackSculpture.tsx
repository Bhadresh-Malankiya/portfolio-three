"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";

// Back-to-front order keeps the isometric structure physically coherent as it assembles.
const blocks = Array.from({ length: 27 }, (_, index) => {
  const x = index % 3, y = Math.floor(index / 3) % 3, z = Math.floor(index / 9);
  return { index, x: 320 + (x - y) * 49, y: 354 + (x + y) * 26 - z * 57,
    dx: Math.round((x - 1) * 56 + Math.sin(index * 2.4) * 48),
    dy: Math.round((1 - z) * 60 + Math.cos(index * 1.9) * 42),
    angle: Math.round(Math.sin(index * 2.1) * 24),
    depth: x + y + z * 4, layer: z };
}).sort((a, b) => a.depth - b.depth);

function Fragment({ block, progress, prefix, selected }: {
  block: typeof blocks[number]; progress: MotionValue<number>; prefix: string; selected: number;
}) {
  const x = useTransform(progress, [0, 1], [block.dx, 0]);
  const y = useTransform(progress, [0, 1], [block.dy, 0]);
  const rotate = useTransform(progress, [0, 1], [block.angle, 0]);
  return <g transform={`translate(${block.x} ${block.y})`}>
    <motion.g style={{ x, y, rotate }}>
      <path d="M0 0 47 25 0 50 -47 25Z" fill={`url(#${prefix}-top)`} stroke="#dfe9f2" strokeOpacity=".6" strokeWidth=".7" />
      <path d="M-47 25 0 50 0 103 -47 78Z" fill={`url(#${prefix}-left)`} stroke="#a9becd" strokeOpacity=".28" strokeWidth=".7" />
      <path d="M0 50 47 25 47 78 0 103Z" fill={`url(#${prefix}-right)`} stroke="#c9d8e7" strokeOpacity=".35" strokeWidth=".7" />
      <path d="M-44 27 0 51 44 27M0 52V100" fill="none" stroke="#f1f6f9" strokeOpacity=".5" strokeWidth=".7" />
      <motion.path d="M-44 70 0 94 44 70" fill="none" stroke="#c6e4fa" strokeWidth="1.6"
        animate={{ opacity: block.layer === selected ? .9 : .12 }} transition={{ duration: .5 }} />
      {block.index % 4 === 0 && <path d="m-34 39 17 9v9l10 5m-26-16 10 6" fill="none" stroke="#acccdf" strokeOpacity=".45" strokeWidth=".8" />}
    </motion.g>
  </g>;
}

const layers = [
  { name: "Interface", code: "01 / UI", detail: "Make the complex feel simple." },
  { name: "Systems", code: "02 / API", detail: "Build the parts people rely on." },
  { name: "Applied AI", code: "03 / AI", detail: "Connect intelligence to real work." },
];

export default function StackSculpture({ progress }: { progress: MotionValue<number> }) {
  const prefix = useId().replace(/:/g, "");
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const assembly = useTransform(progress, [0, .12, .78, 1], [0, 0, 1, 1]);
  const smooth = useSpring(assembly, { stiffness: 95, damping: 26, mass: .5 });
  const pose = useTransform(smooth, value => reduced ? 1 : value);
  const assembledOpacity = useTransform(pose, [0, .6, 1], [0, 0, 1]);
  const scatteredOpacity = useTransform(pose, [0, .4, 1], [1, 0, 0]);
  return <div className="signature-art assembly-art">
    <div className="assembly-atmosphere" aria-hidden="true" />
    <svg className="assembly-sculpture" viewBox="0 0 640 650" role="img" aria-label="Scattered glass and metal modules assemble into a complete system as you scroll">
      <defs>
        <linearGradient id={`${prefix}-top`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#e0e9eb" /><stop offset=".48" stopColor="#91a7b5" /><stop offset="1" stopColor="#50606d" /></linearGradient>
        <linearGradient id={`${prefix}-left`} x1="0" y1="0" x2="1" y2=".4"><stop stopColor="#4b5c68" /><stop offset=".5" stopColor="#243440" /><stop offset="1" stopColor="#111a24" /></linearGradient>
        <linearGradient id={`${prefix}-right`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#6b869b" stopOpacity=".9" /><stop offset=".5" stopColor="#354c60" stopOpacity=".9" /><stop offset="1" stopColor="#182733" /></linearGradient>
        <radialGradient id={`${prefix}-floor`}><stop stopColor="#9fb8cc" stopOpacity=".13" /><stop offset="1" stopColor="#9fb8cc" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx="320" cy="540" rx="270" ry="74" fill={`url(#${prefix}-floor)`} />
      <g fill="none" stroke="#c5d8e9" strokeOpacity=".12" strokeWidth=".7">
        <ellipse cx="320" cy="525" rx="244" ry="86" /><ellipse cx="320" cy="525" rx="184" ry="63" />
        <path d="M50 525H590M320 425V625M117 447l406 156M117 603l406-156" />
        <path d="M66 203v-20h20M554 183h20v20M66 429v20h20M554 449h20v-20" />
      </g>
      {blocks.map(block => <Fragment key={block.index} block={block} progress={pose} prefix={prefix} selected={active} />)}
      <g fill="#aebdca" fontFamily="monospace" fontSize="9" letterSpacing="2">
        <text x="66" y="156">IDEA → SYSTEM</text><text x="465" y="594">BUILD / 001</text>
      </g>
    </svg>
    <div className="assembly-status" aria-hidden="true">
      <motion.span style={{ opacity: scatteredOpacity }}>Scattered ideas.</motion.span>
      <motion.span style={{ opacity: assembledOpacity }}>One working system.</motion.span>
      <div className="assembly-track"><motion.i style={{ scaleX: pose }} /></div>
    </div>
    <div className="stack-selector" role="group" aria-label="Explore my engineering focus">
      {layers.map((layer, index) => <button key={layer.name} aria-pressed={active === index} onClick={() => setActive(index)}><small>{layer.code}</small>{layer.name}</button>)}
    </div>
    <p className="stack-caption" aria-live="polite">{layers[active].detail}</p>
  </div>;
}
