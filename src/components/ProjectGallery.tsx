"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { imageDimensions } from "@/data/imageDimensions";

const captions: Record<string, string> = {
  "/images/extendedforms.png": "Product overview",
  "/images/extendedforms-live.jpg": "Live website",
  "/images/quzo_landing_page.png": "Product overview",
  "/images/quzo_dashboard.png": "Quiz dashboard",
  "/images/quzo_exam_screen.png": "Exam experience",
  "/images/quzo_form_screen.png": "Quiz builder",
  "/images/quzo_in_app_billing.png": "In-app billing",
  "/images/quzo_response_report.png": "Response report",
  "/images/vocalxi-home.jpg": "Live website",
  "/images/vocalxi-review.jpg": "Answer review preview",
  "/images/vocalxi-dashboard_1.webp": "Owner workspace: voice agents and starter templates",
  "/images/vocalxi-dashboard_2.webp": "Google Forms connection flow",
  "/images/jewelxi-home.jpg": "Storefront",
  "/images/jewelxi-shop.jpg": "Jewellery catalog",
  "/images/jewelxi-admin_1.webp": "Admin: collection manager",
  "/images/jewelxi-admin_2.webp": "Admin: inventory with on-hand, reserved and available stock",
  "/images/jewelxi-admin_3.webp": "Admin: store overview and next steps",
  "/images/jewelxi-admin_4.webp": "Admin: storefront content and delivery pricing per currency",
};
const caption = (src: string, index: number) =>
  captions[src] ?? `Product view ${index + 1}`;

type Props = {
  images: string[];
  name: string;
  url?: string;
  frame?: "browser" | "phone";
  big?: boolean;
  bare?: boolean;
  edgeToEdge?: boolean;
  className?: string;
  mediaClassName?: string;
  fill?: boolean;
  imageCaptions?: string[];
};

export function ScreenshotViewer({
  images,
  name,
  index,
  go,
  onDismiss,
  imageCaptions,
}: {
  images: string[];
  name: string;
  index: number;
  go: (step: number) => void;
  onDismiss: () => void;
  imageCaptions?: string[];
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [zoomed, setZoomed] = useState(false);
  const selected = images[index];
  const dimensions = imageDimensions[selected] ?? { w: 1600, h: 1000 };
  const selectedCaption = imageCaptions?.[index] ?? caption(selected, index);
  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element?.showModal();
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);
  return createPortal(
    <dialog
      ref={dialog}
      className="screenshot-viewer"
      aria-label={`${name} screenshot viewer`}
      data-lenis-prevent
      onClose={() => {
        if (!dialog.current?.open) onDismiss();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialog.current?.close();
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          setZoomed(false);
          go(event.key === "ArrowRight" ? 1 : -1);
        }
      }}
    >
      <div className="viewer-shell">
        <div className="viewer-toolbar">
          <div>
            <p>{name}</p>
            <span aria-live="polite">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(images.length).padStart(2, "0")} ·{" "}
              {selectedCaption}
            </span>
          </div>
          <button
            onClick={() => dialog.current?.close()}
            aria-label="Close screenshot viewer"
            autoFocus
          >
            <X size={22} />
          </button>
        </div>
        <div
          className={`viewer-media ${zoomed ? "is-zoomed" : ""}`}
        >
          <Image
            src={selected}
            alt={`${name}: ${selectedCaption}`}
            width={dimensions.w}
            height={dimensions.h}
            style={{ "--shot-w": `${dimensions.w}px` } as CSSProperties}
            unoptimized
          />
        </div>
        <div className="viewer-footer">
          <button onClick={() => setZoomed(!zoomed)} aria-pressed={zoomed}>
            {zoomed ? <ZoomOut size={17} /> : <ZoomIn size={17} />}
            {zoomed ? "Fit to screen" : "Actual size"}
          </button>
          <a
            href={selected}
            target="_blank"
            rel="noreferrer"
            className="viewer-original"
          >
            Original <ArrowUpRight size={16} />
          </a>
          <div className="viewer-pagination">
            <button
              onClick={() => {
                setZoomed(false);
                go(-1);
              }}
              disabled={images.length < 2}
              aria-label={`Previous ${name} screenshot`}
            >
              <ChevronLeft size={20} />
            </button>
            <span>
              {index + 1} / {images.length}
            </span>
            <button
              onClick={() => {
                setZoomed(false);
                go(1);
              }}
              disabled={images.length < 2}
              aria-label={`Next ${name} screenshot`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </dialog>,
    document.body,
  );
}

