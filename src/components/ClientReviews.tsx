"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Star } from "lucide-react";
import { upwork } from "@/data/upwork";
import "@/app/human-story.css";

const featured = [3, 0, 2];

export default function ClientReviews() {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const reduced = useReducedMotion();
  const review = upwork.testimonials[featured[active]];
  function move(direction: number) { setActive((current) => (current + direction + featured.length) % featured.length); }
  return (
    <section className="review-section page-shell client-voices" id="reviews" aria-label="Client feedback">
      <div className="voices-inner">
        <div className="voices-folio"><span>05 / AFTER THE HANDOVER</span><a href={upwork.profileUrl} target="_blank" rel="noopener noreferrer">READ ON UPWORK <ArrowUpRight size={16} /></a></div>
        <div className="voices-header"><h2>The people<br /><em>I build with.</em></h2><div className="voices-score"><span>5.0</span><div><span aria-label="Five out of five stars">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={13} fill="currentColor" />)}</span><small>EVERY RATED UPWORK JOB</small></div></div></div>
        <div className="voices-stage">
          <span className="voices-quote-mark" aria-hidden="true">“</span>
          <div className="voices-quote-window" role="tabpanel" id="client-quote" aria-labelledby={`client-review-${active}`} tabIndex={0}>
            <AnimatePresence mode="wait" initial={false}><motion.figure key={active} initial={{ opacity: 0, y: reduced ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -12 }} transition={{ duration: reduced ? 0 : 0.25 }}><blockquote>{review.quote}</blockquote><figcaption><span className="voices-client-dot" aria-hidden="true" /><div><strong>{review.job}</strong><span>{review.period} · Upwork client</span></div></figcaption></motion.figure></AnimatePresence>
          </div>
          <div className="voices-pagination"><span aria-live="polite">0{active + 1}<span> / 03</span></span><div><button type="button" onClick={() => move(-1)} aria-label="Previous client review"><ArrowLeft size={21} /></button><button type="button" onClick={() => move(1)} aria-label="Next client review"><ArrowRight size={21} /></button></div></div>
        </div>
        <div className="voices-index" role="tablist" aria-label="Featured reviews">{featured.map((reviewIndex, index) => {
          const item = upwork.testimonials[reviewIndex];
          return <button key={item.job} type="button" id={`client-review-${index}`} role="tab" aria-selected={active === index} aria-controls="client-quote" tabIndex={active === index ? 0 : -1} ref={(element) => { buttons.current[index] = element; }} onClick={() => setActive(index)} onKeyDown={(event) => {
            let next = active;
            if (event.key === "ArrowRight") next = (active + 1) % featured.length;
            else if (event.key === "ArrowLeft") next = (active + featured.length - 1) % featured.length;
            else if (event.key === "Home") next = 0;
            else if (event.key === "End") next = featured.length - 1;
            else return;
            event.preventDefault(); setActive(next); buttons.current[next]?.focus();
          }}><span>0{index + 1}</span><strong>{["Understands the brief.", "Stays consistent.", "Good to work with."][index]}</strong><ArrowUpRight size={18} /></button>;
        })}</div>
      </div>
    </section>
  );
}
