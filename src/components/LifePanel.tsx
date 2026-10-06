"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const tabs = ["Journey", "Expertise", "Beyond work"];
const journey = [
  {
    year: "Now",
    title: "AscendXI / VocalXI",
    role: "Founder & product engineer",
    detail: "Building a voice-first way to complete forms.",
  },
  {
    year: "2022–2026",
    title: "ExpressTech Systems",
    role: "Senior engineer / Technical lead",
    detail: "Product engineering across ExtendedForms, Quzo and HelpDesk AI.",
  },
  {
    year: "2020–2022",
    title: "MB Systems",
    role: "Founder · side venture",
    detail:
      "Client delivery, a small team, and first-hand lessons in running a studio.",
  },
  {
    year: "2018–2022",
    title: "HQ Infosystem",
    role: "Full-stack developer",
    detail:
      "Web applications, APIs, payments and the foundations of my engineering work.",
  },
];
export default function LifePanel() {
  const [tab, setTab] = useState(0);
  const [role, setRole] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const reduced = useReducedMotion();
  useEffect(() => {
    function sync() {
      if (location.hash === "#experience") setTab(0);
      if (location.hash === "#expertise") setTab(1);
    }
    sync();
    function onAnchor(event: MouseEvent) {
      const link = (event.target as Element).closest<HTMLAnchorElement>(
        "a[href]",
      );
      if (!link) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname)
        return;
      if (url.hash === "#experience") setTab(0);
      if (url.hash === "#expertise") setTab(1);
    }
    window.addEventListener("hashchange", sync);
    document.addEventListener("click", onAnchor, true);
    return () => {
      window.removeEventListener("hashchange", sync);
      document.removeEventListener("click", onAnchor, true);
    };
  }, []);
  return (
    <section className="life-section page-shell" id="about">
      <span className="life-anchor" id="experience" />
      <span className="life-anchor" id="expertise" />
      <div className="life-heading">
        <p className="eyebrow">{"// the person behind the pixels"}</p>
        <h2>
          One person.
          <br />
          <em>A few different hats.</em>
        </h2>
      </div>
      <div className="life-board glass-panel">
        <div className="life-portrait">
          <Image
            src="/images/profile.png"
            alt="Bhadresh Malankiya"
            fill
            sizes="(min-width: 900px) 380px, 85vw"
            className="object-contain object-bottom"
          />
          <div className="life-signature">
            <strong>Bhadresh.</strong>
            <span>Surat, India · Building since 2018</span>
          </div>
        </div>
        <div className="life-content">
          <div role="tablist" aria-label="My background" className="life-tabs">
            {tabs.map((name, i) => (
              <button
                key={name}
                ref={(el) => {
                  buttons.current[i] = el;
                }}
                id={`life-tab-${i}`}
                role="tab"
                aria-selected={tab === i}
                aria-controls="life-panel"
                tabIndex={tab === i ? 0 : -1}
                onClick={() => setTab(i)}
                onKeyDown={(e) => {
                  let next = tab;
                  if (e.key === "ArrowRight") next = (tab + 1) % 3;
                  else if (e.key === "ArrowLeft") next = (tab + 2) % 3;
                  else if (e.key === "Home") next = 0;
                  else if (e.key === "End") next = 2;
                  else return;
                  e.preventDefault();
                  setTab(next);
                  buttons.current[next]?.focus();
                }}
              >
                {name}
              </button>
            ))}
          </div>
          <div
            id="life-panel"
            role="tabpanel"
            aria-labelledby={`life-tab-${tab}`}
            tabIndex={0}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: reduced ? 0 : 0.2 }}
              >
                {tab === 0 && (
                  <>
                    <div className="life-timeline">
                      {journey.map((item, i) => (
                        <button
                          key={item.title}
                          onClick={() => setRole(i)}
                          aria-pressed={role === i}
                        >
                          <span>{item.year}</span>
                          <i />
                          <strong>
                            {item.title}
                            <small>{item.role}</small>
                          </strong>
                        </button>
                      ))}
                    </div>
                    <p className="life-detail" aria-live="polite">
                      {journey[role].detail}
                    </p>
                  </>
                )}
                {tab === 1 && (
                  <div className="expertise-map">
                    {[
                      {
                        title: "Interfaces",
                        code: "< />",
                        tools: "React · Next.js · TypeScript · React Native",
                      },
                      {
                        title: "Systems",
                        code: "{ }",
                        tools: "Node.js · NestJS · PostgreSQL · Redis",
                      },
                      {
                        title: "Applied AI",
                        code: "✳",
                        tools: "OpenAI · Claude · Gemini · pgvector",
                      },
                    ].map((item) => (
                      <div key={item.title}>
                        <span aria-hidden="true">{item.code}</span>
                        <h3>
                          {item.title}
                          <small>{item.tools}</small>
                        </h3>
                      </div>
                    ))}
                  </div>
                )}
                {tab === 2 && (
                  <div className="life-beyond">
                    <span className="life-large" aria-hidden="true">
                      2018 →
                    </span>
                    <h3>The weekend habit stuck.</h3>
                    <p>See an idea. Open the editor. Find out.</p>
                    <p>
                      I write about the work, the mistakes, and starting again
                      in <em>The Weekend Builder.</em>
                    </p>
                    <a href="#downloads" className="text-link">
                      Read the book <ArrowUpRight size={15} />
                    </a>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          <Link className="life-story-link" href="/journey">
            The longer story <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