export default function ProjectGallery({
  images,
  name,
  url,
  frame = "browser",
  big = false,
  bare = false,
  edgeToEdge = false,
  className = "",
  mediaClassName,
  fill = false,
  imageCaptions,
}: Props) {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [loadedSource, setLoadedSource] = useState<string | null>(null);
  const selected = images[index] ?? images[0];
  useEffect(() => {
    if (loadedSource !== selected || index === displayedIndex) return;
    const timeout = window.setTimeout(() => setDisplayedIndex(index), 280);
    return () => window.clearTimeout(timeout);
  }, [loadedSource, selected, index, displayedIndex]);
  const opener = useRef<HTMLButtonElement | null>(null);
  if (!images.length)
    return <div className="gallery-empty">Project imagery coming soon</div>;
  const selectedCaption = imageCaptions?.[index] ?? caption(selected, index);
  const dimensions = imageDimensions[images[0]];
  // The tallest screenshot sets the frame, so no image in the set is cropped or squeezed.
  const ratios = images.map((src) => imageDimensions[src]).filter(Boolean).map((d) => d.w / d.h);
  const shotRatio = ratios.length ? Math.min(...ratios) : undefined;
  const go = (step: number) =>
    setIndex((current) => (current + step + images.length) % images.length);
  return (
    <div
      className={`project-gallery ${big ? "gallery-large" : ""} ${bare ? "gallery-bare" : ""} ${edgeToEdge ? "gallery-edge" : ""} ${className}`}
    >
      <div className="gallery-chrome" aria-hidden="true">
        <div>
          <i />
          <i />
          <i />
        </div>
        <span>{url ? url.replace(/^https?:\/\//, "") : name}</span>
        <span>↗</span>
      </div>
      <div
        className={`gallery-stage ${frame === "phone" ? "gallery-phone" : ""} ${mediaClassName ?? ""}`}
        style={
          !fill && frame !== "phone" && dimensions
            ? ({ aspectRatio: `${dimensions.w} / ${dimensions.h}`, "--shot-ratio": shotRatio } as CSSProperties)
            : undefined
        }
      >
        {[...new Set([displayedIndex, index])].map((imageIndex) => {
          const source = images[imageIndex] ?? images[0];
          const incoming = imageIndex !== displayedIndex;
          return (
            <Image
              key={source}
              src={source}
              alt={imageIndex === index ? `${name}: ${selectedCaption}` : ""}
              aria-hidden={imageIndex !== index}
              fill
              sizes={edgeToEdge ? "100vw" : fill ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 1440px) 1320px, 100vw"}
              className="object-contain"
              style={{
                opacity: incoming && loadedSource !== source ? 0 : 1,
                zIndex: incoming ? 1 : 0,
                transition: reducedMotion ? "none" : "opacity 240ms ease",
              }}
              onLoad={() => {
                if (imageIndex === index) setLoadedSource(source);
              }}
            />
          );
        })}
        {!fill && (
          <button
            className="gallery-inspect"
            aria-label={`Enlarge ${name} screenshot`}
            onClick={(event) => {
              opener.current = event.currentTarget;
              setViewerOpen(true);
            }}
          >
            <Maximize2 size={17} />
            <span>inspect()</span>
          </button>
        )}
      </div>
      {!fill && (
        <div className="gallery-bottom">
          <p aria-live="polite">
            <span className="text-gold">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="gallery-count">
              {" "}
              / {String(images.length).padStart(2, "0")}
            </span>
            <span className="gallery-caption">{selectedCaption}</span>
          </p>
          {images.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => go(-1)}
                aria-label={`Previous ${name} screenshot`}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => go(1)}
                aria-label={`Next ${name} screenshot`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
      {!fill && images.length > 1 && (
        <details className="gallery-contact-sheet">
          <summary>
            Browse all {images.length} screenshots <span>+</span>
          </summary>
          <div
            className="gallery-thumbnails"
            aria-label={`${name} screenshots`}
          >
            {images.map((src, i) => (
              <button
                key={src}
                onClick={() => setIndex(i)}
                aria-label={`Show ${name} screenshot ${i + 1}: ${imageCaptions?.[i] ?? caption(src, i)}`}
                aria-pressed={index === i}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="88px"
                  className="object-contain"
                />
              </button>
            ))}
          </div>
        </details>
      )}
      {viewerOpen && (
        <ScreenshotViewer
          images={images}
          name={name}
          index={index}
          go={go}
          imageCaptions={imageCaptions}
          onDismiss={() => {
            setViewerOpen(false);
            opener.current?.focus({ preventScroll: true });
          }}
        />
      )}
    </div>
  );
}
