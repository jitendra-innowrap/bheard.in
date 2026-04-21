import Image from "next/image";

interface ProcessStepProps {
  number: string;
  title: string;
  description: string;
}

const steps: ProcessStepProps[] = [
  {
    number: "01.",
    title: "Understand Your Business",
    description:
      "We learn about your goals, audience, and current challenges.",
  },
  {
    number: "02.",
    title: "Plan the Strategy",
    description:
      "We create a clear marketing plan based on what works best for you.",
  },
  {
    number: "03.",
    title: "Launch & Grow",
    description:
      "We run campaigns, track results, and keep improving for better performance.",
  },
];

export default function ProcessSection() {
  return (
    <section className="py-32 bg-surface px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div>
            <h3 className="font-headline text-5xl md:text-7xl font-black text-neutral-900 uppercase tracking-tighter mb-12">
              HOW WE
              <br />
              Work.
            </h3>
            <p className="text-neutral-700 text-lg mb-12 max-w-md">
              We follow a simple process to help your business grow step by
              step.
            </p>
            <div className="flex flex-col gap-8">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-6 items-start">
                  <span className="font-headline text-2xl font-black text-primary">
                    {step.number}
                  </span>
                  <div>
                    <h6 className="font-headline font-bold text-neutral-900 uppercase text-xl">
                      {step.title}
                    </h6>
                    <p className="text-on-surface-variant text-sm mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-surface-container-high rounded-lg overflow-hidden border border-outline-variant/10">
              <Image
                alt="Process Visualization"
                className="w-full h-full object-cover mix-blend-overlay opacity-50"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg3pCJ1YQ1bBiyeOlc3qEUFXWjzblWMRzb_h_bwFBic5TXf47PriBO5WenCpckMly67fRsWRy8OkffzmMKzx7wJfEVvUKsfozGPmJxwzrwjAd5nIEUFmdZo8xPWXRYsJnu2KV6LF2kiPNqLpOUnLwjsRJupddltZuK_L1MeNFcso1E43QU54VrVxm7fEF7I6BOQ8AZXvByU-SEPQJ8MQDKgJ2dhluEhC1Pu5AEnxGmJG-pJqSsm204xr-tvc8pHW31b3QwAoC2ULo"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-4 border-primary/20 rounded-full animate-ping" />
                <div className="absolute w-32 h-32 border border-primary flex items-center justify-center rounded-full bg-surface/80 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-4xl text-primary">
                    play_arrow
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
