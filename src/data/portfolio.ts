import { capturedScreens } from "@/data/captured-screens";
import { projects as archive, type Project } from "@/data/projects";
import { profile } from "@/data/profile";

export const identity = {
  name: "Bhadresh Malankiya",
  role: "Senior Full Stack Engineer · Technical Lead",
  summary:
    "I build and lead SaaS products end to end: frontend, backend, AI features and deployment. Four years leading engineering on ExtendedForms.io (400K+ users) and building Quzo.ai from first commit to launch.",
  email: profile.email,
  site: profile.site,
  location: profile.location,
  resume: "/downloads/bhadresh-malankiya-resume.pdf",
};

export type PortfolioProject = Project & {
  problem: string;
  contribution: string;
  decisions: string[];
  outcomes: string[];
  imageCaptions?: string[];
  visualNote?: string;
};

// Keep historical routes/assets. The presentation layer distinguishes technical
// responsibility from legal ownership and does not promote unverified statistics.
const editorial: Record<string, Partial<PortfolioProject>> = {
  compassrt: {
    imageCaptions: [
      "Live watchlist: two AG Grid tables updating once a second, with green and red flashes on changed cells.",
      "Symbol search over the lookup API, adding a stock to the watchlist and its Socket.IO room.",
      "Sign-in screen. Screens captured from the original code running locally against a simulated price feed.",
    ],
    problem: "Market feeds fire many trades a second. Repainting the screen for each one freezes the table and floods every browser with symbols it never asked for.",
    contribution: "I built the Node.js streaming backend and the React trading grid: one shared upstream socket, RxJS batching on both sides, and Socket.IO rooms so each client only receives the symbols on its watchlist.",
    decisions: [
      "Keep one upstream market socket for everyone, and subscribe a symbol only while someone is watching it.",
      "Buffer trades for one second and send only the newest trade per symbol.",
      "Emit to a Socket.IO room per symbol, so a client never receives data it did not ask for.",
      "Buffer again in the browser and apply AG Grid async transactions by row ID, so only changed rows repaint.",
      "Ship a built-in simulator that fires a tick every 10 ms per symbol to load-test the same path.",
    ],
    outcomes: [
      "A watchlist that stays smooth while trades stream in.",
      "Upstream subscriptions that follow real demand: added on the first viewer, dropped when the room empties.",
      "Node.js, Express, RxJS 7, Socket.IO 4, MongoDB, JWT, React 17, Redux Toolkit and AG Grid.",
    ],
    narrative: [],
  },
  "co-founder-agents": {
    problem: "Running product work and client projects at the same time means research, planning, task tracking and follow-ups that never stop.",
    contribution: "I built a multi-agent system on Mastra's TypeScript SDK to manage the project lifecycle, and used it to test how far specialised agents can carry real work.",
    decisions: [
      "Give each agent one job: research, planning or execution.",
      "Keep conversation memory and task state in PostgreSQL so work survives restarts.",
      "Put approval gates on file changes, deletions and shell commands.",
      "Expose connected tools as agent tools, and run recurring work on persistent schedules.",
    ],
    outcomes: [
      "Research, web fetch, task tracking and recurring schedules working inside one agent workspace.",
      "Hands-on findings on where multi-agent setups help and where one well-scoped agent is enough.",
    ],
    narrative: ["An R&D build for agentic workflows across product and client work."],
  },
  "opportunity-agents": {
    imageCaptions: [
      "Agent OS, the local desk I built next: batches, leads, drafts and the agent status bar.",
      "Agent roles (Scout, Preparer, Analyst, Resolver, Coordinator) with a live audit timeline.",
      "Leads view, shown here with the app's built-in synthetic sample data.",
    ],
    problem: "Finding the right roles and client work abroad means checking hundreds of listings, companies and visa rules by hand, every day.",
    contribution: "I designed eleven scheduled agents that run in hourly batches, each owning one step, with a shared sheet as the single source of truth and proof log.",
    decisions: [
      "One agent per step: discover, verify, score, track, apply or queue, and follow up.",
      "Verify that a company and its location are real, and check visa sponsorship fit, before a lead is kept.",
      "Keep every lead, status and proof in one sheet so nothing is lost between runs.",
      "Apply automatically only where possible; everything else is queued with notes for manual review.",
    ],
    outcomes: [
      "A repeatable pipeline that ran every hour and logged leads and outreach in a tracker.",
      "A local dashboard version with a durable PostgreSQL queue and approval-bound email actions, published as Agent OS on GitHub.",
    ],
    narrative: ["Built for my own search, designed so anyone can point it at their own profile and market."],
    metrics: [
      { value: "3,000+", label: "outreach emails sent" },
      { value: "600+", label: "conversations started" },
      { value: "800+", label: "leads queued for manual review" },
    ],
  },
  "screen-to-answer": {
    imageCaptions: [
      "Start a session from a live camera or a shared screen.",
      "Settings: local or cloud OCR, and fast, balanced or max-accuracy answer models.",
      "Share to another device: scan the QR code and follow the answer live.",
    ],
    problem: "Questions often sit on a screen or a page, not in a text box. Copying them out breaks the flow.",
    contribution: "I built the full pipeline: capture, OCR, a stability check, a streamed model answer, and live sharing to a second device.",
    decisions: [
      "Capture from a live camera or a shared screen, each with its own layout.",
      "Confirm a question only after 3 consecutive OCR readings agree, so scrolling or typing never triggers a request.",
      "Run Tesseract in the browser by default, with Google Cloud Vision as an optional high-accuracy engine.",
      "Stream the answer from Claude or OpenAI, with fast, balanced and max-accuracy presets.",
      "Share a session to another device by scanning a QR code; that device follows the question and answer live over Pusher.",
    ],
    outcomes: [
      "A working proof of concept across camera and screen capture, with live answers on a second device.",
      "Next.js, TypeScript, Tesseract.js, Cloud Vision, Anthropic and OpenAI SDKs, and Pusher Channels.",
    ],
    narrative: ["A proof of concept, built to test live OCR and streamed answers end to end."],
  },
  collahead: {
    frame: "phone",
    problem: "Delivery drivers need clear routes, and dispatchers need proof that each stop really happened.",
    contribution: "I built the driver app and an admin simulator: Mapbox routing, geofenced stops, live location and stop outcomes.",
    decisions: [
      "Draw each route with the Mapbox Directions API and show the driver's next stops in order.",
      "Use latitude and longitude zones around each stop to trigger stop events automatically.",
      "Only accept a stop submission inside a 1-mile radius, and attach a map snapshot as proof.",
      "Record outcomes as success, partially completed or failed, with a reason.",
      "Stream live locations and stop events over Socket.IO so the admin view updates in real time.",
    ],
    outcomes: [
      "A working driver and admin simulator with live tracking and proof of stop.",
      "The client paused the product before launch; the routing and geofencing work stands on its own.",
    ],
    narrative: [],
    imageCaptions: [
      "Route overview with stops and the driver's live position.",
      "Turn-by-turn route to the next stop.",
      "Submitting a stop with a map snapshot as proof.",
      "Submission blocked outside the 1-mile radius.",
      "Stop outcome with reason and distance.",
    ],
  },
  "helpdesk-ai": { kind: "Personal build", narrative: ["HelpXI started as a side project to take repetitive support work off small teams. The core flows work; it is not a launched product."] },
  jewelxi: {
    problem: "A jewellery catalog needs to make the details easy to explore, from material and category to the individual piece.",
    contribution: "I built the storefront, catalog filtering, product pages and custom-design enquiry flow, with an interactive 3D pendant study, plus the admin atelier behind it.",
    decisions: ["Give the product photography room, and keep the browsing controls close.", "Connect the catalog with product details and a custom-design enquiry path.", "Use 3D for a closer look at the piece, alongside a conventional shopping interface."],
    narrative: ["Jewelxi is a public preview with an illustrative collection and test checkout."],
    outcomes: ["A filterable jewellery catalog with search, material and category filters.", "A storefront, inspiration gallery and interactive product study.", "An admin atelier for the collection, inventory, orders, store settings and order processing."],
  },
  "hey-buddy": {
    frame: "phone",
    images: ["/images/heybuddy_4.png", "/images/heybuddy_1.jpeg", "/images/heybuddy_5.jpeg"],
    imageCaptions: ["Mobile app launch screen.", "Product welcome and app download.", "Account and pet-profile onboarding."],
  },
  "extendedforms-io": {
    kind: "Employer product",
    oneLiner:
      "Timed assessments, proctoring and reporting built around Google Forms.",
    role: "Technical lead and full-stack engineer at ExpressTech Systems",
    status: "Employer product · contribution through September 2026",
    problem:
      "Educators need more control over assessments without giving up the familiar Google Forms workflow.",
    contribution:
      "I led engineering across product features, performance-critical paths, integrations and ongoing delivery.",
    decisions: [
      "Improve the busiest user journeys before adding more infrastructure.",
      "Use caching and deliberate data fetching to reduce unnecessary work.",
      "Design proctoring feedback with attention to false positives and student experience.",
    ],
    outcomes: [
      "Production assessment workflows used by 400K+ people across the Google Workspace ecosystem.",
      "Page load cut from 3.2s to 1.2s; Redis caching took responses from 800ms to 120ms.",
      "Led a team of five through two releases a month, a public API (v1 and v2) and enterprise escalations.",
    ],
    narrative: [
      "I owned the engineering of ExtendedForms at ExpressTech Systems: architecture, performance, releases and production support.",
      "The work connected customer-facing assessment features with backend reliability, subscriptions and operational support.",
    ],
    metrics: [
      { value: "400K+", label: "users" },
      { value: "10M+", label: "online exams held" },
      { value: "3x", label: "revenue growth" },
    ],
    imageCaptions: [
      "ExtendedForms product dashboard.",
    ],
  },
  "quzo-ai": {
    kind: "Employer product",
    oneLiner:
      "An ExpressTech assessment platform built for enterprise ExtendedForms clients.",
    role: "Full-stack and AI engineering at ExpressTech Systems",
    status: "Employer product · contribution through September 2026",
    problem:
      "Creating and running an assessment involves more than generating a list of questions: educators also need delivery, controls and useful reporting.",
    contribution:
      "I created Quzo at ExpressTech Systems, taking responsibility for full-stack implementation through its recent launch. Its modular-monolith architecture was designed for enterprise clients in the ExtendedForms context.",
    decisions: [
      "Connect question generation to the assessment workflow rather than treating AI as a separate chat window.",
      "Support different model providers behind a shared credit system.",
      "Use modular-monolith applications with clear boundaries between administration and exam delivery.",
      "Keep exam delivery, proctoring and reporting understandable for both educators and respondents.",
    ],
    outcomes: [
      "An integrated question-to-assessment workflow.",
      "OpenAI, Claude and Gemini behind one credit system; question creation cut from 30 minutes to 30 seconds.",
      "Product screens covering setup, delivery, reports and billing.",
    ],
    narrative: [
      "I built Quzo.ai at ExpressTech Systems and owned its engineering from the first commit to launch.",
      "The product combines AI-assisted authoring with the practical work of administering assessments and understanding the results.",
    ],
    images: [
      "/images/quzo_dashboard.png",
      "/images/quzo_form_screen.png",
      "/images/quzo_exam_screen.png",
      "/images/quzo_response_report.png",
      "/images/quzo_in_app_billing.png",
      "/images/quzo_landing_page.png",
    ],
    imageCaptions: [
      "Assessment dashboard.",
      "Assessment setup and question workflow.",
      "Respondent exam experience.",
      "Response reporting.",
      "In-app billing and credits.",
      "Public product introduction.",
    ],
  },
  "bps-trading": {
    status: "Delivered",
    narrative: ["A real-time crypto trading platform streaming live multi-pair prices over Socket.io, with frontend throttling to keep high-frequency data smooth."],
  },
  zwopr: {
    images: [2, 3, 4, 5, 6, 7, 1].map((n) => `/images/zwopr_${n}.png`),
    oneLiner: "A content management workspace for a Germany-based client.",
    problem:
      "Content teams need to manage a growing, multilingual collection without losing track of the publishing workflow.",
    contribution:
      "I delivered the full-stack admin experience with Next.js, NestJS and GraphQL.",
    decisions: [
      "Organize the admin experience around the content team's tasks.",
      "Use a GraphQL-backed data layer to connect the interface with the content catalog.",
      "Keep reusable interface patterns consistent across the workspace.",
    ],
    outcomes: [
      "A dedicated content administration workspace.",
      "Connected frontend and backend delivery.",
      "Support for multilingual content operations.",
    ],
    narrative: [
      "This was client delivery for ZWOPR, combining a practical administration interface with its backend data workflows.",
    ],
  },
  "intuitive-surgical-dashboard": {
    tech: ["React", "TypeScript", "Liferay", "SSO integration"],
    oneLiner: "Enterprise dashboard engineering for surgical-system workflows.",
    status: "Enterprise project experience",
    problem:
      "Enterprise users need clear interfaces for operational data and connected workflows.",
    contribution:
      "I contributed dashboard and integration work within an enterprise delivery environment.",
    outcomes: ["Dashboard features and SSO integration delivered in an enterprise healthcare environment."],
    narrative: [
      "React and TypeScript dashboard features with SSO integration inside a Liferay-based enterprise platform, built for clarity in surgical-system workflows.",
    ],
    images: [],
    visualNote:
      "Client screens are kept private out of respect for healthcare confidentiality."
  },
  rightful: {
    tech: ["React", "TypeScript", "WebSocket", "Stripe"],
    narrative: [
      "Frontend work for a legal-services platform, including real-time consultation workflows and accessible interaction design.",
    ],
  },
};

