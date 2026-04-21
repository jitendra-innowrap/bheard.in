export default function CTASection() {
  return (
    <section className="py-40 bg-primary-container px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h3 data-g-step="true" className="font-headline text-[clamp(2.5rem,8vw,8rem)] font-black text-on-primary-container uppercase tracking-tighter mb-12 leading-none">
          READY TO BE
          <br />
          HEARD?
        </h3>
        <div data-g-step="true" className="flex flex-col md:flex-row justify-center gap-6 items-center">
          <button className="bg-surface text-on-surface px-12 py-6 rounded-lg font-headline font-black uppercase text-xl tracking-widest hover:bg-surface-container-highest transition-all transform hover:-rotate-2">
            Let&apos;s Talk
          </button>
          <p className="font-body text-on-primary-container font-bold text-lg max-w-xs md:text-left">
            We work with a limited number of clients to ensure quality. Book a
            call and let&apos;s grow your brand.
          </p>
        </div>
      </div>
    </section>
  );
}
