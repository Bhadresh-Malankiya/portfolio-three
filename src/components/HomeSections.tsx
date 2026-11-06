import Link from "next/link";
import { ArrowUpRight, AudioLines, BookOpenCheck, Shuffle, Network } from "lucide-react";
import Reveal from "@/components/Reveal";
import ScrollFlow, { type FlowStep } from "@/components/ScrollFlow";
import "@/app/home-sections.css";

const patterns = [
  {
    icon: AudioLines,
    title: "Voice agents with guardrails",
    body: "A state machine owns the conversation; the model only assesses each answer. Speech-to-text, text-to-speech and the model sit behind swappable interfaces, so Hindi and English each get the provider that performs best. The model cannot add fields or submit anything, and every response is reviewed before it is sent.",
    proof: "VocalXI",
    href: "/projects/vocalxi",
  },
  {
    icon: BookOpenCheck,
    title: "Grounded answers (RAG)",
    body: "Answers come from the owner's content first. Quzo generates question banks from a pgvector retrieval step; each VocalXI form agent answers questions only from its owner's knowledge notes.",
    proof: "Quzo.ai, VocalXI",
    href: "/projects/quzo-ai",
  },
  {
    icon: Shuffle,
    title: "Multi-model routing",
    body: "OpenAI, Claude and Gemini sit behind one adapter layer. Tasks go to the model that fits on quality and cost; Quzo picked GPT-4o mini for text generation after a side-by-side comparison.",
    proof: "Quzo.ai",
    href: "/projects/quzo-ai",
  },
  {
    icon: Network,
    title: "Multi-agent systems",
    body: "Each agent gets one job: research, planning or execution. Built on Mastra with shared memory, persistent schedules, and approval gates before any file change or shell command.",
    proof: "Project lifecycle agents",
    href: "/projects/project-lifecycle-agents",
  },
];

const challenges = [
  {
    title: "A load test took the server down",
    context: "During a load test, about 25K form requests hit a 16 GB Laravel server at once. Most timed out after 30 seconds.",
    action: "Traced it to PHP-FPM's pm.max_children limit: too few workers for the load while server capacity sat unused. Raised the worker pool to match the hardware.",
    result: "The forms feature came back once the worker pool matched the server's capacity.",
    proof: "ExtendedForms.io",
    href: "/projects/extendedforms-io",
  },
  {
    title: "A busy page took 30 seconds to load",
    context: "One high-traffic page took 30 to 35 seconds, and nobody had filed a ticket.",
    action: "Added caching and TanStack Query, plus server rendering and Redis across busy paths.",
    result: "That page dropped to 5 to 6 seconds; typical page load went from 3.2 s to 1.2 s.",
    proof: "ExtendedForms.io",
    href: "/projects/extendedforms-io",
  },
  {
    title: "Hindi voice answers misheard names",
    context: "Respondents mix English words into Hindi, and names and cities were coming back wrong.",
    action: "Ran the same audio through a Hindi-specific and a multilingual speech model and compared the transcripts.",
    result: "Shipped the Hindi model, which kept names and cities right in the tests.",
    proof: "VocalXI",
    href: "/projects/vocalxi",
  },
];

const writing = [
  { title: "How to prevent \u201cSite Unavailable\u201d errors on high-traffic web apps", where: "Medium · Jun 2025", href: "https://medium.com/@bhadreshm3418/how-to-prevent-site-unavailable-errors-on-high-traffic-web-apps-without-breaking-the-bank-babbb5f8ec96" },
  { title: "Cost-effective and accurate AI prompts", where: "Medium · Mar 2025", href: "https://medium.com/@bhadreshm3418/cost-effective-and-accurate-ai-prompts-optimizing-for-efficiency-b1ce57880210" },
  { title: "Case study: QR code sharing in ExtendedForms.io", where: "Medium · Feb 2025", href: "https://medium.com/@bhadreshm3418/case-study-enhancing-user-experience-with-qr-code-sharing-in-extendedforms-io-d75ede68ea00" },
  { title: "Build notes: short explainers on React, TypeScript, debugging and AI agents", where: "LinkedIn · ongoing series", href: "https://www.linkedin.com/in/bhadresh-malankiya/recent-activity/all/" },
];

const aiFlow: FlowStep[] = [
  { title: "Input", what: "A person speaks or types: a form answer, a question, a request.", why: "Voice and text enter the same pipeline, so every channel gets the same safety rules." },
  { title: "Context", what: "Retrieve only the notes or documents that matter for this request (RAG).", why: "The model answers from the owner's content instead of guessing." },
  { title: "Model", what: "Route the task to the model that fits it, through one adapter for OpenAI, Claude and Gemini.", why: "Quality and cost differ by task, and switching providers should not mean rewriting features." },
  { title: "Guardrails", what: "Check the output against a schema before anything else sees it.", why: "The model cannot add fields, trigger actions or submit anything on its own." },
  { title: "Review", what: "A person approves anything that is about to leave the system.", why: "AI drafts and assesses. People stay accountable for what gets sent." },
  { title: "Action", what: "The approved result is submitted, saved or sent.", why: "Only validated, reviewed output reaches users or other systems." },
];

