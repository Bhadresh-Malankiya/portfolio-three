import type { ReactNode } from "react";

/*
 * Architecture diagrams that can build themselves one step at a time.
 * Every node and arrow carries `at`, the step that reveals it. Pass `step`
 * to show the build up to that point; leave it out for the finished picture.
 */

type Stage = { step?: number };
const ALL = Number.POSITIVE_INFINITY;
const stateOf = (at: number, step: number) => (at > step ? "ghost" : at === step ? "active" : "done");

type BoxProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  name: string;
  lines?: string[];
  align?: "middle" | "start";
  at: number;
  step: number;
};

function Box({ x, y, w, h, name, lines = [], align = "middle", at, step }: BoxProps) {
  const tx = align === "middle" ? x + w / 2 : x + 16;
  return (
    <g className="flow-node" data-state={stateOf(at, step)}>
      <rect x={x} y={y} width={w} height={h} rx="8" />
      <text x={tx} y={y + 24} textAnchor={align} className="flow-node-name">{name}</text>
      {lines.map((line, i) => (
        <text key={line} x={tx} y={y + 44 + i * 16} textAnchor={align} className="flow-node-line">{line}</text>
      ))}
    </g>
  );
}

type Edge = { d: string; at: number };

function Edges({ id, edges, step, animate }: { id: string; edges: Edge[]; step: number; animate: boolean }) {
  return (
    <g className="flow-edges">
      {edges.map(({ d, at }) => {
        const state = stateOf(at, step);
        return (
          <g key={d} className="flow-edge" data-state={state}>
            <path d={d} pathLength={1} markerEnd={`url(#${id}-arrow)`} />
            {animate && state === "active" && (
              <circle r="4" className="flow-packet">
                <animateMotion dur="1.3s" repeatCount="indefinite" path={d} />
              </circle>
            )}
          </g>
        );
      })}
    </g>
  );
}

function Frame({ id, label, height, children }: { id: string; label: string; height: number; children: ReactNode }) {
  return (
    <div className="diagram-scroll">
      <svg viewBox={`0 0 760 ${height}`} role="img" aria-label={label} className="diagram-svg flow-svg" fontFamily="var(--font-plex-sans), system-ui, sans-serif">
        <defs>
          <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" className="flow-arrowhead" />
          </marker>
        </defs>
        {children}
      </svg>
    </div>
  );
}

export function AIRequestPathDiagram({ step = ALL }: Stage) {
  const W = 112, y = 24, H = 60;
  const xs = [14, 138, 262, 386, 510, 634];
  const names: [string, string][] = [["Input", "voice or text"], ["Context", "RAG or notes"], ["Model", "best-fit model"], ["Guardrails", "schema checks"], ["Review", "human sign-off"], ["Action", "submit, send"]];
  const live = Number.isFinite(step);
  return (
    <Frame id="ai-path" label="Every AI feature follows one path: input, context, model, guardrails, human review, action" height={108}>
      <Edges id="ai-path" step={step} animate={live} edges={xs.slice(0, -1).map((x, i) => ({ d: `M${x + W} ${y + 30}H${x + W + 10}`, at: i + 1 }))} />
      {names.map(([name, line], i) => <Box key={name} x={xs[i]} y={y} w={W} h={H} name={name} lines={[line]} at={i} step={step} />)}
    </Frame>
  );
}

export function QuzoMonolithDiagram({ step = ALL }: Stage) {
  const live = Number.isFinite(step);
  return (
    <Frame id="quzo" label="Quzo.ai: forms and exams scale apart, sharing one read cache" height={340}>
      <Edges id="quzo" step={step} animate={live} edges={[
        { d: "M350 64V84H168V108", at: 1 },
        { d: "M92 222V258", at: 2 },
        { d: "M244 222V258", at: 2 },
        { d: "M410 64V84H596V108", at: 3 },
        { d: "M312 170H326", at: 4 },
        { d: "M456 170H434", at: 4 },
        { d: "M596 222V258", at: 5 },
      ]} />
      <Box x={280} y={24} w={200} h={40} name="Educators and learners" at={0} step={step} />
      <Box x={24} y={110} w={288} h={112} name="Forms and admin app" align="start" lines={["Authoring and question banks", "AI generation, credit based", "Access and sharing", "Reporting"]} at={1} step={step} />
      <Box x={24} y={260} w={136} h={72} name="Model providers" lines={["OpenAI, Claude,", "and Gemini"]} at={2} step={step} />
      <Box x={176} y={260} w={136} h={72} name="Forms data" lines={["PostgreSQL", "with pgvector"]} at={2} step={step} />
      <Box x={456} y={110} w={280} h={112} name="Exam delivery app" align="start" lines={["Exam sessions", "Response capture", "Scales on its own at exam start"]} at={3} step={step} />
      <Box x={328} y={142} w={104} h={56} name="Redis" lines={["shared reads"]} at={4} step={step} />
      <Box x={496} y={260} w={200} h={72} name="Responses data" lines={["PostgreSQL write path", "separate from forms"]} at={5} step={step} />
    </Frame>
  );
}

export function RealtimeFlowDiagram({ step = ALL }: Stage) {
  const W = 120, H = 60, sy = 52, cy = 200;
  const live = Number.isFinite(step);
  const lane = (y: number, label: string, labelX: number, at: number) => (
    <g className="flow-lane" data-state={stateOf(at, step)}>
      <rect x="24" y={y} width="712" height="112" rx="8" />
      <text x={labelX} y={y + 20}>{label}</text>
    </g>
  );
  return (
    <Frame id="rt" label="CompassRT: one market feed in, one update per symbol per second out" height={300}>
      {lane(16, "Node.js server", 40, 0)}
      {lane(164, "React client", 320, 5)}
      <Edges id="rt" step={step} animate={live} edges={[
        { d: "M160 82H178", at: 1 },
        { d: "M300 82H318", at: 2 },
        { d: "M440 82H458", at: 3 },
        { d: "M580 82H598", at: 4 },
        { d: "M660 112V198", at: 5 },
        { d: "M600 230H582", at: 5 },
        { d: "M460 230H442", at: 5 },
        { d: "M100 200V114", at: 6 },
      ]} />
      <Box x={40} y={sy} w={W} h={H} name="Finnhub feed" lines={["shared socket"]} at={0} step={step} />
      <Box x={180} y={sy} w={W} h={H} name="RxJS stream" lines={["event per trade"]} at={1} step={step} />
      <Box x={320} y={sy} w={W} h={H} name="Buffer 1 s" lines={["bufferTime"]} at={2} step={step} />
      <Box x={460} y={sy} w={W} h={H} name="Latest only" lines={["per symbol"]} at={3} step={step} />
      <Box x={600} y={sy} w={W} h={H} name="Socket.IO" lines={["room per symbol"]} at={4} step={step} />
      <Box x={600} y={cy} w={W} h={H} name="Browser" lines={["socket client"]} at={5} step={step} />
      <Box x={460} y={cy} w={W} h={H} name="Buffer 1 s" lines={["bufferTime"]} at={5} step={step} />
      <Box x={320} y={cy} w={W} h={H} name="AG Grid" lines={["row-ID updates"]} at={5} step={step} />
      <Box x={40} y={cy} w={W} h={H} name="Watchlist" lines={["join or leave"]} at={6} step={step} />
      <g className="flow-node" data-state={stateOf(6, step)}>
        <text x="112" y="144" className="flow-node-line">subscribes on first viewer,</text>
        <text x="112" y="158" className="flow-node-line">unsubscribes when room empties</text>
      </g>
    </Frame>
  );
}
