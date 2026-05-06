"use client";

import HorizontalProcessRail, { type ProcessRailStep } from "@/components/solutions/HorizontalProcessRail";
import KineticSolutionsHero from "@/components/solutions/KineticSolutionsHero";
import ServicePinStack, { type ServicePinItem } from "@/components/solutions/ServicePinStack";
import SolutionsClosingCta from "@/components/solutions/SolutionsClosingCta";
import TechCapabilitiesGrid from "@/components/solutions/TechCapabilitiesGrid";
import TechResultsBand from "@/components/solutions/TechResultsBand";
import TechValueLoop from "@/components/solutions/TechValueLoop";
import TechWireVisual from "@/components/solutions/TechWireVisual";
import {
  PROCESS_THUMB_TECH,
  TECH_HERO_MEDIA,
  TECH_SERVICE_IMAGES,
} from "@/lib/solutions/visualAssets";

const TECH_SERVICES: ServicePinItem[] = [
  {
    id: "web",
    title: "Built for performance.",
    body: "Fast, scalable, and optimized web platforms tailored to your business goals — engineered for Core Web Vitals and growth.",
    visual: <TechWireVisual />,
  },
  {
    id: "mobile",
    title: "Apps people actually use.",
    body: "Intuitive, high-performance mobile experiences across iOS and Android — grounded in real behavior, not feature bloat.",
    ...TECH_SERVICE_IMAGES.mobile,
  },
  {
    id: "ux",
    title: "Design that feels right.",
    body: "Interfaces that are not just beautiful — but effortless to use, with systems that keep teams shipping consistently.",
    ...TECH_SERVICE_IMAGES.ux,
  },
  {
    id: "commerce",
    title: "Sell smarter.",
    body: "Conversion-focused e-commerce platforms designed for scale — from catalog to checkout to retention loops.",
    ...TECH_SERVICE_IMAGES.commerce,
  },
  {
    id: "ai",
    title: "Automation that works 24/7.",
    body: "AI-powered assistants and agents that streamline operations and elevate customer experience — with guardrails.",
    ...TECH_SERVICE_IMAGES.ai,
  },
];

const TECH_PROCESS: ProcessRailStep[] = [
  {
    subtitle: "Ideation",
    title: "Shape the bet",
    body: "Clarify the problem, constraints, and the outcome that actually matters.",
    ...PROCESS_THUMB_TECH.Ideation,
  },
  {
    subtitle: "Wireframing",
    title: "Design the flow",
    body: "Map journeys, states, and edge cases before a single line of production code.",
    ...PROCESS_THUMB_TECH.Wireframing,
  },
  {
    subtitle: "Development",
    title: "Ship in slices",
    body: "Incremental delivery with observability, performance budgets, and QA baked in.",
    ...PROCESS_THUMB_TECH.Development,
  },
  {
    subtitle: "Testing",
    title: "Prove reliability",
    body: "Stress the system — usability, load, and regression — so launch day is boring (in a good way).",
    ...PROCESS_THUMB_TECH.Testing,
  },
  {
    subtitle: "Launch & scale",
    title: "Grow with confidence",
    body: "Hardening, analytics, and iteration loops that keep the product compounding.",
    ...PROCESS_THUMB_TECH["Launch & scale"],
  },
];

export default function TechSolutionsView() {
  return (
    <>
      <KineticSolutionsHero
        eyebrow="Build what scales"
        line1="Technology that grows with you."
        subtext="We design and develop scalable digital products, platforms, and automations that drive measurable results."
        primaryCta={{ href: "#tech-build", label: "Start a Project" }}
        secondaryCta={{ href: "/", label: "See Our Work" }}
        morphWords={["Ship", "Scale", "Magnetic"]}
        variant="tech"
        media={TECH_HERO_MEDIA}
      />

      <TechValueLoop />

      <ServicePinStack
        eyebrow="Services"
        heading="What we build"
        intro="Web, mobile, UX, commerce, and automation — delivered with the same calm, tactile scroll rhythm as our brand work."
        items={TECH_SERVICES}
      />

      <TechCapabilitiesGrid />

      <HorizontalProcessRail
        eyebrow="Process"
        heading="From idea to product"
        subheading="A disciplined build track — clear handoffs, tight feedback loops, and engineering judgment at every step."
        steps={TECH_PROCESS}
      />

      <TechResultsBand />

      <SolutionsClosingCta
        id="tech-build"
        headline="Your idea deserves execution."
        cta={{ href: "/", label: "Start Building" }}
      />
    </>
  );
}
