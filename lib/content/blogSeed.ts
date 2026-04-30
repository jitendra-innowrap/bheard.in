export type SeedBlogPost = {
  slug: string;
  title: string;
  subtitle?: string;
  author: string;
  excerpt: string;
  thumbnailUrl?: string;
  thumbnailAlt?: string;
  content: string;
  category: string;
  readTime: number;
  published: boolean;
  publishedAt: Date;
};

export const seedBlogPosts: SeedBlogPost[] = [
  {
    slug: "positioning-before-performance",
    title: "Positioning Before Performance: Why Growth Compounds Faster",
    author: "BHeard Editorial",
    excerpt:
      "Teams often pour budget into channels before clarifying category position. Better positioning reduces CAC by making every click more qualified.",
    category: "Brand Strategy",
    readTime: 7,
    published: true,
    publishedAt: new Date("2026-03-06T10:30:00.000Z"),
    content: `# Positioning Before Performance

Most growth bottlenecks are not media problems. They are clarity problems.

## The Common Pattern

Teams launch paid campaigns with:

- weak message hierarchy
- generic landing pages
- no sharp point of view

Then they optimize endlessly and still feel stuck.

## What Works Better

Start by aligning four layers:

1. category definition
2. audience tension
3. promise and proof
4. conversion path

When these are clear, performance work becomes force-multiplication instead of damage control.

## Practical Checklist

- Can a new visitor explain your value in one sentence after five seconds?
- Does every campaign map to one clear audience tension?
- Are your proof points visible before scroll?

If not, fix positioning first, then scale media.
`,
  },
  {
    slug: "mobile-app-architecture-for-scale",
    title: "Mobile App Architecture for Scale: Decisions That Save Six Months Later",
    author: "BHeard Editorial",
    excerpt:
      "Architecture choices made in week two often decide whether you can ship fast in month six. Here is a practical model for scaling safely.",
    category: "Product Engineering",
    readTime: 9,
    published: true,
    publishedAt: new Date("2026-03-14T08:00:00.000Z"),
    content: `# Mobile App Architecture for Scale

Shipping fast is easy. Scaling cleanly is hard.

## Early Decisions That Matter

### 1) Domain boundaries

Keep modules aligned to product capabilities, not screens.

### 2) State ownership

Define where truth lives. Avoid duplicate state between local cache and server cache.

### 3) Observability

Instrumentation is not a post-launch task. Add crash, latency, and event visibility from sprint one.

## Recommended Baseline

- typed API contracts
- clear feature modules
- shared design tokens
- release checklist with QA gates

This keeps teams moving without accumulating invisible debt.
`,
  },
  {
    slug: "ai-features-users-actually-adopt",
    title: "AI Features Users Actually Adopt",
    author: "BHeard Editorial",
    excerpt:
      "Most AI features fail because they are novel, not useful. Adoption grows when AI is embedded inside existing user intent.",
    category: "AI Product",
    readTime: 6,
    published: true,
    publishedAt: new Date("2026-03-22T11:15:00.000Z"),
    content: `# AI Features Users Actually Adopt

People adopt AI when it removes friction in a familiar flow.

## Three Patterns That Work

- Suggest next-best action when the user is already deciding.
- Automate repetitive setup tasks.
- Personalize outputs with transparent controls.

## Three Patterns That Fail

- chat surfaces that replace proven workflows
- vague "AI insights" with no action
- automation without confidence indicators

Build for trust first. Delight follows.
`,
  },
  {
    slug: "from-campaign-assets-to-content-systems",
    title: "From Campaign Assets to Content Systems",
    author: "BHeard Editorial",
    excerpt:
      "High-performing teams stop treating content as one-off assets and start managing reusable narrative systems across channels.",
    category: "Content Systems",
    readTime: 8,
    published: true,
    publishedAt: new Date("2026-03-30T09:45:00.000Z"),
    content: `# From Campaign Assets to Content Systems

Campaign output spikes. Systems compound.

## Shift the Unit of Work

Instead of producing isolated deliverables, define:

- message pillars
- modular visual components
- reusable distribution templates

## Why This Matters

You reduce production friction, speed up testing, and keep brand coherence while scaling volume.

The result is not just more content. It is better signal-to-noise in every channel.
`,
  },
];
