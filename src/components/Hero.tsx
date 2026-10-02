"use client";

import Link from "next/link";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import ProductObject from "@/components/ProductObject";
import { downloads } from "@/data/downloads";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 45]);
  return (
    <section ref={ref} className="hero-section hero-open">
      <div className="page-shell">
        <div className="hero-topline">
          <span>
            <i /> ~/bhadresh/portfolio
          </span>
          <span>Surat, IN · UTC+05:30</span>
        </div>
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">{"// Bhadreshkumar Malankiya"}</p>
            <h1>
              <span className="hero-line">
                <span>Full-stack</span>
              </span>
              <span className="hero-line">
                <span>engineer.</span>
              </span>
              <em>
                <span className="hero-line">
                  <span>Weekend</span>
                </span>
                <span className="hero-line">
                  <span>
                    builder<span className="code-cursor">_</span>
                  </span>
                </span>
              </em>
            </h1>
            <p className="hero-role">Senior Full-Stack & AI Engineer</p>
            <p className="hero-description">
              I build SaaS products and AI experiences. Previously at
              ExpressTech. Now building VocalXI through AscendXI — and still
              making things on weekends.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="#work" className="button-primary">
                viewProjects() <ArrowUpRight size={16} />
              </Link>
              <a
                href={downloads.resume.file}
                download={downloads.resume.filename}
                className="button-secondary"
              >
                resume.pdf <Download size={15} />
              </a>
            </div>
            <p className="hero-note">
              <span className="text-gold">const</span> experience ={" "}
              <span className="text-fg">&quot;8+ years&quot;</span>;
            </p>
          </div>
          <motion.div style={{ y }} className="hero-art">
            <ProductObject progress={scrollYProgress} />
          </motion.div>
        </div>
        <div className="hero-bottom">
          <a href="#work" className="scroll-invitation">
            <span className="scroll-icon">
              <ArrowDown size={17} />
            </span>
            scroll to inspect
          </a>
          <div>
            <strong>401K+</strong>
            <span>ExtendedForms users · reported</span>
          </div>
          <div>
            <strong>400K+</strong>
            <span>Quzo exams · reported</span>
          </div>
          <div>
            <strong>8+ years</strong>
            <span>Building production software</span>
          </div>
        </div>
      </div>
    </section>
  );
}
