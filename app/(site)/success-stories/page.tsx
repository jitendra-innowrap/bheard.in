import { getAllCaseStudies } from "@/lib/case-studies";
import StoriesListingView from "@/components/success-stories/StoriesListingView";

export const metadata = {
  title: "Success Stories | BHEARD",
  description:
    "Campaign-grade case studies — immersive storytelling, proof, and execution detail from hospitality, wellness, and brand-led growth work.",
};

export default function SuccessStoriesIndexPage() {
  return <StoriesListingView cases={getAllCaseStudies()} />;
}
