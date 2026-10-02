import Link from "next/link";
import { ArrowUpRight, ArrowRight, Star } from "lucide-react";
import BuildProcess from "@/components/BuildProcess";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ProjectShowcase from "@/components/ProjectShowcase";
import ContactCTA from "@/components/ContactCTA";
import Reveal from "@/components/Reveal";
import { projects, flagshipSlugs } from "@/data/projects";
import CareerTimeline from "@/components/CareerTimeline";
import WeekendBuilds from "@/components/WeekendBuilds";
import DownloadsSection from "@/components/DownloadsSection";
import { upwork } from "@/data/upwork";

const capabilities = [
  {
    title: "frontend + backend",
    text: "Interfaces, APIs, background jobs, and the connections between them. I stay involved after deployment.",
    tools: "React · Next.js · Node.js · Laravel",
  },
  {
    title: "ai.integrations",
    text: "Question generation in Quzo. Support automation in HelpDesk AI. Voice responses in VocalXI.",
    tools: "OpenAI · Claude · Gemini · pgvector",
  },
  {
    title: "performance + infra",
    text: "Caching, database queries, and infrastructure. The parts I look at when a working product starts feeling slow.",
    tools: "PostgreSQL · Redis · AWS · Docker",
  },
];
export default function Home() {
  const flagship = flagshipSlugs.map((slug) =>
    projects.find((project) => project.slug === slug)!,
  );
  return (
    <>
      <Hero />
      <section id="work" className="section-space page-shell scroll-mt-20">
        <Reveal className="section-intro">
          <div>
            <p className="eyebrow">01 // selected_work</p>
            <h2>
              Projects I’ve
              <br />
              <em>worked on.</em>
            </h2>
          </div>
          <p>
            What the product does, what I worked on, and the results recorded
            along the way.
          </p>
        </Reveal>
        <ProjectShowcase projects={flagship} />
        <div className="work-end">
          <p>
            ls ./projects
            <span>Fintech, healthcare, logistics, and experiments.</span>
          </p>
          <Link href="/projects" className="button-secondary">
            View all {projects.length} projects <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <section
        id="weekend"
        className="section-space section-divider scroll-mt-20"
      >
        <div className="page-shell">
          <Reveal className="section-intro">
            <div>
              <p className="eyebrow">02 // after_hours</p>
              <h2>
                The Weekend
                <br />
                <em>Builder.</em>
              </h2>
            </div>
            <p>
              Things I’m building outside the day job. Some are experiments.
              Some become products I keep working on.
            </p>
          </Reveal>
          <WeekendBuilds />
        </div>
      </section>
      <section
        id="about"
        className="section-space section-divider scroll-mt-20"
      >
        <div className="page-shell">
          <AboutSection />
        </div>
      </section>
      <section id="expertise" className="section-space page-shell scroll-mt-20">
        <Reveal className="section-intro">
          <div>
            <p className="eyebrow">04 // stack & process</p>
            <h2>
              What I work
              <br />
              <em>with.</em>
            </h2>
          </div>
          <p>
            I choose tools around the problem. These are the areas where I spend
            most of my time.
          </p>
        </Reveal>
        <div className="capability-grid">
          {capabilities.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.07} className="capability">
              <span className="capability-index">
                0{i + 1} <ArrowUpRight size={20} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span className="capability-tools">{item.tools}</span>
            </Reveal>
          ))}
        </div>
        <BuildProcess />
      </section>
      <section
        id="experience"
        className="section-space section-divider scroll-mt-20"
      >
        <div className="page-shell experience-grid">
          <Reveal className="experience-heading">
            <p className="eyebrow">05 // git log --career</p>
            <h2>
              My working
              <br />
              <em>timeline.</em>
            </h2>
            <p>
              From full-stack development to leading engineering. MB Systems was
              a side venture during my role at ExpressTech.
            </p>
            <Link href="/journey" className="text-link">
              Read the longer version <ArrowUpRight size={16} />
            </Link>
          </Reveal>
          <CareerTimeline />
        </div>
      </section>
      <section className="section-space page-shell">
        <Reveal className="trust-panel">
          <div>
            <p className="eyebrow">06 // client feedback</p>
            <h2>
              From the
              <br />
              <em>other side.</em>
            </h2>
            <p>12 completed jobs · 1.2K hours on Upwork</p>
            <a
              href={upwork.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              View client feedback <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="testimonial">
            <div className="flex gap-1 text-gold" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={17} fill="currentColor" />
              ))}
            </div>
            <blockquote>“{upwork.testimonials[3].quote}”</blockquote>
            <p>{upwork.testimonials[3].job}</p>
            <span>Client feedback · Upwork</span>
          </div>
        </Reveal>
      </section>
      <section id="downloads" className="section-space page-shell scroll-mt-20">
        <Reveal className="section-intro">
          <div>
            <p className="eyebrow">07 // downloads</p>
            <h2>
              The résumé.
              <br />
              <em>And the whole story.</em>
            </h2>
          </div>
          <p>
            The Weekend Builder is my longer account of the work, the mistakes,
            and the side projects. Both PDFs are here to keep.
          </p>
        </Reveal>
        <DownloadsSection />
      </section>
      <section id="contact" className="page-shell section-space scroll-mt-20">
        <ContactCTA />
      </section>
    </>
  );
}
