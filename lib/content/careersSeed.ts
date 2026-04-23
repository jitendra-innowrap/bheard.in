export type SeedCareer = {
  slug: string;
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  active: boolean;
};

export const seedCareers: SeedCareer[] = [
  {
    slug: "senior-frontend-engineer",
    title: "Senior Frontend Engineer",
    department: "Engineering",
    type: "Full-time",
    location: "Remote (India)",
    active: true,
    description: `# Senior Frontend Engineer

We are looking for a frontend engineer who cares deeply about product quality, interaction detail, and maintainable architecture.

## What you will own

- Build and improve high-impact surfaces in Next.js and React.
- Partner with design and product on interaction quality.
- Drive component architecture and code health standards.
- Improve performance, accessibility, and release confidence.

## What we value

- Strong TypeScript fundamentals.
- Clear communication in async workflows.
- Product thinking, not task-only execution.
- Attention to craft and user outcomes.

## Nice to have

- Experience with GSAP animation systems.
- Familiarity with design tokens and scalable component libraries.

## Process

1. Intro call
2. Practical review exercise
3. Technical deep-dive with engineering lead
4. Final culture conversation
`,
  },
  {
    slug: "product-designer-ui-ux",
    title: "Product Designer (UI/UX)",
    department: "Design",
    type: "Full-time",
    location: "Hybrid (Mumbai)",
    active: true,
    description: `# Product Designer (UI/UX)

We hire designers who can connect interface craft with business outcomes.

## What you will own

- End-to-end product flows from concept to polished UI.
- Design system evolution with reusable patterns.
- Collaboration with engineering through implementation.
- Usability-informed iteration after release.

## What we value

- Sharp visual hierarchy and interaction thinking.
- Comfort with ambiguity and product discovery.
- Strong rationale behind design decisions.

## Portfolio expectations

Please include case studies showing:

- problem framing
- design iterations
- trade-off decisions
- measurable outcome
`,
  },
  {
    slug: "content-strategy-lead",
    title: "Content Strategy Lead",
    department: "Brand",
    type: "Contract",
    location: "Remote",
    active: true,
    description: `# Content Strategy Lead

This role drives narrative systems that connect brand voice, campaign execution, and measurable distribution outcomes.

## What you will own

- Build messaging architecture across channels.
- Translate strategic positioning into repeatable content operations.
- Partner with design/video/performance teams on integrated campaigns.
- Define editorial quality standards and review loops.

## What we value

- Strategic clarity over jargon.
- Ability to turn insight into executable briefs.
- Strong writing and storytelling range.
`,
  },
];
