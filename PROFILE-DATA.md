# Bhadreshkumar Malankiya — Complete Profile Data

Generated reference snapshot of the canonical public data in src/data. Regenerate with `node scripts/sync-profile-data.mjs` after editing those files. This file is a reference, not an independent source of verified claims.

Employment titles and dates reflect the supplied employer records. MB Systems dates and team context reflect the author's clarification. Historical product figures and performance outcomes are author-reported, not independently audited benchmarks. Overlapping employment and venture periods do not add extra years of experience.

The portfolio presentation distinguishes employer products (ExtendedForms and Quzo), founder work (AscendXI/VocalXI) and personal builds (HelpDesk AI). The projects archive is retained for historical scope; the portfolio module contains the current presentation. Source documents remain ignored.

## profile

Source: src/data/profile.ts

```json
{
  "profile": {
    "name": "Bhadreshkumar Malankiya",
    "shortName": "Bhadresh",
    "role": "Forward Deployed Engineer · Full Stack & Applied AI",
    "tagline": "The Weekend Builder",
    "subtitle": "Eight years connecting customer problems with production software. Frontend, backend and applied AI, with technical leadership and founder experience.",
    "location": "Surat, Gujarat, India",
    "email": "bhadreshm3418@gmail.com",
    "phone": "+91 73593 59602",
    "site": "bhadresh-malankiya.ascendxi.com",
    "currentRole": "Forward Deployed Engineer · Founder, AscendXI",
    "yearsExperience": 8,
    "summary": "Full-stack and applied-AI engineer with 8+ years across client delivery, backend systems and production products. At ExpressTech Systems, I led engineering work on ExtendedForms and created Quzo for enterprise assessment needs. I founded MB Systems alongside my earlier full-time role at HQ Infosystem, leading 5–6 developers and supporting trainees before closing in mid-2022. I now build VocalXI through AscendXI.",
    "coreStrengths": [
      "Finds and frames problems before writing code, then builds the solution end to end",
      "Thinks about product decisions the way a business owner would, not only as an engineer",
      "Tests features from a non-technical user's point of view before calling them done",
      "Picks up new stacks and tools quickly and puts them into production",
      "Strong research and development instinct, especially with new AI tooling",
      "Connects engineering decisions with product outcomes"
    ],
    "headlineStats": [
      {
        "value": 8,
        "suffix": "+",
        "label": "years shipping production software"
      },
      {
        "value": 6,
        "suffix": "",
        "label": "developers on MB Systems projects (5–6)"
      },
      {
        "value": 400,
        "suffix": "K+",
        "label": "ExtendedForms users"
      },
      {
        "value": 10,
        "suffix": "M+",
        "label": "online exams on ExtendedForms"
      }
    ],
    "tickerStats": [
      "400K+ users on ExtendedForms.io",
      "10M+ online exams on ExtendedForms",
      "579K forms analyzed",
      "Architecture and performance work on high-traffic SaaS",
      "3x revenue growth at ExpressTech",
      "question generation cut from 30 min to 30 sec",
      "page load cut from 3.2s to 1.2s",
      "HelpDesk AI: ~90% less effort for eligible ticket types (author-reported)",
      "5–6 developers on MB Systems projects",
      "10K+ users, $2M+ volume on BPS Trading",
      "1 startup founded, closed honestly, lessons kept"
    ],
    "certifications": [
      "Turing Certified Full Stack Developer",
      "GDG Mobile Track Winner, 2021",
      "TryHackMe — Top 6% Global Rank, 2021",
      "60+ technical courses across AI, DevOps, cybersecurity, analytics, web development",
      "20+ technical articles on Medium, 2K+ followers",
      "Open-source contributor in the React ecosystem",
      "Speaker, \"Scalable Architecture,\" GDG Meetup 2022"
    ],
    "education": {
      "degree": "Bachelor of Engineering, Information Technology",
      "school": "Gujarat Technological University — SSGEC · 2022",
      "detail": "CGPA 9.0/10.0 · First Class with Distinction"
    }
  }
}
```

## experience

Source: src/data/experience.ts

```json
{
  "experience": [
    {
      "id": "ascendxi",
      "role": "Founder / Product Engineer",
      "org": "AscendXI / VocalXI",
      "period": "Current",
      "kind": "founder",
      "bullets": [
        "Building VocalXI solo, from product discovery and interface design to backend services, voice AI and deployment.",
        "Designing the complete workflow: questions, spoken answers, review, and structured responses.",
        "Working across product decisions, full-stack engineering, and applied AI."
      ]
    },
    {
      "id": "expresstech",
      "role": "Senior Software Engineer (technical-lead responsibilities)",
      "org": "ExpressTech Systems",
      "period": "June 1, 2022 — September 30, 2026",
      "kind": "employment",
      "bullets": [
        "Led engineering on ExtendedForms.io; author-reported product totals of 400K+ users and 10M+ online exams, with 3x revenue growth during the tenure",
        "Architected server-rendered applications with Next.js, cutting page load time by 60%",
        "Put Redis caching in place that cut database queries by 70%, bringing response times from 800ms to 120ms",
        "Created Quzo at ExpressTech as a modular-monolith assessment platform designed for enterprise clients in the ExtendedForms context",
        "Cut user churn by 40% and grew organic traffic 150% through an SEO-focused content and performance strategy",
        "Provided technical direction, code reviews and mentoring; established Jest and Cypress testing practices",
        "Cut the bug escape rate by 75% and built a CDN strategy delivering sub-100ms response times globally",
        "Fixed a high-traffic page loading in 30–35 seconds down to 5–6 seconds using caching and TanStack Query"
      ]
    },
    {
      "id": "mb-systems",
      "role": "Founder",
      "org": "MB Systems",
      "period": "mid-2020 — mid-2022",
      "location": "Surat, India",
      "kind": "founder",
      "bullets": [
        "Ran MB Systems alongside HQ Infosystem through a service and collaboration arrangement, with 5–6 developers on my projects.",
        "Delivered client and Shopify e-commerce projects for local businesses in Surat",
        "Built the BPS crypto trading platform under the studio, reaching 10K+ users and $2M+ in trading volume",
        "Trained interns and trainees and helped them find placements during roughly the final year",
        "Spent approximately a year winding down responsibly and helping people settle into other jobs before closing",
        "Handled client relationships end to end, including scope changes and hard conversations when timelines slipped",
        "Took on data and security decisions personally as founder — a different level of accountability than one engineer on a team"
      ]
    },
    {
      "id": "hq-infosystem",
      "role": "Backend Developer",
      "org": "HQ Infosystem",
      "period": "July 1, 2018 — June 1, 2022",
      "kind": "employment",
      "bullets": [
        "Delivered 15+ full-stack applications across edtech, logistics, fintech, and e-commerce",
        "Worked full-time with flexible hours while attending college; approximately two years office-based, followed by remote work",
        "Built enterprise backend systems handling millions of transactions",
        "Integrated Stripe, Razorpay, Twilio, Mapbox, and Binance APIs across client projects",
        "Built REST APIs with Node.js, Express, and Laravel handling 50K+ daily requests",
        "Built Stripe Connect multi-vendor payout systems",
        "Cut API response time by 45% through caching and query optimization",
        "Held 85%+ Jest coverage on critical modules"
      ]
    }
  ]
}
```

## portfolio

Source: src/data/portfolio.ts

