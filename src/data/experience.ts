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
    id: "expresstech",
    role: "Senior Software Engineer · Technical Lead",
    org: "ExpressTech Systems",
    period: "June 1, 2022 — September 30, 2026",
    kind: "employment",
    bullets: [
      "Led engineering on ExtendedForms.io: 400K+ users, 10M+ online exams and 3x revenue growth",
      "Architected server-rendered applications with Next.js, cutting page load time by 60%",
      "Put Redis caching in place that cut database queries by 70%, bringing response times from 800ms to 120ms",
      "Created Quzo at ExpressTech as a modular-monolith assessment platform designed for enterprise clients in the ExtendedForms context",
      "Cut user churn by 40% and grew organic traffic 150% through an SEO-focused content and performance strategy",
      "Provided technical direction, code reviews and mentoring; established Jest and Cypress testing practices",
      "Ran a release cadence of 2 releases a month plus a major release every 1 to 1.5 months, with hotfixes, customer issue resolution and ongoing query handling",
      "Resolved an enterprise client's concern about user load with batched exam sessions and rate limits, working closely with the customer on custom solutions",
      "Built the public API for customers (forms data, response data, webhooks, invitations), shipped as a small-scope v1 and a larger-scope v2",
      "Carried ExtendedForms.io through its peak users and peak revenue periods",
      "Cut the bug escape rate by 75% and built a CDN strategy delivering sub-100ms response times globally",
      "Fixed a high-traffic page loading in 30–35 seconds down to 5–6 seconds using caching and TanStack Query",
    ],
  },
  {
    id: "hq-infosystem",
    role: "Full Stack Developer",
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
