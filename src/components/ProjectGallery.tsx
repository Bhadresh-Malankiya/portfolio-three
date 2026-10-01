"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type Props = {
  images: string[]; name: string; url?: string; frame?: "browser" | "phone";
  big?: boolean; bare?: boolean; className?: string; mediaClassName?: string;
  fill?: boolean; captions?: string[];
};

export default function ProjectGallery({ images, name, url, frame = "browser", bare = false, className = "", fill = false, captions = [] }: Props) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const src = images[index] ?? images[0];
  const interactive = !bare && !fill;
  const caption = captions[index] ?? `${name} — product screen ${index + 1} of ${images.length}.`;

  function move(delta: number) {
    if (images.length < 2) return;
    setIndex((current) => (current + delta + images.length) % images.length);
  }

  function showImage() {
    setOpen(true);
    dialog.current?.showModal();
  }

  function closeImage() {
    dialog.current?.close();
  }

  if (!src) return <div className="pf-gallery-missing">No public screenshot is available for this project.</div>;

  return (
    <div className={`pf-gallery ${className}`} role={interactive ? "region" : undefined} aria-label={interactive ? `${name} screenshots` : undefined}>
      <div className="pf-gallery-frame">
        {frame === "browser" && <div className="pf-browser-bar" aria-hidden="true"><span className="pf-browser-dot" /><span className="pf-browser-dot" /><span className="pf-browser-dot" /><span className="pf-browser-url">{url?.replace(/^https?:\/\//, "") ?? name}</span></div>}
        <div className={`pf-gallery-media ${frame === "phone" ? "is-phone" : ""}`}>
          {failedSrc === src ? <div className="pf-gallery-missing"><p>This screenshot could not be loaded.</p><a className="pf-text-link" href={src} target="_blank" rel="noopener noreferrer">Open image directly ↗</a></div> : <Image src={src} alt={caption} fill sizes="(min-width: 1280px) 720px, (min-width: 768px) 55vw, 92vw" onError={() => setFailedSrc(src)} draggable={false} />}
          {interactive && failedSrc !== src && <button ref={opener} type="button" className="pf-gallery-button" onClick={showImage} aria-label={`Enlarge ${name} screenshot`}>Enlarge ↗</button>}
        </div>
      </div>
      {interactive && <>
        <p className="pf-gallery-caption" aria-live="polite" aria-atomic="true">{caption}</p>
        {images.length > 1 && <>
          <div className="pf-gallery-controls"><button type="button" onClick={() => move(-1)} aria-label={`Previous ${name} screenshot`}>←</button><span className="pf-gallery-count">{String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span><button type="button" onClick={() => move(1)} aria-label={`Next ${name} screenshot`}>→</button></div>
          <div className="pf-thumbnails" aria-label="Choose a screenshot">{images.map((image, i) => <button key={image} type="button" className="pf-thumbnail" aria-current={index === i ? "true" : undefined} aria-label={`Show ${name} screenshot ${i + 1}: ${captions[i] ?? "product screen"}`} onClick={() => setIndex(i)}><Image src={image} alt="" fill sizes="76px" /></button>)}</div>
        </>}
        <dialog ref={dialog} className="pf-lightbox" aria-label={`${name} enlarged screenshot`} onClose={() => { setOpen(false); opener.current?.focus(); }} onKeyDown={(event) => { if (event.key === "ArrowRight") { event.preventDefault(); move(1); } if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); } }} onClick={(event) => { if (event.target === event.currentTarget) { const box = event.currentTarget.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeImage(); } }}>
          <div className="pf-lightbox-top"><strong>{name} · {index + 1} / {images.length}</strong><button type="button" onClick={closeImage} aria-label="Close enlarged screenshot">Close ×</button></div>
          {open && <><div className="pf-lightbox-image"><Image src={src} alt={caption} fill sizes="94vw" /></div><p className="pf-gallery-caption" aria-live="polite">{caption}</p>{images.length > 1 && <div className="pf-gallery-controls"><button type="button" onClick={() => move(-1)} aria-label="Previous enlarged screenshot">← Previous</button><button type="button" onClick={() => move(1)} aria-label="Next enlarged screenshot">Next →</button></div>}</>}
        </dialog>
      </>}
    </div>
  );
}
