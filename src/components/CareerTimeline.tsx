"use client";

import { useRef } from "react";
import { motion, useScroll, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { experience } from "@/data/experience";

export default function CareerTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 60%"],
  });
  return (
    <div ref={ref} className="career-timeline">
      <div className="career-rail" aria-hidden="true">
        <motion.div style={{ scaleY: reduced ? 1 : scrollYProgress }} />
      </div>
      {experience.map((item, i) => (
        <details key={item.id} open={i === 0} className="career-entry">
          <summary>
            <span className="career-dot" />
            <span className="career-date">{item.period}</span>
            <span className="career-title">
              {item.org}
              <ChevronDown size={17} />
            </span>
            <span className="career-role">{item.role}</span>
            <span className="career-branch">
              {item.kind === "founder"
                ? "↳ side venture, alongside my full-time role"
                : i === 0
                  ? "● current role"
                  : "previous role"}
            </span>
          </summary>
          <div className="career-body">
            <ul>
              {item.bullets.slice(0, 4).map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        </details>
      ))}
      <p className="career-tail">
        {"// 2018 \u2192 present \u00b7 expand a role for details"}
      </p>
    </div>
  );
}
