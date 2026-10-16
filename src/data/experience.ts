export type ExperienceEntry = {
  id: string;
  role: string;
  org: string;
  period: string;
  location?: string;
  kind: "employment" | "founder";
  bullets: string[];
};

export const experience: ExperienceEntry[] = [
  {
    id: "ascendxi",
    role: "Founder / Product Engineer",
    org: "AscendXI / VocalXI",
    period: "Current",
    kind: "founder",
    bullets: [
      "Building VocalXI solo, from product discovery and interface design to backend services, voice AI and deployment.",
      "Designing the complete workflow: questions, spoken answers, review, and structured responses.",
      "Working across product decisions, full-stack engineering, and applied AI.",
    ],
  },
  {
    id: "expresstech",
    role: "Senior Software Engineer (technical-lead responsibilities)",
    org: "ExpressTech Systems",
    period: "June 1, 2022 — September 30, 2026",
    kind: "employment",
    bullets: [
      "Led engineering on ExtendedForms.io; author-reported product totals of 400K+ users and 10M+ online exams, with 3x revenue growth during the tenure",
      "Architected server-rendered applications with Next.js, cutting page load time by 60%",
      "Put Redis caching in place that cut database queries by 70%, bringing response times from 800ms to 120ms",
      "Created Quzo at ExpressTech as a modular-monolith assessment platform designed for enterprise clients in the ExtendedForms context",
      "Cut user churn by 40% and grew organic traffic 150% through an SEO-focused content and performance strategy",
      "Provided technical direction, code reviews and mentoring; established Jest and Cypress testing practices",
      "Cut the bug escape rate by 75% and built a CDN strategy delivering sub-100ms response times globally",
      "Fixed a high-traffic page loading in 30–35 seconds down to 5–6 seconds using caching and TanStack Query",
    ],
  },
  {
    id: "mb-systems",
    role: "Founder",
    org: "MB Systems",
    period: "mid-2020 — mid-2022",
    location: "Surat, India",
    kind: "founder",
    bullets: [
      "Ran MB Systems alongside HQ Infosystem through a service and collaboration arrangement, with 5–6 developers on my projects.",
      "Delivered client and Shopify e-commerce projects for local businesses in Surat",
      "Built the BPS crypto trading platform under the studio, reaching 10K+ users and $2M+ in trading volume",
      "Trained interns and trainees and helped them find placements during roughly the final year",
      "Spent approximately a year winding down responsibly and helping people settle into other jobs before closing",
      "Handled client relationships end to end, including scope changes and hard conversations when timelines slipped",
      "Took on data and security decisions personally as founder — a different level of accountability than one engineer on a team",
    ],
  },
  {
    id: "hq-infosystem",
    role: "Backend Developer",
    org: "HQ Infosystem",
    period: "July 1, 2018 — June 1, 2022",
    kind: "employment",
    bullets: [
      "Delivered 15+ full-stack applications across edtech, logistics, fintech, and e-commerce",
      "Worked full-time with flexible hours while attending college; approximately two years office-based, followed by remote work",
      "Built enterprise backend systems handling millions of transactions",
      "Integrated Stripe, Razorpay, Twilio, Mapbox, and Binance APIs across client projects",
      "Built REST APIs with Node.js, Express, and Laravel handling 50K+ daily requests",
      "Built Stripe Connect multi-vendor payout systems",
      "Cut API response time by 45% through caching and query optimization",
      "Held 85%+ Jest coverage on critical modules",
    ],
  },
];
