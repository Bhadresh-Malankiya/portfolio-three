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
  /** Overrides the height/aspect-ratio classes on the actual image box (the
   * default `className` only styles the outer frame — border, radius, etc). */
  mediaClassName?: string;
  /** Renders small clickable thumbnails below the frame. */
  showThumbnails?: boolean;
};

function Dots({ count, index, onPick }: { count: number; index: number; onPick: (i: number) => void }) {
  if (count <= 1) return null;
  return (
    <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onPick(i);
          }}
          aria-label={`Show screenshot ${i + 1} of ${count}`}
          className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-gold" : "w-1.5 bg-white/30 hover:bg-white/50"}`}
        />
      ))}
    </div>
  );
}

function Arrows({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-between px-2 opacity-0 transition-opacity duration-200 group-hover/gallery:opacity-100">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Previous screenshot"
        className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-ink/70 text-fg backdrop-blur transition-colors hover:bg-ink hover:text-gold"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onNext();
        }}
        aria-label="Next screenshot"
        className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-ink/70 text-fg backdrop-blur transition-colors hover:bg-ink hover:text-gold"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

/** All frames stay mounted and simply crossfade opacity — avoids the "flash
 * of nothing" that mount/unmount-based transitions (e.g. AnimatePresence in
 * `mode="wait"`) produce between two images. Each frame also carries its own
 * slow, staggered Ken Burns drift so the active image never sits dead still. */
function GalleryFrames({ images, index, name, reduced }: { images: string[]; index: number; name: string; reduced: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((src, i) => (
        <motion.div
          key={src}
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ zIndex: i === index ? 1 : 0 }}
        >
          <motion.div
            className="absolute inset-0"
            animate={reduced ? undefined : { scale: [1, 1.055, 1] }}
            transition={reduced ? undefined : { duration: 14, repeat: Infinity, ease: "easeInOut", delay: i * 1.7 }}
          >
            <Image
              src={src}
              alt={`${name} — screenshot ${i + 1} of ${images.length}`}
              fill
              sizes="(min-width: 1024px) 900px, 100vw"
              className="object-contain"
              priority={i === 0}
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
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
  showThumbnails = false,
}: Props) {
  const mediaSize = mediaClassName ?? (big ? "h-80 sm:h-[30rem]" : "h-48 sm:h-56");
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const multi = images.length > 1;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!multi || reduced || paused) return;
    intervalRef.current = setInterval(() => setIndex((i) => (i + 1) % images.length), 4200);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [multi, reduced, paused, images.length]);

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  const hoverProps = multi
    ? {
        onMouseEnter: () => setPaused(true),
        onMouseLeave: () => setPaused(false),
      }
    : {};

  if (frame === "phone") {
    return (
      <div>
        <div
          {...hoverProps}
          className={`group/gallery relative flex items-center justify-center bg-ink-3/70 ${
            bare ? "" : "rounded-lg border border-line-strong"
          } ${mediaSize} ${className}`}
        >
          <div className="relative my-2 aspect-[9/19.5] h-[92%] overflow-hidden rounded-[1.8rem] border-[6px] border-ink-2 bg-ink shadow-xl">
            <div className="absolute inset-x-0 top-0 z-10 flex justify-center pt-1.5">
              <div className="h-1 w-10 rounded-full bg-white/25" />
            </div>
            <GalleryFrames images={images} index={index} name={name} reduced={!!reduced} />
            <Dots count={images.length} index={index} onPick={setIndex} />
          </div>
          {multi && <Arrows onPrev={prev} onNext={next} />}
        </div>
        {showThumbnails && multi && (
          <ThumbnailStrip images={images} index={index} onPick={setIndex} name={name} />
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        {...hoverProps}
        className={`group/gallery relative overflow-hidden ${bare ? "" : "rounded-lg border border-line-strong"} bg-ink-3/70 ${className}`}
      >
        <div className="flex items-center gap-3 border-b border-line bg-ink-2/80 px-3 py-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          </div>
          {url && (
            <div className="flex-1 truncate rounded-full bg-ink px-3 py-1 text-center font-mono text-[10px] text-muted">
              {url.replace("https://", "")}
            </div>
          )}
        </div>
        <div className={`relative ${mediaSize}`}>
          <GalleryFrames images={images} index={index} name={name} reduced={!!reduced} />
          <Dots count={images.length} index={index} onPick={setIndex} />
          {multi && <Arrows onPrev={prev} onNext={next} />}
        </div>
      </div>
      {showThumbnails && multi && <ThumbnailStrip images={images} index={index} onPick={setIndex} name={name} />}
    </div>
  );
}

function ThumbnailStrip({
  images,
  index,
  onPick,
  name,
}: {
  images: string[];
  index: number;
  onPick: (i: number) => void;
  name: string;
}) {
  return (
    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
      {images.map((src, i) => (
        <button
          key={src}
          onClick={() => onPick(i)}
          aria-label={`Jump to screenshot ${i + 1}`}
          className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md border transition-all ${
            i === index ? "border-gold opacity-100" : "border-line opacity-50 hover:opacity-80"
          }`}
        >
          <Image src={src} alt={`${name} thumbnail ${i + 1}`} fill sizes="80px" className="object-cover" />
        </button>
      ))}
    </div>
  );
}
