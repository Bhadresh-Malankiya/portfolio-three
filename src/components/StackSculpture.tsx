"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

const layers = [
  { name: "Interface", code: "01 / UI", detail: "Make the complex feel simple." },
  { name: "Systems", code: "02 / API", detail: "Build the parts people rely on." },
  { name: "Applied AI", code: "03 / AI", detail: "Connect intelligence to real work." },
];

export default function StackSculpture() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const inView = useInView(ref);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 100, damping: 22 });
  const rotateY = useSpring(y, { stiffness: 100, damping: 22 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], [-18, 35]);
  return (
    <div ref={ref} className="signature-art stack-art" data-moving={inView && !reduced}
      onPointerMove={(event) => {
        if (reduced || event.pointerType !== "mouse") return;
        const box = event.currentTarget.getBoundingClientRect();
        x.set(-((event.clientY - box.top) / box.height - 0.5) * 10);
        y.set(((event.clientX - box.left) / box.width - 0.5) * 14);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}>
      <div className="stack-orbit" aria-hidden="true" />
      <motion.div className="stack-object" style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY, y: reduced ? 0 : drift, transformPerspective: 950 }}>
        <motion.div animate={{ rotateZ: reduced ? 0 : [0, -4, 4][active] }} transition={{ duration: reduced ? 0 : 0.8 }}>
          <Image src="/images/stack-sculpture.webp" width={1100} height={1100} sizes="(max-width: 600px) 85vw, 48vw" alt="Floating layers of glass and aluminum around a luminous core" className="stack-image" />
        </motion.div>
        <span className="stack-satellite satellite-one" aria-hidden="true">&lt;/&gt;</span>
        <span className="stack-satellite satellite-two" aria-hidden="true">{ "{ }" }</span>
      </motion.div>
      <div className="stack-selector" role="group" aria-label="Explore my engineering focus">
        {layers.map((layer, index) => <button key={layer.name} aria-pressed={active === index} onClick={() => setActive(index)}>
          <small>{layer.code}</small>{layer.name}
        </button>)}
      </div>
      <p className="stack-caption" aria-live="polite">{layers[active].detail}</p>
    </div>
  );
}
