import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="py-32 md:py-64 bg-surface-container-lowest px-8">
      <div className="max-w-7xl mx-auto">
        <div className="asymmetric-grid gap-24">
          <div className="relative">
            <div className="sticky top-40">
              <h2 className="font-headline font-black text-5xl md:text-7xl uppercase tracking-tighter text-neutral-900 mb-12 leading-[0.9]">
                About
                <br /> Bheard.
              </h2>
              <div className="w-24 h-1 bg-primary mb-8" />
            </div>
          </div>
          <div className="flex flex-col gap-16 md:pt-32">
            <p className="font-body text-2xl md:text-4xl font-light text-neutral-700 leading-tight">
              At{" "}
              <span className="text-neutral-900 font-bold italic">Bheard</span>,
              we help brands grow with simple and effective marketing strategies.
              We focus on what actually works — getting you more visibility, more
              leads, and{" "}
              <span className="text-primary-fixed">more customers.</span>.
            </p>
            <p className="font-body text-xl md:text-2xl text-on-surface-variant leading-relaxed">
              From social media to paid ads and branding, we create campaigns
              that connect with your audience and drive real business growth.
            </p>
            <div className="mt-12 overflow-hidden rounded-lg">
              <div className="relative w-full aspect-[16/10]">
                <Image
                  alt="AI Visualization"
                  className="w-full grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105 object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBx0ZmWXK4ejCb5FNLjkqZ92PbbxCcaTrot15dBMVDczLUNwAgKQIIVgAXKW102hkwwgeXyrAWQv4RTws6j7HSWQozGU3SdHHKzUQ7eMUinsn4wR6RU7RtzkD-kXQrBbnLqPLpWTiKqs2h7o5cL1HqxC8U5FHpTNCTo2Epq99-hDHzHE43gE-T88BE2_-EHmqNIiSXMSBsnDdqESBG3RX1b3O_t8DNUYW3NMj-XAzHzBT132_dmLCSw3kax7asoSo3jkplR5aKOVKA"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
