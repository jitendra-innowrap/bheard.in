import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import OurBeliefSection from "@/components/OurBeliefSection";
import ScrollRevealEffects from "@/components/ScrollRevealEffects";

/** Read `SPLINE_HERO_SCENE` / `NEXT_PUBLIC_SPLINE_HERO_SCENE` on each request (fresh URL in dev after restart). */
export const dynamic = "force-dynamic";
import AboutSection from "@/components/AboutSection";
import ClientLogos from "@/components/ClientLogos";
import ServicesSection from "@/components/ServicesSection";
import ServicesVariantOne from "@/components/ServicesVariantOne";
import WorkSection from "@/components/WorkSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <OurBeliefSection />
        <ServicesSection />
        <ClientLogos />
        <ServicesVariantOne />
        <WorkSection />
        <AboutSection />
        <CTASection />
        <ScrollRevealEffects />
      </main>
      <Footer />
    </>
  );
}
