import type { Metadata } from "next";
import AboutPageView from "@/components/about/AboutPageView";

const title = "About BHeard Consulting | Digital Marketing Agency Mumbai";
const description =
  "BHeard Consulting is a Mumbai-based digital marketing agency fueling brand growth through design, social campaigns, growth strategy, and product development roadmaps. Meet our team and mission.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "digital marketing agency Mumbai",
    "brand growth",
    "product development",
    "BHeard Consulting",
    "digital design agency",
    "social media campaigns",
    "growth strategy",
  ],
  openGraph: {
    title,
    description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://bheard.in/about/#webpage",
      url: "https://bheard.in/about",
      name: title,
      description,
      isPartOf: { "@type": "WebSite", name: "BHeard Consulting", url: "https://bheard.in/" },
      about: {
        "@type": "Organization",
        name: "BHeard Consulting",
        description:
          "Full-service digital agency in Mumbai specializing in brand growth, digital design, marketing strategy, and product development.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Mumbai",
          addressCountry: "IN",
        },
        founder: {
          "@type": "Person",
          name: "Neha Gupta",
          alumniOf: { "@type": "CollegeOrUniversity", name: "National University of Singapore" },
        },
      },
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutPageView />
    </>
  );
}
