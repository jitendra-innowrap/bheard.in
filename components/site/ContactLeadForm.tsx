"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  message: string;
};

const initialState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  message: "",
};

export default function ContactLeadForm({ sourcePage }: { sourcePage?: string }) {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onChange =
    (key: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const res = await fetch("/api/contact-leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, sourcePage: sourcePage ?? "/contact" }),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      setError(payload?.error?.message ?? "Could not submit your message. Please try again.");
      setSubmitting(false);
      return;
    }

    setForm(initialState);
    setSuccess("Thanks, your message has been submitted. Our team will reach out shortly.");
    setSubmitting(false);
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
      <label className="grid gap-1.5">
        <span className="text-sm font-semibold text-on-surface">Full name</span>
        <input
          required
          value={form.fullName}
          onChange={onChange("fullName")}
          className="h-11 rounded-md border border-outline-variant bg-white px-3 text-sm text-on-surface outline-none transition focus:border-primary"
          placeholder="Your full name"
        />
      </label>

      <label className="grid gap-1.5">
        <span className="text-sm font-semibold text-on-surface">Email address</span>
        <input
          required
          type="email"
          value={form.email}
          onChange={onChange("email")}
          className="h-11 rounded-md border border-outline-variant bg-white px-3 text-sm text-on-surface outline-none transition focus:border-primary"
          placeholder="name@company.com"
        />
      </label>

      <label className="grid gap-1.5">
        <span className="text-sm font-semibold text-on-surface">Phone</span>
        <input
          value={form.phone}
          onChange={onChange("phone")}
          className="h-11 rounded-md border border-outline-variant bg-white px-3 text-sm text-on-surface outline-none transition focus:border-primary"
          placeholder="+91 90000 00000"
        />
      </label>

      <label className="grid gap-1.5">
        <span className="text-sm font-semibold text-on-surface">Company</span>
        <input
          value={form.company}
          onChange={onChange("company")}
          className="h-11 rounded-md border border-outline-variant bg-white px-3 text-sm text-on-surface outline-none transition focus:border-primary"
          placeholder="Your company (optional)"
        />
      </label>

      <label className="grid gap-1.5 md:col-span-2">
        <span className="text-sm font-semibold text-on-surface">How can we help?</span>
        <textarea
          required
          value={form.message}
          onChange={onChange("message")}
          rows={6}
          className="rounded-md border border-outline-variant bg-white px-3 py-2.5 text-sm text-on-surface outline-none transition focus:border-primary"
          placeholder="Share your goals, project context, and timeline."
        />
      </label>

      {error ? <p className="md:col-span-2 text-sm text-red-600">{error}</p> : null}
      {success ? (
        <div className="md:col-span-2 relative overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,158,11,0.18),transparent_45%)]" />
          <div className="relative flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 h-5 w-5 animate-pulse text-emerald-600" />
            <p className="text-sm leading-relaxed">{success}</p>
          </div>
        </div>
      ) : null}

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-bold uppercase tracking-wide text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Sending..." : "Send message"}
        </button>
      </div>
    </form>
  );
}

