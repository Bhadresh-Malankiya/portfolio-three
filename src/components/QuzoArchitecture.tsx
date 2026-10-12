"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, ChartNoAxesCombined, Check, ChevronDown, Database, FilePenLine, Layers3, Network, Server, Users, Zap } from "lucide-react";
import "@/app/quzo-architecture.css";

type Journey = "configure" | "exam" | "results";
type ScalePhase = "steady" | "surge" | "drain";
export type QuzoArchitectureStatus = "proposed" | "mixed" | "implemented";

const scalePhases = [
  { id: "steady" as const, label: "Steady traffic", title: "Reuse reads. Keep writes durable.", description: "The exam application reads recurring definitions from Redis. Answers go to the response primary; the cache is never the record of a submission." },
  { id: "surge" as const, label: "Exam-start surge", title: "Add exam capacity, not another copy of everything.", description: "The scale plan adds ready exam instances behind a load balancer. Warm capacity covers startup time; bounded connections protect the response database." },
  { id: "drain" as const, label: "Scale back", title: "Finish the work before removing capacity.", description: "The scale plan stops new traffic to a draining instance, lets in-flight requests finish, then removes it. Shared state keeps sessions independent of one server." },
];

const journeys = [
  {
    id: "configure" as const,
    label: "Configure",
    icon: FilePenLine,
    title: "Build the assessment. Keep its rules together.",
    description: "Authoring and administration share a modular application. Published definitions live in durable storage; repeated reads can use Redis.",
    steps: ["Educator edits a form", "Forms modules validate it", "Primary stores the change", "Redis supports repeated reads"],
  },
  {
    id: "exam" as const,
    label: "Run an exam",
    icon: Zap,
    title: "An exam starts. The traffic arrives together.",
    description: "The exam application scales independently. Cached definitions reduce repeated fetches while answers go directly to the response database.",
    steps: ["Learner starts an exam", "Node.js serves the session", "Redis supplies repeated reads", "Responses commit to the primary"],
  },
  {
    id: "results" as const,
    label: "Review results",
    icon: ChartNoAxesCombined,
    title: "Give reporting room without crowding submissions.",
    description: "Reporting reads can use replicas while the primary handles incoming answers. A fresh submission is verified against the primary, not a potentially delayed replica.",
    steps: ["Educator opens a report", "Forms checks access", "Replica serves report reads", "Freshness stays explicit"],
  },
];

function Node({ className, active, children }: { className: string; active: boolean; children: ReactNode }) {
  return <div className={`qarch-node ${className}`} data-lit={active}>{children}</div>;
}

function ArchitectureWires({ journey, scalingPlanned }: { journey: Journey; scalingPlanned: boolean }) {
  const routes = [
    { id: "forms-entry", d: "M198 286H246Q258 286 258 274V154Q258 142 270 142H312", active: journey !== "exam" },
    { id: "exam-entry", d: "M198 304H246Q258 304 258 316V444Q258 456 270 456H312", active: journey === "exam" },
    { id: "forms-write", d: "M624 125H936", active: journey === "configure" },
    { id: "forms-cache", d: "M624 197H649Q661 197 661 209V272Q661 284 673 284H684", active: journey === "configure" },
    { id: "exam-cache", d: "M624 402H649Q661 402 661 390V330Q661 318 673 318H684", active: journey === "exam" },
    { id: "response-write", d: "M624 453H936", active: journey === "exam" },
    { id: "report-read", d: "M624 166H900Q912 166 912 178V511Q912 523 924 523H936", active: journey === "results" },
  ];
  return <svg className="qarch-wires" viewBox="0 0 1200 620" preserveAspectRatio="none" aria-hidden="true">
    {routes.map(route => <g key={route.id} data-lit={route.active} data-planned={scalingPlanned && route.id === "report-read"} className={`qarch-route route-${route.id}`}>
      <path d={route.d} className="qarch-wire-base" />
      <path d={route.d} className="qarch-wire-traffic" />
    </g>)}
    <g className="qarch-wire-labels"><text x="757" y="113">DURABLE WRITES</text><text x="757" y="440">ANSWER WRITES</text><text x="868" y="591" textAnchor="middle">{scalingPlanned ? "PLANNED REPORT READS →" : "REPORT READS →"}</text></g>
  </svg>;
}

