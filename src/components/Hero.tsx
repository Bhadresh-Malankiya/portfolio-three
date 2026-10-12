"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useSyncExternalStore } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { downloads } from "@/data/downloads";

const pinnedQuery = "(min-width: 900px) and (prefers-reduced-motion: no-preference)";
function subscribe(callback: () => void) {
  const media = window.matchMedia(pinnedQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const pinnedSnapshot = () => window.matchMedia(pinnedQuery).matches;
const serverSnapshot = () => false;

export default function Hero() {
  const story = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const pinned = useSyncExternalStore(subscribe, pinnedSnapshot, serverSnapshot);
  const { scrollYProgress } = useScroll({ target: story, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 130, damping: 30 });
  const sceneScale = useTransform(progress, [0, 1], [1, 1.6]);
  const titleY = useTransform(progress, [0, .8], [0, -100]);
  const titleOpacity = useTransform(progress, [0, .65, 1], [1, 1, 0]);
  const ringRotate = useTransform(progress, [0, 1], [0, 75]);
  const rawX = useMotionValue(0), rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 65, damping: 22 });
  const y = useSpring(rawY, { stiffness: 65, damping: 22 });
  return <section ref={story} className="opening-story" aria-label="Meet Bhadresh">
    <div className="opening-theatre" onPointerMove={event => {
      if (reduced || event.pointerType !== "mouse") return;
      const bounds = event.currentTarget.getBoundingClientRect();
      rawX.set((event.clientX / bounds.width - .5) * 18);
      rawY.set(((event.clientY - bounds.top) / bounds.height - .5) * 12);
    }} onPointerLeave={() => { rawX.set(0); rawY.set(0); }}>
      <motion.div className="opening-world" style={{ scale: pinned ? sceneScale : 1, x: reduced ? 0 : x, y: reduced ? 0 : y }}>
        <Image src="/images/engineers-aperture.webp" alt="" fill sizes="100vw" priority className="opening-image" />
      </motion.div>
      <div className="opening-shade" aria-hidden="true" />
      <motion.div className="opening-orbit" style={{ rotate: pinned ? ringRotate : 0 }} aria-hidden="true"><i /><i /><span>↗</span></motion.div>
      <motion.div className="opening-title" style={{ y: pinned ? titleY : 0, opacity: pinned ? titleOpacity : 1 }}>
        <motion.p className="opening-byline" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .7, delay: reduced ? 0 : .15 }}>Bhadresh Malankiya <span>Forward Deployed Engineer</span></motion.p>
        <h1><span className="opening-line"><motion.span initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: reduced ? 0 : .9, ease: [.16,1,.3,1], delay: reduced ? 0 : .15 }}>I make</motion.span></span>
          <span className="opening-line opening-question"><motion.em initial={{ y: "105%", rotate: -6 }} animate={{ y: 0, rotate: 0 }} transition={{ duration: reduced ? 0 : 1.1, ease: [.16,1,.3,1], delay: reduced ? 0 : .25 }}>“what if”</motion.em></span>
          <span className="opening-line"><motion.span initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: reduced ? 0 : .9, ease: [.16,1,.3,1], delay: reduced ? 0 : .4 }}>work<span className="opening-period">.</span></motion.span></span></h1>
        <motion.div className="opening-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : .6, delay: reduced ? 0 : .8 }}>
          <Link href="#work" className="opening-enter">Step into the work <ArrowDown size={16} /></Link>
          <a href={downloads.resume.file} download={downloads.resume.filename}>The résumé <ArrowUpRight size={14} /></a>
        </motion.div>
      </motion.div>
      <div className="opening-footnote"><p>Interfaces. Systems. Applied AI.<br />The whole journey, from question to production.</p><div><span className="live-dot" />Surat, India <span className="opening-footnote-separator">/</span> Building at AscendXI</div></div>
      <span className="opening-coordinate coordinate-left" aria-hidden="true">01 / ENTER THE WORKSHOP</span>
      <span className="opening-coordinate coordinate-right" aria-hidden="true">SCROLL TO EXPLORE ↓</span>
      <motion.div className="opening-curtain" initial={{ scaleY: 1 }} animate={{ scaleY: 0 }} transition={{ duration: reduced ? 0 : .9, ease: [.76,0,.24,1] }} aria-hidden="true" />
    </div>
  </section>;
}
