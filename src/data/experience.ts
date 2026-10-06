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
      "Building VocalXI, a browser voice product for form-based conversations.",
      "Designing the complete workflow: questions, spoken answers, review, and structured responses.",
      "Working across product decisions, full-stack engineering, and applied AI.",
    ],
  },
  {
    id: "expresstech",
    role: "Senior Software Engineer / Technical Lead",
    org: "ExpressTech Systems",
    period: "June 2022 — September 2026",
    kind: "employment",
    bullets: [
      "Sole technical owner of ExtendedForms.io — 401K+ users, 579K forms, 8.7M respondents; drove 3x revenue growth",
      "Architected server-rendered applications with Next.js, cutting page load time by 60%",
      "Put Redis caching in place that cut database queries by 70%, bringing response times from 800ms to 120ms",
      "Scaled the backend to 100K concurrent users at 99.8% uptime",
      "Cut user churn by 40% and grew organic traffic 150% through an SEO-focused content and performance strategy",
      "Mentored 5+ engineers and set up Jest coverage above 90% alongside Cypress end-to-end tests",
      "Cut the bug escape rate by 75% and built a CDN strategy delivering sub-100ms response times globally",
      "Fixed a high-traffic page loading in 30–35 seconds down to 5–6 seconds using caching and TanStack Query",
    ],
  },
  {
    id: "mb-systems",
    role: "Founder",
    org: "MB Systems",
    period: "2020 — 2022",
    location: "Surat, India",
    kind: "founder",
    bullets: [
      "Ran a startup studio alongside my full-time role. The studio later closed; the work included client delivery, hiring, and team management.",
      "Delivered client and Shopify e-commerce projects for local businesses in Surat",
      "Built the BPS crypto trading platform under the studio, reaching 10K+ users and $2M+ in trading volume",
      "Trained 6–7 interns, all now well-settled in their careers",
      "Managed developers directly for the first time; picked up a project manager's habits across several roles at once",
      "Handled client relationships end to end, including scope changes and hard conversations when timelines slipped",
      "Took on data and security decisions personally as founder — a different level of accountability than one engineer on a team",
    ],
  },
  {
    id: "hq-infosystem",
    role: "Full Stack Developer / Senior Full Stack Developer",
    org: "HQ Infosystem",
    period: "2018 — 2022",
    kind: "employment",
    bullets: [
      "Delivered 15+ full-stack applications across edtech, logistics, fintech, and e-commerce",
      "Built enterprise backend systems handling millions of transactions",
      "Integrated Stripe, Razorpay, Twilio, Mapbox, and Binance APIs across client projects",
      "Built REST APIs with Node.js, Express, and Laravel handling 50K+ daily requests",
      "Built Stripe Connect multi-vendor payout systems",
      "Cut API response time by 45% through caching and query optimization",
      "Held 85%+ Jest coverage on critical modules",
    ],
  },
];