export default function QuzoArchitecture({ status = "mixed" }: { status?: QuzoArchitectureStatus }) {
  const [journey, setJourney] = useState<Journey>("exam");
  const [scalePhase, setScalePhase] = useState<ScalePhase>("steady");
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLElement>(null);
  const id = useId();
  const current = journeys.find(item => item.id === journey)!;
  const currentScale = scalePhases.find(item => item.id === scalePhase)!;
  const implemented = status === "implemented";
  const coreImplemented = status !== "proposed";
  const scalingPlanned = !implemented;
  const journeyDescription = scalingPlanned && journey === "exam"
    ? "Exam delivery is separate from form administration. Redis reduces repeated fetches; responses go to their own database. Explore the next step: independent exam capacity."
    : scalingPlanned && journey === "results"
      ? "Reporting belongs to the Forms application. Planned read replicas will give report queries their own capacity. Fresh submissions still need primary reads when immediate consistency matters."
      : current.description;
  const journeySteps = scalingPlanned && journey === "results"
    ? ["Educator opens a report", "Forms checks access", "Planned: replica serves reads", "Freshness stays explicit"]
    : current.steps;
  const coreLabel = coreImplemented ? "Built" : "Proposed";

  useEffect(() => {
    if (!root.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "80px" });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  return <section ref={root} className="quzo-architecture" id="quzo-architecture" aria-labelledby={`${id}-heading`} data-visible={visible} data-journey={journey} data-scale-phase={scalePhase}>
    <div className="case-container qarch-container">
      <div className="qarch-heading">
        <div><span className="case-label">Inside Quzo / System design</span><h2 id={`${id}-heading`}>{status === "mixed" ? <>Built today.<br /><em>Designed to scale.</em></> : <>Behind every answer,<br /><em>a few deliberate decisions.</em></>}</h2></div>
        <div className="qarch-heading-note"><span className="qarch-status"><span />{status === "mixed" ? "Core shipped / scaling planned" : implemented ? "Architecture overview" : "Proposed scaling design"}</span><p>Two modular applications.<br />Different workloads. Room to grow.</p></div>
      </div>

      <div className="qarch-console">
        <div className="qarch-console-top"><span><Network size={14} /> Follow a request</span><span className="qarch-console-hint">Select a journey below</span></div>
        <div className="qarch-controls" role="group" aria-label="Explore the Quzo architecture">
          {journeys.map(({ id: journeyId, label, icon: Icon }, i) => <button key={journeyId} type="button" aria-pressed={journey === journeyId} aria-controls={`${id}-journey`} onClick={() => setJourney(journeyId)}><span className="qarch-tab-number">0{i + 1}</span><Icon size={17} /><span>{label}</span><ArrowUpRight size={15} className="qarch-tab-arrow" /></button>)}
        </div>

        {journey === "exam" && <div className="qarch-scale-plan">
          <div className="qarch-scale-heading"><span><Server size={14} />{scalingPlanned ? "Explore planned capacity" : "Explore application capacity"}</span><small>Illustrative flow · not a load test</small></div>
          <div className="qarch-scale-controls" role="group" aria-label="Explore exam traffic scenarios">
            {scalePhases.map((phase, index) => <button key={phase.id} type="button" aria-pressed={phase.id === scalePhase} aria-controls={`${id}-scale-detail ${id}-map`} onClick={() => setScalePhase(phase.id)}><span>0{index + 1}</span>{phase.label}</button>)}
          </div>
          <div className="qarch-scale-detail" id={`${id}-scale-detail`} aria-live="polite" aria-atomic="true"><strong>{currentScale.title}</strong><p>{currentScale.description}</p></div>
        </div>}

        <div className="qarch-map" id={`${id}-map`} role="group" aria-label="Architecture map: planned load-balanced ingress routes to separate Forms and Exams applications, a shared Redis cache, and separate configuration and response data stores">
          <div className="qarch-column-label qarch-client-label">01 / People</div><div className="qarch-column-label qarch-app-label">02 / Application boundaries</div><div className="qarch-column-label qarch-data-label">03 / Data by workload</div>
          <ArchitectureWires journey={journey} scalingPlanned={scalingPlanned} />
          <Node className="qarch-clients" active>
            <Users size={25} strokeWidth={1.3} /><h3>Educators<br />& learners</h3><p>Browser requests</p><div className="qarch-router"><Network size={14} /><span>Load balancer<small>{scalingPlanned ? "Planned ingress" : "Request routing"}</small></span></div>
          </Node>

          <Node className="qarch-forms" active={journey !== "exam"}>
            <span className="qarch-node-eyebrow"><Layers3 size={13} /> Modular monolith / A</span><div className="qarch-title-state"><h3>Forms & admin</h3><span className="qarch-state" data-built={coreImplemented}>{coreLabel}</span></div><div className="qarch-module-list"><span>Authoring</span><span>Access</span><span>Reporting</span></div><p>One application, clear module boundaries.</p>
          </Node>

          <Node className="qarch-exams" active={journey === "exam"}>
            <span className="qarch-node-eyebrow"><Layers3 size={13} /> Modular monolith / B</span><div className="qarch-title-state"><h3>Exam delivery</h3><span className="qarch-state" data-built={coreImplemented}>{coreLabel}</span></div><div className="qarch-module-list"><span>Sessions</span><span>Responses</span></div>
            <div className="qarch-node-pool" role="group" aria-label={`Illustrative Node.js pool: ${currentScale.label}. ${scalingPlanned ? "Additional instances and autoscaling are planned." : "Instance counts are illustrative."}`}>
              {[0, 1, 2].map(index => {
                const mode = index === 0 || scalePhase === "surge" || (scalePhase === "drain" && index === 1) ? "serving" : scalePhase === "drain" ? "draining" : "standby";
                return <span key={index} data-capacity={index === 0 ? "base" : "planned"} data-mode={mode}><Server size={12} />0{index + 1}<small>{mode === "standby" ? "Reserved" : mode === "draining" ? "Draining" : "Serving"}</small></span>;
              })}
            </div><p className="qarch-pool-note">{scalingPlanned ? "Node.js · extra capacity planned" : "Node.js · illustrative instances"}</p>
          </Node>

          <Node className="qarch-cache" active={journey !== "results"}>
            <Zap size={18} strokeWidth={1.5} /><div><div className="qarch-title-state"><h3>Redis</h3><span className="qarch-state" data-built={coreImplemented}>{coreLabel}</span></div><p>Shared read cache</p></div><span>Definitions · recurring fetches</span>
          </Node>

          <Node className="qarch-form-data" active={journey === "configure"}>
            <span className="qarch-node-eyebrow"><Database size={13} /> Configuration store</span><h3>Forms + admin data</h3><div className="qarch-data-pair"><span><i /><strong>Primary</strong><small>Writes + critical reads</small></span><ArrowDown size={13} /><span><i /><strong>HA standby</strong><small>{scalingPlanned ? "Planned · failover capacity" : "Failover capacity"}</small></span></div>
          </Node>

          <Node className="qarch-response-data" active={journey !== "configure"}>
            <span className="qarch-node-eyebrow"><Database size={13} /> Response store</span><h3>Answers, kept separate</h3><div className="qarch-data-pair"><span data-selected={journey === "exam"}><i /><strong>Write primary</strong><small>Frequent submissions</small></span><ArrowDown size={13} /><span data-selected={journey === "results"}><i /><strong>Read replicas</strong><small>{scalingPlanned ? "Planned · report reads" : "Reports · may lag writes"}</small></span></div>
          </Node>
          <div className="qarch-map-key"><span><i /> Selected request path</span><span><i /> Supporting system</span><span className="qarch-map-abstraction">Logical view · not a deployment topology</span></div>
        </div>

        <div className="qarch-journey" id={`${id}-journey`} aria-live="polite" aria-atomic="true">
          <div className="qarch-journey-copy"><span className="qarch-journey-index">0{journeys.indexOf(current) + 1}</span><div><h3>{current.title}</h3><p>{journeyDescription}</p></div></div>
          <ol>{journeySteps.map((step, i) => <li key={step}><span>{String(i + 1).padStart(2, "0")}</span>{step}{i < journeySteps.length - 1 && <ArrowRight size={13} />}</li>)}</ol>
        </div>
      </div>

      <details className="qarch-details"><summary><span>Open the engineering notes</span><ChevronDown size={17} /></summary><div className="qarch-notes">
        <div><h3>Why two modular monoliths?</h3><p>Forms and exams have different traffic patterns. Each remains one deployable application with internal modules, keeping changes easier to reason about while allowing independent application scaling.</p></div>
        <div><h3>What happens to cached data?</h3><p>Repeated, authorized reads can use cache-aside. Keys need workspace and version boundaries, an expiry, and invalidation after edits. A cache miss falls back to the database; answers bypass the cache.</p></div>
        <div><h3>What does autoscaling need?</h3><p>The scale plan uses requests per instance or utilization, with latency as a health signal. Keep warm capacity, cap database connections and store sessions outside individual processes. Drain in-flight requests before scale-in; submission retries need idempotency and bounded backoff.</p></div>
        <div><h3>Where are the limits?</h3><p>Replicas can lag; they do not increase primary write capacity. Failover needs a tested recovery path. Load tests, connection limits and recovery drills must establish capacity before publishing a concurrency or availability claim.</p></div>
      </div></details>
      <p className="qarch-scope"><Check size={13} />{status === "mixed" ? "Built: Forms, Exams and shared Redis. Planned: load-balanced exam autoscaling, HA standby and read replicas. Shown instance counts explain the design; they are not a deployment inventory or a concurrency benchmark." : implemented ? "A simplified explanation of the architecture. Shown instance counts are illustrative; no concurrency benchmark or availability guarantee is implied." : "Architecture exploration for Quzo’s scaling needs. This diagram is a proposed design, not a claim of deployed infrastructure or measured capacity."}</p>
    </div>
  </section>;
}
