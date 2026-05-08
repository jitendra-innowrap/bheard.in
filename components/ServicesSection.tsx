"use client";

import "@/lib/motion/config";
import { CSSProperties, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import SectionCharReveal from "@/components/motion/SectionCharReveal";
import {
  sectionPageX,
  sectionStackTop,
  sectionTitleMarginCompact,
} from "@/components/system/sectionTheme";
import { prefersReducedMotion } from "@/lib/motion/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type ServiceItem = {
  name: string;
  description: string;
};

const brandServices: ServiceItem[] = [
  {
    name: "Social Media Management",
    description:
      "Strategy, content calendars, community management and consistent channel growth. We run your platforms so you can run your business.",
  },
  {
    name: "Content and Copywriting",
    description:
      "Brand voice, campaign narratives, captions, scripts and website copy. Every word intentional. Every line earning its place.",
  },
  {
    name: "Video Editing and Animations",
    description:
      "Reels, brand films, product launches and motion graphics. Crafted for retention, built to travel across channels.",
  },
  {
    name: "Graphic Design and Illustrations",
    description:
      "Visual identity systems, social creatives, collaterals and packaging design. Consistent across every touchpoint.",
  },
  {
    name: "Campaign Planning",
    description:
      "Full-funnel campaign strategy - from the insight and big idea to the go-live calendar. Built around your goals, not a generic playbook.",
  },
];

const techServices: ServiceItem[] = [
  {
    name: "Custom Web Development",
    description:
      "Fast, secure, conversion-optimised websites built from the ground up. No templates. No off-the-shelf compromises.",
  },
  {
    name: "Custom Mobile App Development",
    description:
      "iOS and Android apps that carry your brand experience into your customer's pocket. Native performance, cross-platform thinking.",
  },
  {
    name: "UI/UX Design",
    description:
      "Research-led, user-tested interfaces that are intuitive to navigate and designed to convert. Every screen purposeful.",
  },
  {
    name: "E-Commerce",
    description:
      "End-to-end e-commerce builds - storefront design, payment integration, inventory hooks and conversion optimisation. Ready to sell from day one.",
  },
  {
    name: "Chatbots and AI Agents",
    description:
      "Intelligent automations that qualify leads, handle queries and move customers through the funnel - 24/7, without adding headcount.",
  },
];

