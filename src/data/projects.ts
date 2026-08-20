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
  kind: "Sole ownership" | "Employer product" | "Founder venture" | "Client project" | "Freelance";
  oneLiner: string;
  motif: Motif;
  featured: boolean;
  tech: string[];
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
    slug: "quzo-ai",
    name: "Quzo.ai",
    url: "https://quzo.ai",
    category: "AI SaaS",
    kind: "Sole ownership",
    oneLiner: "AI-first exam and quiz platform with proctoring — built from a blank folder, on his own terms.",
    motif: "proctor",
    featured: false,
    tech: ["Next.js", "React", "Node.js", "OpenAI", "Claude", "Gemini", "PostgreSQL", "pgvector", "Stripe"],
    metrics: [
      { value: "400K+", label: "student exams handled" },
      { value: "30s", label: "question creation, down from 30 min" },
      { value: "3", label: "AI providers, one credit system" },
    ],
    narrative: [
      "There was no point in Quzo.ai's history where someone else's budget was the reason it existed. It exists because he decided it should, and then built it — no employer's roadmap, no committee to justify a feature to before the technology had proven itself.",
      "It runs on a credit management and optimization system that lets the underlying AI model be picked by task and cost — OpenAI, Claude, or Gemini — rather than locking the whole product to one provider's pricing curve. A retrieval-augmented generation pipeline on pgvector powers AI-generated question banks, cutting what used to take an educator thirty minutes down to about thirty seconds.",
      "Beyond the core exam experience: AI Watchers-style proctoring, AI photo-based conversation, AI video animation, and AI video conversation features — each one a smaller experiment first, not a line item on a roadmap planned months in advance.",
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
    oneLiner: "Google Forms analytics and AI extension platform, inside the Google Workspace ecosystem.",
    motif: "forms",
    featured: true,
    tech: ["Laravel", "Vue.js", "Next.js", "Node.js", "PostgreSQL", "MongoDB", "Redis", "Stripe", "AWS"],
    metrics: [
      { value: "401K+", label: "users" },
      { value: "579K", label: "forms analyzed" },
      { value: "8.7M", label: "respondents" },
      { value: "3x", label: "revenue growth" },
    ],
    narrative: [
      "Sole technical owner — architecture, performance, and where engineering effort goes next all start with him. No handed-down roadmap, no ambiguity about whose judgment is being questioned when something breaks.",
      "Rebuilt performance-critical paths, taking page load from 3.2s to 1.2s, then cutting the highest-traffic page from a painful 30–35 seconds down to 5–6 using smarter caching and TanStack Query. Nobody filed a ticket for it — he noticed it was costing real users at the exact moment they were trying to trust the product.",
      "Proudest feature: AI Watchers with face detection, protecting exam integrity — built with real care about false positives, and about what happens to a real student in a real moment of academic stress if the system gets it wrong.",
    ],
    role: "Sole technical owner — architecture, performance, AI features, growth",
    status: "Live — 401K+ users and growing",
    images: ["/images/extendedforms.png"],
  },
  {
    slug: "helpdesk-ai",
    name: "HelpDesk AI",
    category: "AI SaaS",
    kind: "Sole ownership",
    oneLiner: "Multi-tenant AI support agent platform with threshold-based auto-reply — built solo, on weekends.",
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
    images: ["/images/helpdesk_1.png", "/images/helpdesk_2.png", "/images/helpdesk_3.png", "/images/helpdesk_4.png"],
  },
  {
    slug: "zwopr",
    name: "ZWOPR Admin Solution",
    url: "https://app.zwopr.com",
    category: "B2B SaaS",
    kind: "Client project",
    oneLiner: "AI-powered social content management system, built for a German company.",
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
    oneLiner: "AI kiosk for automated baggage measurement, deployed across 15+ airports.",
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
    url: "https://thewebstack.com",
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
    status: "Live",
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
      "Live multi-pair order streaming over more than a thousand concurrent WebSocket connections — built during the MB Systems year, the technical high point of a venture that ultimately didn't survive the studio around it.",
    ],
    role: "Founder & lead engineer",
    status: "Built under MB Systems (2023–24)",
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
    images: ["/images/intuitive.png", "/images/intuitive_dashboard.png", "/images/intuitive_dashboard_1.png"],
  },
  {
    slug: "kexy-restaurants",
    name: "Kexy Restaurants",
    url: "https://getkexy.com",
    category: "SaaS",
    kind: "Client project",
    oneLiner: "Restaurant management platform with ads and multi-vendor payouts.",
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
    oneLiner: "Australia's legal services platform, with real-time video consultation.",
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
    oneLiner: "React Native driver app with live GPS tracking, discontinued before launch.",
    motif: "map",
    featured: false,
    tech: ["React Native", "Mapbox Directions API", "Node.js"],
    metrics: [{ value: "0", label: "shipped — client discontinued it before launch" }],
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
    oneLiner: "Independent client work outside the full-time role — e-commerce and AI agent builds.",
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

export const flagshipSlugs = ["extendedforms-io", "zwopr", "bps-trading"];
