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

const research = [
  {
    question: "Which speech model handles Hindi best?",
    tested: "Ran the same Hindi audio, with English words mixed in, through a Hindi-specific model and a multilingual one.",
    decision: "The Hindi model kept names and cities right; the multilingual one misheard one per sample. Shipped the Hindi model.",
  },
  {
    question: "Do agents need Redis and a job queue service?",
    tested: "Compared Redis plus BullMQ against PostgreSQL row locking for claiming jobs.",
    decision: "PostgreSQL alone: one less service to run, with safe concurrent workers, until the load proves otherwise.",
  },
  {
    question: "How do you confirm a UPI payment without holding funds?",
    tested: "Studied two open-source UPI gateways and their verification methods.",
    decision: "A QR code or reference number does not prove payment. A trusted bank or provider signal, idempotent webhooks and reconciliation are required.",
  },
  {
    question: "Where should a voice product run at launch?",
    tested: "Compared four hosting setups on monthly cost, operations work and migration risk.",
    decision: "Docker plus managed PostgreSQL now; AWS and Kubernetes only when measured load justifies them.",
  },
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

export function ResearchSection() {
  return (
    <section id="research" className="page-shell home-block" aria-labelledby="research-heading">
      <div className="home-block-heading">
        <p className="eyebrow">07 / Research and decisions</p>
        <h2 id="research-heading">Test first,<br /><em>then decide.</em></h2>
        <p className="home-block-intro">Good engineering choices come from evidence, not trends. Here is how I settled four real decisions.</p>
      </div>
      <div className="research-grid">
        {research.map((item, i) => (
          <Reveal key={item.question} y={16} delay={(i % 2) * 0.05} className="research-card">
            <span className="research-index">{String(i + 1).padStart(2, "0")}</span>
            <h3>{item.question}</h3>
            <dl>
              <div><dt>Tested</dt><dd>{item.tested}</dd></div>
              <div><dt>Decided</dt><dd>{item.decision}</dd></div>
            </dl>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
