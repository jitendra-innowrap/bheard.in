"use client";

import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { Input } from "@/components/admin/ui/input";
import { Textarea } from "@/components/admin/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/admin/ui/select";
import { FormField } from "@/components/admin/ui/form-field";
import { Button } from "@/components/admin/ui/button";

const blogFormSchema = z.object({
  slug: z.string().min(3, "Slug is required"),
  title: z.string().min(5, "Title is required"),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters"),
  category: z.string().min(2, "Category is required"),
  readTime: z.number().min(1).max(60),
  content: z.string().min(60, "Content is too short"),
  published: z.boolean(),
  publishedAt: z.string().nullable(),
});

type BlogFormModel = z.infer<typeof blogFormSchema>;

export default function BlogForm({
  initial,
  mode,
}: {
  initial?: BlogFormModel;
  mode: "create" | "edit";
}) {
  const form = useForm<BlogFormModel>({
    resolver: zodResolver(blogFormSchema),
    defaultValues:
      initial ?? {
        slug: "",
        title: "",
        excerpt: "",
        category: "Brand Strategy",
        readTime: 6,
        content: "",
        published: false,
        publishedAt: null,
      },
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submit = form.handleSubmit(async (model) => {
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
  });

  return (
    <form onSubmit={submit} className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Title" error={form.formState.errors.title?.message}>
          <Input {...form.register("title")} />
        </FormField>
        <FormField label="Slug" error={form.formState.errors.slug?.message}>
          <Input {...form.register("slug")} disabled={mode === "edit"} />
        </FormField>
        <FormField label="Category" error={form.formState.errors.category?.message}>
          <Controller
            control={form.control}
            name="category"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Brand Strategy">Brand Strategy</SelectItem>
                  <SelectItem value="Product Engineering">Product Engineering</SelectItem>
                  <SelectItem value="AI Product">AI Product</SelectItem>
                  <SelectItem value="Content Systems">Content Systems</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
        <FormField label="Read Time (minutes)" error={form.formState.errors.readTime?.message}>
          <Input type="number" min={1} max={60} {...form.register("readTime", { valueAsNumber: true })} />
        </FormField>
      </div>

      <FormField label="Excerpt" error={form.formState.errors.excerpt?.message}>
        <Textarea rows={3} {...form.register("excerpt")} />
      </FormField>

      <div data-color-mode="dark">
        <MDEditor
          value={form.watch("content")}
          onChange={(value) => form.setValue("content", value ?? "", { shouldValidate: true })}
          height={420}
        />
      </div>
      {form.formState.errors.content?.message ? (
        <p className="text-xs text-destructive">{form.formState.errors.content.message}</p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <label className="inline-flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={form.watch("published")}
            onChange={(e) => form.setValue("published", e.target.checked)}
          />
          Published
        </label>
        <Input
          type="datetime-local"
          value={form.watch("publishedAt") ? form.watch("publishedAt")?.slice(0, 16) : ""}
          onChange={(e) => form.setValue("publishedAt", e.target.value ? new Date(e.target.value).toISOString() : null)}
          className="w-auto"
        />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button
        disabled={saving}
        className="w-fit"
      >
        {saving ? "Saving..." : mode === "create" ? "Create post" : "Save changes"}
      </Button>
    </form>
  );
}
