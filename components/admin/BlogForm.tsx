"use client";

import { FormEvent, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { useRouter } from "next/navigation";

type BlogFormModel = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  content: string;
  published: boolean;
  publishedAt?: string | null;
};

export default function BlogForm({
  initial,
  mode,
}: {
  initial?: BlogFormModel;
  mode: "create" | "edit";
}) {
  const [model, setModel] = useState<BlogFormModel>(
    initial ?? {
      slug: "",
      title: "",
      excerpt: "",
      category: "",
      readTime: 6,
      content: "",
      published: false,
      publishedAt: null,
    }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const url = mode === "create" ? "/api/blog" : `/api/blog/${initial?.slug}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...model,
        publishedAt: model.publishedAt || null,
      }),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      setError(payload?.error?.message ?? "Failed to save post");
      setSaving(false);
      return;
    }

    router.push("/admin/blog");
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <input
          value={model.title}
          onChange={(e) => setModel((s) => ({ ...s, title: e.target.value }))}
          placeholder="Title"
          className="border-b border-outline-variant bg-transparent px-2 py-3 outline-none focus:border-primary"
          required
        />
        <input
          value={model.slug}
          onChange={(e) => setModel((s) => ({ ...s, slug: e.target.value }))}
          placeholder="Slug (kebab-case)"
          className="border-b border-outline-variant bg-transparent px-2 py-3 outline-none focus:border-primary"
          required
          disabled={mode === "edit"}
        />
        <input
          value={model.category}
          onChange={(e) => setModel((s) => ({ ...s, category: e.target.value }))}
          placeholder="Category"
          className="border-b border-outline-variant bg-transparent px-2 py-3 outline-none focus:border-primary"
          required
        />
        <input
          type="number"
          min={1}
          max={60}
          value={model.readTime}
          onChange={(e) => setModel((s) => ({ ...s, readTime: Number(e.target.value) }))}
          placeholder="Read time (min)"
          className="border-b border-outline-variant bg-transparent px-2 py-3 outline-none focus:border-primary"
          required
        />
      </div>

      <textarea
        value={model.excerpt}
        onChange={(e) => setModel((s) => ({ ...s, excerpt: e.target.value }))}
        placeholder="Excerpt"
        rows={3}
        className="border-b border-outline-variant bg-transparent px-2 py-3 outline-none focus:border-primary"
        required
      />

      <div data-color-mode="dark">
        <MDEditor
          value={model.content}
          onChange={(value) => setModel((s) => ({ ...s, content: value ?? "" }))}
          height={420}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={model.published}
            onChange={(e) => setModel((s) => ({ ...s, published: e.target.checked }))}
          />
          Published
        </label>
        <input
          type="datetime-local"
          value={model.publishedAt ? model.publishedAt.slice(0, 16) : ""}
          onChange={(e) => setModel((s) => ({ ...s, publishedAt: e.target.value ? new Date(e.target.value).toISOString() : null }))}
          className="border-b border-outline-variant bg-transparent px-2 py-3 outline-none focus:border-primary"
        />
      </div>

      {error ? <p className="text-sm text-error-container">{error}</p> : null}

      <button
        disabled={saving}
        className="inline-flex items-center justify-center gap-2 bg-primary px-6 py-3 font-label text-sm font-bold uppercase tracking-[0.15em] text-on-primary disabled:opacity-60"
      >
        {saving ? "Saving..." : mode === "create" ? "Create post" : "Save changes"}
      </button>
    </form>
  );
}