const vocalxi: PortfolioProject = {
  slug: "vocalxi",
  name: "VocalXI",
  url: "https://vocalxi.com",
  category: "Voice AI",
  kind: "Personal build",
  experiment: true,
  motif: "forms",
  featured: true,
  oneLiner: "A voice-first way to answer forms through a guided conversation.",
  role: "Product engineer · design, voice AI, backend and deployment",
  status: "In active development · Google Forms connector in staging",
  tech: ["TypeScript", "Next.js", "Voice AI", "Form workflows"],
  metrics: [],
  problem:
    "Forms can be time-consuming to read and complete, especially when a conversation would feel more natural.",
  contribution:
    "I am building the product experience that turns form questions into a guided voice interaction and brings the answers back into a structured workflow.",
  decisions: [
    "Start with the form's questions and preserve their intent.",
    "Let people review and confirm answers instead of silently submitting them.",
    "Separate browser voice capabilities from telephone calling and integrations still in development.",
  ],
  outcomes: [
    "A working browser voice agent that asks form questions and captures spoken answers in English and Hindi.",
    "Phone calling in pilot: the first real call asked a Google Form's questions and wrote the answers back to the form.",
    "Product design, application engineering and voice AI in one end-to-end build.",
  ],
  narrative: [
    "VocalXI explores voice as an interface for interviews, intake, feedback and other form-based tasks.",
    "Browser voice conversations work end to end today; the Google Forms connector is in staging and telephone calling is next.",
  ],
  images: ["/images/vocalxi-home.jpg", "/images/vocalxi-review.jpg"],
  imageCaptions: ["Public product website.", "Answer review preview."],
};

