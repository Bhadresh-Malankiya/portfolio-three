import Link from "next/link";
import { ArrowUpRight, AudioLines, BookOpenCheck, ShieldCheck, Shuffle, Network } from "lucide-react";
import Reveal from "@/components/Reveal";
import { AIRequestPathDiagram, QuzoMonolithDiagram, RealtimeFlowDiagram } from "@/components/Diagrams";
import "@/app/home-sections.css";

const patterns = [
  {
    icon: AudioLines,
    title: "Voice agents",
    body: "A state machine owns the conversation; the model only assesses each answer. Speech-to-text, text-to-speech and the model sit behind swappable interfaces, so Hindi and English each get the provider that performs best.",
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
    icon: ShieldCheck,
    title: "Guardrails",
    body: "The model cannot add fields, change required answers or submit anything. Free text is captured word for word, and every response is reviewed before it is sent.",
    proof: "VocalXI",
    href: "/projects/vocalxi",
  },
  {
    icon: Shuffle,
    title: "Multi-model routing",
    body: "OpenAI, Claude and Gemini sit behind one adapter layer. Tasks go to the model that fits on quality and cost; Quzo picked GPT-4o mini for text generation after a side-by-side comparison.",
    proof: "Quzo.ai, Screen-to-Answer Assistant",
    href: "/projects/quzo-ai",
  },
  {
    icon: Network,
    title: "Multi-agent systems",
    body: "Each agent gets one job. The Co-founder agents run on Mastra with memory, schedules and approval gates for file and shell actions; the Opportunity agents split discovery, verification, scoring and follow-up across 11 scheduled agents.",
    proof: "Co-founder agents, Opportunity agents",
    href: "/projects/opportunity-agents",
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
    title: "Exam start brings everyone at once",
    context: "Respondents taking exams and admins building them shared one app and one database, so traffic spikes slowed everyone.",
    action: "Split it into two independently deployed apps with separate databases for configuration and responses, linked by short-lived JWT handoffs.",
    result: "The exam app scales on its own; admin work stays fast during spikes.",
    proof: "Quzo.ai · Medium write-up",
    href: "https://medium.com/@bhadreshm3418/how-to-prevent-site-unavailable-errors-on-high-traffic-web-apps-without-breaking-the-bank-babbb5f8ec96",
  },
  {
    title: "An enterprise client doubted the platform could take their users",
    context: "A large customer worried that their exam load would overwhelm the service.",
    action: "Worked directly with them and introduced batched exam sessions and rate limits for their rollout.",
    result: "The client's load problem was resolved without a platform rewrite.",
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
    title: "A live market freezes the screen",
    context: "Trades arrive faster than a table can repaint, and every browser was a candidate for every symbol.",
    action: "Buffered trades each second with RxJS, kept the newest per symbol and sent it only to that symbol's Socket.IO room.",
    result: "A smooth live grid that repaints only the rows that changed.",
    proof: "CompassRT",
    href: "/projects/compassrt",
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
      <Reveal y={16} className="diagram-card">
        <p className="diagram-title">Every AI feature follows one path</p>
        <AIRequestPathDiagram />
      </Reveal>
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
      <div className="diagram-pair">
        <Reveal y={16} className="diagram-card">
          <p className="diagram-kicker">Quzo.ai · modular monolith</p>
          <p className="diagram-title">Forms and exams scale apart, sharing one read cache</p>
          <QuzoMonolithDiagram />
          <p className="diagram-note">Exam start brings everyone at once, so exam delivery runs as its own app and scales independently while both apps reuse one Redis cache.</p>
          <Link href="/projects/quzo-ai#quzo-architecture" className="pattern-proof">Explore the full architecture <ArrowUpRight size={14} /></Link>
        </Reveal>
        <Reveal y={16} delay={0.05} className="diagram-card">
          <p className="diagram-kicker">CompassRT · real-time data flow</p>
          <p className="diagram-title">One feed in, one calm update per second out</p>
          <RealtimeFlowDiagram />
          <p className="diagram-note">One shared market socket feeds an RxJS stream, buffered each second and sent only to the Socket.IO room for that symbol. Symbols are subscribed upstream when the first viewer arrives and dropped when the room empties.</p>
          <Link href="/projects/compassrt" className="pattern-proof">Inside CompassRT <ArrowUpRight size={14} /></Link>
        </Reveal>
      </div>
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
