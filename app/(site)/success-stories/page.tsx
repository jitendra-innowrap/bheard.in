import { getAllCaseStudies } from "@/lib/case-studies";
import StoriesListingView from "@/components/success-stories/StoriesListingView";
import { listPublishedStories } from "@/lib/services/stories.service";
import { successStoryToCaseStudy } from "@/lib/success-stories/mapper";

export const metadata = {
  title: "Success Stories | BHEARD",
  description:
    "Campaign-grade case studies — immersive storytelling, proof, and execution detail from hospitality, wellness, and brand-led growth work.",
};

export const dynamic = "force-dynamic";

export default async function SuccessStoriesIndexPage() {
  let cases = getAllCaseStudies();
  try {
    const rows = await listPublishedStories();
    if (rows.length) {
      cases = rows.map(successStoryToCaseStudy);
    }
  } catch {}
  return <StoriesListingView cases={cases} />;
}
