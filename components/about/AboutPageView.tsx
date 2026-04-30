"use client";

import "@/lib/motion/config";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Compass, Layers, Megaphone, Rocket } from "lucide-react";
import ClientLogos from "@/components/ClientLogos";
import { prefersReducedMotion } from "@/lib/motion/animations";
import { sectionBandY, sectionPageX, sectionStackTop } from "@/components/system/sectionTheme";

gsap.registerPlugin(useGSAP, ScrollTrigger);
const ABOUT_HERO_TEXT = "FUEL BRAND\nGROWTH\nTHROUGH DESIGN.";
const ABOUT_FOOTER_TEXT = "LET'S BUILD YOUR\nNEXT GROWTH CHAPTER";

const SERVICES = [
  {
    title: "Bespoke digital experiences",
    body: "Crafting interfaces and brand systems where cutting-edge design meets clarity and conversion.",
    icon: Layers,
  },
  {
    title: "Social & performance campaigns",
    body: "Impactful social media campaigns that reach the right audiences and amplify your story.",
    icon: Megaphone,
  },
  {
    title: "Brand growth strategy",
    body: "Data-driven growth strategies that move emerging startups and global brands toward market leadership.",
    icon: Rocket,
  },
  {
    title: "Product development roadmaps",
    body: "Roadmaps and execution support that turn ideas into scalable products with measurable outcomes.",
    icon: Compass,
  },
] as const;

