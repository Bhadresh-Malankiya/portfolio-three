export type SkillGroup = {
  id: string;
  label: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    items: ["JavaScript", "TypeScript", "Python", "PHP", "Java", "SQL", "HTML5", "CSS3"],
  },
  {
    id: "frontend",
    label: "Frontend",
    items: ["React.js", "Next.js", "Vue.js", "AngularJS", "Tailwind CSS", "Material-UI", "TanStack Query", "RxJS"],
  },
  {
    id: "backend",
    label: "Backend",
    items: ["Node.js", "Express.js", "NestJS", "Laravel", "CakePHP"],
  },
  {
    id: "mobile",
    label: "Mobile",
    items: ["React Native"],
  },
  {
    id: "data",
    label: "Databases",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Firebase", "Redis", "pgvector"],
  },
  {
    id: "cloud",
    label: "Cloud & DevOps",
    items: ["AWS", "Google Cloud", "Azure", "Vercel", "Docker", "Kafka", "Kubernetes", "Load Balancing", "Auto-Scaling"],
  },
  {
    id: "testing",
    label: "Testing & QA",
    items: ["Jest", "Cypress", "Lighthouse", "OWASP Security Testing", "SonarQube"],
  },
  {
    id: "devtools",
    label: "CI/CD & Dev Tools",
    items: ["GitHub Actions", "GitLab CI", "Jenkins", "ESLint", "Prettier", "Husky"],
  },
  {
    id: "visualization",
    label: "Visualization & Animation",
    items: ["Highcharts", "Mapbox", "Three.js", "Framer Motion", "Lenis", "Animate.js"],
  },
  {
    id: "ai-tools",
    label: "AI-Native Dev Tools",
    items: ["v0.dev", "Windsurf", "Cursor", "Antigravity", "Claude Code"],
  },
  {
    id: "ai",
    label: "Applied AI & Adoption",
    items: ["OpenAI", "Claude (Anthropic)", "Gemini", "LLM integration", "RAG pipelines with pgvector", "Prompt engineering", "AI workflow adoption"],
  },
  {
    id: "business",
    label: "Third-Party & Business Systems",
    items: ["Stripe", "Razorpay", "Twilio", "Binance API", "Google AdSense", "CRM", "POS", "RMS", "SRP", "ERP"],
  },
  {
    id: "security",
    label: "Security & Auth",
    items: ["SSO", "JWT-based auth", "AES-256 encryption", "RFC-compliant security standards"],
  },
];

// A concise view of the capabilities used across customer-facing delivery.
export const deliveryExpertise = [
  { code: "01 / UI", title: "Frontend", detail: "Clear interfaces for real workflows.", tools: "JavaScript · TypeScript · React · Next.js" },
  { code: "02 / API", title: "Backend", detail: "APIs, business logic and integrations.", tools: "PHP · Laravel · Node.js · PostgreSQL" },
  { code: "03 / AI", title: "AI integration", detail: "Connect models to product context.", tools: "LLMs · RAG · OpenAI · pgvector" },
  { code: "04 / ADOPT", title: "AI adoption", detail: "Make AI useful in day-to-day work.", tools: "Prompt engineering · AI workflows · Claude" },
  { code: "05 / SHIP", title: "Systems & deployment", detail: "Design for traffic, reliability and growth.", tools: "System design · AWS · Kafka · Docker" },
  { code: "06 / LEAD", title: "Technical leadership", detail: "Managed 10+ developers, with delivery ownership.", tools: "Team management · Mentoring · Product scope" },
];
