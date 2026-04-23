"use client";

import BrandPhilosophySection from "@/components/solutions/BrandPhilosophySection";
import CaseMomentsStrip from "@/components/solutions/CaseMomentsStrip";
import HorizontalProcessRail, { type ProcessRailStep } from "@/components/solutions/HorizontalProcessRail";
import KineticSolutionsHero from "@/components/solutions/KineticSolutionsHero";
import MockSocialScroller from "@/components/solutions/MockSocialScroller";
import ServicePinStack, { type ServicePinItem } from "@/components/solutions/ServicePinStack";
import SolutionsClosingCta from "@/components/solutions/SolutionsClosingCta";
import {
  BRAND_HERO_MEDIA,
  BRAND_SERVICE_IMAGES,
  PROCESS_THUMB_BRAND,
} from "@/lib/solutions/visualAssets";

const BRAND_SERVICES: ServicePinItem[] = [
  {
    id: "social",
    title: "Consistency that compounds.",
    body: "We don’t just post — we engineer content pipelines that grow audience, trust, and engagement over time.",
    visual: <MockSocialScroller />,
  },
  {
    id: "copy",
    title: "Words that sell without selling.",
    body: "Every word is intentional — from hooks to long-form storytelling, we craft narratives that convert attention into action.",
    ...BRAND_SERVICE_IMAGES.copy,
  },
  {
    id: "video",
    title: "Motion that captures attention.",
    body: "Short-form, long-form, branded visuals — designed to stop the scroll and drive retention.",
    ...BRAND_SERVICE_IMAGES.video,
  },
  {
    id: "design",
    title: "Visual identity that stands apart.",
    body: "Design systems, illustrations, and creatives that make your brand instantly recognizable.",
    ...BRAND_SERVICE_IMAGES.design,
  },
  {
    id: "campaign",
    title: "Ideas that scale.",
    body: "We plan campaigns with structure — from concept to execution — ensuring consistency across every channel.",
    ...BRAND_SERVICE_IMAGES.campaign,
  },
];

const BRAND_PROCESS: ProcessRailStep[] = [
  {
    subtitle: "Discover",
    title: "Brand DNA",
    body: "Understanding your brand DNA — audience, category, and the story only you can own.",
    ...PROCESS_THUMB_BRAND.Discover,
  },
  {
    subtitle: "Define",
    title: "Strategy & positioning",
    body: "Sharp positioning, narrative architecture, and message hierarchy that scales.",
    ...PROCESS_THUMB_BRAND.Define,
  },
  {
    subtitle: "Design",
    title: "Content & visual systems",
    body: "Systems for content, design, and motion that keep every touchpoint coherent.",
    ...PROCESS_THUMB_BRAND.Design,
  },
  {
    subtitle: "Deploy",
    title: "Campaign execution",
    body: "Channel-native rollout with quality control — fast iteration without losing the plot.",
    ...PROCESS_THUMB_BRAND.Deploy,
  },
  {
    subtitle: "Optimize",
    title: "Data-driven iteration",
    body: "Learn from signal, not noise — refine creative, cadence, and spend with intent.",
    ...PROCESS_THUMB_BRAND.Optimize,
  },
];

export default function BrandSolutionsView() {
  return (
    <>
      <KineticSolutionsHero
        eyebrow="Make them remember you"
        line1="Brands aren’t built."
        line2="They’re remembered."
        subtext="We design story systems, content engines, and campaigns that don’t just look good — they stay in people’s minds."
        primaryCta={{ href: "#brand-journey", label: "Build Your Brand" }}
        secondaryCta={{ href: "/success-stories", label: "View Case Studies" }}
        morphWords={["Story", "Recall", "Trust"]}
        variant="brand"
        media={BRAND_HERO_MEDIA}
      />

      <BrandPhilosophySection />

      <ServicePinStack
        eyebrow="Services"
        heading="What we build"
        intro="Each layer is deliberate — social, narrative, motion, design, and campaigns built to compound recall."
        items={BRAND_SERVICES}
      />

      <HorizontalProcessRail
        eyebrow="Process"
        heading="A system, not guesswork."
        subheading="A repeatable spine from discovery to optimization — built for clarity and compounding recall."
        steps={BRAND_PROCESS}
      />

      <CaseMomentsStrip />

      <SolutionsClosingCta
        id="brand-journey"
        headline="If they don’t remember you, they won’t choose you."
        cta={{ href: "/", label: "Start Your Brand Journey" }}
      />
    </>
  );
}
