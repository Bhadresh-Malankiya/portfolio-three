export type SkillGroup = {
  id: string;
  label: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    items: ["TypeScript", "JavaScript", "SQL", "PHP", "HTML5", "CSS3"],
  },
  {
    id: "historical-languages",
    label: "Limited historical exposure",
    items: ["Java", "Python"],
  },
  {
    id: "frontend",
    label: "Frontend",
    items: ["React.js", "Next.js", "Vue.js", "AngularJS", "Tailwind CSS", "Material-UI", "TanStack Query", "RxJS"],
  },
  {
    id: "backend",
    label: "Backend",
    items: ["Node.js", "Express.js", "NestJS", "Laravel", "CakePHP", "GraphQL", "Socket.io (rooms and groups)", "Throttling and funneling of high-frequency data"],
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
    items: ["v0.dev", "Windsurf", "Cursor", "Antigravity", "Claude Code", "Mastra", "MCP"],
  },
  {
    id: "ai",
    label: "Applied AI & Adoption",
    items: ["OpenAI", "Claude (Anthropic)", "Gemini", "LLM integration", "RAG pipelines with pgvector", "Prompt engineering", "Model selection by task", "AI agent systems", "AI workflow adoption"],
  },
  {
    id: "business",
    label: "Third-Party & Business Systems",
    items: ["Stripe", "Razorpay", "Twilio", "Binance API", "Google AdSense", "CRM", "POS", "RMS", "SRP", "ERP"],
  },
  {
    id: "security",
    label: "Security & Auth",
    items: ["SSO", "JWT-based auth", "AES-256 encryption", "RFC-compliant security standards", "Vulnerability scanning", "OWASP practices"],
  },
];

// A concise view of the capabilities used across customer-facing delivery.
export const deliveryExpertise = [
  { code: "01 / UI", title: "Frontend", detail: "Clear interfaces for real workflows.", tools: "TypeScript · React · Next.js · Vue.js · Tailwind CSS" },
  { code: "02 / API", title: "Backend", detail: "APIs, business logic and integrations.", tools: "Node.js · NestJS · Express · PostgreSQL · MongoDB · Redis" },
  { code: "03 / AI", title: "AI integration", detail: "Connect models to product context.", tools: "OpenAI · Claude · Gemini · RAG · pgvector" },
  { code: "04 / ADOPT", title: "AI adoption", detail: "Make AI useful in day-to-day work.", tools: "Prompt design · Model selection · AI-assisted delivery" },
  { code: "05 / SHIP", title: "Systems & deployment", detail: "Design for traffic, reliability and growth.", tools: "AWS · Docker · NGINX · CI/CD · Caching" },
  { code: "06 / LEAD", title: "Technical leadership", detail: "Technical direction, code reviews and developer mentoring.", tools: "Team of 5 · Code review · Mentoring · Release planning" },
];
