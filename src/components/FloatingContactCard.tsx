"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { Mail, ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";

const MARGIN = 20;
const BADGE_W = 60;
const BADGE_H = 88;
const CARD_W = 224;
const CARD_H = 300;

// A fixed (not random) bar-width pattern for the decorative barcode strip —
// deterministic so it doesn't shift between server and client renders.
const BARCODE = [3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3];

function Barcode({ className = "" }: { className?: string }) {
  return (
    <div className={`flex h-3.5 items-stretch gap-[1.5px] ${className}`} aria-hidden="true">
      {BARCODE.map((w, i) => (
        <span key={i} style={{ width: w }} className={i % 3 === 0 ? "bg-fg/45" : "bg-fg/20"} />
      ))}
    </div>
  );
}

function LanyardHole() {
  return (
    <span
      className="pointer-events-none absolute top-1.5 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full border border-line-strong bg-ink"
      aria-hidden="true"
    />
  );
}

/**
 * A floating "ID badge" that lives on top of every page. Docked, it reads as
 * a small badge tab (photo + lanyard punch-hole) clipped to whichever screen
 * edge it's closest to; hovering (or tapping, on touch) pulls the full
 * badge into view — photo, name, a decorative barcode strip, and an
 * "open to work" status line. Draggable anywhere; releases spring it to the
 * nearest edge, the way a picture-in-picture window snaps back.
 *
 * The draggable hit target is always exactly the small badge's footprint —
 * the full card renders as an absolutely-positioned overlay next to it,
 * anchored top + toward whichever side has room, so expanding never pushes
 * anything off-screen (an earlier version grew the real draggable box and a
 * right-docked card grew straight off the right edge of the viewport).
 *
 * Skipped entirely under prefers-reduced-motion — a draggable floating
 * widget is a motion-first affordance with no good reduced-motion version.
 */
export default function FloatingContactCard() {
  const reduced = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [ready, setReady] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [side, setSide] = useState<"left" | "right">("right");

  useEffect(() => {
    if (reduced) return;
    function place() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      x.set(vw - BADGE_W - MARGIN);
      y.set(Math.max(MARGIN, Math.min(vh * 0.5, vh - CARD_H - MARGIN)));
      setReady(true);
    }
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  function handleDragEnd() {
    setDragging(false);
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const goRight = rect.left + rect.width / 2 > vw / 2;
    setSide(goRight ? "right" : "left");
    const targetX = goRight ? vw - BADGE_W - MARGIN : MARGIN;
    // Clamped so the full card always fits below the docked point when it expands.
    const targetY = Math.max(MARGIN, Math.min(rect.top, vh - CARD_H - MARGIN));
    const spring = { type: "spring" as const, stiffness: 280, damping: 28 };
    animate(x, targetX, spring);
    animate(y, targetY, spring);
  }

  if (reduced) return null;

  return (
    <motion.div
      ref={cardRef}
      drag
      dragMomentum={false}
      dragElastic={0.06}
      onDragStart={() => setDragging(true)}
      onDragEnd={handleDragEnd}
      style={{ x, y, opacity: ready ? 1 : 0, width: BADGE_W, height: BADGE_H }}
      className="fixed left-0 top-0 z-40 hidden touch-none select-none sm:block"
      onHoverStart={() => !dragging && setExpanded(true)}
      onHoverEnd={() => setExpanded(false)}
      onTap={() => setExpanded((v) => !v)}
    >
      <div className="relative h-full w-full">
        {/* Docked badge tab */}
        <div
          className="relative flex h-full w-full cursor-grab flex-col items-center overflow-hidden rounded-lg border border-line-strong bg-ink-2/95 pt-3 shadow-[0_20px_50px_-18px_rgba(0,0,0,0.75)] active:cursor-grabbing"
          aria-hidden="true"
        >
          <LanyardHole />
          <div className="h-8 w-8 overflow-hidden rounded-full border border-line-strong bg-ink-3">
            <Image
              src="/images/profile.png"
              alt=""
              width={64}
              height={64}
              className="h-full w-full object-cover object-top grayscale"
            />
          </div>
          <p className="mt-1.5 font-mono text-[8px] uppercase tracking-wider text-muted">{profile.shortName}</p>
          <div className="mt-auto h-1 w-full bg-gold" />
        </div>

        {/* Full badge, revealed on hover/tap */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: CARD_W }}
              className={`absolute top-0 origin-top overflow-hidden rounded-xl border border-line-strong bg-ink-2/95 shadow-[0_25px_60px_-16px_rgba(0,0,0,0.8)] backdrop-blur ${
                side === "right" ? "right-0" : "left-0"
              }`}
            >
              <LanyardHole />
              <div className="flex items-center justify-between border-b border-line px-4 pb-3 pt-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-gold">The Weekend Builder</span>
                <span className="font-mono text-[9px] text-muted">ID·01</span>
              </div>

              <div className="flex flex-col items-center px-4 pt-4">
                <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-gold/60 bg-ink-3">
                  <Image
                    src="/images/profile.png"
                    alt={profile.name}
                    width={128}
                    height={128}
                    className="h-full w-full object-cover object-top grayscale"
                  />
                </div>
                <p className="mt-3 text-center font-display text-base leading-tight text-fg">{profile.name}</p>
                <p className="mt-1 text-center font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                  Senior Full Stack Engineer
                </p>
              </div>

              <Barcode className="mx-4 mt-4" />

              <div className="mx-4 mt-3 flex items-center gap-1.5 border-t border-line pt-3">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-bright shadow-[0_0_6px_1px_rgba(244,197,114,0.6)]" />
                <p className="font-mono text-[10px] uppercase tracking-wide text-fg/80">Open to work</p>
              </div>

              <div className="grid grid-cols-2 gap-px bg-line mt-4">
                <a
                  href={`mailto:${profile.email}`}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="flex items-center justify-center gap-1.5 bg-ink-2 py-3 font-mono text-[10px] uppercase tracking-wide text-fg transition-colors hover:bg-ink-3 hover:text-gold"
                >
                  <Mail size={12} />
                  Email
                </a>
                <Link
                  href="/#contact"
                  onPointerDown={(e) => e.stopPropagation()}
                  className="flex items-center justify-center gap-1.5 bg-ink-2 py-3 font-mono text-[10px] uppercase tracking-wide text-fg transition-colors hover:bg-ink-3 hover:text-gold"
                >
                  Say hello
                  <ArrowUpRight size={12} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