function PaneBlock({
  title,
  description,
  services,
  variant = "brand",
}: {
  title: string;
  description: string;
  services: ServiceItem[];
  variant?: "brand" | "tech";
}) {
  const isTech = variant === "tech";
  return (
    <>
      <h4
        data-pane-reveal
        className={`font-headline text-4xl font-black uppercase ${isTech ? "text-white" : "text-neutral-900"}`}
      >
        {title}
      </h4>
      <p
        data-pane-reveal
        className={`mt-4 max-w-lg ${isTech ? "text-white/70" : "text-on-surface-variant"}`}
      >
        {description}
      </p>
      <ul className="mt-8 space-y-2">
        {services.map((service, i) => (
          <li
            key={service.name}
            data-pane-reveal
            className={`group flex flex-col rounded-sm text-sm transition-all duration-300 md:text-base ${
              isTech
                ? "border border-white/10 bg-white/5 text-white hover:border-white/25 hover:bg-white/10 focus-within:border-white/25 focus-within:bg-white/10"
                : "border border-outline-variant/60 bg-surface text-neutral-900 hover:border-primary/40 hover:bg-primary/5 focus-within:border-primary/40 focus-within:bg-primary/5"
            }`}
          >
            <div className="flex items-center gap-4 px-4 py-3.5 font-semibold">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-xs font-black transition-colors duration-300 ${
                  isTech
                    ? "bg-white/10 text-white group-hover:bg-white/20"
                    : "bg-primary/10 text-primary group-hover:bg-primary/20"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1">{service.name}</span>
              <ArrowRight
                className={`h-4 w-4 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100 ${
                  isTech ? "text-white/60" : "text-primary"
                }`}
              />
            </div>
            <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr] motion-reduce:duration-0">
              <div className="overflow-hidden">
                <p
                  className={`px-4 pb-3.5 text-xs leading-relaxed md:text-sm ${
                    isTech ? "text-white/65" : "text-on-surface-variant"
                  }`}
                >
                  {service.description}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const brandPaneRef = useRef<HTMLDivElement | null>(null);
  const techPaneRef = useRef<HTMLDivElement | null>(null);
  const brandContentRef = useRef<HTMLDivElement | null>(null);
  const techContentRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const card = cardRef.current;
      const brandPane = brandPaneRef.current;
      const techPane = techPaneRef.current;
      const brandContent = brandContentRef.current;
      const techContent = techContentRef.current;
      if (!card || !brandPane || !techPane || !brandContent || !techContent) {
        return;
      }

      gsap.set(card, {
        "--split": "50%",
      });

      const animateTo = (split: string) => {
        gsap.to(card, {
          "--split": split,
          duration: 0.65,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      const focusBrand = () => {
        animateTo("85%");
        gsap.to(brandContent, { x: 20, duration: 0.65, ease: "power3.out", overwrite: "auto" });
        gsap.to(techContent, { x: 60, duration: 0.65, ease: "power3.out", overwrite: "auto" });
      };

      const focusTech = () => {
        animateTo("15%");
        gsap.to(brandContent, { x: -60, duration: 0.65, ease: "power3.out", overwrite: "auto" });
        gsap.to(techContent, { x: -20, duration: 0.65, ease: "power3.out", overwrite: "auto" });
      };

      const reset = () => {
        animateTo("50%");
        gsap.to([brandContent, techContent], {
          x: 0,
          duration: 0.62,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      brandPane.addEventListener("mouseenter", focusBrand);
      techPane.addEventListener("mouseenter", focusTech);
      card.addEventListener("mouseleave", reset);

      return () => {
        brandPane.removeEventListener("mouseenter", focusBrand);
        techPane.removeEventListener("mouseenter", focusTech);
        card.removeEventListener("mouseleave", reset);
      };
    },
    { scope: sectionRef }
  );

  useGSAP(
    () => {
      if (prefersReducedMotion() || !sectionRef.current) {
        return;
      }

      const panes = sectionRef.current.querySelectorAll<HTMLElement>("[data-pane-reveal]");
      if (!panes.length) {
        return;
      }

      gsap.fromTo(
        panes,
        { opacity: 0, y: 36, willChange: "transform" },
        {
          opacity: 1,
          y: 0,
          stagger: 0.045,
          duration: 0.52,
          ease: "power3.out",
          clearProps: "willChange",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      className={`bg-surface ${sectionPageX} ${sectionStackTop} pb-20 md:pb-24`}
    >
      <SectionCharReveal
        as="div"
        layout="flow"
        scrubEnd="+=34%"
        className={`mx-auto max-w-7xl ${sectionTitleMarginCompact} lg:mb-14`}
        eyebrow="How we work"
        title="Our services"
        description="Strategy, content, design, and technology connected to create brands and digital experiences that move together."
      />

      <div className="mx-auto max-w-7xl">
        <div
          ref={cardRef}
          style={{ "--split": "50%" } as CSSProperties}
          className="relative overflow-hidden border border-outline-variant/60 bg-surface-container"
        >
          <div className="grid grid-cols-1 md:hidden">
            <div className="border-b border-outline-variant/60 p-8">
              <PaneBlock
                title="Brand Solutions"
                description="Creative systems, content and campaign strategy for brands that want to be remembered - not just seen."
                services={brandServices}
                variant="brand"
              />
            </div>
            <div className="bg-gradient-to-br from-[#3d1e00] via-[#4a2508] to-[#2d1600] p-8">
              <PaneBlock
                title="Tech Solutions"
                description="Digital products and intelligent tools, engineered for any industry. We build the platforms your brand operates on - and the systems that scale it."
                services={techServices}
                variant="tech"
              />
            </div>
          </div>

          <div className="relative hidden h-[640px] md:block">
            <div
              ref={brandPaneRef}
              style={{
                clipPath:
                  "polygon(0 0, var(--split, 50%) 0, calc(var(--split, 50%) - 10%) 100%, 0 100%)",
              }}
              className="absolute inset-y-0 left-0 z-10 w-full overflow-hidden bg-surface-container-low"
            >
              <div ref={brandContentRef} className="min-w-[500px] max-w-[760px] p-10">
                <PaneBlock
                  title="Brand Solutions"
                  description="Creative systems, content and campaign strategy for brands that want to be remembered - not just seen."
                  services={brandServices}
                  variant="brand"
                />
              </div>
            </div>

            <div
              ref={techPaneRef}
              style={{
                clipPath:
                  "polygon(var(--split, 50%) 0, 100% 0, 100% 100%, calc(var(--split, 50%) - 10%) 100%)",
              }}
              className="absolute inset-y-0 left-0 z-10 w-full overflow-hidden bg-gradient-to-br from-[#e59253] via-[#e58a45] to-[#eebd8e]"
            >
              <div ref={techContentRef} className="ml-auto min-w-[500px] max-w-[760px] p-10">
                <PaneBlock
                  title="Tech Solutions"
                  description="Digital products and intelligent tools, engineered for any industry. We build the platforms your brand operates on - and the systems that scale it."
                  services={techServices}
                  variant="tech"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
