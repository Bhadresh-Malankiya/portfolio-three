import type { ReactNode } from "react";

const INK = "#f2f1ee";
const MUTED = "#a1a1a8";
const EDGE = "rgba(255,255,255,0.32)";
const GOLD = "#e3a857";

type BoxProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  name: string;
  lines?: string[];
  accent?: boolean;
  align?: "middle" | "start";
};

function Box({ x, y, w, h, name, lines = [], accent = false, align = "middle" }: BoxProps) {
  const tx = align === "middle" ? x + w / 2 : x + 16;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill={accent ? GOLD : "none"} fillOpacity={accent ? 0.14 : 1} stroke={accent ? GOLD : EDGE} strokeWidth={accent ? 2 : 1.25} />
      <text x={tx} y={y + 24} textAnchor={align} fontSize="13" fontWeight="600" fill={INK}>{name}</text>
      {lines.map((line, i) => (
        <text key={line} x={tx} y={y + 44 + i * 16} textAnchor={align} fontSize="11.5" fill={accent ? INK : MUTED}>{line}</text>
      ))}
    </g>
  );
}

function Frame({ id, label, height, children }: { id: string; label: string; height: number; children: ReactNode }) {
  return (
    <div className="diagram-scroll">
      <svg viewBox={`0 0 760 ${height}`} role="img" aria-label={label} className="diagram-svg" fontFamily="var(--font-plex-sans), system-ui, sans-serif">
        <defs>
          <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill={EDGE} />
          </marker>
        </defs>
        {children}
      </svg>
    </div>
  );
}

function Arrows({ id, paths }: { id: string; paths: string[] }) {
  return (
    <g fill="none" stroke={EDGE} strokeWidth="1.25">
      {paths.map((d) => <path key={d} d={d} markerEnd={`url(#${id}-arrow)`} />)}
    </g>
  );
}

export function AIRequestPathDiagram() {
  const W = 112, y = 24, H = 60;
  const xs = [14, 138, 262, 386, 510, 634];
  return (
    <Frame id="ai-path" label="Every AI feature follows one path: input, context, model, guardrails, human review, action" height={108}>
      <Arrows id="ai-path" paths={xs.slice(0, -1).map((x) => `M${x + W} ${y + 30}H${x + W + 10}`)} />
      <Box x={xs[0]} y={y} w={W} h={H} name="Input" lines={["voice or text"]} />
      <Box x={xs[1]} y={y} w={W} h={H} name="Context" lines={["RAG or notes"]} />
      <Box x={xs[2]} y={y} w={W} h={H} name="Model" lines={["best-fit model"]} />
      <Box x={xs[3]} y={y} w={W} h={H} name="Guardrails" lines={["schema checks"]} accent />
      <Box x={xs[4]} y={y} w={W} h={H} name="Review" lines={["human sign-off"]} />
      <Box x={xs[5]} y={y} w={W} h={H} name="Action" lines={["submit, send"]} />
    </Frame>
  );
}

export function QuzoMonolithDiagram() {
  return (
    <Frame id="quzo" label="Quzo.ai: forms and exams scale apart, sharing one read cache" height={340}>
      <Arrows id="quzo" paths={["M350 64V84H168V108", "M410 64V84H596V108", "M312 170H326", "M456 170H434", "M92 222V258", "M244 222V258", "M596 222V258"]} />
      <Box x={280} y={24} w={200} h={40} name="Educators and learners" />
      <Box x={24} y={110} w={288} h={112} name="Forms and admin app" align="start" lines={["Authoring and question banks", "AI generation, credit based", "Access and sharing", "Reporting"]} />
      <Box x={328} y={142} w={104} h={56} name="Redis" lines={["shared reads"]} />
      <Box x={456} y={110} w={280} h={112} name="Exam delivery app" align="start" lines={["Exam sessions", "Response capture", "Scales on its own at exam start"]} accent />
      <Box x={24} y={260} w={136} h={72} name="Model providers" lines={["OpenAI, Claude,", "and Gemini"]} />
      <Box x={176} y={260} w={136} h={72} name="Forms data" lines={["PostgreSQL", "with pgvector"]} />
      <Box x={496} y={260} w={200} h={72} name="Responses data" lines={["PostgreSQL write path", "separate from forms"]} />
    </Frame>
  );
}

export function RealtimeFlowDiagram() {
  const W = 120, H = 60, sy = 52, cy = 200;
  const lane = (y: number, label: string, labelX: number) => (
    <g>
      <rect x="24" y={y} width="712" height="112" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.14)" />
      <text x={labelX} y={y + 20} fontSize="11.5" fontWeight="600" fill={MUTED}>{label}</text>
    </g>
  );
  return (
    <Frame id="rt" label="CompassRT: one market feed in, one update per symbol per second out" height={300}>
      {lane(16, "Node.js server", 40)}
      {lane(164, "React client", 320)}
      <Arrows id="rt" paths={["M160 82H178", "M300 82H318", "M440 82H458", "M580 82H598", "M660 112V198", "M600 230H582", "M460 230H442", "M100 200V114"]} />
      <Box x={40} y={sy} w={W} h={H} name="Finnhub feed" lines={["shared socket"]} />
      <Box x={180} y={sy} w={W} h={H} name="RxJS stream" lines={["event per trade"]} />
      <Box x={320} y={sy} w={W} h={H} name="Buffer 1 s" lines={["bufferTime"]} accent />
      <Box x={460} y={sy} w={W} h={H} name="Latest only" lines={["per symbol"]} />
      <Box x={600} y={sy} w={W} h={H} name="Socket.IO" lines={["room per symbol"]} />
      <Box x={600} y={cy} w={W} h={H} name="Browser" lines={["socket client"]} />
      <Box x={460} y={cy} w={W} h={H} name="Buffer 1 s" lines={["bufferTime"]} />
      <Box x={320} y={cy} w={W} h={H} name="AG Grid" lines={["row-ID updates"]} />
      <Box x={40} y={cy} w={W} h={H} name="Watchlist" lines={["join or leave"]} />
      <text x="112" y="144" fontSize="11.5" fill={MUTED}>subscribes on first viewer,</text>
      <text x="112" y="158" fontSize="11.5" fill={MUTED}>unsubscribes when room empties</text>
    </Frame>
  );
}

export function OpportunityAgentsDiagram() {
  const W = 160, H = 76, rowA = 24, rowB = 144;
  return (
    <Frame id="opp" label="Opportunity agents: eleven scheduled agents, one job each, every hour" height={244}>
      <Arrows id="opp" paths={["M184 62H206", "M368 62H390", "M552 62H574", "M656 100V142", "M576 182H554", "M392 182H370"]} />
      <Box x={24} y={rowA} w={W} h={H} name="1 Scheduler" lines={["hourly batches", "11 agent tasks"]} />
      <Box x={208} y={rowA} w={W} h={H} name="2 Find leads" lines={["roles and client work", "across markets abroad"]} />
      <Box x={392} y={rowA} w={W} h={H} name="3 Verify" lines={["real company and city", "visa sponsorship fit"]} accent />
      <Box x={576} y={rowA} w={W} h={H} name="4 Filter and score" lines={["skills and role fit", "best leads kept"]} />
      <Box x={576} y={rowB} w={W} h={H} name="5 Track" lines={["sheet with proof", "status and history"]} />
      <Box x={392} y={rowB} w={W} h={H} name="6 Apply or queue" lines={["apply when possible", "else manual review"]} />
      <Box x={208} y={rowB} w={W} h={H} name="7 Follow up" lines={["Gmail follow-ups", "calls on Calendar"]} />
    </Frame>
  );
}
