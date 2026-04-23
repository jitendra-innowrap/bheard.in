import Link from "next/link";

type SolutionsClosingCtaProps = {
  id?: string;
  headline: string;
  cta: { href: string; label: string };
};

export default function SolutionsClosingCta({ id, headline, cta }: SolutionsClosingCtaProps) {
  return (
    <section
      id={id}
      className="border-t border-inverse-surface/10 bg-gradient-to-b from-surface-container-high to-surface py-section-y-sm md:py-section-y"
    >
      <div className="mx-auto max-w-content-max px-gutter-sm text-center md:px-gutter">
        <h2 className="mx-auto max-w-3xl font-headline text-[clamp(1.85rem,4vw,3rem)] font-black uppercase leading-snug tracking-tight text-on-background">
          {headline}
        </h2>
        <Link
          href={cta.href}
          className="mt-10 inline-flex items-center gap-2 rounded-lg bg-primary px-9 py-4 font-headline text-sm font-bold uppercase tracking-widest text-on-primary shadow-[0_0_48px_-12px_rgba(255,146,62,0.65)] transition-transform hover:scale-[1.02]"
        >
          {cta.label} <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
