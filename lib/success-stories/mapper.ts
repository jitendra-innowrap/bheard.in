import type { SuccessStoryRecord as SuccessStory } from "@/lib/db/models";
import type { CaseStudyContent, CaseStudyExecutionBlock, CaseStudyStat } from "@/lib/case-studies";
import { getCaseStudyBySlug } from "@/lib/case-studies";

type CaseData = Partial<Omit<CaseStudyContent, "slug">>;

function asStats(value: unknown, fallback: CaseStudyStat[] = []): CaseStudyStat[] {
  if (!Array.isArray(value)) return fallback;
  return value
    .map((v) => {
      if (!v || typeof v !== "object") return null;
      const valueStr = String((v as any).value ?? "").trim();
      const label = String((v as any).label ?? "").trim();
      if (!valueStr || !label) return null;
      return { value: valueStr, label };
    })
    .filter(Boolean) as CaseStudyStat[];
}

function asExecution(value: unknown): CaseStudyExecutionBlock[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => {
      if (!v || typeof v !== "object") return null;
      const heading = String((v as any).heading ?? "").trim();
      const body = String((v as any).body ?? "").trim();
      const image = String((v as any).image ?? "").trim();
      const imageAlt = String((v as any).imageAlt ?? "").trim() || heading;
      const alignRaw = (v as any).align;
      const align = alignRaw === "left" || alignRaw === "right" ? alignRaw : "left";
      if (!heading || !body || !image) return null;
      return { heading, body, image, imageAlt, align };
    })
    .filter(Boolean) as CaseStudyExecutionBlock[];
}

export function successStoryToCaseStudy(row: SuccessStory): CaseStudyContent {
  const data = (row.caseData ?? {}) as CaseData;
  const seed = getCaseStudyBySlug(row.slug);
  const listTitle = (data.listTitle ?? row.title).trim();
  const listDescription = (data.listDescription ?? row.summary).trim();
  const listMeta = (data.listMeta ?? row.industry).trim();
  const heroTitle = (data.heroTitle ?? row.title).trim();
  const heroSubtitle = (data.heroSubtitle ?? row.summary).trim();
  const heroMeta = (data.heroMeta ?? row.industry).trim();
  const execution = asExecution((data as any).execution);
  const listImage = (data.listImage ?? row.listImage ?? row.heroImage ?? seed?.listImage ?? "").toString();
  const heroImage = (data.heroImage ?? row.heroImage ?? row.listImage ?? seed?.heroImage ?? listImage).toString();

  return {
    slug: row.slug,
    listTitle,
    listTagline: String(data.listTagline ?? row.summary).trim(),
    listDescription,
    listMeta,
    listImage,
    listImageAlt: String(data.listImageAlt ?? seed?.listImageAlt ?? listTitle).trim(),
    listStats: asStats((data as any).listStats),
    heroTitle,
    heroSubtitle,
    heroMeta,
    heroImage,
    heroImageAlt: String(data.heroImageAlt ?? seed?.heroImageAlt ?? heroTitle).trim(),
    overview: {
      heading: String((data as any).overview?.heading ?? "The brief"),
      body: String((data as any).overview?.body ?? row.about),
    },
    challenge: {
      heading: String((data as any).challenge?.heading ?? "The challenge"),
      intro: String((data as any).challenge?.intro ?? row.challenge),
      bullets: Array.isArray((data as any).challenge?.bullets) ? (data as any).challenge?.bullets : [],
    },
    strategy: {
      heading: String((data as any).strategy?.heading ?? "Our approach"),
      intro: String((data as any).strategy?.intro ?? row.solution),
      bullets: Array.isArray((data as any).strategy?.bullets) ? (data as any).strategy?.bullets : [],
    },
    execution:
      execution.length > 0
        ? execution
        : [
            {
              heading: "Execution",
              body: row.solution,
              image: heroImage,
              imageAlt: heroTitle,
              align: "left",
            },
          ],
    results: {
      heading: String((data as any).results?.heading ?? "The impact"),
      stats: asStats((data as any).results?.stats, [{ value: "Impact", label: row.results }]),
      closing: String((data as any).results?.closing ?? row.results),
    },
    closingStatement: String(data.closingStatement ?? row.summary),
    cta: {
      title: String((data as any).cta?.title ?? row.contactCta),
      subtext: String((data as any).cta?.subtext ?? "Let’s build your next story."),
    },
  };
}

