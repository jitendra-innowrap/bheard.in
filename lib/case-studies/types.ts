export type CaseStudyStat = {
  /** Display value — numbers only when verified (e.g. GP30) */
  value: string;
  label: string;
};

export type CaseStudyExecutionBlock = {
  heading: string;
  body: string;
  image: string;
  imageAlt: string;
  /** Visual rhythm on desktop */
  align?: "left" | "right";
};

export type CaseStudyContent = {
  slug: string;
  /** Listing + SEO */
  listTitle: string;
  listTagline: string;
  listDescription: string;
  listMeta: string;
  listImage: string;
  listImageAlt: string;
  listStats?: CaseStudyStat[];

  heroTitle: string;
  heroSubtitle: string;
  heroMeta: string;
  heroImage: string;
  heroImageAlt: string;

  overview: { heading: string; body: string };
  challenge: { heading: string; intro: string; bullets?: string[] };
  strategy: { heading: string; intro: string; bullets?: string[] };
  execution: CaseStudyExecutionBlock[];
  results: { heading: string; stats: CaseStudyStat[]; closing: string };
  closingStatement: string;
  cta: { title: string; subtext: string };
};
