import { CASE_STUDIES } from "@/lib/case-studies/data";

export const seedStories = CASE_STUDIES.map((story) => ({
  slug: story.slug,
  title: story.listTitle,
  industry: story.listMeta,
  summary: story.listDescription,
  about: `${story.overview.heading}\n\n${story.overview.body}`,
  challenge: `${story.challenge.heading}\n\n${story.challenge.intro}\n\n${story.challenge.bullets?.join("\n") ?? ""}`.trim(),
  solution: `${story.strategy.heading}\n\n${story.strategy.intro}\n\n${story.strategy.bullets?.join("\n") ?? ""}`.trim(),
  results: `${story.results.heading}\n\n${story.results.stats
    .map((stat) => `${stat.value} — ${stat.label}`)
    .join("\n")}\n\n${story.results.closing}`.trim(),
  contactCta: story.cta.title,
  published: true,
}));
