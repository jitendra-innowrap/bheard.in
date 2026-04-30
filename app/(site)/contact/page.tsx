import type { Metadata } from "next";
import InnerPageHero from "@/components/system/InnerPageHero";
import ContactLeadForm from "@/components/site/ContactLeadForm";

export const metadata: Metadata = {
  title: "Contact | BHEARD",
  description: "Get in touch with BHEARD Consulting to discuss growth, design, and digital strategy.",
};

export default function ContactPage() {
  return (
    <>
      <InnerPageHero
        watermark="Contact"
        heading="Let's Build Something That Performs"
        subtext="Tell us about your brand goals and our team will connect with a focused action plan."
      />
      <section className="bg-surface px-gutter-sm py-section-y-sm md:px-gutter md:py-section-y">
        <div className="mx-auto max-w-5xl rounded-2xl border border-outline-variant/60 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6">
            <h2 className="font-headline text-2xl font-bold text-on-surface">Contact the team</h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              Every submission is routed to our CRM leads queue so your request is tracked end-to-end.
            </p>
          </div>
          <ContactLeadForm sourcePage="/contact" />
        </div>
      </section>
    </>
  );
}