export default function AboutPageView() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      const hero = heroRef.current;
      if (hero && !reduced) {
        gsap.set('[data-about-hero="eyebrow"]', { opacity: 0, y: 24 });
        gsap.set('[data-about-hero="headline-letter"]', { opacity: 0, y: 54 });
        gsap.set('[data-about-hero="lede"]', { opacity: 0, y: 32 });
        gsap.set('[data-about-hero="cta"]', { opacity: 0, y: 28 });
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to('[data-about-hero="eyebrow"]', { opacity: 1, y: 0, duration: 0.5 })
          .to(
            '[data-about-hero="headline-letter"]',
            { opacity: 1, y: 0, duration: 0.72, stagger: 0.028, ease: "power3.out" },
            "-=0.2"
          )
          .to('[data-about-hero="lede"]', { opacity: 1, y: 0, duration: 0.55 }, "-=0.45")
          .to('[data-about-hero="cta"]', { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, "-=0.35");

        gsap.to('[data-about-hero="glow"]', {
          scale: 1.06,
          y: 14,
          duration: 4.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      if (reduced) {
        return;
      }

      const reveals = gsap.utils.toArray<HTMLElement>("[data-about-reveal]");
      reveals.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 44, willChange: "transform" },
          {
            opacity: 1,
            y: 0,
            duration: 0.62,
            ease: "power3.out",
            clearProps: "willChange",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              once: true,
            },
          }
        );
      });

      gsap.fromTo(
        '[data-about-mission="copy"]',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.68,
          ease: "power3.out",
          scrollTrigger: {
            trigger: '[data-about-mission="section"]',
            start: "top 82%",
            once: true,
          },
        }
      );

      const cards = gsap.utils.toArray<HTMLElement>("[data-about-card]");
      if (cards.length) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: cards[0]?.parentElement,
              start: "top 88%",
              once: true,
            },
          }
        );
      }

      const parallaxEls = gsap.utils.toArray<HTMLElement>("[data-about-parallax]");
      parallaxEls.forEach((el) => {
        const section = el.closest("section");
        if (!section) return;
        gsap.fromTo(
          el,
          { y: 0 },
          {
            y: -48,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.1,
            },
          }
        );
      });

      const serviceItems = gsap.utils.toArray<HTMLElement>("[data-about-service]");
      if (serviceItems.length) {
        gsap.fromTo(
          serviceItems,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.07,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: serviceItems[0]?.closest("[data-about-services-wrap]"),
              start: "top 87%",
              once: true,
            },
          }
        );
      }

      gsap.fromTo(
        '[data-about-footer="headline-letter"]',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.024,
          scrollTrigger: {
            trigger: '[data-about-footer="section"]',
            start: "top 80%",
            once: true,
          },
        }
      );
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef}>
      <section
        ref={heroRef}
        className="relative isolate flex min-h-[88vh] flex-col justify-end overflow-hidden px-8 pb-20 pt-36 md:min-h-[90vh] md:pb-28 md:pt-40"
      >
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-surface-container-low to-surface-container-lowest" />
        <div
          data-about-hero="glow"
          className="pointer-events-none absolute -right-20 top-1/4 z-0 h-[min(70vw,520px)] w-[min(70vw,520px)] rounded-full bg-primary/15 blur-[140px]"
        />
        <div
          data-about-parallax
          className="pointer-events-none absolute bottom-1/4 left-[-10%] z-0 h-72 w-72 rounded-full bg-primary-fixed/20 blur-[90px]"
        />
        <p
          data-about-hero="eyebrow"
          className="relative z-[2] mx-auto mb-6 w-full max-w-7xl font-body text-xs font-bold uppercase tracking-[0.2em] text-primary opacity-0 motion-reduce:opacity-100"
        >
          Digital marketing agency Mumbai · BHeard Consulting
        </p>
        <div className="relative z-[2] mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 md:grid-cols-12 md:items-center md:gap-12">
          <div className="md:col-span-7 md:flex md:min-h-[340px] md:items-center">
            <h1 className="font-headline text-[clamp(2.75rem,9vw,5.5rem)] font-black uppercase leading-[0.95] tracking-tight text-neutral-900 motion-reduce:opacity-100">
              {ABOUT_HERO_TEXT.split("").map((char, idx) => {
                if (char === "\n") return <br key={`about-hero-br-${idx}`} />;
                if (char === " ") {
                  return (
                    <span
                      key={`about-hero-space-${idx}`}
                      data-about-hero="headline-letter"
                      className="inline-block opacity-0 motion-reduce:opacity-100"
                    >
                      &nbsp;
                    </span>
                  );
                }
                const isGrowth =
                  idx >= ABOUT_HERO_TEXT.indexOf("GROWTH") &&
                  idx < ABOUT_HERO_TEXT.indexOf("GROWTH") + "GROWTH".length;
                return (
                  <span
                    key={`about-hero-char-${idx}`}
                    data-about-hero="headline-letter"
                    className={`inline-block opacity-0 motion-reduce:opacity-100 ${isGrowth ? "text-primary-fixed" : ""}`}
                  >
                    {char}
                  </span>
                );
              })}
            </h1>
          </div>
          <div className="flex flex-col gap-8 md:col-span-5">
            <p
              data-about-hero="lede"
              className="font-body text-lg leading-relaxed text-on-surface-variant opacity-0 motion-reduce:opacity-100 md:text-xl"
            >
              At BHeard Consulting, we fuel brand growth through innovative digital design and strategic marketing.
              Based in Mumbai, we are a full-service agency specializing in bespoke digital experiences—blending
              cutting-edge design with data-driven growth strategies.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                data-about-hero="cta"
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 font-headline text-sm font-black uppercase tracking-widest text-on-primary opacity-0 transition hover:bg-primary-fixed-dim motion-reduce:opacity-100"
              >
                Partner with us
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                data-about-hero="cta"
                href="/success-stories"
                className="inline-flex items-center justify-center rounded-lg border border-outline-variant bg-white/80 px-8 py-4 font-headline text-sm font-bold uppercase tracking-wide text-neutral-800 opacity-0 backdrop-blur transition hover:border-primary hover:text-primary motion-reduce:opacity-100"
              >
                Client wins
              </Link>
            </div>
          </div>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 right-0 select-none font-headline text-[clamp(3.5rem,14vw,11rem)] font-black uppercase leading-none text-neutral-200/90"
        >
          BHeard
        </div>
      </section>

      <section data-about-mission="section" className={`bg-surface-container-lowest ${sectionPageX} ${sectionBandY}`}>
        <div className="mx-auto max-w-7xl">
          <p
            data-about-mission="copy"
            className="mx-auto max-w-4xl text-center font-headline text-headline font-bold leading-tight text-neutral-900"
          >
            Our mission:{" "}
            <span className="text-primary-fixed">transform your brand into a market leader.</span> We have partnered
            with global brands and emerging startups alike—delivering social campaigns, targeted growth strategies, and
            product development roadmaps that drive results.
          </p>
        </div>
      </section>

      <section className={`bg-surface-container-highest/60 ${sectionPageX} ${sectionBandY} ${sectionStackTop}`}>
        <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-2 md:gap-20 md:items-center">
          <div data-about-reveal>
            <span className="mb-4 inline-block font-body text-label-sm uppercase tracking-widest text-primary">
              Origin story
            </span>
            <h2 className="mb-6 max-w-[18ch] font-headline text-[clamp(2rem,5.2vw,4.2rem)] font-extrabold uppercase leading-[0.95] text-neutral-900">
              Rooted in strategy.
              <br />
              Built to last.
            </h2>
            <div className="space-y-5 font-body text-body-lg text-on-surface-variant">
              <p>
                Founded by Neha Gupta after her MBA at the National University of Singapore—and honed at Accenture
                Global—our studio carries a vision shaped by rigorous consulting and creative instinct.
              </p>
              <p>
                Today that vision is powered by a dynamic team of creative strategists, designers, and tech innovators.
                We do not just build campaigns; we craft digital journeys that connect brands with the right audiences.
              </p>
            </div>
          </div>
          <div data-about-reveal className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface-container-high md:aspect-square">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
              alt="BHeard Consulting team collaborating on brand and product strategy in Mumbai"
              fill
              className="object-cover grayscale transition duration-700 hover:grayscale-0"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 to-transparent" />
            <p className="absolute bottom-6 left-6 right-6 font-body text-sm text-white/95 md:text-base">
              Partner with us to unlock your brand potential—through creative design, scalable growth strategies, and
              product development that leaves a mark.
            </p>
          </div>
        </div>
      </section>

      <section className={`bg-surface-container-lowest ${sectionPageX} ${sectionBandY}`}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 md:mb-16" data-about-reveal>
            <span className="mb-3 inline-block font-body text-label-sm uppercase tracking-widest text-primary">
              People & craft
            </span>
            <h2 className="max-w-3xl font-headline text-display-lg font-extrabold uppercase leading-none text-neutral-900">
              People & Craft
              <br />
              Behind the Work
            </h2>
            <p className="mt-4 max-w-2xl font-body text-body-lg text-on-surface-variant">
              A Mumbai-based collective combining consulting discipline with studio craft—so every engagement stays
              sharp, accountable, and creatively bold.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-12">
            <article
              data-about-card
              className="md:col-span-5 flex flex-col overflow-hidden rounded-xl border border-outline-variant/80 bg-white shadow-sm"
            >
              <div className="relative aspect-[5/4] bg-surface-container-high">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                  alt="Neha Gupta, founder of BHeard Consulting"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 42vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-6 md:p-8">
                <h3 className="font-headline text-xl font-bold uppercase tracking-tight text-neutral-900">
                  Neha Gupta
                </h3>
                <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-primary">Founder · Principal</p>
                <p className="mt-4 font-body text-sm leading-relaxed text-on-surface-variant md:text-base">
                  MBA (National University of Singapore); former Accenture Global. Neha leads BHeard with a dual lens on
                  brand narrative and operating rigor—aligning creative ambition with growth metrics that matter to
                  founders and enterprise teams alike.
                </p>
              </div>
            </article>
            <div className="grid gap-6 md:col-span-7 md:grid-rows-3">
              {[
                {
                  title: "Creative strategists",
                  body: "Positioning, messaging, and channel thinking that turns briefs into campaigns people remember—and funnels that convert.",
                },
                {
                  title: "Designers & storytellers",
                  body: "Visual systems, motion, and UX craft that make every touchpoint feel intentional, on-brand, and built for clarity.",
                },
                {
                  title: "Tech innovators",
                  body: "Engineers and product partners who ship roadmaps, prototypes, and integrations so ideas scale beyond a single launch moment.",
                },
              ].map((item) => (
                <article
                  key={item.title}
                  data-about-card
                  className="flex flex-col justify-center rounded-xl border border-outline-variant/80 bg-surface-container-low p-6 md:p-8"
                >
                  <h3 className="font-headline text-lg font-bold uppercase tracking-tight text-neutral-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 font-body text-sm leading-relaxed text-on-surface-variant md:text-base">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className={`relative overflow-hidden bg-neutral-900 ${sectionPageX} ${sectionBandY}`}
        data-about-services-wrap
      >
        <div
          data-about-parallax
          className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-primary/25 blur-[100px]"
        />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 md:mb-16" data-about-reveal>
            <span className="mb-3 inline-block font-body text-label-sm uppercase tracking-widest text-primary-fixed">
              Services
            </span>
            <h2 className="max-w-3xl font-headline text-display-lg font-extrabold uppercase leading-none text-white">
              What we deliver
            </h2>
            <p className="mt-4 max-w-2xl font-body text-body-lg text-neutral-300">
              Full-service support across brand growth and product development—so your next chapter is designed,
              launched, and measured in one motion.
            </p>
          </div>
          <ul className="grid gap-5 md:grid-cols-2">
            {SERVICES.map(({ title, body, icon: Icon }) => (
              <li
                key={title}
                data-about-service
                className="flex gap-5 rounded-xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm md:p-8"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary-fixed">
                  <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
                </div>
                <div>
                  <h3 className="font-headline text-lg font-bold uppercase tracking-tight text-white">{title}</h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-neutral-300 md:text-base">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ClientLogos />

      <section id="contact" className={`scroll-mt-28 bg-gradient-to-br from-primary-container to-primary-dim ${sectionPageX} py-24 md:py-32`}>
        <div className="mx-auto max-w-7xl">
          <div data-about-footer="section" className="grid gap-10 md:grid-cols-12 md:items-center md:gap-16" data-about-reveal>
            <div className="md:col-span-7">
              <h2 className="font-headline text-display-lg font-black uppercase leading-[0.95] text-on-primary-container">
                {ABOUT_FOOTER_TEXT.split("").map((char, idx) => {
                  if (char === "\n") return <br key={`about-footer-br-${idx}`} />;
                  if (char === " ") {
                    return (
                      <span
                        key={`about-footer-space-${idx}`}
                        data-about-footer="headline-letter"
                        className="inline-block opacity-0 motion-reduce:opacity-100"
                      >
                        &nbsp;
                      </span>
                    );
                  }
                  return (
                    <span
                      key={`about-footer-char-${idx}`}
                      data-about-footer="headline-letter"
                      className="inline-block opacity-0 motion-reduce:opacity-100"
                    >
                      {char}
                    </span>
                  );
                })}
              </h2>
              <p className="mt-5 max-w-xl font-body text-body-lg text-on-primary-container/90">
                Tell us about your brand, product, or campaign goals. We&apos;ll reply with a clear point of view—and how
                we can help you scale with confidence from Mumbai to global markets.
              </p>
            </div>
            <div className="md:col-span-5 flex flex-col gap-5">
              <a
                href="mailto:hello@bheard.in"
                className="block rounded-xl bg-white px-6 py-5 font-headline text-lg font-bold text-neutral-900 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                hello@bheard.in
              </a>
              <p className="font-body text-sm font-medium uppercase tracking-wider text-on-primary-container/85">
                Mumbai, India · Remote-friendly engagements
              </p>
              <Link
                href="/brand-solutions"
                className="inline-flex w-fit items-center gap-2 border-b-2 border-on-primary-container pb-1 font-headline text-sm font-bold uppercase tracking-wide text-on-primary-container transition hover:border-white hover:text-white"
              >
                Explore brand solutions
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
