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
  "helpdesk-ai": { kind: "Personal build" },
  jewelxi: {
    problem: "A jewellery catalog needs to make the details easy to explore, from material and category to the individual piece.",
    contribution: "I built the storefront, catalog filtering, product pages and custom-design enquiry flow, with an interactive 3D pendant study.",
    decisions: ["Give the product photography room, and keep the browsing controls close.", "Connect the catalog with product details and a custom-design enquiry path.", "Use 3D for a closer look at the piece, alongside a conventional shopping interface."],
    narrative: ["Jewelxi is a public preview with an illustrative collection and test checkout."],
    outcomes: ["A filterable jewellery catalog with search, material and category filters.", "A storefront, inspiration gallery and interactive product study."],
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
