import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CareerApplicationForm from "@/components/careers/CareerApplicationForm";
import { sectionPageX } from "@/components/system/sectionTheme";

export type CareerDetailRole = {
  slug: string;
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  /** Present when loaded from database — enables online applications + resume storage */
  id?: string;
};

export default function CareerDetailView({
  role,
  onlineApplicationsReady,
}: {
  role: CareerDetailRole;
  onlineApplicationsReady: boolean;
}) {
  return (
    <div data-motion-exclude className="bg-surface pb-section-y-sm pt-8 md:pb-section-y md:pt-10">
      <div className={`${sectionPageX} mx-auto max-w-content-max`}>
        <nav aria-label="Breadcrumb" className="font-body text-sm text-on-surface-variant">
          <Link href="/careers" className="font-semibold text-primary underline-offset-4 hover:underline">
            Careers
          </Link>
          <span className="mx-2 text-neutral-400" aria-hidden>
            /
          </span>
          <span className="text-on-background">{role.title}</span>
        </nav>

        <header className="mt-8 max-w-4xl">
          <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">{role.department}</p>
          <h1 className="mt-3 font-headline text-[clamp(2rem,4.5vw,3.25rem)] font-black uppercase leading-tight tracking-tight text-on-background">
            {role.title}
          </h1>
          <p className="mt-4 font-body text-sm uppercase tracking-[0.14em] text-on-surface-variant md:text-base">
            {role.location} · {role.type}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#apply"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-headline text-xs font-black uppercase tracking-widest text-on-primary shadow-sm transition hover:bg-primary-fixed-dim"
            >
              Apply now
            </a>
            <Link
              href="/careers"
              className="inline-flex items-center justify-center rounded-lg border border-outline-variant bg-white px-6 py-3 font-headline text-xs font-bold uppercase tracking-wide text-neutral-800 transition hover:border-primary hover:text-primary dark:bg-white dark:text-neutral-900"
            >
              All roles
            </Link>
          </div>
        </header>
      </div>

      <div className={`${sectionPageX} mx-auto mt-12 grid max-w-content-max gap-10 md:mt-16 md:grid-cols-[minmax(0,280px)_1fr] md:gap-12 lg:grid-cols-[minmax(0,300px)_1fr]`}>
        <aside className="h-fit space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-200 dark:bg-white">
            <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">Role snapshot</p>
            <dl className="mt-5 space-y-5">
              <div>
                <dt className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">Type</dt>
                <dd className="mt-1 font-body text-base font-semibold text-neutral-900">{role.type}</dd>
              </div>
              <div>
                <dt className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">Location</dt>
                <dd className="mt-1 font-body text-base font-semibold text-neutral-900">{role.location}</dd>
              </div>
              <div>
                <dt className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">Team</dt>
                <dd className="mt-1 font-body text-base font-semibold text-neutral-900">{role.department}</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 to-transparent p-6 dark:from-primary/15">
            <p className="font-headline text-sm font-bold uppercase tracking-wide text-neutral-900">Questions?</p>
            <p className="mt-2 font-body text-sm leading-relaxed text-neutral-700">
              Reach the hiring desk at{" "}
              <a className="font-semibold text-primary underline underline-offset-4" href="mailto:careers@bheard.in">
                careers@bheard.in
              </a>
              .
            </p>
          </div>
        </aside>

        <div className="min-w-0 space-y-10 md:space-y-12">
          <section
            aria-labelledby="job-desc-heading"
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_1px_0_rgba(0,0,0,0.04)] md:p-10 lg:p-12 dark:border-neutral-200 dark:bg-white"
          >
            <h2 id="job-desc-heading" className="font-headline text-xl font-black uppercase tracking-tight text-neutral-900 md:text-2xl">
              Role overview & responsibilities
            </h2>
            <p className="mt-2 font-body text-sm text-neutral-600">Everything you need to know before you apply.</p>
            <div className="prose prose-neutral prose-headings:font-headline prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tight prose-h1:text-2xl prose-h2:mt-10 prose-h2:text-lg prose-h2:text-neutral-900 prose-p:text-neutral-700 prose-li:text-neutral-700 prose-strong:text-neutral-900 mt-8 max-w-none border-t border-neutral-100 pt-8 prose-a:text-primary dark:prose-headings:text-neutral-900 dark:prose-p:text-neutral-700 dark:prose-li:text-neutral-700">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{role.description}</ReactMarkdown>
            </div>
          </section>

          <section
            id="apply"
            aria-labelledby="apply-heading"
            className="scroll-mt-28 rounded-2xl border border-neutral-200/90 bg-neutral-50/40 p-1 md:border-primary/15 md:bg-gradient-to-br md:from-primary/[0.06] md:to-transparent dark:border-neutral-200 dark:bg-transparent"
          >
            <CareerApplicationForm
              slug={role.slug}
              roleTitle={role.title}
              onlineApplicationsReady={onlineApplicationsReady}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
