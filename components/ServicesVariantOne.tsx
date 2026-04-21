const brandServices = [
  "Social Media Management",
  "Content and Copywriting",
  "Video Editing and Animations",
  "Graphic Design and Illustrations",
  "Campaign Planning",
];

const techServices = [
  "Custom Web Development",
  "Custom Mobile App Development",
  "UI/UX Design",
  "E-Commerce",
  "Chatbots and AI Agents",
];

function MicroCard({ title, tag }: { title: string; tag: string }) {
  return (
    <article className="group border border-outline-variant/60 bg-surface-container p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-surface-container-high">
      <span className="mb-4 inline-flex border border-outline-variant px-3 py-1 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
        {tag}
      </span>
      <h4 className="font-headline text-lg font-bold text-neutral-900">{title}</h4>
    </article>
  );
}

export default function ServicesVariantOne() {
  return (
    <section className="bg-surface px-8 py-24">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 md:mb-12">
          <p data-g-step="true" className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Variant One
          </p>
          <h2 data-g-step="true" className="font-headline text-3xl font-black uppercase tracking-tight text-neutral-900 md:text-5xl">
            Split Bento Grid
          </h2>
        </header>

        <div className="space-y-8">
          <section className="grid grid-cols-1 gap-4 md:grid-cols-12">
            <article data-g-step="true" className="group border border-outline-variant/60 bg-surface-container-low p-8 transition-all duration-400 hover:-translate-y-1 hover:bg-primary-container md:col-span-7 md:p-10">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                Brand Solutions
              </p>
              <h3 className="font-headline text-3xl font-black uppercase text-neutral-900 md:text-4xl">
                Visibility that drives trust and recall.
              </h3>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-on-surface-variant md:text-lg">
                We build brand systems that help your business feel consistent,
                memorable, and conversion-ready across every customer touchpoint.
              </p>
            </article>

            <div className="grid grid-cols-1 gap-4 md:col-span-5 md:grid-cols-2">
              {brandServices.map((service, idx) => (
                <div data-g-step="true" key={service}>
                  <MicroCard title={service} tag={`B0${idx + 1}`} />
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-12">
            <div className="grid grid-cols-1 gap-4 md:col-span-5 md:grid-cols-2">
              {techServices.map((service, idx) => (
                <div data-g-step="true" key={service}>
                  <MicroCard title={service} tag={`T0${idx + 1}`} />
                </div>
              ))}
            </div>

            <article data-g-step="true" className="group border border-outline-variant/60 bg-surface-container-low p-8 transition-all duration-400 hover:-translate-y-1 hover:bg-primary-container md:col-span-7 md:p-10">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                Tech Solutions
              </p>
              <h3 className="font-headline text-3xl font-black uppercase text-neutral-900 md:text-4xl">
                Digital products engineered for scale.
              </h3>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-on-surface-variant md:text-lg">
                From custom builds to AI workflows, we deliver fast, stable, and
                future-proof experiences designed around measurable business goals.
              </p>
            </article>
          </section>
        </div>
      </div>
    </section>
  );
}
