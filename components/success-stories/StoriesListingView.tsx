"use client";

import InnerPageHero from "@/components/system/InnerPageHero";
import type { CaseStudyContent } from "@/lib/case-studies";
import StoryStickyStack from "./StoryStickyStack";

export default function StoriesListingView({ cases }: { cases: CaseStudyContent[] }) {
  return (
    <>
      <InnerPageHero
        watermark="PROOF"
        heading="Stories That Made an Impact"
        subtext="Impact-driven brand campaigns — told as immersive narratives, not template case pages. Same typography, spacing, and motion language as the homepage."
      />
      <StoryStickyStack cases={cases} />
    </>
  );
}