const quzoFlow: FlowStep[] = [
  { title: "Two kinds of traffic", what: "Educators build and manage exams; learners take them.", why: "Authoring is steady all day. Exams start with everyone arriving in the same minute." },
  { title: "Forms and admin app", what: "Authoring, question banks, AI generation, sharing and reporting live in one app.", why: "Day-to-day product work stays in one codebase that is simple to change and ship." },
  { title: "Models and forms data", what: "AI generation calls the model providers; forms live in PostgreSQL with pgvector.", why: "Retrieval for question banks sits right next to the data it searches." },
  { title: "Exam delivery app", what: "Exam sessions and response capture run as a separate app.", why: "Exam start is the spike, so this part scales on its own without dragging the admin app with it." },
  { title: "Shared Redis cache", what: "Both apps read exam definitions from one Redis cache.", why: "Thousands of learners starting together hit the cache, not the database." },
  { title: "Separate responses store", what: "Answers are written to their own PostgreSQL path.", why: "Heavy exam writes never slow down authoring queries." },
];

const realtimeFlow: FlowStep[] = [
  { title: "One market feed", what: "The server opens a single shared socket to Finnhub.", why: "A hundred viewers should never mean a hundred upstream connections." },
  { title: "RxJS stream", what: "Every trade becomes an event on one stream.", why: "One stream can be batched, filtered and split per symbol in a few operators." },
  { title: "Buffer each second", what: "Trades are collected for one second with bufferTime.", why: "Busy symbols can trade hundreds of times a second; batching keeps CPU and bandwidth flat." },
  { title: "Latest price only", what: "Each batch keeps only the newest price per symbol.", why: "Screens need the current price, not every tick in between." },
  { title: "Room per symbol", what: "Socket.IO sends each update only to that symbol's room.", why: "Clients receive just the symbols on their watchlist." },
  { title: "Calm client updates", what: "The browser batches again and AG Grid updates rows by ID.", why: "Prices move live without re-rendering the whole table." },
  { title: "Watchlist drives the feed", what: "Joining a symbol subscribes upstream; when its room empties, it unsubscribes.", why: "The server only pays for symbols someone is actually watching." },
];

export function AIEngineeringSection() {
  return (
    <section id="ai" className="page-shell home-block" aria-labelledby="ai-heading">
      <div className="home-block-heading">
        <p className="eyebrow">04 / How I build AI</p>
        <h2 id="ai-heading">AI that ships.<br /><em>Models in the loop, people in control.</em></h2>
        <p className="home-block-intro">I put LLMs inside real products, not chat windows. Every AI feature I build follows the same rules: ground the model in the right context, keep it away from decisions it should not make, and let a person approve anything that leaves the system.</p>
      </div>
      <div className="pattern-grid">
        {patterns.map(({ icon: Icon, title, body, proof, href }, i) => (
          <Reveal key={title} y={18} delay={(i % 3) * 0.05} className="pattern-card">
            <Icon size={24} strokeWidth={1.4} aria-hidden="true" className="pattern-icon" />
            <h3>{title}</h3>
            <p>{body}</p>
            <Link href={href} className="pattern-proof">{proof} <ArrowUpRight size={14} /></Link>
          </Reveal>
        ))}
      </div>
      <ScrollFlow
        kind="ai"
        kicker="The request path"
        title="Every AI feature follows one path"
        summary="Scroll to follow a single request from the moment someone speaks to the moment something is sent."
        steps={aiFlow}
      />
    </section>
  );
}

export function SystemDesignSection() {
  return (
    <section id="system-design" className="page-shell home-block" aria-labelledby="system-heading">
      <div className="home-block-heading">
        <p className="eyebrow">05 / System design</p>
        <h2 id="system-heading">Built for the traffic<br /><em>that actually arrives.</em></h2>
      </div>
      <ScrollFlow
        kind="quzo"
        kicker="Quzo.ai · modular monolith"
        title="Forms and exams scale apart, sharing one read cache"
        summary="Exam start brings everyone at once. Scroll to see how the system is split so that spike stays contained."
        steps={quzoFlow}
        link={{ href: "/projects/quzo-ai#quzo-architecture", label: "Explore the full architecture" }}
      />
      <ScrollFlow
        kind="realtime"
        kicker="CompassRT · real-time data flow"
        title="One feed in, one calm update per second out"
        summary="Scroll to follow a single trade from the market feed to a row in the grid."
        steps={realtimeFlow}
        link={{ href: "/projects/compassrt", label: "Inside CompassRT" }}
      />
    </section>
  );
}

export function ChallengesSection() {
  return (
    <section id="challenges" className="page-shell home-block" aria-labelledby="challenges-heading">
      <div className="home-block-heading">
        <p className="eyebrow">07 / Challenges I solved</p>
        <h2 id="challenges-heading">Hard problems,<br /><em>solved on real systems.</em></h2>
        <p className="home-block-intro">Outages, traffic spikes, slow pages and noisy data. Here is what broke, what I did, and what changed.</p>
      </div>
      <div className="research-grid challenge-grid">
        {challenges.map((item, i) => (
          <Reveal key={item.title} y={16} delay={(i % 2) * 0.05} className="research-card">
            <span className="research-index">{String(i + 1).padStart(2, "0")}</span>
            <h3>{item.title}</h3>
            <dl>
              <div><dt>The problem</dt><dd>{item.context}</dd></div>
              <div><dt>What I did</dt><dd>{item.action}</dd></div>
              <div><dt>Result</dt><dd>{item.result}</dd></div>
            </dl>
            <a href={item.href} className="pattern-proof challenge-proof" {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{item.proof} <ArrowUpRight size={14} /></a>
          </Reveal>
        ))}
      </div>
      <div className="writing-strip">
        <p className="diagram-kicker">Writing and build notes</p>
        <ul>
          {writing.map((item) => (
            <li key={item.href}><a href={item.href} target="_blank" rel="noopener noreferrer"><span>{item.title}</span><small>{item.where}</small><ArrowUpRight size={16} /></a></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
