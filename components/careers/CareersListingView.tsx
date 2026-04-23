import Link from "next/link";
import InnerPageHero from "@/components/system/InnerPageHero";
import { sectionPageX } from "@/components/system/sectionTheme";

export type CareerListItem = {
  slug: string;
  title: string;
  department: string;
  type: string;
  location: string;
  active: boolean;
};

export default function CareersListingView({ roles }: { roles: CareerListItem[] }) {
  return (
    <>
      <InnerPageHero
        watermark="JOIN"
        heading="We Hire People, Not Resumes"
        subtext="We work with people who care about ownership, quality, and building meaningful outcomes."
        theme="dark"
      />

      <section className={`bg-surface ${sectionPageX} py-section-y-sm md:py-section-y`}>
        <div className="mx-auto max-w-content-max">
          <div className="max-w-4xl border-l-2 border-primary pl-5">
            <p className="font-headline text-[clamp(1.6rem,3vw,2.6rem)] font-bold leading-tight text-on-background">
              We work async when needed, move with ownership, and optimize for taste plus measurable impact—not process theater.
            </p>
          </div>

          <div className="mt-14">
            <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">Open roles</p>
            <div className="mt-4 border-t border-outline-variant/60">
              {roles.length ? (
                roles.map((role) => (
                  <article
                    key={role.slug}
                    className="grid gap-4 border-b border-outline-variant/60 bg-surface py-6 transition-colors hover:bg-surface-tint/10 md:grid-cols-[1.2fr_1fr_auto] md:items-center"
                  >
                    <div>
                      <h2 className="font-headline text-2xl font-black uppercase leading-tight text-on-background">
                        {role.title}
                      </h2>
                      <p className="mt-2 font-label text-label-sm uppercase tracking-[0.18em] text-primary">{role.department}</p>
                    </div>
                    <p className="font-body text-sm uppercase tracking-[0.14em] text-on-surface-variant">
                      {role.location} · {role.type}
                    </p>
                    <Link
                      href={`/careers/${role.slug}`}
                      className="inline-flex items-center gap-2 font-label text-sm font-bold uppercase tracking-[0.16em] text-on-background"
                    >
                      Apply <span aria-hidden>→</span>
                    </Link>
                  </article>
                ))
              ) : (
                <div className="border-b border-outline-variant/60 py-8">
                  <p className="font-body text-on-surface-variant">
                    Nothing right now, but we are always open to great people.{" "}
                    <a className="font-semibold text-on-background underline decoration-primary underline-offset-4" href="mailto:careers@bheard.in">
                      careers@bheard.in
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-14 border-t border-outline-variant/60 pt-8">
            <h3 className="font-headline text-3xl font-black uppercase tracking-tight text-on-background">Do not see your role?</h3>
            <p className="mt-3 font-body text-on-surface-variant">
              Send us your work anyway at{" "}
              <a className="font-semibold text-on-background underline decoration-primary underline-offset-4" href="mailto:careers@bheard.in">
                careers@bheard.in
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