```json
{
  "identity": {
    "name": "Bhadresh Malankiya",
    "role": "Forward Deployed Engineer",
    "summary": "I turn customer problems into production software: frontend, backend, AI integration and deployment. My experience spans technical leadership, scaling SaaS and building VocalXI solo.",
    "email": "bhadreshm3418@gmail.com",
    "site": "bhadresh-malankiya.ascendxi.com",
    "location": "Surat, Gujarat, India",
    "resume": "/downloads/Bhadreshkumar-malankiya-resume-full.pdf"
  },
  "portfolioProjects": [
    {
      "slug": "jewelxi",
      "name": "Jewelxi",
      "url": "https://jewelxi.vercel.app/",
      "category": "E-commerce",
      "kind": "Personal build",
      "oneLiner": "A jewellery storefront with a filterable catalog, custom design enquiries, and an interactive 3D product study.",
      "motif": "freelance",
      "featured": true,
      "techLabel": "Features",
      "tech": [
        "E-commerce",
        "3D interfaces",
        "Catalog filtering",
        "Test checkout"
      ],
      "metrics": [],
      "narrative": [
        "Jewelxi is a public preview with an illustrative collection and test checkout."
      ],
      "role": "E-commerce development and interactive product presentation",
      "status": "Public preview — test checkout",
      "images": [
        "/images/jewelxi-home.jpg",
        "/images/jewelxi-shop.jpg"
      ],
      "problem": "A jewellery catalog needs to make the details easy to explore, from material and category to the individual piece.",
      "contribution": "I built the storefront, catalog filtering, product pages and custom-design enquiry flow, with an interactive 3D pendant study.",
      "decisions": [
        "Give the product photography room, and keep the browsing controls close.",
        "Connect the catalog with product details and a custom-design enquiry path.",
        "Use 3D for a closer look at the piece, alongside a conventional shopping interface."
      ],
      "outcomes": [
        "A filterable jewellery catalog with search, material and category filters.",
        "A storefront, inspiration gallery and interactive product study."
      ]
    },
    {
      "slug": "quzo-ai",
      "name": "Quzo.ai",
      "url": "https://quzo.ai",
      "category": "AI SaaS",
      "kind": "Employer product",
      "oneLiner": "An ExpressTech assessment platform built for enterprise ExtendedForms clients.",
      "motif": "proctor",
      "featured": false,
      "tech": [
        "Next.js",
        "React",
        "Node.js",
        "OpenAI",
        "Claude",
        "Gemini",
        "PostgreSQL",
        "pgvector",
        "Stripe"
      ],
      "metrics": [],
      "narrative": [
        "Quzo.ai is presented here as employer-product engineering. Technical responsibility does not imply founder or legal ownership.",
        "The product combines AI-assisted authoring with the practical work of administering assessments and understanding the results."
      ],
      "role": "Full-stack and AI engineering at ExpressTech Systems",
      "status": "Employer product · contribution through September 2026",
      "images": [
        "/images/quzo_dashboard.png",
        "/images/quzo_form_screen.png",
        "/images/quzo_exam_screen.png",
        "/images/quzo_response_report.png",
        "/images/quzo_in_app_billing.png",
        "/images/quzo_landing_page.png"
      ],
      "problem": "Creating and running an assessment involves more than generating a list of questions: educators also need delivery, controls and useful reporting.",
      "contribution": "I created Quzo at ExpressTech Systems, taking responsibility for full-stack implementation through its recent launch. Its modular-monolith architecture was designed for enterprise clients in the ExtendedForms context.",
      "decisions": [
        "Connect question generation to the assessment workflow rather than treating AI as a separate chat window.",
        "Support different model providers behind a shared credit system.",
        "Use modular-monolith applications with clear boundaries between administration and exam delivery.",
        "Keep exam delivery, proctoring and reporting understandable for both educators and respondents."
      ],
      "outcomes": [
        "An integrated question-to-assessment workflow.",
        "Multi-provider AI integration and credit management.",
        "Product screens covering setup, delivery, reports and billing."
      ],
      "imageCaptions": [
        "Assessment dashboard.",
        "Assessment setup and question workflow.",
        "Respondent exam experience.",
        "Response reporting.",
        "In-app billing and credits.",
        "Public product introduction."
      ]
    },
    {
      "slug": "extendedforms-io",
      "name": "ExtendedForms.io",
      "url": "https://extendedforms.io",
      "category": "B2B SaaS",
      "kind": "Employer product",
      "oneLiner": "Timed assessments, proctoring and reporting built around Google Forms.",
      "motif": "forms",
      "featured": true,
      "tech": [
        "Laravel",
        "Vue.js",
        "Next.js",
        "Node.js",
        "PostgreSQL",
        "MongoDB",
        "Redis",
        "Stripe",
        "AWS"
      ],
      "metrics": [
        {
          "value": "400K+",
          "label": "users"
        },
        {
          "value": "10M+",
          "label": "online exams held"
        }
      ],
      "narrative": [
        "My responsibility was technical ownership within ExpressTech Systems—not ownership of the company or its products.",
        "The work connected customer-facing assessment features with backend reliability, subscriptions and operational support."
      ],
      "role": "Technical lead and full-stack engineer at ExpressTech Systems",
      "status": "Employer product · contribution through September 2026",
      "images": [
        "/images/extendedforms.png",
        "/images/extendedforms-live.jpg"
      ],
      "problem": "Educators need more control over assessments without giving up the familiar Google Forms workflow.",
      "contribution": "I led engineering across product features, performance-critical paths, integrations and ongoing delivery.",
      "decisions": [
        "Improve the busiest user journeys before adding more infrastructure.",
        "Use caching and deliberate data fetching to reduce unnecessary work.",
        "Design proctoring feedback with attention to false positives and student experience."
      ],
      "outcomes": [
        "Production assessment workflows in the Google Workspace ecosystem. Historical product figures are author-reported; they are not independently audited benchmarks.",
        "Performance improvements across high-traffic pages.",
        "Technical leadership across development and product delivery."
      ],
      "imageCaptions": [
        "ExtendedForms product screen from the existing portfolio assets."
      ]
    },
    {
      "slug": "helpdesk-ai",
      "name": "HelpDesk AI",
      "category": "AI SaaS",
      "kind": "Personal build",
      "oneLiner": "Multi-tenant AI support agent platform with threshold-based auto-reply — built solo, on weekends.",
      "motif": "inbox",
      "featured": false,
      "tech": [
        "Node.js",
        "IMAP IDLE",
        "AES-256",
        "JWT",
        "PostgreSQL"
      ],
      "metrics": [],
      "narrative": [
        "Multi-tenant AI support agent platform with threshold-based auto-reply — built solo, on weekends.",
        "My contribution: Solo build — architecture, security, backend, on weekends."
      ],
      "role": "Solo build — architecture, security, backend, on weekends",
      "status": "Live — weekend project turned real platform",
      "images": [
        "/images/helpdesk_1.png",
        "/images/helpdesk_2.png",
        "/images/helpdesk_3.png",
        "/images/helpdesk_4.png"
      ],
      "problem": "Multi-tenant AI support agent platform with threshold-based auto-reply — built solo, on weekends.",
      "contribution": "Solo build — architecture, security, backend, on weekends",
      "decisions": [],
      "outcomes": []
    },
    {
      "slug": "zwopr",
      "name": "ZWOPR Admin Solution",
      "url": "https://app.zwopr.com",
      "category": "B2B SaaS",
      "kind": "Client project",
      "oneLiner": "A content management workspace for a Germany-based client.",
      "motif": "cms",
      "featured": true,
      "tech": [
        "Next.js",
        "NestJS",
        "GraphQL",
        "Hasura Cloud",
        "PostgreSQL"
      ],
      "metrics": [],
      "narrative": [
        "This was client delivery for ZWOPR, combining a practical administration interface with its backend data workflows."
      ],
      "role": "Full-stack delivery — Next.js frontend, NestJS/GraphQL backend",
      "status": "Delivered",
      "images": [
        "/images/zwopr_2.png",
        "/images/zwopr_3.png",
        "/images/zwopr_4.png",
        "/images/zwopr_5.png",
        "/images/zwopr_6.png",
        "/images/zwopr_7.png",
        "/images/zwopr_1.png"
      ],
      "problem": "Content teams need to manage a growing, multilingual collection without losing track of the publishing workflow.",
      "contribution": "I delivered the full-stack admin experience with Next.js, NestJS and GraphQL.",
      "decisions": [
        "Organize the admin experience around the content team's tasks.",
        "Use a GraphQL-backed data layer to connect the interface with the content catalog.",
        "Keep reusable interface patterns consistent across the workspace."
      ],
      "outcomes": [
        "A dedicated content administration workspace.",
        "Connected frontend and backend delivery.",
        "Support for multilingual content operations."
      ]
    },
    {
      "slug": "ebaggagedrop",
      "name": "eBaggageDrop",
      "category": "IoT / AI",
      "kind": "Client project",
      "oneLiner": "AI kiosk for automated baggage measurement, deployed across 15+ airports.",
      "motif": "kiosk",
      "featured": false,
      "tech": [
        "React.js",
        "TensorFlow",
        "OpenCV",
        "Node.js",
        "Socket.io",
        "AWS"
      ],
      "metrics": [],
      "narrative": [
        "AI kiosk for automated baggage measurement, deployed across 15+ airports.",
        "My contribution: Frontend + AI processing integration."
      ],
      "role": "Frontend + AI processing integration",
      "status": "Deployed",
      "problem": "AI kiosk for automated baggage measurement, deployed across 15+ airports.",
      "contribution": "Frontend + AI processing integration",
      "decisions": [],
      "outcomes": []
    },
    {
      "slug": "webstack",
      "name": "WebStack",
      "category": "SaaS",
      "kind": "Client project",
      "oneLiner": "Multi-tenant project management and CRM built for agencies.",
      "motif": "pm",
      "featured": false,
      "tech": [
        "Next.js",
        "TypeScript",
        "NestJS",
        "PostgreSQL"
      ],
      "metrics": [],
      "narrative": [
        "Multi-tenant project management and CRM built for agencies.",
        "My contribution: Full-stack architecture and delivery."
      ],
      "role": "Full-stack architecture and delivery",
      "status": "Delivered — public demo currently unavailable",
      "problem": "Multi-tenant project management and CRM built for agencies.",
      "contribution": "Full-stack architecture and delivery",
      "decisions": [],
      "outcomes": []
    },
    {
      "slug": "bps-trading",
      "name": "BPS Trading Platform",
      "category": "Fintech",
      "kind": "Founder venture",
      "oneLiner": "Real-time crypto trading platform, built under MB Systems.",
      "motif": "ticker",
      "featured": true,
      "tech": [
        "React.js",
        "Node.js",
        "Binance API",
        "Socket.io",
        "MongoDB",
        "AWS"
      ],
      "metrics": [],
      "narrative": [
        "Built through MB Systems alongside HQ Infosystem under a service and collaboration arrangement. Historical product figures are author-reported."
      ],
      "role": "Founder & lead engineer",
      "status": "Built under MB Systems · mid-2020–mid-2022; studio closed",
      "frame": "phone",
      "images": [
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
        "/images/bps_17.png"
      ],
      "problem": "Real-time crypto trading platform, built under MB Systems.",
      "contribution": "Founder & lead engineer",
      "decisions": [],
      "outcomes": []
    },
    {
      "slug": "intuitive-surgical-dashboard",
      "name": "Intuitive Surgical Dashboard",
      "url": "https://intuitive.com",
      "category": "Medical Tech",
      "kind": "Client project",
      "oneLiner": "Enterprise dashboard engineering for surgical-system workflows.",
      "motif": "medical",
      "featured": false,
      "tech": [
        "React",
        "TypeScript",
        "Liferay",
        "SSO integration"
      ],
      "metrics": [],
      "narrative": [
        "This case study describes my engineering contribution, not ownership of the underlying product. No hospital-count, uptime or compliance certification is asserted here."
      ],
      "role": "Frontend dashboard and integration engineering",
      "status": "Enterprise project experience",
      "images": [],
      "problem": "Enterprise users need clear interfaces for operational data and connected workflows.",
      "contribution": "I contributed dashboard and integration work within an enterprise delivery environment.",
      "decisions": [],
      "outcomes": [
        "Enterprise interface and integration experience."
      ],
      "visualNote": "Internal healthcare screens are not republished here. Project context is described without exposing operational data."
    },
    {
      "slug": "kexy-restaurants",
      "name": "Kexy Restaurants",
      "url": "https://getkexy.com",
      "category": "SaaS",
      "kind": "Client project",
      "oneLiner": "Restaurant management platform with ads and multi-vendor payouts.",
      "motif": "restaurant",
      "featured": false,
      "tech": [
        "CakePHP",
        "MySQL",
        "Redis",
        "Stripe Connect",
        "Twilio",
        "AWS"
      ],
      "metrics": [],
      "narrative": [
        "Restaurant management platform with ads and multi-vendor payouts.",
        "My contribution: Backend & payments architecture."
      ],
      "role": "Backend & payments architecture",
      "status": "Live",
      "images": [
        "/images/kexy.png"
      ],
      "problem": "Restaurant management platform with ads and multi-vendor payouts.",
      "contribution": "Backend & payments architecture",
      "decisions": [],
      "outcomes": []
    },
    {
      "slug": "hey-buddy",
      "name": "Hey Buddy",
      "url": "https://heybuddy.io",
      "category": "Mobile App",
      "kind": "Client project",
      "oneLiner": "Pet GPS tracking and health monitoring app.",
      "motif": "petmap",
      "featured": false,
      "tech": [
        "Vue.js",
        "React Native",
        "Firebase",
        "Mapbox",
        "NFC APIs"
      ],
      "metrics": [],
      "narrative": [
        "Pet GPS tracking and health monitoring app.",
        "My contribution: Mobile & mapping integration."
      ],
      "role": "Mobile & mapping integration",
      "status": "Live",
      "frame": "phone",
      "images": [
        "/images/heybuddy_4.png",
        "/images/heybuddy_1.jpeg",
        "/images/heybuddy_5.jpeg"
      ],
      "problem": "Pet GPS tracking and health monitoring app.",
      "contribution": "Mobile & mapping integration",
      "decisions": [],
      "outcomes": [],
      "imageCaptions": [
        "Mobile app launch screen.",
        "Product welcome and app download.",
        "Account and pet-profile onboarding."
      ]
    },
    {
      "slug": "rightful",
      "name": "Rightful",
      "url": "https://rightful.com.au",
      "category": "Legal Tech",
      "kind": "Client project",
      "oneLiner": "Australia's legal services platform, with real-time video consultation.",
      "motif": "legal",
      "featured": false,
      "tech": [
        "React",
        "TypeScript",
        "WebSocket",
        "Stripe"
      ],
      "metrics": [],
      "narrative": [
        "Frontend work for a legal-services platform, including real-time consultation workflows and accessible interaction design."
      ],
      "role": "Frontend architecture & accessibility",
      "status": "Live",
      "images": [
        "/images/rightful.png"
      ],
      "problem": "Australia's legal services platform, with real-time video consultation.",
      "contribution": "Frontend architecture & accessibility",
      "decisions": [],
      "outcomes": []
    },
    {
      "slug": "collahead",
      "name": "Collahead — Truck Driver Tracking",
      "category": "Logistics / Mobility",
      "kind": "Client project",
      "oneLiner": "React Native driver app with live GPS tracking, discontinued before launch.",
      "motif": "map",
      "featured": false,
      "tech": [
        "React Native",
        "Mapbox Directions API",
        "Node.js"
      ],
      "metrics": [],
      "narrative": [
        "React Native driver app with live GPS tracking, discontinued before launch.",
        "My contribution: Mobile app & live-tracking engineering."
      ],
      "role": "Mobile app & live-tracking engineering",
      "status": "Discontinued before launch",
      "problem": "React Native driver app with live GPS tracking, discontinued before launch.",
      "contribution": "Mobile app & live-tracking engineering",
      "decisions": [],
      "outcomes": []
    },
    {
      "slug": "freelance-agency-work",
      "name": "Freelance / Agency Client Work",
      "category": "Freelance",
      "kind": "Freelance",
      "oneLiner": "Independent client work outside the full-time role — e-commerce and AI agent builds.",
      "motif": "freelance",
      "featured": false,
      "tech": [
        "Shopify",
        "Next.js",
        "Node.js",
        "AI Agents"
      ],
      "metrics": [],
      "narrative": [
        "Independent client work outside the full-time role — e-commerce and AI agent builds.",
        "My contribution: Independent contractor."
      ],
      "role": "Independent contractor",
      "status": "Ongoing",
      "problem": "Independent client work outside the full-time role — e-commerce and AI agent builds.",
      "contribution": "Independent contractor",
      "decisions": [],
      "outcomes": []
    },
    {
      "slug": "vocalxi",
      "name": "VocalXI",
      "url": "https://vocalxi.com",
      "category": "Voice AI",
      "kind": "Founder venture",
      "motif": "forms",
      "featured": true,
      "oneLiner": "A voice-first way to answer forms through a guided conversation.",
      "role": "Founder and product engineer · AscendXI",
      "status": "Pre-launch · Google Forms connector in staging; telephone calling planned",
      "tech": [
        "TypeScript",
        "Next.js",
        "Voice AI",
        "Form workflows"
      ],
      "metrics": [],
      "problem": "Forms can be time-consuming to read and complete, especially when a conversation would feel more natural.",
      "contribution": "I am building the product experience that turns form questions into a guided voice interaction and brings the answers back into a structured workflow.",
      "decisions": [
        "Start with the form's questions and preserve their intent.",
        "Let people review and confirm answers instead of silently submitting them.",
        "Separate browser voice capabilities from telephone calling and integrations still in development."
      ],
      "outcomes": [
        "A browser voice-to-forms experience under development.",
        "Product design, application engineering and voice experience in one founder-led project."
      ],
      "narrative": [
        "VocalXI is my own product under AscendXI. It explores voice as an interface for interviews, intake, feedback and other form-based tasks.",
        "The product is pre-launch. Google Forms integration is in staging, telephone calling is planned, and production readiness has not been verified."
      ],
      "images": [
        "/images/vocalxi-home.jpg",
        "/images/vocalxi-review.jpg",
        "/images/captured/vocalxi-desktop.webp",
        "/images/captured/vocalxi-mobile.webp"
      ],
      "imageCaptions": [
        "Public product website.",
        "Answer review preview.",
        "VocalXI public website · desktop capture. Marketing page, not an authenticated product dashboard.",
        "VocalXI public website · mobile capture. Marketing page, not an authenticated product dashboard."
      ]
    }
  ],
  "selectedWork": [
    {
      "slug": "quzo-ai",
      "name": "Quzo.ai",
      "url": "https://quzo.ai",
      "category": "AI SaaS",
      "kind": "Employer product",
      "oneLiner": "An ExpressTech assessment platform built for enterprise ExtendedForms clients.",
      "motif": "proctor",
      "featured": false,
      "tech": [
        "Next.js",
        "React",
        "Node.js",
        "OpenAI",
        "Claude",
        "Gemini",
        "PostgreSQL",
        "pgvector",
        "Stripe"
      ],
      "metrics": [],
      "narrative": [
        "Quzo.ai is presented here as employer-product engineering. Technical responsibility does not imply founder or legal ownership.",
        "The product combines AI-assisted authoring with the practical work of administering assessments and understanding the results."
      ],
      "role": "Full-stack and AI engineering at ExpressTech Systems",
      "status": "Employer product · contribution through September 2026",
      "images": [
        "/images/quzo_dashboard.png",
        "/images/quzo_form_screen.png",
        "/images/quzo_exam_screen.png",
        "/images/quzo_response_report.png",
        "/images/quzo_in_app_billing.png",
        "/images/quzo_landing_page.png"
      ],
      "problem": "Creating and running an assessment involves more than generating a list of questions: educators also need delivery, controls and useful reporting.",
      "contribution": "I created Quzo at ExpressTech Systems, taking responsibility for full-stack implementation through its recent launch. Its modular-monolith architecture was designed for enterprise clients in the ExtendedForms context.",
      "decisions": [
        "Connect question generation to the assessment workflow rather than treating AI as a separate chat window.",
        "Support different model providers behind a shared credit system.",
        "Use modular-monolith applications with clear boundaries between administration and exam delivery.",
        "Keep exam delivery, proctoring and reporting understandable for both educators and respondents."
      ],
      "outcomes": [
        "An integrated question-to-assessment workflow.",
        "Multi-provider AI integration and credit management.",
        "Product screens covering setup, delivery, reports and billing."
      ],
      "imageCaptions": [
        "Assessment dashboard.",
        "Assessment setup and question workflow.",
        "Respondent exam experience.",
        "Response reporting.",
        "In-app billing and credits.",
        "Public product introduction."
      ]
    },
    {
      "slug": "vocalxi",
      "name": "VocalXI",
      "url": "https://vocalxi.com",
      "category": "Voice AI",
      "kind": "Founder venture",
      "motif": "forms",
      "featured": true,
      "oneLiner": "A voice-first way to answer forms through a guided conversation.",
      "role": "Founder and product engineer · AscendXI",
      "status": "Pre-launch · Google Forms connector in staging; telephone calling planned",
      "tech": [
        "TypeScript",
        "Next.js",
        "Voice AI",
        "Form workflows"
      ],
      "metrics": [],
      "problem": "Forms can be time-consuming to read and complete, especially when a conversation would feel more natural.",
      "contribution": "I am building the product experience that turns form questions into a guided voice interaction and brings the answers back into a structured workflow.",
      "decisions": [
        "Start with the form's questions and preserve their intent.",
        "Let people review and confirm answers instead of silently submitting them.",
        "Separate browser voice capabilities from telephone calling and integrations still in development."
      ],
      "outcomes": [
        "A browser voice-to-forms experience under development.",
        "Product design, application engineering and voice experience in one founder-led project."
      ],
      "narrative": [
        "VocalXI is my own product under AscendXI. It explores voice as an interface for interviews, intake, feedback and other form-based tasks.",
        "The product is pre-launch. Google Forms integration is in staging, telephone calling is planned, and production readiness has not been verified."
      ],
      "images": [
        "/images/vocalxi-home.jpg",
        "/images/vocalxi-review.jpg",
        "/images/captured/vocalxi-desktop.webp",
        "/images/captured/vocalxi-mobile.webp"
      ],
      "imageCaptions": [
        "Public product website.",
        "Answer review preview.",
        "VocalXI public website · desktop capture. Marketing page, not an authenticated product dashboard.",
        "VocalXI public website · mobile capture. Marketing page, not an authenticated product dashboard."
      ]
    },
    {
      "slug": "extendedforms-io",
      "name": "ExtendedForms.io",
      "url": "https://extendedforms.io",
      "category": "B2B SaaS",
      "kind": "Employer product",
      "oneLiner": "Timed assessments, proctoring and reporting built around Google Forms.",
      "motif": "forms",
      "featured": true,
      "tech": [
        "Laravel",
        "Vue.js",
        "Next.js",
        "Node.js",
        "PostgreSQL",
        "MongoDB",
        "Redis",
        "Stripe",
        "AWS"
      ],
      "metrics": [
        {
          "value": "400K+",
          "label": "users"
        },
        {
          "value": "10M+",
          "label": "online exams held"
        }
      ],
      "narrative": [
        "My responsibility was technical ownership within ExpressTech Systems—not ownership of the company or its products.",
        "The work connected customer-facing assessment features with backend reliability, subscriptions and operational support."
      ],
      "role": "Technical lead and full-stack engineer at ExpressTech Systems",
      "status": "Employer product · contribution through September 2026",
      "images": [
        "/images/extendedforms.png",
        "/images/extendedforms-live.jpg"
      ],
      "problem": "Educators need more control over assessments without giving up the familiar Google Forms workflow.",
      "contribution": "I led engineering across product features, performance-critical paths, integrations and ongoing delivery.",
      "decisions": [
        "Improve the busiest user journeys before adding more infrastructure.",
        "Use caching and deliberate data fetching to reduce unnecessary work.",
        "Design proctoring feedback with attention to false positives and student experience."
      ],
      "outcomes": [
        "Production assessment workflows in the Google Workspace ecosystem. Historical product figures are author-reported; they are not independently audited benchmarks.",
        "Performance improvements across high-traffic pages.",
        "Technical leadership across development and product delivery."
      ],
      "imageCaptions": [
        "ExtendedForms product screen from the existing portfolio assets."
      ]
    }
  ],
  "expertise": [
    {
      "number": "01",
      "title": "Interface",
      "stack": "React · Next.js · TypeScript",
      "description": "Clear, responsive experiences built around what people need to do.",
      "example": "Explore the ZWOPR workspace",
      "href": "/projects/zwopr"
    },
    {
      "number": "02",
      "title": "System",
      "stack": "Node.js · PostgreSQL · Redis",
      "description": "APIs, data workflows and reliable product foundations behind the interface.",
      "example": "Explore ExtendedForms",
      "href": "/projects/extendedforms-io"
    },
    {
      "number": "03",
      "title": "Intelligence",
      "stack": "Applied AI · RAG · Voice",
      "description": "AI capabilities connected to a useful workflow—not added just for a demo.",
      "example": "Explore VocalXI",
      "href": "/projects/vocalxi"
    }
  ]
}
```

