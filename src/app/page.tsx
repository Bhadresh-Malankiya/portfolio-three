import Hero from "@/components/Hero";
import DeviceGallery from "@/components/DeviceGallery";
import LifePanel from "@/components/LifePanel";
import DownloadsSection from "@/components/DownloadsSection";
import ContactCTA from "@/components/ContactCTA";
import { AIEngineeringSection, ResearchSection, SystemDesignSection } from "@/components/HomeSections";
export default function Home() {
  return (
    <>
      <Hero />
      <DeviceGallery />
      <AIEngineeringSection />
      <SystemDesignSection />
      <LifePanel />
      <ResearchSection />
      <section id="downloads" className="page-shell take-home exhibition-library">
        <div className="take-home-heading">
          <p className="eyebrow">08 / For the hiring conversation</p>
          <h2>
            One page.<em> Everything that matters.</em>
          </h2>
        </div>
        <DownloadsSection />
      </section>
      <section id="contact" className="page-shell section-space scroll-mt-20">
        <ContactCTA />
      </section>
    </>
  );
}
