"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BookOpen, Download, FileText } from "lucide-react";
import { downloads } from "@/data/downloads";

function DownloadRow({
  icon: Icon,
  label,
  file,
  filename,
  sizeLabel,
  last = false,
}: {
  icon: typeof FileText;
  label: string;
  file: string;
  filename: string;
  sizeLabel: string;
  last?: boolean;
}) {
  return (
    <a
      href={file}
      download={filename}
      className={`group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-ink-3 ${last ? "" : "border-b border-line"}`}
    >
      <Icon size={16} className="shrink-0 text-gold" />
      <span className="min-w-0">
        <span className="block text-sm text-fg">{label}</span>
        <span className="block font-mono text-[10px] text-muted">
          {sizeLabel} · PDF
        </span>
      </span>
      <Download
        size={14}
        className="ml-auto shrink-0 text-muted transition-colors group-hover:text-gold"
      />
    </a>
  );
}

/**
 * A persistent take-home dock — reachable from every page and every scroll
 * position, not just the "paper trail" section further down the homepage,
 * so a recruiter who never scrolls that far can still grab the résumé or
 * the book. The labeled button works with mouse, touch, or keyboard.
 */
export default function FloatingDownloads() {
  const [open, setOpen] = useState(false);
  const dock = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!dock.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <motion.div className="fixed bottom-5 left-5 z-40" ref={dock}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{
              duration: reduced ? 0 : 0.22,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute bottom-full left-0 mb-3 w-64 origin-bottom-left overflow-hidden rounded-xl border border-line-strong bg-ink-2/95 shadow-[0_25px_60px_-16px_rgba(0,0,0,0.8)] backdrop-blur"
          >
            <p className="border-b border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              Take something with you
            </p>
            <DownloadRow
              icon={FileText}
              label="Download CV"
              file={downloads.resume.file}
              filename={downloads.resume.filename}
              sizeLabel={downloads.resume.sizeLabel}
            />
            <DownloadRow
              icon={BookOpen}
              label="Download the book"
              file={downloads.ebook.file}
              filename={downloads.ebook.filename}
              sizeLabel={downloads.ebook.sizeLabel}
              last
            />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Résumé and book downloads"
        className="flex items-center gap-2 rounded-full border border-line-strong bg-ink-2/90 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-fg shadow-[0_20px_50px_-18px_rgba(0,0,0,0.75)] backdrop-blur transition-colors hover:border-gold hover:text-gold"
      >
        <Download size={14} className="text-gold" />
        Downloads
      </button>
    </motion.div>
  );
}