## projects

Source: src/data/projects.ts

```json
{
  "projects": [
    {
      "slug": "jewelxi",
      "name": "Jewelxi",
      "url": "https://jewelxi.vercel.app/",
      "category": "E-commerce",
      "kind": "Personal build",
      "oneLiner": "A jewellery storefront with a filterable catalog, custom design enquiries, and an interactive 3D product study.",
      "motif": "freelance",
      "featured": true,
      "techLabel": "Features",
      "tech": [
        "E-commerce",
        "3D interfaces",
        "Catalog filtering",
        "Test checkout"
      ],
      "metrics": [],
      "narrative": [
        "Jewelxi brings the storefront, product catalog, and custom design enquiry into one jewellery shopping experience. The public preview includes category and material filters, product search, multiple display currencies, and detailed product pages.",
        "The visual work includes a scroll-driven 3D pendant study and a separate inspiration gallery. The catalog includes search, category filters, material filters, and sorting.",
        "The site is currently in public preview, with an illustrative collection and test checkout."
      ],
      "role": "E-commerce development and interactive product presentation",
      "status": "Public preview — test checkout",
      "images": [
        "/images/jewelxi-home.jpg",
        "/images/jewelxi-shop.jpg"
      ]
    },
    {
      "slug": "vocalxi",
      "name": "VocalXI",
      "url": "https://vocalxi.com",
      "category": "Voice AI / Personal product",
      "kind": "Founder venture",
      "oneLiner": "My voice-form product: share a browser link, collect spoken answers, and let respondents review before submitting.",
      "motif": "proctor",
      "featured": true,
      "techLabel": "Features",
      "tech": [
        "Browser voice agents",
        "Form builder",
        "Google Forms connector (staging)",
        "Response review"
      ],
      "metrics": [],
      "narrative": [
        "VocalXI is a product I am building personally. It turns a set of form questions into a browser voice conversation, so respondents can speak their answers instead of filling every field by hand.",
        "The workflow starts with native forms or a Google Forms connection, continues through a shareable respondent link, and ends with an answer review before submission. The product also includes a workspace for forms and responses.",
        "VocalXI is pre-launch, with browser voice workflows in development and the Google Forms connector in staging. Telephone calling is planned; production readiness has not been verified."
      ],
      "role": "Personal product — building and developing VocalXI",
      "status": "Pre-launch · browser voice in development; Google Forms connector in staging; telephone calling planned",
      "images": [
        "/images/vocalxi-home.jpg",
        "/images/vocalxi-review.jpg"
      ]
    },
    {
      "slug": "quzo-ai",
      "name": "Quzo.ai",
      "url": "https://quzo.ai",
      "category": "AI SaaS",
      "kind": "Employer product",
      "oneLiner": "AI-powered quizzes and proctored exams, built from idea to production.",
      "motif": "proctor",
      "featured": false,
      "tech": [
        "Next.js",
        "React",
        "Node.js",
        "OpenAI",
        "Claude",
        "Gemini",
        "PostgreSQL",
        "pgvector",
        "Stripe"
      ],
      "metrics": [
        {
          "value": "30s",
          "label": "question creation, down from 30 min"
        },
        {
          "value": "3",
          "label": "AI providers, one credit system"
        }
      ],
      "narrative": [
        "I created Quzo.ai at ExpressTech Systems as a modular-monolith assessment platform for enterprise clients in the ExtendedForms context. My work covers the application, the AI integrations, the credit system, and deployment.",
        "The credit system routes tasks across OpenAI, Claude, and Gemini based on the task and its cost. A retrieval pipeline using pgvector supports question-bank generation, reducing the recorded authoring time from around 30 minutes to 30 seconds.",
        "The exam workflow includes proctoring and response reporting. I have also developed photo, video, and conversation features as smaller experiments within the product."
      ],
      "role": "Senior Software Engineer at ExpressTech Systems; full-stack implementation and technical direction",
      "status": "Recently launched employer product · contribution through September 2026",
      "images": [
        "/images/quzo_landing_page.png",
        "/images/quzo_dashboard.png",
        "/images/quzo_exam_screen.png",
        "/images/quzo_form_screen.png",
        "/images/quzo_response_report.png",
        "/images/quzo_in_app_billing.png"
      ]
    },
    {
      "slug": "extendedforms-io",
      "name": "ExtendedForms.io",
      "url": "https://extendedforms.io",
      "category": "B2B SaaS",
      "kind": "Employer product",
      "oneLiner": "Google Forms analytics and AI extension platform, inside the Google Workspace ecosystem.",
      "motif": "forms",
      "featured": true,
      "tech": [
        "Laravel",
        "Vue.js",
        "Next.js",
        "Node.js",
        "PostgreSQL",
        "MongoDB",
        "Redis",
        "Stripe",
        "AWS"
      ],
      "metrics": [
        {
          "value": "400K+",
          "label": "users"
        },
        {
          "value": "579K",
          "label": "forms analyzed"
        },
        {
          "value": "10M+",
          "label": "online exams held"
        },
        {
          "value": "3x",
          "label": "revenue growth"
        }
      ],
      "narrative": [
        "At ExpressTech, I led engineering on ExtendedForms.io: architecture, feature delivery, performance, and production support.",
        "I rebuilt performance-critical paths to reduce page load from 3.2 seconds to 1.2 seconds. On a separate high-traffic page, caching and TanStack Query reduced loading from 30–35 seconds to around 5–6 seconds.",
        "I also developed AI Watchers with face detection for exam proctoring. The implementation needed to account for false positives as well as suspicious activity."
      ],
      "role": "Engineering leadership at ExpressTech — architecture, performance, AI features and delivery",
      "status": "Live — 400K+ users and growing",
      "images": [
        "/images/extendedforms.png",
        "/images/extendedforms-live.jpg"
      ]
    },
    {
      "slug": "helpdesk-ai",
      "name": "HelpDesk AI",
      "category": "AI SaaS",
      "kind": "Personal build",
      "oneLiner": "Multi-tenant AI support agent platform with threshold-based auto-reply — built solo, on weekends.",
      "motif": "inbox",
      "featured": false,
      "tech": [
        "Node.js",
        "IMAP IDLE",
        "AES-256",
        "JWT",
        "PostgreSQL"
      ],
      "metrics": [
        {
          "value": "~90%",
          "label": "less effort for eligible ticket types (author-reported)"
        },
        {
          "value": "hours",
          "label": "resolution, down from 1–2 days"
        },
        {
          "value": "100%",
          "label": "weekend-built"
        }
      ],
      "narrative": [
        "Nobody assigned this. Built entirely on weekends alongside a demanding full-time role, because most support tickets follow recognizable patterns, and a well-designed system can resolve or route them instantly instead of making a customer wait in a queue.",
        "Multi-tenant from day one — per-client subdomains, JWT-based data isolation, AES-256 encrypted mailbox credentials, and a dedicated WatcherManager reliably watching each connected mailbox over IMAP without dropped messages or resource leaks.",
        "None of that complexity was required by a contract. It's there because a year and a half of thinking like an attacker on Kali Linux made it hard to design credential handling any other way — and because a weekend project with no committee in the middle is where the cleanest decisions get made."
      ],
      "role": "Solo build — architecture, security, backend, on weekends",
      "status": "Live — weekend project turned real platform",
      "images": [
        "/images/helpdesk_1.png",
        "/images/helpdesk_2.png",
        "/images/helpdesk_3.png",
        "/images/helpdesk_4.png"
      ]
    },
    {
      "slug": "zwopr",
      "name": "ZWOPR Admin Solution",
      "url": "https://app.zwopr.com",
      "category": "B2B SaaS",
      "kind": "Client project",
      "oneLiner": "AI-powered social content management system, built for a German company.",
      "motif": "cms",
      "featured": true,
      "tech": [
        "Next.js",
        "NestJS",
        "GraphQL",
        "Hasura Cloud",
        "PostgreSQL"
      ],
      "metrics": [
        {
          "value": "6 mo",
          "label": "delivery timeline"
        },
        {
          "value": "70%",
          "label": "less content creation time"
        },
        {
          "value": "100K+",
          "label": "content items, 3 languages"
        }
      ],
      "narrative": [
        "A social CMS delivered in six months, cutting content creation time by 70% across more than 100,000 content items in three languages — GraphQL over Hasura Cloud keeping the admin layer fast as the catalog scaled."
      ],
      "role": "Full-stack delivery — Next.js frontend, NestJS/GraphQL backend",
      "status": "Delivered",
      "images": [
        "/images/zwopr_1.png",
        "/images/zwopr_2.png",
        "/images/zwopr_3.png",
        "/images/zwopr_4.png",
        "/images/zwopr_5.png",
        "/images/zwopr_6.png",
        "/images/zwopr_7.png"
      ]
    },
    {
      "slug": "ebaggagedrop",
      "name": "eBaggageDrop",
      "category": "IoT / AI",
      "kind": "Client project",
      "oneLiner": "AI kiosk for automated baggage measurement, deployed across 15+ airports.",
      "motif": "kiosk",
      "featured": false,
      "tech": [
        "React.js",
        "TensorFlow",
        "OpenCV",
        "Node.js",
        "Socket.io",
        "AWS"
      ],
      "metrics": [
        {
          "value": "15+",
          "label": "airports"
        },
        {
          "value": "99.2%",
          "label": "measurement accuracy"
        },
        {
          "value": "<500ms",
          "label": "AI processing time"
        },
        {
          "value": "5M+",
          "label": "baggage items processed"
        }
      ],
      "narrative": [
        "Computer vision at the edge of a kiosk, not a lab: TensorFlow and OpenCV measuring luggage in real time, streamed over Socket.io, tuned until sub-500ms processing held up at 99.2% accuracy across five million-plus bags."
      ],
      "role": "Frontend + AI processing integration",
      "status": "Deployed"
    },
    {
      "slug": "webstack",
      "name": "WebStack",
      "category": "SaaS",
      "kind": "Client project",
      "oneLiner": "Multi-tenant project management and CRM built for agencies.",
      "motif": "pm",
      "featured": false,
      "tech": [
        "Next.js",
        "TypeScript",
        "NestJS",
        "PostgreSQL"
      ],
      "metrics": [
        {
          "value": "100+",
          "label": "agencies"
        },
        {
          "value": "500K+",
          "label": "tasks tracked"
        }
      ],
      "narrative": [
        "Subdomain-based tenant isolation via JWT and RFC-compliant security standards — the same isolation discipline that shows up in HelpDesk AI, applied to a project-management product now running 500K+ tasks across 100+ agencies."
      ],
      "role": "Full-stack architecture and delivery",
      "status": "Delivered — public demo currently unavailable"
    },
    {
      "slug": "bps-trading",
      "name": "BPS Trading Platform",
      "category": "Fintech",
      "kind": "Founder venture",
      "oneLiner": "Real-time crypto trading platform, built under MB Systems.",
      "motif": "ticker",
      "featured": true,
      "tech": [
        "React.js",
        "Node.js",
        "Binance API",
        "Socket.io",
        "MongoDB",
        "AWS"
      ],
      "metrics": [
        {
          "value": "10K+",
          "label": "users"
        },
        {
          "value": "$2M+",
          "label": "trading volume"
        },
        {
          "value": "1000+",
          "label": "concurrent WebSocket connections"
        }
      ],
      "narrative": [
        "Live multi-pair order streaming over more than a thousand concurrent WebSocket connections — built during the MB Systems period, the technical high point of a venture that ultimately didn't survive the studio around it."
      ],
      "role": "Founder & lead engineer",
      "status": "Built under MB Systems · mid-2020–mid-2022; studio closed",
      "frame": "phone",
      "images": [
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
        "/images/bps_17.png"
      ]
    },
    {
      "slug": "intuitive-surgical-dashboard",
      "name": "Intuitive Surgical Dashboard",
      "url": "https://intuitive.com",
      "category": "Medical Tech",
      "kind": "Client project",
      "oneLiner": "Frontend dashboard for Da Vinci Xi and SP surgical systems.",
      "motif": "medical",
      "featured": false,
      "tech": [
        "React",
        "TypeScript",
        "Liferay",
        "SSO integration"
      ],
      "metrics": [],
      "narrative": [
        "Contributed React/TypeScript dashboard features and SSO integration within a Liferay-based enterprise environment."
      ],
      "role": "Frontend dashboard and integration engineering",
      "status": "Enterprise client contribution",
      "images": [
        "/images/intuitive.png",
        "/images/intuitive_dashboard.png",
        "/images/intuitive_dashboard_1.png"
      ]
    },
    {
      "slug": "kexy-restaurants",
      "name": "Kexy Restaurants",
      "url": "https://getkexy.com",
      "category": "SaaS",
      "kind": "Client project",
      "oneLiner": "Restaurant management platform with ads and multi-vendor payouts.",
      "motif": "restaurant",
      "featured": false,
      "tech": [
        "CakePHP",
        "MySQL",
        "Redis",
        "Stripe Connect",
        "Twilio",
        "AWS"
      ],
      "metrics": [
        {
          "value": "500+",
          "label": "restaurants"
        },
        {
          "value": "$50M+",
          "label": "order volume"
        },
        {
          "value": "15–20%",
          "label": "MoM revenue growth"
        }
      ],
      "narrative": [
        "Multi-vendor payouts over Stripe Connect for 500+ restaurants moving $50M+ in orders — the same payout discipline first built at HQ Infosystem, at restaurant-industry scale."
      ],
      "role": "Backend & payments architecture",
      "status": "Live",
      "images": [
        "/images/kexy.png"
      ]
    },
    {
      "slug": "hey-buddy",
      "name": "Hey Buddy",
      "url": "https://heybuddy.io",
      "category": "Mobile App",
      "kind": "Client project",
      "oneLiner": "Pet GPS tracking and health monitoring app.",
      "motif": "petmap",
      "featured": false,
      "tech": [
        "Vue.js",
        "React Native",
        "Firebase",
        "Mapbox",
        "NFC APIs"
      ],
      "metrics": [
        {
          "value": "50K+",
          "label": "downloads"
        },
        {
          "value": "$500K",
          "label": "ARR"
        },
        {
          "value": "4.6/5",
          "label": "rating, 92% 30-day retention"
        }
      ],
      "narrative": [
        "Mapbox-driven live tracking and NFC-based tagging, tuned until 92% of users were still opening the app 30 days later — retention, in a pet-tracking app, is trust made visible."
      ],
      "role": "Mobile & mapping integration",
      "status": "Live",
      "frame": "phone",
      "images": [
        "/images/heybuddy_1.jpeg",
        "/images/heybuddy_2.png",
        "/images/heybuddy_3.png",
        "/images/heybuddy_4.png",
        "/images/heybuddy_5.jpeg"
      ]
    },
    {
      "slug": "rightful",
      "name": "Rightful",
      "url": "https://rightful.com.au",
      "category": "Legal Tech",
      "kind": "Client project",
      "oneLiner": "Australia's legal services platform, with real-time video consultation.",
      "motif": "legal",
      "featured": false,
      "tech": [
        "React.js",
        "TypeScript",
        "Python",
        "WebSocket",
        "Stripe"
      ],
      "metrics": [
        {
          "value": "92/100",
          "label": "Lighthouse score"
        },
        {
          "value": "AA",
          "label": "WCAG 2.1 compliant"
        }
      ],
      "narrative": [
        "Real-time video consultations and GIF-based, time-triggered UI animation, built to a 92/100 Lighthouse score and WCAG 2.1 AA — accessibility as a hard requirement, not an afterthought, for a platform handling legal services."
      ],
      "role": "Frontend architecture & accessibility",
      "status": "Live",
      "images": [
        "/images/rightful.png"
      ]
    },
    {
      "slug": "collahead",
      "name": "Collahead — Truck Driver Tracking",
      "category": "Logistics / Mobility",
      "kind": "Client project",
      "oneLiner": "React Native driver app with live GPS tracking, discontinued before launch.",
      "motif": "map",
      "featured": false,
      "tech": [
        "React Native",
        "Mapbox Directions API",
        "Node.js"
      ],
      "metrics": [
        {
          "value": "0",
          "label": "shipped — client discontinued it before launch"
        }
      ],
      "narrative": [
        "Custom Mapbox geofenced triggers for live GPS driver tracking, modeled on Zomato/Blinkit-style delivery tracking, for a New York-based client. The project was discontinued before launch — included here deliberately, because the geofencing engineering was real and the lessons about signal debouncing and GPS drift still apply everywhere else."
      ],
      "role": "Mobile app & live-tracking engineering",
      "status": "Discontinued before launch"
    },
    {
      "slug": "freelance-agency-work",
      "name": "Freelance / Agency Client Work",
      "category": "Freelance",
      "kind": "Freelance",
      "oneLiner": "Independent client work outside the full-time role — e-commerce and AI agent builds.",
      "motif": "freelance",
      "featured": false,
      "tech": [
        "Shopify",
        "Next.js",
        "Node.js",
        "AI Agents"
      ],
      "metrics": [],
      "narrative": [
        "E-commerce storefronts and AI agent builds delivered end to end for local clients — the same weekend-and-evening discipline that produced HelpDesk AI, applied to other people's businesses."
      ],
      "role": "Independent contractor",
      "status": "Ongoing"
    }
  ],
  "flagshipSlugs": [
    "extendedforms-io",
    "quzo-ai",
    "zwopr"
  ]
}
```

