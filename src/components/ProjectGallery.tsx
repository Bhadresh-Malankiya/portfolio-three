"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
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
  "/images/jewelxi-home.jpg": "Storefront",
  "/images/jewelxi-shop.jpg": "Jewellery catalog",
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
  className?: string;
  mediaClassName?: string;
  fill?: boolean;
};

function ScreenshotViewer({
  images,
  name,
  index,
  go,
  onDismiss,
}: {
  images: string[];
  name: string;
  index: number;
  go: (step: number) => void;
  onDismiss: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [zoomed, setZoomed] = useState(false);
  const selected = images[index];
  const dimensions = imageDimensions[selected] ?? { w: 1600, h: 1000 };
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
      aria-labelledby={titleId}
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
            <p id={titleId}>{name}</p>
            <span aria-live="polite">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(images.length).padStart(2, "0")} ·{" "}
              {caption(selected, index)}
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
          key={`${selected}-${zoomed}`}
        >
          <Image
            src={selected}
            alt={`${name} — ${caption(selected, index)}`}
            width={dimensions.w}
            height={dimensions.h}
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
  className = "",
  mediaClassName,
  fill = false,
}: Props) {
  const [index, setIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const opener = useRef<HTMLButtonElement | null>(null);
  if (!images.length)
    return <div className="gallery-empty">Project imagery coming soon</div>;
  const selected = images[index] ?? images[0];
  const dimensions = imageDimensions[images[0]];
  const go = (step: number) =>
    setIndex((current) => (current + step + images.length) % images.length);
  return (
    <div
      className={`project-gallery ${big ? "gallery-large" : ""} ${bare ? "gallery-bare" : ""} ${className}`}
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
            ? { aspectRatio: `${dimensions.w} / ${dimensions.h}` }
            : undefined
        }
      >
        <Image
          key={selected}
          src={selected}
          alt={`${name} — ${caption(selected, index)}`}
          fill
          sizes={
            fill
              ? "(min-width: 768px) 50vw, 100vw"
              : "(min-width: 1024px) 850px, 100vw"
          }
          className="object-contain"
        />
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
            <span className="gallery-caption">{caption(selected, index)}</span>
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
                aria-label={`Show ${name} screenshot ${i + 1}: ${caption(src, i)}`}
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
          onDismiss={() => {
            setViewerOpen(false);
            opener.current?.focus({ preventScroll: true });
          }}
        />
      )}
    </div>
  );
}
