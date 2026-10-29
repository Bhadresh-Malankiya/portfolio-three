export type Motif =
  | "forms"
  | "proctor"
  | "inbox"
  | "ticker"
  | "map"
  | "medical"
  | "cms"
  | "kiosk"
  | "restaurant"
  | "legal"
  | "pm"
  | "petmap"
  | "freelance";

export type Metric = { value: string; label: string };

export type Project = {
  slug: string;
  name: string;
  url?: string;
  category: string;
  kind:
    | "Sole ownership"
    | "Employer product"
    | "Client project"
    | "Freelance"
    | "Personal build";
  oneLiner: string;
  motif: Motif;
  featured: boolean;
  tech: string[];
  techLabel?: string;
  metrics: Metric[];
  narrative: string[];
  role: string;
  status: string;
  /** Real product screenshots, in /public/images. Falls back to the generated motif when empty. */
  images?: string[];
  /** "phone" renders screenshots in a phone frame instead of a browser window. */
  frame?: "browser" | "phone";
  /** Prototype, R&D or side build that is not a launched product. */
  experiment?: boolean;
};

export const projects: Project[] = [
  {
    slug: "jewelxi",
    name: "Jewelxi",
    experiment: true,
    url: "https://jewelxi.vercel.app/",
    category: "E-commerce",
    kind: "Personal build",
    oneLiner:
      "A jewellery storefront with a filterable catalog, custom design enquiries, and an interactive 3D product study.",
    motif: "freelance",
    featured: true,
    techLabel: "Features",
    tech: ["E-commerce", "3D interfaces", "Catalog filtering", "Test checkout"],
    metrics: [],
    narrative: [
      "Jewelxi brings the storefront, product catalog, and custom design enquiry into one jewellery shopping experience. The public preview includes category and material filters, product search, multiple display currencies, and detailed product pages.",
      "The visual work includes a scroll-driven 3D pendant study and a separate inspiration gallery. The catalog includes search, category filters, material filters, and sorting.",
      "The site is currently in public preview, with an illustrative collection and test checkout.",
    ],
    role: "E-commerce development and interactive product presentation",
    status: "Public preview — test checkout",
    images: ["/images/jewelxi-home.jpg", "/images/jewelxi-shop.jpg", "/images/jewelxi-admin_1.webp", "/images/jewelxi-admin_2.webp", "/images/jewelxi-admin_3.webp", "/images/jewelxi-admin_4.webp"],
  },
  {
    slug: "vocalxi",
    name: "VocalXI",
    experiment: true,
    url: "https://vocalxi.com",
    category: "Voice AI",
    kind: "Personal build",
    oneLiner:
      "My voice-form product: share a browser link, collect spoken answers, and let respondents review before submitting.",
    motif: "proctor",
    featured: true,
    techLabel: "Features",
    tech: [
      "Browser voice agents",
      "Form builder",
      "Google Forms connector (staging)",
      "Response review",
    ],
    metrics: [],
    narrative: [
      "VocalXI is a product I am building personally. It turns a set of form questions into a browser voice conversation, so respondents can speak their answers instead of filling every field by hand.",
      "The workflow starts with native forms or a Google Forms connection, continues through a shareable respondent link, and ends with an answer review before submission. The product also includes a workspace for forms and responses.",
      "Browser voice conversations work end to end today. The Google Forms connector is in staging and telephone calling is next on the roadmap.",
    ],
    role: "Product engineer: design, voice AI, backend and deployment",
    status: "Early access · browser voice live · Google Forms connector in staging",
    images: ["/images/vocalxi-home.jpg", "/images/vocalxi-review.jpg", "/images/vocalxi-dashboard_1.webp", "/images/vocalxi-dashboard_2.webp"],
  },
  {
    slug: "quzo-ai",
    name: "Quzo.ai",
    url: "https://quzo.ai",
    category: "AI SaaS",
    kind: "Employer product",
    oneLiner:
      "AI-powered quizzes and proctored exams, built from idea to production.",
    motif: "proctor",
    featured: false,
    tech: [
      "Next.js",
      "React",
      "Node.js",
      "OpenAI",
      "Claude",
      "Gemini",
      "PostgreSQL",
      "pgvector",
      "Stripe",
    ],
    metrics: [
      { value: "30s", label: "question creation, down from 30 min" },
      { value: "3", label: "AI providers, one credit system" },
    ],
    narrative: [
      "I created Quzo.ai at ExpressTech Systems as a modular-monolith assessment platform for enterprise clients in the ExtendedForms context. My work covers the application, the AI integrations, the credit system, and deployment.",
      "The credit system routes tasks across OpenAI, Claude, and Gemini based on the task and its cost. A retrieval pipeline using pgvector supports question-bank generation, reducing the recorded authoring time from around 30 minutes to 30 seconds.",
      "The exam workflow includes proctoring and response reporting. I have also developed photo, video, and conversation features as smaller experiments within the product.",
    ],
    role: "Senior Software Engineer at ExpressTech Systems; full-stack implementation and technical direction",
    status: "Recently launched employer product · contribution through September 2026",
    images: [
      "/images/quzo_landing_page.png",
      "/images/quzo_dashboard.png",
      "/images/quzo_exam_screen.png",
      "/images/quzo_form_screen.png",
      "/images/quzo_response_report.png",
      "/images/quzo_in_app_billing.png",
    ],
  },
  {
    slug: "extendedforms-io",
    name: "ExtendedForms.io",
    url: "https://extendedforms.io",
    category: "B2B SaaS",
    kind: "Employer product",
    oneLiner:
      "Google Forms analytics and AI extension platform, inside the Google Workspace ecosystem.",
    motif: "forms",
    featured: true,
    tech: [
      "Laravel",
      "Vue.js",
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Stripe",
      "AWS",
    ],
    metrics: [
      { value: "400K+", label: "users" },
      { value: "10M+", label: "online exams held" },
    ],
    narrative: [
      "At ExpressTech, I led engineering on ExtendedForms.io: architecture, feature delivery, performance, and production support.",
      "I rebuilt performance-critical paths to reduce page load from 3.2 seconds to 1.2 seconds. On a separate high-traffic page, caching and TanStack Query reduced loading from 30–35 seconds to around 5–6 seconds.",
      "I also developed AI Watchers with face detection for exam proctoring. The implementation needed to account for false positives as well as suspicious activity.",
    ],
    role: "Engineering leadership at ExpressTech — architecture, performance, AI features and delivery",
    status: "Live · 400K+ users",
    // Public landing page captured from extendedforms.io on 2026-10-02.
    images: ["/images/extendedforms.png", "/images/extendedforms-live.jpg"],
  },
  {
    slug: "helpdesk-ai",
    name: "HelpXI (HelpDesk AI)",
    experiment: true,
    category: "AI SaaS",
    kind: "Personal build",
    oneLiner:
      "Multi-tenant AI support agent platform with confidence-based auto-reply, designed and built solo.",
    motif: "inbox",
    featured: false,
    tech: ["Node.js", "IMAP IDLE", "AES-256", "JWT", "PostgreSQL"],
    metrics: [],
    narrative: [
      "A side project: multi-tenant support agent with per-client subdomains, JWT data isolation, AES-256 encrypted mailbox credentials and a WatcherManager that watches each connected mailbox over IMAP IDLE.",
    ],
    role: "Solo build: architecture, security and backend",
    status: "Side project · core flows working",
    images: [
      "/images/helpdesk_1.png",
      "/images/helpdesk_2.png",
      "/images/helpdesk_3.png",
      "/images/helpdesk_4.png",
    ],
  },
  {
    slug: "zwopr",
    name: "ZWOPR Admin Solution",
    url: "https://app.zwopr.com",
    category: "B2B SaaS",
    kind: "Client project",
    oneLiner:
      "AI-powered social content management system, built for a German company.",
    motif: "cms",
    featured: true,
    tech: ["Next.js", "NestJS", "GraphQL", "Hasura Cloud", "PostgreSQL"],
    metrics: [],
    narrative: [
      "An AI-powered social CMS for a German client, with GraphQL over Hasura Cloud and multilingual content.",
    ],
    role: "Full-stack delivery — Next.js frontend, NestJS/GraphQL backend",
    status: "Delivered",
    images: [
      "/images/zwopr_1.png",
      "/images/zwopr_2.png",
      "/images/zwopr_3.png",
      "/images/zwopr_4.png",
      "/images/zwopr_5.png",
      "/images/zwopr_6.png",
      "/images/zwopr_7.png",
    ],
  },
  {
    slug: "ebaggagedrop",
    name: "eBaggageDrop",
    category: "IoT / AI",
    kind: "Client project",
    oneLiner:
      "AI kiosk that measures and checks baggage automatically at airport self bag drop.",
    motif: "kiosk",
    featured: false,
    tech: ["React.js", "TensorFlow", "OpenCV", "Node.js", "Socket.io", "AWS"],
    metrics: [],
    narrative: [
      "Frontend and AI processing integration for a baggage kiosk: TensorFlow and OpenCV measurements streamed to the interface over Socket.io.",
    ],
    role: "Frontend + AI processing integration",
    status: "Client project",
  },
  {
    slug: "webstack",
    name: "WebStack",
    // Public site returned 404 on 2026-10-02; omit the broken live-site link.
    category: "SaaS",
    kind: "Client project",
    oneLiner: "Multi-tenant project management and CRM built for agencies.",
    motif: "pm",
    featured: false,
    tech: ["Next.js", "TypeScript", "NestJS", "PostgreSQL"],
    metrics: [],
    narrative: [
      "Subdomain-based tenant isolation with JWT, built for a US-based client and deployed on Azure.",
    ],
    role: "Full-stack architecture and delivery",
    status: "Delivered",
  },
  {
    slug: "bps-trading",
    name: "BPS Trading Platform",
    category: "Fintech",
    kind: "Personal build",
    oneLiner: "Real-time crypto trading platform with live multi-pair price streaming.",
    motif: "ticker",
    featured: true,
    tech: ["React.js", "Node.js", "Binance API", "Socket.io", "MongoDB", "AWS"],
    metrics: [],
    narrative: [
      "Live multi-pair price streaming over WebSockets, with frontend throttling to keep high-frequency data smooth.",
    ],
    role: "Lead engineer",
    status: "Delivered",
    frame: "phone",
    images: [
      "/images/bps_1.png",
      "/images/bps_2.png",
      "/images/bps_3.png",
      "/images/bps_4.png",
      "/images/bps_5.png",
      "/images/bps_6.png",
      "/images/bps_7.png",
      "/images/bps_8.png",
      "/images/bps_9.png",
      "/images/bps_10.png",
      "/images/bps_11.png",
      "/images/bps_12.png",
      "/images/bps_13.png",
      "/images/bps_14.png",
      "/images/bps_15.png",
      "/images/bps_16.png",
      "/images/bps_17.png",
    ],
  },
  {
    slug: "intuitive-surgical-dashboard",
    name: "Intuitive Surgical Dashboard",
    category: "Medical Tech",
    kind: "Client project",
    oneLiner: "Frontend dashboard for Da Vinci Xi and SP surgical systems.",
    motif: "medical",
    featured: false,
    tech: ["React", "TypeScript", "Liferay", "SSO integration"],
    metrics: [],
    narrative: [
      "Contributed React/TypeScript dashboard features and SSO integration within a Liferay-based enterprise environment.",
    ],
    role: "Frontend dashboard and integration engineering",
    status: "Enterprise client contribution",
    images: [
      "/images/intuitive.png",
      "/images/intuitive_dashboard.png",
      "/images/intuitive_dashboard_1.png",
    ],
  },
  {
    slug: "kexy-restaurants",
    name: "Kexy Restaurants",
    category: "SaaS",
    kind: "Client project",
    oneLiner:
      "Restaurant management platform with ads and multi-vendor payouts.",
    motif: "restaurant",
    featured: false,
    tech: ["CakePHP", "MySQL", "Redis", "Stripe Connect", "Twilio", "AWS"],
    metrics: [],
    narrative: [
      "Backend and payments work on a restaurant platform, including multi-vendor payouts over Stripe Connect.",
    ],
    role: "Backend & payments architecture",
    status: "Client project",
    images: ["/images/kexy.png"],
  },
  {
    slug: "hey-buddy",
    name: "Hey Buddy",
    url: "https://heybuddy.io",
    category: "Mobile App",
    kind: "Client project",
    oneLiner: "Pet GPS tracking and health monitoring app.",
    motif: "petmap",
    featured: false,
    tech: ["Vue.js", "React Native", "Firebase", "Mapbox", "NFC APIs"],
    metrics: [],
    narrative: [
      "Mobile and mapping work on a pet app: Mapbox live location and NFC-based pet tags.",
    ],
    role: "Mobile & mapping integration",
    status: "Client project",
    frame: "phone",
    images: [
      "/images/heybuddy_1.jpeg",
      "/images/heybuddy_2.png",
      "/images/heybuddy_3.png",
      "/images/heybuddy_4.png",
      "/images/heybuddy_5.jpeg",
    ],
  },
  {
    slug: "rightful",
    name: "Rightful",
    category: "Legal Tech",
    kind: "Client project",
    oneLiner:
      "Legal services platform for Australia, with real-time video consultations.",
    motif: "legal",
    featured: false,
    tech: ["React.js", "TypeScript", "Python", "WebSocket", "Stripe"],
    metrics: [],
    narrative: [
      "Frontend work on real-time video consultations and accessible interaction design.",
    ],
    role: "Frontend architecture & accessibility",
    status: "Client project",
    images: ["/images/rightful.png"],
  },
  {
    slug: "compassrt",
    name: "CompassRT",
    category: "Fintech",
    kind: "Client project",
    oneLiner:
      "Live stock dashboard: one shared market feed, batched each second and pushed only to people watching that symbol.",
    motif: "ticker",
    featured: true,
    tech: ["Node.js", "RxJS", "Socket.IO", "React", "AG Grid", "MongoDB"],
    metrics: [],
    narrative: [
      "A real-time stock watchlist that stays smooth while trades stream in from the market feed.",
    ],
    role: "Full-stack engineering: Node.js streaming backend and React trading grid",
    status: "Delivered",
    images: [
      "/images/compassrt_1.webp",
      "/images/compassrt_2.webp",
      "/images/compassrt_3.webp",
    ],
  },
  {
    slug: "co-founder-agents",
    name: "Co-founder agents",
    category: "AI agents",
    kind: "Personal build",
    experiment: true,
    oneLiner:
      "Multi-agent system on Mastra that runs the project lifecycle for product and client work.",
    motif: "pm",
    featured: false,
    tech: ["Mastra", "TypeScript", "Node.js", "PostgreSQL", "Claude"],
    metrics: [],
    narrative: [
      "Research, planning and task agents that share memory and work through approved actions.",
    ],
    role: "Design and build: agents, tools, memory and approval flow",
    status: "R&D · multi-agent experiments",
  },
  {
    slug: "opportunity-agents",
    name: "Opportunity agents",
    category: "AI automation",
    kind: "Personal build",
    experiment: true,
    oneLiner:
      "Eleven scheduled agents in hourly batches that find roles and client work, verify, score, track and follow up.",
    motif: "map",
    featured: false,
    tech: ["Scheduled AI agents", "Next.js", "PostgreSQL", "Google Sheets", "Gmail"],
    metrics: [],
    narrative: [
      "An agent pipeline that turns opportunity hunting into a tracked, repeatable process.",
    ],
    role: "Design and build: agent roles, schedules, tracking and follow-up",
    status: "Ran hourly · 3,000+ emails, 600+ conversations",
    images: [
      "/images/opportunity-agents_1.webp",
      "/images/opportunity-agents_2.webp",
      "/images/opportunity-agents_3.webp",
    ],
  },
  {
    slug: "screen-to-answer",
    name: "Screen-to-Answer Assistant",
    category: "Applied AI",
    kind: "Personal build",
    experiment: true,
    oneLiner:
      "Reads a question from a live camera or shared screen, waits until the text holds steady, then streams an AI answer to any device.",
    motif: "proctor",
    featured: false,
    tech: ["Next.js", "TypeScript", "Tesseract.js", "Claude", "OpenAI", "Pusher"],
    metrics: [],
    narrative: [
      "A proof of concept for live OCR feeding a streamed LLM answer, shared across devices.",
    ],
    role: "Solo build: capture pipeline, OCR, streaming and live sharing",
    status: "Proof of concept",
    images: [
      "/images/screen-to-answer_1.webp",
      "/images/screen-to-answer_2.webp",
      "/images/screen-to-answer_3.webp",
    ],
  },
  {
    slug: "collahead",
    name: "Collahead",
    category: "Logistics / Mobility",
    kind: "Client project",
    experiment: true,
    oneLiner:
      "Driver and admin simulator for truck routes with Mapbox directions, geofenced stops and live location.",
    motif: "map",
    featured: false,
    tech: ["React Native", "Mapbox Directions API", "Node.js", "Socket.IO"],
    metrics: [],
    narrative: [
      "Route navigation, proof of stop and live tracking for delivery drivers.",
    ],
    role: "Mobile app, mapping and live-tracking engineering",
    status: "Client prototype · not launched",
    frame: "phone",
    images: [
      "/images/collahead_1.webp",
      "/images/collahead_2.webp",
      "/images/collahead_3.webp",
      "/images/collahead_4.webp",
      "/images/collahead_5.webp",
    ],
  },
];

export const flagshipSlugs = ["extendedforms-io", "quzo-ai", "zwopr"];
