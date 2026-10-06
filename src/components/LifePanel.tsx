"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { deliveryExpertise } from "@/data/skills";

const tabs = ["Journey", "Expertise", "Founder mindset"];
const journey = [
  {
    year: "Now",
    title: "AscendXI / VocalXI",
    role: "Founder & product engineer",
    detail: "Building VocalXI solo: product decisions, frontend, backend, voice AI and deployment. From the first idea to a working product.",
  },
  {
    year: "2022–2026",
    title: "ExpressTech Systems",
    role: "Senior engineer / Technical lead",
    detail: "Led engineering across ExtendedForms and Quzo. ExtendedForms serves 400K+ users and has supported 10M+ online exams.",
  },
  {
    year: "2020–2022",
    title: "MB Systems",
    role: "Founder · side venture",
    detail:
      "Founded a studio alongside my engineering role. Owned client relationships, hiring and delivery; closed it in 2022 and carried the lessons forward.",
  },
  {
    year: "2018–2022",
    title: "HQ Infosystem",
    role: "Full-stack developer",
    detail:
      "Built web applications, APIs and payment integrations with JavaScript, PHP and Laravel. The foundation for taking a problem from discovery to production.",
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
        <p className="eyebrow">{"// engineer. technical lead. founder."}</p>
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
          <div className="life-intro">
            <p className="eyebrow">Forward Deployed Engineer</p>
            <p>I work from the customer problem through to production — across frontend, backend and AI, with a founder’s eye for what matters.</p>
          </div>
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
                  <div className="delivery-expertise">
                    {deliveryExpertise.map((item) => (
                      <div key={item.title}>
                        <span className="expertise-index" aria-hidden="true">{item.code}</span>
                        <h3>{item.title}</h3>
                        <p>{item.detail}</p>
                        <small>{item.tools}</small>
                      </div>
                    ))}
                  </div>
                )}
                {tab === 2 && (
                  <div className="life-beyond life-founder">
                    <span className="life-large" aria-hidden="true">idea → live</span>
                    <h3>I’ve been on both sides of the brief.</h3>
                    <p>At MB Systems, I ran the business as well as the build. Today, I’m building VocalXI solo — a voice-first way to complete forms.</p>
                    <p>That changes how I work: understand the customer, choose the scope, ship, and stay accountable after launch.</p>
                    <div className="life-founder-links">
                      <a href="https://vocalxi.com" target="_blank" rel="noopener noreferrer" className="text-link">Explore VocalXI <ArrowUpRight size={15} /></a>
                      <a href="#downloads" className="text-link">The Weekend Builder <ArrowUpRight size={15} /></a>
                    </div>
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
      <dl className="life-impact" aria-label="Experience and product impact">
        <div><dt>400K+</dt><dd>ExtendedForms users</dd></div>
        <div><dt>10M+</dt><dd>Online exams on ExtendedForms</dd></div>
        <div><dt>10+</dt><dd>Developers managed</dd></div>
        <div><dt>10 → 100K</dt><dd>Users · experience scaling products</dd></div>
      </dl>
    </section>
  );
}
