import Hero from "@/components/Hero";
import DeviceGallery from "@/components/DeviceGallery";
import LifePanel from "@/components/LifePanel";
import ClientReviews from "@/components/ClientReviews";
import DownloadsSection from "@/components/DownloadsSection";
import ContactCTA from "@/components/ContactCTA";
export default function Home() {
  return (
    <>
      <Hero />
      <DeviceGallery />
      <LifePanel />
      <ClientReviews />
      <section id="downloads" className="page-shell take-home">
        <div className="take-home-heading">
          <p className="eyebrow">{"// take something with you"}</p>
          <h2>
            The résumé.<em> The whole story.</em>
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
