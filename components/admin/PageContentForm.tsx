"use client";

import { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/admin/ui/input";
import { FormField } from "@/components/admin/ui/form-field";
import { Button } from "@/components/admin/ui/button";

const pageFormSchema = z.object({
  title: z.string().min(3, "Title is required"),
  content: z.string().min(20, "Content is too short"),
});

type PageFormModel = z.infer<typeof pageFormSchema>;

export default function PageContentForm({
  slug,
  initial,
  loading = false,
}: {
  slug: string;
  initial?: { title: string; content: string };
  loading?: boolean;
}) {
  const form = useForm<PageFormModel>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: initial ?? {
      title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      content: "",
    },
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (initial) {
      form.reset(initial);
    }
  }, [initial, form]);

  const submit = form.handleSubmit(async (model) => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    const res = await fetch(`/api/pages/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(model),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      setError(payload?.error?.message ?? "Failed to save page");
      setSaving(false);
      return;
    }

    setSaving(false);
    setSuccess(true);
    router.refresh();
    setTimeout(() => setSuccess(false), 3000);
  });

  return (
    <form onSubmit={submit} className="grid gap-5">
      {loading ? <div className="h-10 animate-pulse rounded-md border border-border bg-card" /> : null}
      <FormField label="Page Title" error={form.formState.errors.title?.message}>
        <Input {...form.register("title")} />
      </FormField>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Content (Markdown)</label>
        <div data-color-mode="light">
          <MDEditor
            value={form.watch("content")}
            onChange={(value) => form.setValue("content", value ?? "", { shouldValidate: true })}
            height={560}
          />
        </div>
        {form.formState.errors.content?.message ? (
          <p className="mt-1 text-xs text-destructive">{form.formState.errors.content.message}</p>
        ) : null}
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {success ? <p className="text-sm text-green-600">Page saved successfully.</p> : null}

      <Button disabled={saving} className="w-fit">
        {saving ? "Saving..." : "Save Page"}
      </Button>
    </form>
  );
}
