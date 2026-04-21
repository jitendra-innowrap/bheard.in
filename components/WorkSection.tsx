import Image from "next/image";

const projects = [
  {
    id: "01",
    title: "Luxury Hospitality Growth",
    metric: "+182% qualified inquiries",
    category: "Performance + Creative",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=80",
    col: "md:col-span-7",
    ratio: "aspect-[16/10]",
  },
  {
    id: "02",
    title: "Wellness Brand Repositioning",
    metric: "3.4x engagement lift",
    category: "Brand + Content",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    col: "md:col-span-5",
    ratio: "aspect-[4/5]",
  },
  {
    id: "03",
    title: "Restaurant Visual Story System",
    metric: "+126% organic reach",
    category: "Social + Video",
    image:
      "https://images.unsplash.com/photo-1495563381401-ecfbcaaa67d1?auto=format&fit=crop&w=1400&q=80",
    col: "md:col-span-4",
    ratio: "aspect-[4/3]",
  },
  {
    id: "04",
    title: "D2C Commerce Acceleration",
    metric: "41% lower acquisition cost",
    category: "Ads + Funnel Design",
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1400&q=80",
    col: "md:col-span-4",
    ratio: "aspect-[4/3]",
  },
  {
    id: "05",
    title: "Education Lead Engine",
    metric: "4.1x lead velocity",
    category: "Growth + Automation",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1400&q=80",
    col: "md:col-span-4",
    ratio: "aspect-[4/3]",
  },
];

function WorkCard({
  id,
  title,
  metric,
  category,
  image,
  col,
  ratio,
}: (typeof projects)[number]) {
  return (
    <article data-g-step="true" className={`${col} group cursor-pointer`}>
      <div className={`relative ${ratio} overflow-hidden`}>
        <Image
          alt={title}
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale group-hover:grayscale-0"
          src={image}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-85" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {id} / {category}
          </p>
          <h4 className="mt-2 font-headline text-2xl font-black uppercase leading-tight text-surface md:text-3xl">
            {title}
          </h4>
          <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-surface/90">
            {metric}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function WorkSection() {
  return (
    <section className="py-32 bg-surface-container-lowest px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <h3 data-g-step="true" className="font-headline text-5xl md:text-8xl font-black uppercase text-neutral-900 leading-[0.9]">
          SELECTED
          <br />
          WORKS
        </h3>
        <p data-g-step="true" className="font-body text-neutral-700 max-w-sm uppercase tracking-widest text-xs font-bold border-b border-primary pb-2">
          View Archive (24)
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
        {projects.map((project) => (
          <WorkCard key={project.id} {...project} />
        ))}
      </div>
    </section>
  );
}
