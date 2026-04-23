import { notFound } from "next/navigation";
import CaseStudyDetailView from "@/components/success-stories/CaseStudyDetailView";
import { getCaseStudyBySlug, getCaseStudySlugs } from "@/lib/case-studies";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
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
  const study = getCaseStudyBySlug(slug);
  if (!study) {
    notFound();
  }
  return <CaseStudyDetailView study={study} />;
}
