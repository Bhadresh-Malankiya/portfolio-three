"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  images: string[];
  name: string;
  url?: string;
  frame?: "browser" | "phone";
  big?: boolean;
  bare?: boolean;
  className?: string;
  /** Overrides the height classes on the frame (the default `className`
   * only styles the outer track — border, radius, etc). */
  mediaClassName?: string;
  /** Stretch the (single) image to fill the track's box with object-cover —
   * for fixed-width slots like the project grid cards. Skips all carousel
   * behavior; only makes sense with one image. */
  fill?: boolean;
};

const PHONE_RATIO = 9 / 19.5;
const BROWSER_RATIO = 16 / 10;
const AUTO_MS = 4000;

function Chrome({ url }: { url?: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center gap-1.5 bg-gradient-to-b from-ink/85 via-ink/40 to-transparent px-3 py-2.5">
      <span className="h-2 w-2 rounded-full bg-white/25" />
      <span className="h-2 w-2 rounded-full bg-white/25" />
      <span className="h-2 w-2 rounded-full bg-white/25" />
      {url && (
        <div className="ml-1 flex-1 truncate rounded-full bg-ink/60 px-3 py-0.5 text-center font-mono text-[10px] text-fg/70 backdrop-blur-sm">
          {url.replace("https://", "")}
        </div>
      )}
    </div>
  );
}

/**
 * One slide in the coverflow: sized by a fixed HEIGHT (100% of the track),
 * with width auto-derived from its own aspect ratio — never the other way
 * around. (An earlier version sized by width % + aspect-ratio, which let
 * height run away unconstrained; a tall phone screenshot ended up several
 * times taller than the track and just got clipped top and bottom, losing
 * its bezel entirely.) Positioned by `left` in real measured pixels — CSS
 * transform percentages resolve against the element's *own* box, not the
 * parent's, so getting the peek offset right needs actual container width,
 * not a percentage trick.
 */
