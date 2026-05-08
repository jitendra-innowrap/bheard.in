import type { Metadata, Viewport } from "next";
import AboutSection from "@/components/AboutSection";
import CTASection from "@/components/CTASection";
import ClientLogos from "@/components/ClientLogos";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import OurBeliefSection from "@/components/OurBeliefSection";
import ScrollRevealEffects from "@/components/ScrollRevealEffects";
import ServicesSection from "@/components/ServicesSection";
import ServicesVariantOne from "@/components/ServicesVariantOne";
import WorkSection from "@/components/WorkSection";

export const metadata: Metadata = {
  title: "Branding & Tech Agency in India | BHEARD",
  description:
    "BHEARD is an integrated branding and tech agency based in Mumbai. Brand strategy, campaigns, social media, web and mobile app development — one team, one brief, one outcome.",
  alternates: {
    canonical: "https://bheard.in/",
    languages: {
      "en-IN": "https://bheard.in/",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "BHEARD — Integrated Branding & Tech Agency",
    description:
      "Capturing voice in the noise. Brand solutions and digital products for ambitious businesses — built under one roof.",
    type: "website",
    url: "https://bheard.in/",
    images: [
      {
        url: "https://bheard.in/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Hero dark background — BHEARD logotype in white + tagline CAPTURING VOICE IN THE NOISE below it.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BHEARD — Integrated Branding & Tech Agency",
    description: "Capturing voice in the noise. Brand + tech solutions for businesses that mean it.",
    images: ["https://bheard.in/og-home.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#1A1714",
};

const homeSchema = {
  "@context": "https://schema.org",
  "@type": ["MarketingAgency", "ProfessionalService"],
  name: "BHEARD",
  alternateName: "B Heard",
  url: "https://bheard.in",
  logo: "https://bheard.in/logo.png",
  description:
    "Integrated branding and tech agency in Mumbai offering brand solutions, social media marketing, web development, and mobile app development.",
  foundingDate: "2024",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mumbai",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
  areaServed: ["India"],
  knowsAbout: [
    "Brand Strategy",
    "Social Media Marketing",
    "Campaign Planning",
    "Content Marketing",
    "Video Production",
    "Graphic Design",
    "Web Development",
    "Mobile App Development",
    "UI/UX Design",
    "E-Commerce Development",
    "Chatbot Development",
  ],
  sameAs: ["https://www.instagram.com/bheard.in", "https://www.linkedin.com/company/bheard"],
} as const;

/** Read `SPLINE_HERO_SCENE` / `NEXT_PUBLIC_SPLINE_HERO_SCENE` on each request (fresh URL in dev after restart). */
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }} />
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
