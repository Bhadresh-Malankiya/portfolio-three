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
    | "Founder venture"
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
};

export const projects: Project[] = [
  {
    slug: "jewelxi",
    name: "Jewelxi",
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
    images: ["/images/jewelxi-home.jpg", "/images/jewelxi-shop.jpg"],
  },
  {
    slug: "vocalxi",
    name: "VocalXI",
    url: "https://vocalxi.com",
    category: "Voice AI / Personal product",
    kind: "Personal build",
    oneLiner:
      "My voice-form product: share a browser link, collect spoken answers, and let respondents review before submitting.",
    motif: "proctor",
    featured: true,
    techLabel: "Features",
    tech: [
      "Browser voice agents",
      "Form builder",
      "Google Forms",
      "Response review",
    ],
    metrics: [],
    narrative: [
      "VocalXI is a product I am building personally. It turns a set of form questions into a browser voice conversation, so respondents can speak their answers instead of filling every field by hand.",
      "The workflow starts with native forms or a Google Forms connection, continues through a shareable respondent link, and ends with an answer review before submission. The product also includes a workspace for forms and responses.",
      "Browser voice is available and the product is onboarding its first users. The Google Forms connector has limited staging access. Phone calling is planned, not a released feature.",
    ],
    role: "Personal product — building and developing VocalXI",
    status: "Early release — browser voice; Google Forms connector in staging",
    images: ["/images/vocalxi-home.jpg", "/images/vocalxi-review.jpg"],
  },
  {
    slug: "quzo-ai",
    name: "Quzo.ai",
    url: "https://quzo.ai",
    category: "AI SaaS",
    kind: "Sole ownership",
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
      { value: "400K+", label: "student exams handled" },
      { value: "30s", label: "question creation, down from 30 min" },
      { value: "3", label: "AI providers, one credit system" },
    ],
    narrative: [
      "I built Quzo.ai from scratch as an AI-powered quiz and exam platform. My work covers the application, the AI integrations, the credit system, and deployment.",
      "The credit system routes tasks across OpenAI, Claude, and Gemini based on the task and its cost. A retrieval pipeline using pgvector supports question-bank generation, reducing the recorded authoring time from around 30 minutes to 30 seconds.",
      "The exam workflow includes proctoring and response reporting. I have also developed photo, video, and conversation features as smaller experiments within the product.",
    ],
    role: "Founder, sole engineer, architecture, AI systems, growth & SEO",
    status: "Live — growing every term",
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
    kind: "Sole ownership",
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
      { value: "579K", label: "forms analyzed" },
      { value: "10M+", label: "online exams held" },
      { value: "3x", label: "revenue growth" },
    ],
    narrative: [
      "At ExpressTech, I own the technical side of ExtendedForms.io: architecture, feature delivery, performance, and production support.",
      "I rebuilt performance-critical paths to reduce page load from 3.2 seconds to 1.2 seconds. On a separate high-traffic page, caching and TanStack Query reduced loading from 30–35 seconds to around 5–6 seconds.",
      "I also developed AI Watchers with face detection for exam proctoring. The implementation needed to account for false positives as well as suspicious activity.",
    ],
    role: "Sole technical owner — architecture, performance, AI features, growth",
    status: "Live — 400K+ users and growing",
    // Public landing page captured from extendedforms.io on 2026-10-02.
    images: ["/images/extendedforms.png", "/images/extendedforms-live.jpg"],
  },
  {
    slug: "helpdesk-ai",
    name: "HelpDesk AI",
    category: "AI SaaS",
    kind: "Sole ownership",
    oneLiner:
      "Multi-tenant AI support agent platform with threshold-based auto-reply — built solo, on weekends.",
    motif: "inbox",
    featured: false,
    tech: ["Node.js", "IMAP IDLE", "AES-256", "JWT", "PostgreSQL"],
    metrics: [
      { value: "~90%", label: "less support engineer time" },
      { value: "hours", label: "resolution, down from 1–2 days" },
      { value: "100%", label: "weekend-built" },
    ],
    narrative: [
      "Nobody assigned this. Built entirely on weekends alongside a demanding full-time role, because most support tickets follow recognizable patterns, and a well-designed system can resolve or route them instantly instead of making a customer wait in a queue.",
      "Multi-tenant from day one — per-client subdomains, JWT-based data isolation, AES-256 encrypted mailbox credentials, and a dedicated WatcherManager reliably watching each connected mailbox over IMAP without dropped messages or resource leaks.",
      "None of that complexity was required by a contract. It's there because a year and a half of thinking like an attacker on Kali Linux made it hard to design credential handling any other way — and because a weekend project with no committee in the middle is where the cleanest decisions get made.",
    ],
    role: "Solo build — architecture, security, backend, on weekends",
    status: "Live — weekend project turned real platform",
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
    metrics: [
      { value: "6 mo", label: "delivery timeline" },
      { value: "70%", label: "less content creation time" },
      { value: "100K+", label: "content items, 3 languages" },
    ],
    narrative: [
      "A social CMS delivered in six months, cutting content creation time by 70% across more than 100,000 content items in three languages — GraphQL over Hasura Cloud keeping the admin layer fast as the catalog scaled.",
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
      "AI kiosk for automated baggage measurement, deployed across 15+ airports.",
    motif: "kiosk",
    featured: false,
    tech: ["React.js", "TensorFlow", "OpenCV", "Node.js", "Socket.io", "AWS"],
    metrics: [
      { value: "15+", label: "airports" },
      { value: "99.2%", label: "measurement accuracy" },
      { value: "<500ms", label: "AI processing time" },
      { value: "5M+", label: "baggage items processed" },
    ],
    narrative: [
      "Computer vision at the edge of a kiosk, not a lab: TensorFlow and OpenCV measuring luggage in real time, streamed over Socket.io, tuned until sub-500ms processing held up at 99.2% accuracy across five million-plus bags.",
    ],
    role: "Frontend + AI processing integration",
    status: "Deployed",
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
    metrics: [
      { value: "100+", label: "agencies" },
      { value: "500K+", label: "tasks tracked" },
    ],
    narrative: [
      "Subdomain-based tenant isolation via JWT and RFC-compliant security standards — the same isolation discipline that shows up in HelpDesk AI, applied to a project-management product now running 500K+ tasks across 100+ agencies.",
    ],
    role: "Full-stack architecture and delivery",
    status: "Delivered — public demo currently unavailable",
  },
  {
    slug: "bps-trading",
    name: "BPS Trading Platform",
    category: "Fintech",
    kind: "Founder venture",
    oneLiner: "Real-time crypto trading platform, built under MB Systems.",
    motif: "ticker",
    featured: true,
    tech: ["React.js", "Node.js", "Binance API", "Socket.io", "MongoDB", "AWS"],
    metrics: [
      { value: "10K+", label: "users" },
      { value: "$2M+", label: "trading volume" },
      { value: "1000+", label: "concurrent WebSocket connections" },
    ],
    narrative: [
      "Live multi-pair order streaming over more than a thousand concurrent WebSocket connections — built during the MB Systems period, the technical high point of a venture that ultimately didn't survive the studio around it.",
    ],
    role: "Founder & lead engineer",
    status: "Built under MB Systems (2020–2022)",
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
    url: "https://intuitive.com",
    category: "Medical Tech",
    kind: "Client project",
    oneLiner: "Frontend dashboard for Da Vinci Xi and SP surgical systems.",
    motif: "medical",
    featured: false,
    tech: ["React.js", "TypeScript", "Redux", "WebSocket", "HIPAA compliance"],
    metrics: [
      { value: "50K+", label: "hospitals worldwide" },
      { value: "99.99%", label: "uptime" },
      { value: "HIPAA", label: "compliant" },
    ],
    narrative: [
      "The kind of build where a bug isn't an inconvenient reload — HIPAA-compliant, internationalized into multiple languages including Japanese, running across 50,000+ hospitals at 99.99% uptime.",
    ],
    role: "Frontend dashboard engineering",
    status: "Live worldwide",
    images: [
      "/images/intuitive.png",
      "/images/intuitive_dashboard.png",
      "/images/intuitive_dashboard_1.png",
    ],
  },
  {
    slug: "kexy-restaurants",
    name: "Kexy Restaurants",
    url: "https://getkexy.com",
    category: "SaaS",
    kind: "Client project",
    oneLiner:
      "Restaurant management platform with ads and multi-vendor payouts.",
    motif: "restaurant",
    featured: false,
    tech: ["CakePHP", "MySQL", "Redis", "Stripe Connect", "Twilio", "AWS"],
    metrics: [
      { value: "500+", label: "restaurants" },
      { value: "$50M+", label: "order volume" },
      { value: "15–20%", label: "MoM revenue growth" },
    ],
    narrative: [
      "Multi-vendor payouts over Stripe Connect for 500+ restaurants moving $50M+ in orders — the same payout discipline first built at HQ Infosystem, at restaurant-industry scale.",
    ],
    role: "Backend & payments architecture",
    status: "Live",
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
    metrics: [
      { value: "50K+", label: "downloads" },
      { value: "$500K", label: "ARR" },
      { value: "4.6/5", label: "rating, 92% 30-day retention" },
    ],
    narrative: [
      "Mapbox-driven live tracking and NFC-based tagging, tuned until 92% of users were still opening the app 30 days later — retention, in a pet-tracking app, is trust made visible.",
    ],
    role: "Mobile & mapping integration",
    status: "Live",
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
    url: "https://rightful.com.au",
    category: "Legal Tech",
    kind: "Client project",
    oneLiner:
      "Australia's legal services platform, with real-time video consultation.",
    motif: "legal",
    featured: false,
    tech: ["React.js", "TypeScript", "Python", "WebSocket", "Stripe"],
    metrics: [
      { value: "92/100", label: "Lighthouse score" },
      { value: "AA", label: "WCAG 2.1 compliant" },
    ],
    narrative: [
      "Real-time video consultations and GIF-based, time-triggered UI animation, built to a 92/100 Lighthouse score and WCAG 2.1 AA — accessibility as a hard requirement, not an afterthought, for a platform handling legal services.",
    ],
    role: "Frontend architecture & accessibility",
    status: "Live",
    images: ["/images/rightful.png"],
  },
  {
    slug: "collahead",
    name: "Collahead — Truck Driver Tracking",
    category: "Logistics / Mobility",
    kind: "Client project",
    oneLiner:
      "React Native driver app with live GPS tracking, discontinued before launch.",
    motif: "map",
    featured: false,
    tech: ["React Native", "Mapbox Directions API", "Node.js"],
    metrics: [
      { value: "0", label: "shipped — client discontinued it before launch" },
    ],
    narrative: [
      "Custom Mapbox geofenced triggers for live GPS driver tracking, modeled on Zomato/Blinkit-style delivery tracking, for a New York-based client. The project was discontinued before launch — included here deliberately, because the geofencing engineering was real and the lessons about signal debouncing and GPS drift still apply everywhere else.",
    ],
    role: "Mobile app & live-tracking engineering",
    status: "Discontinued before launch",
  },
  {
    slug: "freelance-agency-work",
    name: "Freelance / Agency Client Work",
    category: "Freelance",
    kind: "Freelance",
    oneLiner:
      "Independent client work outside the full-time role — e-commerce and AI agent builds.",
    motif: "freelance",
    featured: false,
    tech: ["Shopify", "Next.js", "Node.js", "AI Agents"],
    metrics: [],
    narrative: [
      "E-commerce storefronts and AI agent builds delivered end to end for local clients — the same weekend-and-evening discipline that produced HelpDesk AI, applied to other people's businesses.",
    ],
    role: "Independent contractor",
    status: "Ongoing",
  },
];

export const flagshipSlugs = ["extendedforms-io", "quzo-ai", "zwopr"];
