"use client";

import { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Controller } from "react-hook-form";
import { Input } from "@/components/admin/ui/input";
import { Textarea } from "@/components/admin/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/admin/ui/select";
import { Switch } from "@/components/admin/ui/switch";
import { DatePicker } from "@/components/admin/ui/date-picker";
import { FormField } from "@/components/admin/ui/form-field";
import { Button } from "@/components/admin/ui/button";

const blogFormSchema = z.object({
  slug: z.string().min(3, "Slug is required"),
  title: z.string().min(5, "Title is required"),
  subtitle: z.string().default(""),
  showAuthorDetails: z.boolean().default(true),
  author: z.string().default(""),
  authorImage: z.string().default(""),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters"),
  thumbnailUrl: z.string().default(""),
  thumbnailAlt: z.string().default(""),
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
    defaultValues:
      initial ?? {
        slug: "",
        title: "",
        subtitle: "",
        showAuthorDetails: true,
        author: "BHeard Editorial",
        authorImage: "",
        excerpt: "",
        thumbnailUrl: "",
        thumbnailAlt: "",
        category: "Brand Strategy",
        readTime: 6,
        content: "",
        published: false,
        publishedAt: null,
      },
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const title = form.watch("title");
  const thumbnailPreview = form.watch("thumbnailUrl");
  const showAuthorDetails = form.watch("showAuthorDetails");
  useEffect(() => {
    if (mode === "create") {
      const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      form.setValue("slug", slug, { shouldValidate: slug.length >= 3 });
    }
  }, [title, mode, form]);

  const submit = form.handleSubmit(async (model) => {
    setSaving(true);
    setError(null);
    const parsed = blogFormSchema.safeParse(model);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0];
        if (typeof key === "string") {
          form.setError(key as keyof BlogFormModel, { type: "manual", message: issue.message });
        }
      });
      setSaving(false);
      return;
    }

    const url = mode === "create" ? "/api/blog" : `/api/blog/${initial?.slug}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...parsed.data,
        subtitle: parsed.data.subtitle || "",
        author: parsed.data.showAuthorDetails ? parsed.data.author || "" : "",
        authorImage: parsed.data.showAuthorDetails ? parsed.data.authorImage || "" : "",
        thumbnailUrl: parsed.data.thumbnailUrl || "",
        thumbnailAlt: parsed.data.thumbnailAlt || "",
        publishedAt: parsed.data.publishedAt || null,
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
          <Input
            {...form.register("slug")}
            readOnly={mode === "create"}
            disabled={mode === "edit"}
            className={mode === "create" ? "bg-muted text-muted-foreground" : ""}
          />
        </FormField>
        <FormField label="Subtitle">
          <Input {...form.register("subtitle")} />
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
      <div className="rounded-md border border-border p-4">
        <label className="inline-flex items-center gap-2 text-sm text-foreground">
          <Switch
            checked={showAuthorDetails}
            onCheckedChange={(checked: boolean) => form.setValue("showAuthorDetails", checked, { shouldDirty: true })}
          />
          <span>Show Author Details</span>
        </label>
      </div>
      {showAuthorDetails ? (
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Author Name" error={form.formState.errors.author?.message}>
            <Input {...form.register("author")} placeholder="e.g. BHeard Editorial" />
          </FormField>
          <FormField label="Author Image URL">
            <Input {...form.register("authorImage")} placeholder="https://..." />
          </FormField>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Thumbnail URL">
          <Input {...form.register("thumbnailUrl")} placeholder="https://..." />
        </FormField>
        <FormField label="Thumbnail Alt">
          <Input {...form.register("thumbnailAlt")} placeholder="Describe thumbnail image" />
        </FormField>
      </div>

      <div className="rounded-md border border-border p-4">
        <p className="mb-3 text-sm font-medium">Upload thumbnail (ImageKit)</p>
        <Input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setUploading(true);
            setError(null);
            try {
              const fd = new FormData();
              fd.set("image", file);
              const res = await fetch("/api/admin/upload-image", { method: "POST", body: fd });
              const body = await res.json().catch(() => null);
              if (!res.ok || !body?.url) {
                setError(body?.error?.message ?? "Image upload failed");
                return;
              }
              form.setValue("thumbnailUrl", body.url, { shouldDirty: true });
              if (!form.getValues("thumbnailAlt")) {
                form.setValue("thumbnailAlt", file.name.replace(/\.[^.]+$/, ""), { shouldDirty: true });
              }
            } catch {
              setError("Image upload failed");
            } finally {
              setUploading(false);
              e.currentTarget.value = "";
            }
          }}
          disabled={uploading}
        />
        {uploading ? <p className="mt-2 text-xs text-muted-foreground">Uploading...</p> : null}
      </div>
      {thumbnailPreview ? (
        <div className="rounded-md border border-border bg-card p-4">
          <p className="mb-3 text-sm font-medium">Thumbnail preview</p>
          <div className="relative aspect-[16/9] w-full max-w-[420px] overflow-hidden rounded-md border border-border">
            <Image
              src={thumbnailPreview}
              alt={form.watch("thumbnailAlt") || form.watch("title") || "Blog thumbnail preview"}
              fill
              className="object-cover"
              sizes="420px"
            />
          </div>
        </div>
      ) : null}

      <FormField label="Excerpt" error={form.formState.errors.excerpt?.message}>
        <Textarea rows={3} {...form.register("excerpt")} />
      </FormField>

      <div data-color-mode="light">
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
          <Switch checked={form.watch("published")} onCheckedChange={(checked: boolean) => form.setValue("published", checked)} />
          <span>Published</span>
        </label>
        <DatePicker value={form.watch("publishedAt")} onChange={(next) => form.setValue("publishedAt", next)} />
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