## chapters

Source: src/data/chapters.ts

```json
{
  "foreword": {
    "title": "Why I'm Writing This Down",
    "quote": "Close enough to be true, far enough to be useful.",
    "body": [
      "I have spent most of my adult life building things that other people use without ever thinking about the person who built them. A form loads in under a second, an exam runs without a single glitch, a support ticket gets answered before the customer has finished their coffee, and nobody claps. That is what \"it works\" means. The absence of complaint is the applause, and you learn, slowly, to hear it that way.",
      "This is not a story about a straight line. There is a college placement season that went better than I expected, a first job that taught me more than any course did, a pandemic that became an opening instead of a setback, a genuine detour into cybersecurity that never became my career but shaped how I think about every system I've built since, a leadership role I grew into rather than arrived in fully formed, employer products I helped build and lead, independent weekend projects, and a venture that operated from mid-2020 to mid-2022. I'm including that startup in as much detail as the ones that worked, because leaving it out would make this a highlight reel instead of a record."
    ]
  },
  "chapters": [
    {
      "id": "roots",
      "icon": "sprout",
      "number": "I",
      "title": "Roots — Growing Up in Surat",
      "era": "Childhood · Surat",
      "quote": "Surat never taught me that a good product sells itself. It taught me the opposite, every single day.",
      "summary": "Surat's business instinct — build it, sell it, improve it, build the next thing — was the air I grew up in. I didn't come from a family of engineers. I had ordinary access to a computer and an unreasonable amount of patience for staring at a broken thing until it worked.",
      "body": [
        "I did not come from a family of engineers or a school with a famous computer lab. What I had was ordinary access to a computer at a reasonable age, and an unreasonable amount of patience for figuring out why something was not working the way I expected it to. That patience is, in hindsight, most of what the job actually is.",
        "Gujarat's business culture gave me a native comfort with the idea that a product needs a market, not just a clever build. Nobody owes you attention just because you built something interesting. Somebody has to want it.",
        "The most important thing about this period was not any specific skill. It was the formation of a default mode I still operate in today: when something interests me, I do not wait for someone to assign it to me. I start."
      ]
    },
    {
      "id": "distinction-years",
      "icon": "graduation-cap",
      "number": "II",
      "title": "The Distinction Years — College and the Placement Season",
      "era": "Graduated 2022 · GTU, SSGEC",
      "quote": "A 9.0 CGPA didn't make me employable. Four straight years of refusing to cut corners did.",
      "summary": "B.E. in Information Technology, CGPA 9.0/10, First Class with Distinction. Not from one brilliant semester, but from treating consistency, quietly, as a competitive advantage.",
      "body": [
        "My degree and first full-time job overlapped. College required full attendance, while HQ provided flexible working hours; remote study during COVID helped me manage both. I graduated in 2022.",
        "College, for me, was less about any single brilliant class and more about a compounding routine. I was not the student who crammed the night before and pulled off a miracle. I was the student who treated consistency as a competitive advantage.",
        "The placement season is where that accumulation showed its return. It gave me evidence that the way I had chosen to spend my college years mapped to something the market valued; my first employment had already begun in 2018, before graduation in 2022.",
        "Do not wait for placement season to start caring about how you spend your time. By the time it arrives, the work is already done, one way or the other."
      ]
    },
    {
      "id": "cracking-the-code",
      "icon": "code",
      "number": "III",
      "title": "Cracking the Code — DSA, Interviews, and the First Offer",
      "era": "2018 · First offer",
      "quote": "I didn't beat my first interview with talent. I beat it with the same handful of problems, solved two hundred times, until none of them looked new anymore.",
      "summary": "DSA prep was repetition with attention — pattern recognition across arrays, trees, graphs, and dynamic programming until a \"novel\" problem was just a familiar shape in a different costume. Landed the first offer at HQ Infosystem.",
      "body": [
        "A large percentage of the DSA you grind through for interviews will not appear in your daily work in anything like the form you studied it. It still matters enormously, because it's testing whether you can hold a problem in your head, break it into smaller correct pieces, and reason clearly under mild pressure.",
        "I made a habit, well before my real interviews, of talking through problems out loud to an empty room. It felt strange the first several times. By the time I was doing it in front of an actual person, the strangeness had already been spent safely, where nothing was at stake.",
        "Depth beats breadth in the early stages. Explain your thinking before you write a single line of code. Get comfortable being wrong out loud. Treat every rejection as data, not judgment."
      ]
    },
    {
      "id": "learning-to-build",
      "icon": "building",
      "number": "IV",
      "title": "Learning to Build — The HQ Infosystem Years",
      "era": "July 2018 – June 2022 · Backend Developer",
      "quote": "Fifteen client projects taught me the same lesson fifteen times: edtech, logistics, and fintech are the same problem, wearing three different costumes.",
      "summary": "Fifteen-plus full-stack applications across edtech, logistics, fintech, and e-commerce. Payment integrations with Stripe, Razorpay, and Twilio. REST APIs handling 50K+ daily requests. The years where scale stopped being a textbook idea.",
      "body": [
        "I remember the first time I integrated a payment provider properly, rather than just following a tutorial's happy path, and realizing how much of the real work has almost nothing to do with the successful transaction. The successful transaction is the easy ten percent.",
        "I built Stripe Connect multi-vendor payout systems, which forced me to think carefully about money moving between parties. Every edge case stops being theoretical when a bug means someone's actual income.",
        "I cut API response times by 45% through caching and query optimization, and held Jest coverage above 85% on the modules that mattered most. Performance and reliability are not features you add at the end — they're habits you build in from the start."
      ]
    },
    {
      "id": "corona-advantage",
      "icon": "activity",
      "number": "V",
      "title": "The Corona Advantage",
      "era": "2020 – 2021 · The slow period",
      "quote": "A crisis doesn't ask if you're ready. It only asks what you do next.",
      "summary": "Instead of waiting out one of the worst hiring environments in recent memory, I went deeper into frameworks and tools I'd only used at a surface level — no deadline, no client, just depth. The difference showed up later, when the market recovered.",
      "body": [
        "It meant building small things purely to understand them, with no deadline and no client waiting — a completely different kind of learning than building under pressure to ship. None of it produced anything dramatic in the moment.",
        "Any period that looks like a career setback, if you still have your hands and your evenings, is also a period nobody is watching closely. That lack of scrutiny is not a curse. It's room to work on the things you'd otherwise never prioritize.",
        "Slow markets are not the enemy of a career, only the enemy of a passive one."
      ]
    },
    {
      "id": "kali-linux-nights",
      "icon": "terminal",
      "number": "VI",
      "title": "Kali Linux Nights — A Cybersecurity Detour",
      "era": "2021 – 2022 · Nights and weekends",
      "quote": "I fell in love with breaking things a full year before it occurred to me that someone might pay me to do it.",
      "summary": "A self-directed pull toward understanding how systems fail. Top 6% Global Rank on TryHackMe in 2021, Advent of Cyber certified in 2022. Never became the career — became a permanent second lens underneath every architecture decision since.",
      "body": [
        "I started thinking the way an attacker thinks: where does this system trust input it shouldn't, where does this authentication flow have a gap, where does this API leak more than it should to someone patient enough to look.",
        "I never fully crossed over into cybersecurity as a career path, even loving the work. My home situation needed steady, dependable income, not the front-loaded-with-risk economics of independent security research. I kept it as a serious interest instead of a pivot.",
        "When I built HelpDesk AI's mailbox credential handling with AES-256 encryption, that design didn't come purely from best practice. It came from months of Kali Linux nights spent thinking about how credential storage gets exploited when it's built carelessly."
      ]
    },
    {
      "id": "the-jump",
      "icon": "trending-up",
      "number": "VII",
      "title": "The Jump — Becoming a Tech Lead at ExpressTech",
      "era": "2022 – 2026 · Senior Software Engineer / Technical Lead",
      "quote": "Nobody promoted me into leadership. I just started making the decisions nobody else wanted to own, and the title eventually agreed with me.",
      "summary": "The shift from developer to lead isn't a shift in code difficulty — it's a shift in how many decisions other people are waiting on you to make, and how far a wrong one travels. Provided technical direction and mentoring, and improved architecture and performance on high-traffic products.",
      "body": [
        "As an individual contributor, a bad choice mostly costs you time. As a technical lead, a bad choice can cost your whole team time, and if it reaches production, real money and real trust with customers.",
        "I pushed Jest coverage above 90% and layered in Cypress end-to-end tests — not because coverage numbers are inherently meaningful, but because getting a team to care about coverage is really getting them to care about whoever maintains this code next. That cut our bug escape rate by 75%.",
        "Leadership in engineering is mostly the discipline of making the invisible work visible enough that your team can trust it exists."
      ]
    },
    {
      "id": "owning-extendedforms",
      "icon": "sheet",
      "number": "VIII",
      "title": "Leading Engineering on ExtendedForms.io",
      "era": "2022 – 2026 · Engineering leadership at ExpressTech Systems",
      "quote": "400,000+ users experience the work through the product. They only notice when the page loads in 1.2 seconds instead of 3.2.",
      "summary": "ExtendedForms brings timed assessments, proctoring and reporting to Google Forms. At ExpressTech Systems, I led engineering on a platform serving 400K+ users and supporting 10M+ online exams, with responsibility across architecture, performance and delivery.",
      "body": [
        "Technical ownership meant leading architecture, performance and delivery within ExpressTech Systems. It did not mean owning the company or product.",
        "I rebuilt performance-critical paths, taking page load from 3.2s to 1.2s, and later cut our highest-traffic page from 30–35 seconds down to 5–6 using smarter caching and TanStack Query. Nobody filed a ticket demanding it. I noticed it, and treated it as urgent because I was the one who'd live with the consequences of ignoring it.",
        "The feature I'm proudest of is AI Watchers with face detection, protecting exam integrity. It required thinking hard about false positives — about the difference between a feature that's technically accurate and one that's fair to the student on the other end of it."
      ]
    },
    {
      "id": "building-quzo",
      "icon": "sparkles",
      "number": "IX",
      "title": "Building Quzo.ai From Nothing",
      "era": "2022 – 2026 · Full-stack and AI engineering at ExpressTech",
      "quote": "I gave a machine the job of writing exam questions. It took thirty seconds. It used to take thirty minutes, and none of those minutes were mine to spare.",
      "summary": "A recently launched ExpressTech assessment product, built as a modular monolith for enterprise clients in the ExtendedForms context. My work connected the assessment workflow with model-agnostic AI integration across OpenAI, Claude and Gemini.",
      "body": [
        "I built a credit management and optimization system that lets the underlying AI model be selected based on task and cost — rather than locking the whole product to a single provider's pricing curve. I didn't fully appreciate how important that decision was until later.",
        "A retrieval-augmented generation pipeline on pgvector powers AI-generated question banks: what used to take an educator thirty minutes now takes about thirty seconds.",
        "I was an early adopter of AI-native dev tools — v0, Windsurf, Cursor, Antigravity, Claude Code — and set up custom agent rules and workflows so specific agents handle specific functions. The skill wasn't doing the work faster myself. It was getting a capable but not fully autonomous entity to produce reliably good outcomes."
      ]
    },
    {
      "id": "weekends-that-mattered",
      "icon": "inbox",
      "number": "X",
      "title": "Weekends That Mattered — HelpDesk AI and the Side-Project Habit",
      "era": "Weekends · Alongside the full-time role",
      "quote": "Nobody assigned me a support ticket problem. I just couldn't stand watching a customer wait two days for something a weekend could fix.",
      "summary": "A multi-tenant AI support agent platform, built entirely on weekends for no reason except curiosity. Author-reported ~90% less support effort for ticket types it could handle; tickets resolved in hours instead of one to two days.",
      "body": [
        "Most support tickets follow recognizable patterns, and a well-designed system can recognize those patterns and resolve or route them instantly instead of making a customer wait in a queue.",
        "I built it multi-tenant from the start: per-client subdomains, JWT-based data isolation, AES-256 encrypted mailbox credentials, and a dedicated WatcherManager reliably watching each mailbox over IMAP. None of that complexity was required by any contract. I built it that way because anything less wouldn't have been something I was proud to call finished.",
        "A weekend spent building something real is a specific kind of rest for me. There's a particular clarity that comes from being completely, unambiguously in charge, from the first architectural decision to the smallest naming choice."
      ]
    },
    {
      "id": "mb-systems",
      "icon": "flame",
      "number": "XI",
      "title": "MB Systems — Founding, Failing, and What It Taught Me",
      "era": "mid-2020 – mid-2022 · Founder alongside HQ",
      "quote": "A startup doesn't fail in one dramatic moment. It fails the same quiet way it almost succeeds: one ordinary week at a time.",
      "summary": "A venture in Surat, run alongside HQ Infosystem through a service and collaboration arrangement, with 5–6 developers on my projects. Built the BPS crypto trading platform (author-reported 10K+ users, $2M+ volume) and trained interns and trainees. I spent approximately a year winding down responsibly and helping people settle into other jobs before closing.",
      "body": [
        "As an employee, even a technical lead, you're shielded from a lot of market reality by the structure around you. As a founder, there's no structure between you and the market's actual response to what you built. Demand does not arrive because you worked hard.",
        "I took on data and security decisions personally, as the person ultimately accountable. That single shift, from shared accountability to personal accountability, changed how carefully I thought about every technical decision — and it's stayed with me since.",
        "The studio closed because cash runway, the time I could realistically devote alongside a demanding full-time role, and market timing didn't line up. No single dramatic mistake explains it better than that unglamorous combination. I don't regret that period. I'd be lying if I said the ending didn't sting. Both are true."
      ]
    },
    {
      "id": "the-craft",
      "icon": "chart",
      "number": "XII",
      "title": "The Craft — Charts, Maps, and Chasing New Tools",
      "era": "Ongoing",
      "quote": "A chart that lags is the only kind of slow database a user can actually see with their own eyes.",
      "summary": "Years with Highcharts rendering millions of points without grinding to a halt, Mapbox geofencing and live tracking, Three.js for embedded 3D, Framer Motion and Lenis for interface feel. The skill that compounds isn't any one tool — it's becoming fluent in the next one, fast.",
      "body": [
        "A database can be slow in ways a user never sees. A chart's performance is the user's direct, visible experience of whether your engineering is any good — there's nowhere to hide a slow chart.",
        "Building a reliable geofencing system sounds like comparing coordinates. In practice it means accounting for GPS drift, debouncing a signal that flickers across a boundary, and making sure a temporary loss of signal doesn't silently break the whole feature.",
        "The willingness to treat \"I don't know this tool yet\" as a temporary and uninteresting fact, rather than a real barrier, is one of the more important instincts in this entire book."
      ]
    },
    {
      "id": "leading-without-a-title",
      "icon": "users",
      "number": "XIII",
      "title": "Leading Without a Title — Mentorship Lessons",
      "era": "Ongoing · Developer and trainee mentorship",
      "quote": "The fastest way to help someone is to hand them the answer. The only way to actually help them is to resist that urge.",
      "summary": "Good mentorship isn't transferring your own solution to someone else's problem. It's building the muscle in someone else to arrive at solutions like it on their own — even when, especially when, it would be faster to just tell them.",
      "body": [
        "People trust a codebase's standards faster when they can see a leader hold themselves to the same standard first, rather than simply enforce it on others.",
        "Mentoring interns at MB Systems during a genuinely difficult, resource-constrained year taught me the most about patience under pressure — a much harder test of your actual values than mentoring when things are comfortable.",
        "Leadership doesn't require a title. The habits — patience, explaining reasoning rather than just conclusions, modeling the standard rather than only demanding it — are ones you can start building the moment you know something someone else doesn't yet."
      ]
    },
    {
      "id": "whats-next",
      "icon": "compass",
      "number": "XVI",
      "title": "What's Next",
      "era": "Now",
      "quote": "I don't know what I'm building next. I know exactly how I'll start: badly, immediately, and without waiting to feel ready.",
      "summary": "My ExpressTech chapter ended in September 2026, after engineering work on ExtendedForms and the recent launch of Quzo. I am now building VocalXI through AscendXI. MB Systems is closed, and its lessons are still being processed with each new decision. No tidy resolution — just a clear statement of what comes next.",
      "body": [
        "I want to keep building the kind of judgment that comes from thinking like a business owner even when my formal role is purely technical — that dual lens is the source of most of the decisions in this story I'm still glad I made.",
        "I want to keep the security-minded lens from the Kali Linux years alive in everything I build, even though it never became a formal career.",
        "The habit this whole story has really been about: starting things before I'm fully ready, on the theory that readiness is mostly built in the act of starting rather than achieved in advance of it."
      ]
    }
  ]
}
```

