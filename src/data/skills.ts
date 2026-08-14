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
    items: ["AWS", "Google Cloud", "Azure", "Vercel", "Docker", "Kubernetes", "Load Balancing", "Auto-Scaling"],
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
    label: "AI Integrations",
    items: ["OpenAI", "Claude (Anthropic)", "Gemini", "RAG pipelines with pgvector"],
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
