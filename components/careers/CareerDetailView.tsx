"use client";

import { FormEvent, useState } from "react";

export type CareerDetail = {
  slug: string;
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
};

export default function CareerDetailView({ role }: { role: CareerDetail }) {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="bg-surface py-section-y-sm md:py-section-y">
      <div className="mx-auto max-w-content-max px-gutter-sm md:px-gutter">
        <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">{role.department}</p>
        <h1 className="mt-4 font-headline text-[clamp(2rem,4vw,3.5rem)] font-black uppercase leading-tight tracking-tight text-on-background">
          {role.title}
        </h1>
      </div>

      <div className="mx-auto mt-10 grid max-w-content-max gap-10 px-gutter-sm md:grid-cols-[320px_1fr] md:px-gutter">
        <aside className="h-fit border border-outline-variant/60 bg-surface-container-low p-6 md:sticky md:top-28">
          <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">Role meta</p>
          <dl className="mt-5 space-y-4">
            <div>
              <dt className="font-body text-xs uppercase tracking-[0.14em] text-on-surface-variant">Type</dt>
              <dd className="mt-1 font-semibold text-on-background">{role.type}</dd>
            </div>
            <div>
              <dt className="font-body text-xs uppercase tracking-[0.14em] text-on-surface-variant">Location</dt>
              <dd className="mt-1 font-semibold text-on-background">{role.location}</dd>
            </div>
            <div>
              <dt className="font-body text-xs uppercase tracking-[0.14em] text-on-surface-variant">Team</dt>
              <dd className="mt-1 font-semibold text-on-background">{role.department}</dd>
            </div>
          </dl>
        </aside>

        <div className="space-y-8">
          <article className="prose prose-neutral max-w-none">
            <pre className="whitespace-pre-wrap font-body text-base leading-relaxed text-on-surface-variant">{role.description}</pre>
          </article>

          <div className="border border-outline-variant/60 bg-surface-container-low p-6">
            <h2 className="font-headline text-2xl font-black uppercase tracking-tight text-on-background">Apply for this role</h2>
            {!submitted ? (
              <form onSubmit={onSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
                <input required placeholder="Name" className="border-b border-outline-variant bg-transparent px-2 py-3 font-body outline-none focus:border-primary md:col-span-1" />
                <input required type="email" placeholder="Email" className="border-b border-outline-variant bg-transparent px-2 py-3 font-body outline-none focus:border-primary md:col-span-1" />
                <input placeholder="Portfolio link" className="border-b border-outline-variant bg-transparent px-2 py-3 font-body outline-none focus:border-primary md:col-span-2" />
                <textarea required placeholder="Message" rows={4} className="border-b border-outline-variant bg-transparent px-2 py-3 font-body outline-none focus:border-primary md:col-span-2" />
                <button className="mt-2 inline-flex w-full items-center justify-center gap-2 bg-primary px-6 py-3 font-label text-sm font-bold uppercase tracking-[0.15em] text-on-primary md:col-span-2">
                  Submit application <span aria-hidden>→</span>
                </button>
              </form>
            ) : (
              <p className="mt-5 font-body text-on-surface-variant">
                Thanks for applying. We will review your details and get back to you with next steps.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