## skills

Source: src/data/skills.ts

```json
{
  "skillGroups": [
    {
      "id": "languages",
      "label": "Languages",
      "items": [
        "TypeScript",
        "JavaScript",
        "SQL",
        "PHP",
        "HTML5",
        "CSS3"
      ]
    },
    {
      "id": "historical-languages",
      "label": "Limited historical exposure",
      "items": [
        "Java",
        "Python"
      ]
    },
    {
      "id": "frontend",
      "label": "Frontend",
      "items": [
        "React.js",
        "Next.js",
        "Vue.js",
        "AngularJS",
        "Tailwind CSS",
        "Material-UI",
        "TanStack Query",
        "RxJS"
      ]
    },
    {
      "id": "backend",
      "label": "Backend",
      "items": [
        "Node.js",
        "Express.js",
        "NestJS",
        "Laravel",
        "CakePHP"
      ]
    },
    {
      "id": "mobile",
      "label": "Mobile",
      "items": [
        "React Native"
      ]
    },
    {
      "id": "data",
      "label": "Databases",
      "items": [
        "PostgreSQL",
        "MySQL",
        "MongoDB",
        "Firebase",
        "Redis",
        "pgvector"
      ]
    },
    {
      "id": "cloud",
      "label": "Cloud & DevOps",
      "items": [
        "AWS",
        "Google Cloud",
        "Azure",
        "Vercel",
        "Docker",
        "Kafka",
        "Kubernetes",
        "Load Balancing",
        "Auto-Scaling"
      ]
    },
    {
      "id": "testing",
      "label": "Testing & QA",
      "items": [
        "Jest",
        "Cypress",
        "Lighthouse",
        "OWASP Security Testing",
        "SonarQube"
      ]
    },
    {
      "id": "devtools",
      "label": "CI/CD & Dev Tools",
      "items": [
        "GitHub Actions",
        "GitLab CI",
        "Jenkins",
        "ESLint",
        "Prettier",
        "Husky"
      ]
    },
    {
      "id": "visualization",
      "label": "Visualization & Animation",
      "items": [
        "Highcharts",
        "Mapbox",
        "Three.js",
        "Framer Motion",
        "Lenis",
        "Animate.js"
      ]
    },
    {
      "id": "ai-tools",
      "label": "AI-Native Dev Tools",
      "items": [
        "v0.dev",
        "Windsurf",
        "Cursor",
        "Antigravity",
        "Claude Code"
      ]
    },
    {
      "id": "ai",
      "label": "Applied AI & Adoption",
      "items": [
        "OpenAI",
        "Claude (Anthropic)",
        "Gemini",
        "LLM integration",
        "RAG pipelines with pgvector",
        "Prompt engineering",
        "AI workflow adoption"
      ]
    },
    {
      "id": "business",
      "label": "Third-Party & Business Systems",
      "items": [
        "Stripe",
        "Razorpay",
        "Twilio",
        "Binance API",
        "Google AdSense",
        "CRM",
        "POS",
        "RMS",
        "SRP",
        "ERP"
      ]
    },
    {
      "id": "security",
      "label": "Security & Auth",
      "items": [
        "SSO",
        "JWT-based auth",
        "AES-256 encryption",
        "RFC-compliant security standards"
      ]
    }
  ],
  "deliveryExpertise": [
    {
      "code": "01 / UI",
      "title": "Frontend",
      "detail": "Clear interfaces for real workflows.",
      "tools": "JavaScript · TypeScript · React · Next.js"
    },
    {
      "code": "02 / API",
      "title": "Backend",
      "detail": "APIs, business logic and integrations.",
      "tools": "TypeScript · Node.js · PostgreSQL · Redis"
    },
    {
      "code": "03 / AI",
      "title": "AI integration",
      "detail": "Connect models to product context.",
      "tools": "LLMs · RAG · OpenAI · pgvector"
    },
    {
      "code": "04 / ADOPT",
      "title": "AI adoption",
      "detail": "Make AI useful in day-to-day work.",
      "tools": "Prompt engineering · AI workflows · Claude"
    },
    {
      "code": "05 / SHIP",
      "title": "Systems & deployment",
      "detail": "Design for traffic, reliability and growth.",
      "tools": "System design · AWS · Kafka · Docker"
    },
    {
      "code": "06 / LEAD",
      "title": "Technical leadership",
      "detail": "Technical direction, code reviews and developer mentoring.",
      "tools": "Team management · Mentoring · Product scope"
    }
  ]
}
```

