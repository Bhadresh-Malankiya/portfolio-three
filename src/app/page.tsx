import Hero from "@/components/Hero";
import DeviceGallery from "@/components/DeviceGallery";
import LifePanel from "@/components/LifePanel";
import ContactCTA from "@/components/ContactCTA";
import { AIEngineeringSection, ChallengesSection, SystemDesignSection } from "@/components/HomeSections";
export default function Home() {
  return (
    <>
      <Hero />
      <DeviceGallery />
      <AIEngineeringSection />
      <SystemDesignSection />
      <LifePanel />
      <ChallengesSection />
      <section id="contact" className="page-shell section-space scroll-mt-20">
        <ContactCTA />
      </section>
    </>
  );
}
