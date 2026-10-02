import { capturedScreens } from "@/data/captured-screens";
import { projects as archive, type Project } from "@/data/projects";
import { profile } from "@/data/profile";

export const identity = {
  name: "Bhadresh Malankiya",
  role: "Senior Full-Stack & AI Engineer",
  summary:
    "I build production SaaS, thoughtful interfaces and applied AI systems. My work connects React and Next.js experiences with Node.js services, data and reliable delivery.",
  email: profile.email,
  site: profile.site,
  location: profile.location,
  resume: "/downloads/Bhadreshkumar-malankiya-resume-full.pdf",
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
      "Production assessment workflows in the Google Workspace ecosystem.",
      "Performance improvements across high-traffic pages.",
      "Technical leadership across development and product delivery.",
    ],
    narrative: [
      "My responsibility was technical ownership within ExpressTech Systems—not ownership of the company or its products.",
      "The work connected customer-facing assessment features with backend reliability, subscriptions and operational support.",
    ],
    metrics: [
      { value: "401K+", label: "users · portfolio-reported scale" },
      { value: "8.7M+", label: "respondents · portfolio-reported scale" },
    ],
    imageCaptions: [
      "ExtendedForms product screen from the existing portfolio assets.",
    ],
  },
  "quzo-ai": {
    kind: "Employer product",
    oneLiner:
      "AI-assisted question creation, assessment delivery and response reporting.",
    role: "Full-stack and AI engineering at ExpressTech Systems",
    status: "Employer product · contribution through September 2026",
    problem:
      "Creating and running an assessment involves more than generating a list of questions: educators also need delivery, controls and useful reporting.",
    contribution:
      "I worked across the assessment interface, AI integrations, backend workflows and product delivery.",
    decisions: [
      "Connect question generation to the assessment workflow rather than treating AI as a separate chat window.",
      "Support different model providers behind a shared credit system.",
      "Keep exam delivery, proctoring and reporting understandable for both educators and respondents.",
    ],
    outcomes: [
      "An integrated question-to-assessment workflow.",
      "Multi-provider AI integration and credit management.",
      "Product screens covering setup, delivery, reports and billing.",
    ],
    narrative: [
      "Quzo.ai is presented here as employer-product engineering. Technical responsibility does not imply founder or legal ownership.",
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
    outcomes: ["Enterprise interface and integration experience."],
    narrative: [
      "This case study describes my engineering contribution, not ownership of the underlying product. No hospital-count, uptime or compliance certification is asserted here.",
    ],
    images: [],
    visualNote:
      "Internal healthcare screens are not republished here. Project context is described without exposing operational data.",
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
  kind: "Founder venture",
  motif: "forms",
  featured: true,
  oneLiner: "A voice-first way to answer forms through a guided conversation.",
  role: "Founder and product engineer · AscendXI",
  status: "Browser voice product · additional integrations evolving",
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
    "A public voice-to-forms product.",
    "Product design, application engineering and voice experience in one founder-led project.",
  ],
  narrative: [
    "VocalXI is my own product under AscendXI. It explores voice as an interface for interviews, intake, feedback and other form-based tasks.",
    "For current availability, use the live product website. Planned calling capabilities are not represented as shipped features in this portfolio.",
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
  "vocalxi",
  "quzo-ai",
  "zwopr",
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
      "AI capabilities connected to a useful workflow—not added just for a demo.",
    example: "Explore VocalXI",
    href: "/projects/vocalxi",
  },
];