## impact

Source: src/data/impact.ts

```json
{
  "impactMetrics": [
    {
      "label": "Page load",
      "context": "ExtendedForms.io — SSR rebuild + TanStack Query",
      "before": "3.2s",
      "after": "1.2s",
      "pct": 37
    },
    {
      "label": "Worst-case page load",
      "context": "The one page nobody filed a ticket about — he noticed it anyway",
      "before": "~32s",
      "after": "~5.5s",
      "pct": 17
    },
    {
      "label": "Exam question creation",
      "context": "Quzo.ai — AI generation replacing manual authoring by hand",
      "before": "30 min",
      "after": "30 sec",
      "pct": 2
    },
    {
      "label": "Support ticket resolution",
      "context": "HelpDesk AI — author-reported improvement for eligible tickets; weekend build",
      "before": "1–2 days",
      "after": "hours",
      "pct": 8
    },
    {
      "label": "Database response time",
      "context": "Redis caching layer, ExpressTech",
      "before": "800ms",
      "after": "120ms",
      "pct": 15
    },
    {
      "label": "API response time",
      "context": "Caching + query optimization, HQ Infosystem",
      "before": "baseline",
      "after": "−45%",
      "pct": 55
    }
  ],
  "uniquenessBadges": [
    "Technical leadership across employer products",
    "Employer products and independent builds",
    "MB Systems, mid-2020 to mid-2022",
    "8+ years, zero career gaps",
    "Developer mentorship and trainee support"
  ]
}
```

