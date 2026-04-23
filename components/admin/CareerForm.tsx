"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type CareerFormModel = {
  slug: string;
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  active: boolean;
};

export default function CareerForm({
  initial,
  mode,
}: {
  initial?: CareerFormModel;
  mode: "create" | "edit";
}) {
  const [model, setModel] = useState<CareerFormModel>(
    initial ?? {
      slug: "",
      title: "",
      department: "",
      type: "Full-time",
      location: "Remote",
      description: "",
      active: true,
    }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const url = mode === "create" ? "/api/careers" : `/api/careers/${initial?.slug}`;
    const method = mode === "create" ? "POST" : "PUT";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(model),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      setError(payload?.error?.message ?? "Failed to save role");
      setSaving(false);
      return;
    }

    router.push("/admin/careers");
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <input
          value={model.title}
          onChange={(e) => setModel((s) => ({ ...s, title: e.target.value }))}
          placeholder="Role title"
          className="border-b border-outline-variant bg-transparent px-2 py-3 outline-none focus:border-primary"
          required
        />
        <input
          value={model.slug}
          onChange={(e) => setModel((s) => ({ ...s, slug: e.target.value }))}
          placeholder="Slug"
          className="border-b border-outline-variant bg-transparent px-2 py-3 outline-none focus:border-primary"
          required
          disabled={mode === "edit"}
        />
        <input
          value={model.department}
          onChange={(e) => setModel((s) => ({ ...s, department: e.target.value }))}
          placeholder="Department"
          className="border-b border-outline-variant bg-transparent px-2 py-3 outline-none focus:border-primary"
          required
        />
        <input
          value={model.type}
          onChange={(e) => setModel((s) => ({ ...s, type: e.target.value }))}
          placeholder="Type"
          className="border-b border-outline-variant bg-transparent px-2 py-3 outline-none focus:border-primary"
          required
        />
        <input
          value={model.location}
          onChange={(e) => setModel((s) => ({ ...s, location: e.target.value }))}
          placeholder="Location"
          className="border-b border-outline-variant bg-transparent px-2 py-3 outline-none focus:border-primary md:col-span-2"
          required
        />
      </div>

      <textarea
        value={model.description}
        onChange={(e) => setModel((s) => ({ ...s, description: e.target.value }))}
        placeholder="Role description (markdown/plain text)"
        rows={14}
        className="border border-outline-variant bg-transparent px-3 py-3 outline-none focus:border-primary"
        required
      />

      <label className="inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={model.active}
          onChange={(e) => setModel((s) => ({ ...s, active: e.target.checked }))}
        />
        Active
      </label>

      {error ? <p className="text-sm text-error-container">{error}</p> : null}

      <button
        disabled={saving}
        className="inline-flex items-center justify-center gap-2 bg-primary px-6 py-3 font-label text-sm font-bold uppercase tracking-[0.15em] text-on-primary disabled:opacity-60"
      >
        {saving ? "Saving..." : mode === "create" ? "Create role" : "Save changes"}
      </button>
    </form>
  );
}
