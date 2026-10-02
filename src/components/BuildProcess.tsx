"use client";

import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

const steps = [
  {
    name: "define()",
    title: "01 / Work out what needs fixing.",
    text: "I start with the existing workflow and the people using it. What is slow? What breaks? What would make this useful?",
    output: "output: scope + first milestone",
  },
  {
    name: "design()",
    title: "02 / Sketch the system.",
    text: "I map the data and interfaces before choosing the stack. Authentication, failure cases, and deployment belong in the plan too.",
    output: "output: architecture + trade-offs",
  },
  {
    name: "build()",
    title: "03 / Build in small releases.",
    text: "I implement a working path through the product, test it, and get it in front of someone. Then I add the next piece.",
    output: "output: tested release",
  },
  {
    name: "measure()",
    title: "04 / Check what happens next.",
    text: "I watch errors and response times, look at user feedback, and keep improving the slow or confusing parts.",
    output: "output: fixes + next iteration",
  },
];
export default function BuildProcess() {
  const [selected, setSelected] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div className="build-process">
      <div
        className="process-tabs"
        role="tablist"
        aria-label="My product development process"
      >
        {steps.map((step, i) => (
          <button
            key={step.name}
            ref={(el) => {
              buttons.current[i] = el;
            }}
            id={`process-tab-${i}`}
            role="tab"
            aria-selected={selected === i}
            aria-controls={`process-panel-${i}`}
            tabIndex={selected === i ? 0 : -1}
            onClick={() => setSelected(i)}
            onKeyDown={(event) => {
              const next =
                event.key === "ArrowRight"
                  ? (i + 1) % steps.length
                  : event.key === "ArrowLeft"
                    ? (i + steps.length - 1) % steps.length
                    : event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? steps.length - 1
                        : null;
              if (next !== null) {
                event.preventDefault();
                setSelected(next);
                buttons.current[next]?.focus();
              }
            }}
          >
            <span>0{i + 1}</span>
            {step.name}
            <ArrowUpRight size={14} />
          </button>
        ))}
      </div>
      {steps.map((step, i) => (
        <div
          key={step.name}
          id={`process-panel-${i}`}
          role="tabpanel"
          aria-labelledby={`process-tab-${i}`}
          hidden={selected !== i}
          tabIndex={0}
          className="process-panel"
        >
          <div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </div>
          <span>{step.output}</span>
        </div>
      ))}
    </div>
  );
}