export const portfolioProjects: PortfolioProject[] = [
  ...archive
    .filter((p) => p.slug !== "vocalxi")
    .map(
      (p): PortfolioProject => ({
        ...p,
        metrics: [],
        problem: p.oneLiner,
        contribution: p.role,
        decisions: [],
        outcomes: [],
        // Legacy narratives contain historical claims without attached evidence.
        // Keep the factual project scope and role instead of repeating those claims.
        narrative: [p.oneLiner, `My contribution: ${p.role}.`],
        ...editorial[p.slug],
      }),
    ),
  vocalxi,
];

// Apply captured public screens while retaining existing product screenshots.
for (const project of portfolioProjects) {
  const publicScreens = capturedScreens[project.slug];
  if (publicScreens) {
    const originalImages = project.images ?? [];
    const originalCaptions = originalImages.map(
      (_, index) =>
        project.imageCaptions?.[index] ??
        project.name + " — existing product screen " + (index + 1) + ".",
    );
    project.images = [...originalImages, ...publicScreens.images];
    project.imageCaptions = [
      ...originalCaptions,
      ...publicScreens.imageCaptions,
    ];
  }
}

export const selectedWork = [
  "extendedforms-io",
  "quzo-ai",
  "vocalxi",
].map((slug) => portfolioProjects.find((p) => p.slug === slug)!);

export const expertise = [
  {
    number: "01",
    title: "Interface",
    stack: "React · Next.js · TypeScript",
    description:
      "Clear, responsive experiences built around what people need to do.",
    example: "Explore the ZWOPR workspace",
    href: "/projects/zwopr",
  },
  {
    number: "02",
    title: "System",
    stack: "Node.js · PostgreSQL · Redis",
    description:
      "APIs, data workflows and reliable product foundations behind the interface.",
    example: "Explore ExtendedForms",
    href: "/projects/extendedforms-io",
  },
  {
    number: "03",
    title: "Intelligence",
    stack: "Applied AI · RAG · Voice",
    description:
      "AI capabilities connected to a useful workflow, not added for a demo.",
    example: "Explore VocalXI",
    href: "/projects/vocalxi",
  },
];
