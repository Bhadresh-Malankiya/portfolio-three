export type ImpactMetric = {
  label: string;
  context: string;
  before: string;
  after: string;
  pct: number; // "after" as a percentage width of "before" — drives the bar
};

export const impactMetrics: ImpactMetric[] = [
  {
    label: "Page load",
    context: "ExtendedForms.io — SSR rebuild + TanStack Query",
    before: "3.2s",
    after: "1.2s",
    pct: 37,
  },
  {
    label: "Worst-case page load",
    context: "The one page nobody filed a ticket about — he noticed it anyway",
    before: "~32s",
    after: "~5.5s",
    pct: 17,
  },
  {
    label: "Exam question creation",
    context: "Quzo.ai — AI generation replacing manual authoring by hand",
    before: "30 min",
    after: "30 sec",
    pct: 2,
  },
  {
    label: "Support ticket resolution",
    context: "HelpDesk AI, for routine ticket types",
    before: "1–2 days",
    after: "hours",
    pct: 8,
  },
  {
    label: "Database response time",
    context: "Redis caching layer, ExpressTech",
    before: "800ms",
    after: "120ms",
    pct: 15,
  },
  {
    label: "API response time",
    context: "Caching + query optimization, HQ Infosystem",
    before: "baseline",
    after: "−45%",
    pct: 55,
  },
];

export const uniquenessBadges: string[] = [
  "Technical leadership across employer products",
  "Employer products and independent builds",
  "8+ years, zero career gaps",
  "Developer mentorship and trainee support",
];
