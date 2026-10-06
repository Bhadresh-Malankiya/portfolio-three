import Counter from "@/components/Counter";
import Reveal from "@/components/Reveal";

type Row = {
  name: string;
  status: "live" | "weekend" | "closed";
  detail: string;
  metrics: { value: number; suffix?: string; label: string }[];
};

const ROWS: Row[] = [
  {
    name: "extendedforms.io",
    status: "live",
    detail: "sole technical owner · Google Forms analytics + AI",
    metrics: [
      { value: 400, suffix: "K+", label: "users" },
      { value: 10, suffix: "M+", label: "online exams" },
      { value: 99, suffix: ".8%", label: "uptime" },
    ],
  },
  {
    name: "quzo.ai",
    status: "live",
    detail: "engineering at ExpressTech · AI exams & proctoring",
    metrics: [
      { value: 400, suffix: "K+", label: "exams run" },
      { value: 30, suffix: "s", label: "per question, was 30 min" },
    ],
  },
  {
    name: "helpdesk-ai",
    status: "weekend",
    detail: "solo, weekends only · AI support agent",
    metrics: [{ value: 90, suffix: "%", label: "less support time" }],
  },
  {
    name: "expresstech systems",
    status: "live",
    detail: "technical lead, 2022–2026 · platform engineering",
    metrics: [
      { value: 10, suffix: "+", label: "developers managed" },
      { value: 3, suffix: "x", label: "revenue growth" },
    ],
  },
  {
    name: "mb systems",
    status: "closed",
    detail: "founder, 2020–2022 · startup studio",
    metrics: [
      { value: 10, suffix: "K+", label: "users on BPS trading" },
      { value: 7, suffix: "", label: "interns trained, all placed" },
    ],
  },
];

const DOT: Record<Row["status"], string> = {
  live: "bg-fg shadow-[0_0_8px_2px_rgba(242,241,238,0.55)]",
  weekend: "bg-gold shadow-[0_0_8px_2px_rgba(227,168,87,0.6)]",
  closed: "bg-muted/50",
};

const STATUS_LABEL: Record<Row["status"], string> = {
  live: "live",
  weekend: "weekend build",
  closed: "closed — lesson kept",
};

export default function StatusBoard() {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-ink-2/50">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5 sm:px-6">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          product work & leadership
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-fg/80">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-fg" /> live
          read-out
        </span>
      </div>
      <ul>
        {ROWS.map((row, i) => (
          <Reveal as="li" key={row.name} delay={i * 0.06}>
            <div className="flex flex-col gap-3 border-b border-line px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-center gap-3">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${DOT[row.status]}`}
                />
                <div>
                  <p className="font-mono text-sm text-fg">
                    {row.name}
                    <span className="ml-2 text-[10px] uppercase tracking-wide text-muted">
                      {STATUS_LABEL[row.status]}
                    </span>
                  </p>
                  <p className="text-xs text-muted">{row.detail}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 pl-5 sm:pl-0">
                {row.metrics.map((m) => (
                  <div key={m.label} className="text-right sm:text-left">
                    <p className="font-mono text-base text-gold-bright sm:text-lg">
                      <Counter value={m.value} suffix={m.suffix} />
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-wide text-muted">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