## downloads

Source: src/data/downloads.ts

```json
{
  "downloads": {
    "ebook": {
      "kicker": "The memoir",
      "title": "The Weekend Builder",
      "subtitle": "A Life in Code, Ownership, and the Habit of Starting Again",
      "file": "/downloads/the-weekend-builder.pdf",
      "filename": "The-Weekend-Builder-Bhadreshkumar-Malankiya.pdf",
      "sizeLabel": "480 KiB",
      "pages": 87,
      "stats": [
        "Foreword + 16 chapters",
        "87 pages",
        "~20,000 words"
      ],
      "cta": "Download the book"
    },
    "resume": {
      "kicker": "The résumé",
      "title": "Bhadreshkumar Malankiya",
      "subtitle": "Senior Full-Stack Engineer · Node.js, TypeScript & Applied AI",
      "file": "/downloads/bhadreshkumar-malankiya-resume.pdf",
      "filename": "Bhadreshkumar-Malankiya-Resume.pdf",
      "sizeLabel": "7 KiB",
      "pages": 2,
      "stats": [
        "2 pages",
        "8+ years, condensed"
      ],
      "cta": "Download the résumé"
    }
  }
}
```

## fieldGuides

Source: src/data/fieldGuides.ts

```json
{
  "fieldGuides": [
    {
      "slug": "cracking-dsa-and-interviews",
      "title": "A Field Guide to Cracking DSA and Technical Interviews",
      "eyebrow": "Chapter XIV",
      "quote": "You don't crack an interview in the room. You crack it in the two hundred problems nobody ever watched you solve.",
      "intro": "Written directly to whoever is preparing for their own interviews — the exact things I wish someone had told me plainly, without the vague encouragement that fills most advice on this topic.",
      "sections": [
        {
          "heading": "Start with the shapes, not the problems",
          "body": "There's a genuinely small number of underlying patterns behind the enormous volume of practice problems online: two-pointer techniques, sliding windows, breadth-first and depth-first traversal, dynamic programming built on overlapping subproblems, backtracking. Organize your early practice explicitly around recognizing these shapes underneath unfamiliar descriptions. Pick a pattern, work a cluster of problems on that pattern until recognition is automatic, then move on. Random practice feels productive; structured, pattern-first practice builds transferable recognition far faster."
        },
        {
          "heading": "Talk out loud, every time, starting now",
          "body": "Silent problem-solving and narrated problem-solving are genuinely different skills, and an interview only tests the second. Record yourself narrating a solution occasionally and listen back — almost everyone is surprised how much less clear their spoken reasoning is than it felt inside their own head."
        },
        {
          "heading": "Get comfortable being wrong in front of someone",
          "body": "You will take wrong turns in real interviews. Everyone does. What separates a strong outcome from a weak one is whether you can notice it, say so calmly, and correct course without your composure visibly collapsing. Practice the specific language: \"I'm noticing this approach won't handle this edge case cleanly, let me reconsider\" — said calmly, is a skill in itself."
        },
        {
          "heading": "Understand tradeoffs, not just labels",
          "body": "An interviewer asking about complexity is rarely testing whether you can name it. They're testing whether you understand why it is what it is, and whether you can identify a different approach with a different tradeoff if the constraints changed. Practice by asking what happens to your solution's complexity if the input were ten times larger, or if memory were far more constrained than time."
        },
        {
          "heading": "Mock interviews are not optional",
          "body": "The specific pressure of being watched while thinking has to be practiced directly, the same way public speaking does even by someone who knows their material cold. The discomfort of doing this a handful of times in low-stakes practice is dramatically cheaper than experiencing it for the first time in an interview that actually matters."
        },
        {
          "heading": "Treat rejection as data, not verdict",
          "body": "I did not pass every interview I ever sat for. Nobody who has interviewed extensively has. The engineers who improve fastest extract a specific, actionable lesson from a rejection rather than absorbing it as a broad judgment about their overall ability."
        },
        {
          "heading": "Don't skip system design and behavioral rounds",
          "body": "At a first-job level, system design rounds test whether you can reason clearly about tradeoffs at a small, honest scale — not whether you can architect a global platform. Behavioral rounds test whether you can describe a real situation honestly, with a clear account of what you did and learned. Prepare two or three genuine stories, even from college projects, and tell them clearly rather than searching for a more impressive one."
        }
      ]
    },
    {
      "slug": "landing-your-first-job",
      "title": "A Field Guide to Landing Your First Job",
      "eyebrow": "Chapter XV",
      "quote": "Your first offer isn't proof that you're already excellent. It's only proof that someone was willing to bet you would be.",
      "intro": "Landing a first job is a genuinely different problem than landing a fifth. With no track record to point to, you're asking someone to bet on potential — the entire strategy should be built around making that bet feel safe.",
      "sections": [
        {
          "heading": "Build proof before you need it",
          "body": "A portfolio of real, working projects, even small ones, is worth more than almost anything else you can put in front of a hiring manager who's never met you. It doesn't need to be commercially successful. It needs to demonstrate you can take an idea from nothing to something that runs."
        },
        {
          "heading": "Treat academic performance as compounding, not a single event",
          "body": "A strong record and a good placement outcome don't happen because of anything dramatic in a final semester. They happen from a long, unglamorous accumulation of consistent effort — available to anyone willing to start it early rather than waiting for deadline pressure."
        },
        {
          "heading": "Don't wait for the market to be favorable",
          "body": "A difficult market is a reason to prepare more deliberately, never a reason to prepare less. The gap between people who used a slow period to build and people who paused becomes visible the moment the market recovers."
        },
        {
          "heading": "Talk about projects like responsibilities, not tech-stack trivia",
          "body": "Instead of \"I built a project using React and Node,\" try \"I noticed this specific problem, chose this approach because of this tradeoff, and here's what I'd do differently now.\" That last part — honest reflection on what you'd improve — is disproportionately persuasive."
        },
        {
          "heading": "Apply broadly, prepare narrowly",
          "body": "There's a difference between casting a wide net and treating every application with equally shallow effort. The candidates who stand out did visibly deeper homework on the small number of roles that genuinely mattered to them."
        },
        {
          "heading": "A small, genuine network beats a cold queue",
          "body": "Stay in real touch with classmates, seniors, professors, and anyone who saw your actual work firsthand. A first job, more often than most people admit, arrives through some version of a real relationship rather than a cold application into an anonymous queue."
        },
        {
          "heading": "The offer is the beginning, not the finish line",
          "body": "A first role's most important job is not prestige — it's giving you real, structured exposure to how software actually gets built and shipped under real constraints. Prepare for the interview seriously. Don't mistake the gate for the destination."
        }
      ]
    }
  ]
}
```

