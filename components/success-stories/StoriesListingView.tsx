"use client";

import type { CaseStudyContent } from "@/lib/case-studies";
import StoriesClosingCta from "./StoriesClosingCta";
import StoriesImmersiveHero from "./StoriesImmersiveHero";
import StoryStickyStack from "./StoryStickyStack";

export default function StoriesListingView({ cases }: { cases: CaseStudyContent[] }) {
  return (
    <>
      <StoriesImmersiveHero cases={cases} />
      <StoryStickyStack cases={cases} />
      <StoriesClosingCta cases={cases} />
    </>
  );
}
