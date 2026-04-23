/** Curated Unsplash assets for Brand / Tech solution pages (hostname allowed in next.config). */

export const BRAND_HERO_MEDIA = {
  src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=2000&q=80",
  alt: "Creative team reviewing brand mood boards and strategy notes in a bright studio",
} as const;

export const TECH_HERO_MEDIA = {
  src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=2000&q=80",
  alt: "Code on a monitor with a clean desk setup representing engineered product work",
} as const;

export const BRAND_CHAOS_MEDIA = {
  src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1600&q=80",
  alt: "Busy meeting with many screens suggesting fragmented marketing noise",
} as const;

export const BRAND_STRUCTURE_MEDIA = {
  src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
  alt: "Minimal open office with structured lines and calm workspace light",
} as const;

export const BRAND_SERVICE_IMAGES: Record<string, { imageSrc: string; imageAlt: string }> = {
  copy: {
    imageSrc: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Notebook and pen for copywriting and narrative craft",
  },
  video: {
    imageSrc: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Video editing timeline on a display",
  },
  design: {
    imageSrc: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Graphic design tools and color swatches on a desk",
  },
  campaign: {
    imageSrc: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Analytics dashboard suggesting campaign performance",
  },
};

export const TECH_SERVICE_IMAGES: Record<string, { imageSrc: string; imageAlt: string }> = {
  mobile: {
    imageSrc: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Hands holding a smartphone showing a polished mobile interface",
  },
  ux: {
    imageSrc: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "UI wireframes and sticky notes on a desk",
  },
  commerce: {
    imageSrc: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Checkout and ecommerce shopping experience on a laptop",
  },
  ai: {
    imageSrc: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Abstract neural visualization representing AI automation",
  },
};

export const PROCESS_THUMB_BRAND: Record<string, { imageSrc: string; imageAlt: string }> = {
  Discover: {
    imageSrc: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Team discovery workshop",
  },
  Define: {
    imageSrc: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Strategist presenting positioning slides",
  },
  Design: {
    imageSrc: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Design workspace with layouts",
  },
  Deploy: {
    imageSrc: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Campaign launch and collaboration",
  },
  Optimize: {
    imageSrc: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Analytics charts for optimization",
  },
};

export const PROCESS_THUMB_TECH: Record<string, { imageSrc: string; imageAlt: string }> = {
  Ideation: {
    imageSrc: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Whiteboard ideation session",
  },
  Wireframing: {
    imageSrc: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24d?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Wireframes sketched for a product",
  },
  Development: {
    imageSrc: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Developer typing on a laptop",
  },
  Testing: {
    imageSrc: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    imageAlt: "QA testing devices on a desk",
  },
  "Launch & scale": {
    imageSrc: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Growth metrics on a dashboard",
  },
};

export const CASE_MOMENT_THUMBS: Record<string, { imageSrc: string; imageAlt: string }> = {
  eng: {
    imageSrc: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Social engagement on mobile",
  },
  ret: {
    imageSrc: "https://images.unsplash.com/photo-1432888498266-38ffec018eaf?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Audience watching content on a laptop",
  },
  reach: {
    imageSrc: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Team celebrating a campaign milestone",
  },
};
