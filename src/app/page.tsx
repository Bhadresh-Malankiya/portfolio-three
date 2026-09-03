import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import AboutSection from "@/components/AboutSection";
import StatusBoard from "@/components/StatusBoard";
import SectionHeading from "@/components/SectionHeading";
import JourneyTeaser from "@/components/JourneyTeaser";
import DownloadsSection from "@/components/DownloadsSection";
import ProjectShowcase from "@/components/ProjectShowcase";
import ImpactSection from "@/components/ImpactSection";
import SkillsIndex from "@/components/SkillsIndex";
import KineticMarquee from "@/components/KineticMarquee";
import Scene3D from "@/components/Scene3D";
import ContactCTA from "@/components/ContactCTA";
import CertificationsStrip from "@/components/CertificationsStrip";
import UpworkSection from "@/components/UpworkSection";
import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";
import { projects, flagshipSlugs } from "@/data/projects";
import { fieldGuides } from "@/data/fieldGuides";

// Section order is deliberately client-first: hook → proof → the actual work
// → efficiency/stack/trust signals, and only *then* the deeper memoir/resume
// material and field notes for whoever scrolls that far. A hiring manager
// skimming for thirty seconds should hit the work well before the life story.
export default function Home() {
  const flagship = flagshipSlugs.map((s) => projects.find((p) => p.slug === s)!);

  return (
    <>
      <Hero />
      <Ticker />

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <AboutSection />
      </section>

      <section className="border-t border-line bg-ink-2/20">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <SectionHeading
            eyebrow="Proof, not adjectives"
            title="Two products he owns end to end. One team he leads. One startup he closed honestly."
            description="Numbers pulled from the products themselves — not a résumé exaggerating them."
          />
          <div className="mt-10">
            <StatusBoard />
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 pt-20 sm:px-8 sm:pt-28">
          <SectionHeading
            eyebrow="Selected work"
            title="Three products. Three different reasons they exist. Scroll."
            description="One built inside a company, one built entirely alone, one built purely on weekends because a customer shouldn't wait two days for something that simple."
            align="center"
          />
        </div>
        <ProjectShowcase projects={flagship} />
        {/* `relative z-10` is load-bearing: ProjectShowcase's panels use
            position:sticky, which paints above later *static* siblings
            regardless of DOM order, so without this the last panel silently
            eats clicks on the button below it. */}
        <div className="relative z-10 mx-auto -mt-16 max-w-6xl px-5 pb-20 text-center sm:px-8 sm:pb-28">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-fg transition-colors hover:border-gold hover:text-gold"
          >
            See all 13 projects
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <section className="border-t border-line bg-ink-2/20">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <SectionHeading
            eyebrow="Efficiency, measured"
            title="The recurring pattern: find the slow part, make it fast, keep the receipts."
            description="Every one of these is a real before-and-after from the products above — not a projection."
          />
          <div className="mt-12">
            <ImpactSection />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <SectionHeading
            eyebrow="The stack"
            title="Fluent fast, on whatever the next problem requires."
            description="The skill that compounds isn't permanent expertise in one tool — it's the process for becoming fluent in the next one quickly enough that the tool stops being the bottleneck."
          />
          <Reveal delay={0.1} className="hidden overflow-hidden rounded-xl border border-line bg-ink-3/40 lg:block">
            <div className="h-44">
              <Scene3D variant="network" className="h-full w-full" />
            </div>
            <p className="border-t border-line px-4 py-2.5 font-mono text-[11px] text-muted">
              13 projects, one connected practice
            </p>
          </Reveal>
        </div>
        <div className="mt-12">
          <SkillsIndex />
        </div>
      </section>

      <section className="border-t border-line bg-ink-2/20">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Eyebrow>Certifications & recognition</Eyebrow>
          <CertificationsStrip />
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <SectionHeading
            eyebrow="Client trust, not adjectives"
            title="Twelve jobs on Upwork. Five stars on every one that left a rating."
            description="Real clients, paying out of pocket, with no team or account manager standing between the work and the review. Click through — the profile is live."
          />
          <div className="mt-14">
            <UpworkSection />
          </div>
        </div>
      </section>

      <KineticMarquee lineA="Bhadreshkumar Malankiya" lineB="The Weekend Builder" />

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeading
          eyebrow="The memoir"
          title="He wrote the whole story down. Sixteen chapters, one foreword, zero straight lines."
          description="From a computer in Surat to sole ownership of two SaaS products — including the year-long startup that didn't survive, told in as much detail as the ones that worked."
        />
        <div className="mt-10">
          <JourneyTeaser />
        </div>
      </section>

      <section className="border-t border-line bg-ink-2/20">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <SectionHeading
            eyebrow="The paper trail"
            title="The résumé for the facts. The book for the rest."
            description="No signup, no email gate — just the PDFs. The résumé is the six-minute version for a hiring manager; the book is the whole uncut record, all sixteen chapters."
          />
          <div className="mt-10">
            <DownloadsSection />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeading
          eyebrow="Field notes"
          title="Two chapters written directly for people earlier in their own career."
          description="No vague encouragement — the specific things he wishes someone had told him before his first interview and his first job search."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {fieldGuides.map((g, i) => (
            <Reveal key={g.slug} delay={i * 0.08}>
              <Link
                href={`/field-guide/${g.slug}`}
                className="group flex h-full flex-col justify-between rounded-lg border border-line bg-ink-2/40 p-7 transition-colors hover:border-gold/50"
              >
                <div>
                  <Eyebrow className="text-[10px]">{g.eyebrow}</Eyebrow>
                  <h3 className="mt-3 font-display text-2xl leading-snug text-fg">{g.title}</h3>
                  <p className="mt-3 text-sm italic leading-relaxed text-muted">&ldquo;{g.quote}&rdquo;</p>
                </div>
                <div className="mt-6 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-gold">
                  Read the guide
                  <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <KineticMarquee lineA="Let's build something" lineB="Say hello" className="border-t-0" />

      <section id="contact" className="scroll-mt-24 border-t border-line bg-ink-2/20 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <ContactCTA />
        </div>
      </section>
    </>
  );
}
