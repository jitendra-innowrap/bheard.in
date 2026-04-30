import { notFound } from "next/navigation";
import CaseStudyDetailView from "@/components/success-stories/CaseStudyDetailView";
import { getCaseStudyBySlug, getCaseStudySlugs } from "@/lib/case-studies";
import { getStoryBySlug, listPublishedStories } from "@/lib/services/stories.service";
import { successStoryToCaseStudy } from "@/lib/success-stories/mapper";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const rows = await listPublishedStories();
    if (rows.length) return rows.map((row) => ({ slug: row.slug }));
  } catch {}
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  let study = null;
  try {
    const row = await getStoryBySlug(slug);
    study = row && row.published ? successStoryToCaseStudy(row) : null;
  } catch {
    study = getCaseStudyBySlug(slug);
  }
  if (!study) {
    return { title: "Story | BHEARD" };
  }
  return {
    title: `${study.heroTitle} | BHEARD`,
    description: study.heroSubtitle.slice(0, 158),
  };
}

export default async function SuccessStoryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let study = null;
  try {
    const row = await getStoryBySlug(slug);
    study = row && row.published ? successStoryToCaseStudy(row) : null;
  } catch {
    study = getCaseStudyBySlug(slug);
  }
  if (!study) {
    notFound();
  }
  return <CaseStudyDetailView study={study} />;
}