function Slide({
  src,
  name,
  index,
  total,
  url,
  frame,
  offset,
  leftPx,
  onSelect,
}: {
  src: string;
  name: string;
  index: number;
  total: number;
  url?: string;
  frame: "browser" | "phone";
  offset: number;
  leftPx: number;
  onSelect: () => void;
}) {
  const abs = Math.abs(offset);
  const visible = abs <= 1;
  const alt = `${name} — screenshot ${index + 1} of ${total}`;

  return (
    <motion.div
      className={`absolute top-1/2 h-[86%] ${offset === 0 ? "cursor-default" : "cursor-pointer"}`}
      style={{ aspectRatio: frame === "phone" ? PHONE_RATIO : BROWSER_RATIO, zIndex: 10 - abs }}
      animate={{
        left: leftPx,
        x: "-50%",
        y: "-50%",
        scale: offset === 0 ? 1 : 0.82,
        opacity: visible ? (offset === 0 ? 1 : 0.4) : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
      transition={{ type: "spring", stiffness: 260, damping: 32 }}
      onClick={offset !== 0 ? onSelect : undefined}
    >
      <div
        className={`relative h-full w-full overflow-hidden bg-ink-3/70 ${
          frame === "phone" ? "rounded-[1.8rem] border-[6px] border-ink-2 shadow-xl" : "rounded-lg border border-line-strong"
        }`}
      >
        {frame === "phone" && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center pt-1.5">
            <div className="h-1 w-10 rounded-full bg-white/25" />
          </div>
        )}
        {frame === "browser" && <Chrome url={url} />}
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 900px, 90vw"
          className="object-contain"
          draggable={false}
          priority={index === 0}
        />
        {/* the dimming "overlay" on non-active slides */}
        {offset !== 0 && <div className="absolute inset-0 bg-ink/55" />}
      </div>
    </motion.div>
  );
}

function Arrow({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      aria-label={dir === "left" ? "Previous screenshot" : "Next screenshot"}
      className={`pointer-events-auto absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-ink/80 text-fg backdrop-blur transition-all hover:border-gold hover:text-gold ${
        dir === "left" ? "left-1 sm:left-3" : "right-1 sm:right-3"
      }`}
    >
      <Icon size={16} />
    </button>
  );
}

export default function ProjectGallery({
  images,
  name,
  url,
  frame = "browser",
  big = false,
  bare = false,
  className = "",
  mediaClassName,
  fill = false,
}: Props) {
  const heightClass = mediaClassName ?? (big ? "h-[42vh] sm:h-[50vh]" : "h-72 sm:h-80");
  const multi = images.length > 1;
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dragStartX = useRef<number | null>(null);
  const dragMoved = useRef(false);

  useEffect(() => {
    if (!multi || fill || reduced || paused) return;
    intervalRef.current = setInterval(() => setIndex((i) => (i + 1) % images.length), AUTO_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [multi, fill, reduced, paused, images.length]);

  useEffect(() => {
    if (fill || !trackRef.current) return;
    const el = trackRef.current;
    const ro = new ResizeObserver(([entry]) => setTrackWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [fill]);

  function go(dir: 1 | -1) {
    setIndex((i) => (i + dir + images.length) % images.length);
  }

  function onPointerDown(e: React.PointerEvent) {
    if (!multi) return;
    dragStartX.current = e.clientX;
    dragMoved.current = false;
  }
  function onPointerMove(e: React.PointerEvent) {
    if (dragStartX.current === null) return;
    if (Math.abs(e.clientX - dragStartX.current) > 6) dragMoved.current = true;
  }
  function onPointerUp(e: React.PointerEvent) {
    if (dragStartX.current === null) return;
    const dx = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  }

  if (fill) {
    const src = images[0];
    if (frame === "phone") {
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-ink-3/70 ${bare ? "" : "rounded-lg border border-line-strong"} ${heightClass} ${className}`}>
          <div className="relative my-2 aspect-[9/19.5] h-[92%] overflow-hidden rounded-[1.8rem] border-[6px] border-ink-2 bg-ink shadow-xl">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center pt-1.5">
              <div className="h-1 w-10 rounded-full bg-white/25" />
            </div>
            <Image
              src={src}
              alt={`${name} screenshot`}
              fill
              sizes="280px"
              className="object-cover"
              draggable={false}
              priority
            />
          </div>
        </div>
      );
    }
    return (
      <div className={`relative overflow-hidden bg-ink-3/70 ${bare ? "" : "rounded-lg border border-line-strong"} ${heightClass} ${className}`}>
        <Chrome url={url} />
        <Image
          src={src}
          alt={`${name} screenshot`}
          fill
          sizes="(min-width: 1024px) 900px, 100vw"
          className="object-cover"
          draggable={false}
          priority
        />
      </div>
    );
  }

  // How far apart (in px) each slot sits, as a fraction of the measured
  // track width — phone slides are much narrower than the track, so they
  // need a smaller step to still overlap/peek instead of floating apart.
  const stepPx = trackWidth * (frame === "phone" ? 0.24 : 0.36);
  const centerPx = trackWidth / 2;

  return (
    <div className={`group/gallery relative ${className}`}>
      <div
        ref={trackRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className={`relative overflow-hidden ${heightClass} ${multi ? "cursor-grab active:cursor-grabbing touch-pan-y" : ""}`}
      >
        {trackWidth > 0 &&
          images.map((src, i) => {
            let offset = i - index;
            if (offset > images.length / 2) offset -= images.length;
            if (offset < -images.length / 2) offset += images.length;
            return (
              <Slide
                key={src}
                src={src}
                name={name}
                index={i}
                total={images.length}
                url={url}
                frame={frame}
                offset={offset}
                leftPx={centerPx + offset * stepPx}
                onSelect={() => {
                  if (!dragMoved.current) setIndex(i);
                }}
              />
            );
          })}
      </div>

      {multi && !bare && (
        <>
          <Arrow dir="left" onClick={() => go(-1)} />
          <Arrow dir="right" onClick={() => go(1)} />
          <div className="pointer-events-none mt-3 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-gold" : "w-1.5 bg-fg/25"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