## upwork

Source: src/data/upwork.ts

```json
{
  "upwork": {
    "profileUrl": "https://www.upwork.com/freelancers/bhadreshmalankiya",
    "proofImage": "/images/upwork-profile-overview.jpg",
    "stats": [
      {
        "value": 10,
        "prefix": "$",
        "suffix": "K+",
        "label": "total earnings"
      },
      {
        "value": 12,
        "suffix": "",
        "label": "jobs completed"
      },
      {
        "value": 1,
        "suffix": ".2K",
        "label": "hours logged"
      },
      {
        "value": 5,
        "suffix": ".0",
        "label": "avg. rating, every rated job"
      }
    ],
    "verifications": [
      "Identity verified",
      "Payment verified",
      "Military veteran"
    ],
    "bio": [
      "Every job on this profile was paid for out of a client's own pocket — no account manager, no team between us, just the work and whether it held up. Twelve jobs, five-star on every one that left a rating.",
      "The range says as much as the score: PHP/jQuery systems patched on a live deadline, a Shopify app built on Laravel + React, a two-year NextJs admin dashboard, a part-time React/Node/Cloud engagement — the same client-facing discipline that now goes into the AI SaaS and Three.js/Motion UI work below."
    ],
    "quickPraise": [
      "\"Great work.\" — Easy Laravel Task",
      "\"Great as always\" — PHP module build"
    ],
    "skills": [
      "Laravel",
      "React",
      "Next.js",
      "Node.js",
      "Shopify Apps",
      "Vue.js",
      "MySQL",
      "JavaScript"
    ],
    "testimonials": [
      {
        "quote": "Working fluently since the beginning of time. Excellent always",
        "job": "Modification to PHP information system",
        "period": "Nov 2022 – Jan 2023",
        "rating": 5
      },
      {
        "quote": "Excellent as always, Bhadresh is the man",
        "job": "Create/modify functions — PHP information system",
        "period": "Aug – Oct 2022",
        "rating": 5
      },
      {
        "quote": "Tasks are done. Everything is OK with Bhadresh. Great to work with him. Thanks.",
        "response": "Thanks — your satisfaction is everything.",
        "job": "AJAX functionality + button, PHP project",
        "period": "Mar 2022",
        "rating": 5,
        "tags": [
          "Collaborative"
        ]
      },
      {
        "quote": "Excellent job, according to our needs. Fast response. Thanks.",
        "response": "Thank you so much for the feedback.",
        "job": "jQuery/JS/PHP developer — POS system",
        "period": "Nov 2021",
        "rating": 5,
        "tags": [
          "Committed to quality",
          "Reliable"
        ]
      }
    ]
  }
}
```
