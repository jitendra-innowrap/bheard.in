"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/admin/ui/input";
import { Textarea } from "@/components/admin/ui/textarea";
import { FormField } from "@/components/admin/ui/form-field";
import { Button } from "@/components/admin/ui/button";

const storyFormSchema = z.object({
  slug: z.string().min(3),
  title: z.string().min(4),
  industry: z.string().min(2),
  summary: z.string().min(20),
  about: z.string().min(40),
  challenge: z.string().min(40),
  solution: z.string().min(40),
  results: z.string().min(40),
  contactCta: z.string().min(5),
  published: z.boolean(),
});

type StoryFormModel = z.infer<typeof storyFormSchema>;

export default function StoryForm({
  initial,
  mode,
}: {
  initial?: StoryFormModel;
  mode: "create" | "edit";
}) {
  const form = useForm<StoryFormModel>({
    resolver: zodResolver(storyFormSchema),
    defaultValues:
      initial ?? {
        slug: "",
        title: "",
        industry: "",
        summary: "",
        about: "",
        challenge: "",
        solution: "",
        results: "",
        contactCta: "Let's discuss your story",
        published: true,
      },
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submit = form.handleSubmit(async (model) => {
    setSaving(true);
    setError(null);
    const url = mode === "create" ? "/api/stories" : `/api/stories/${initial?.slug}`;
    const method = mode === "create" ? "POST" : "PUT";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(model),
    });
    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      setError(payload?.error?.message ?? "Failed to save story");
      setSaving(false);
      return;
    }
    router.push("/admin/success-stories");
    router.refresh();
  });

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Title" error={form.formState.errors.title?.message}>
          <Input {...form.register("title")} />
        </FormField>
        <FormField label="Slug" error={form.formState.errors.slug?.message}>
          <Input {...form.register("slug")} disabled={mode === "edit"} />
        </FormField>
        <FormField label="Industry" error={form.formState.errors.industry?.message}>
          <Input {...form.register("industry")} />
        </FormField>
        <FormField label="Contact CTA" error={form.formState.errors.contactCta?.message}>
          <Input {...form.register("contactCta")} />
        </FormField>
      </div>
      <FormField label="Summary" error={form.formState.errors.summary?.message}>
        <Textarea rows={3} {...form.register("summary")} />
      </FormField>
      <FormField label="About" error={form.formState.errors.about?.message}>
        <Textarea rows={5} {...form.register("about")} />
      </FormField>
      <FormField label="Challenge" error={form.formState.errors.challenge?.message}>
        <Textarea rows={5} {...form.register("challenge")} />
      </FormField>
      <FormField label="Solution" error={form.formState.errors.solution?.message}>
        <Textarea rows={5} {...form.register("solution")} />
      </FormField>
      <FormField label="Results" error={form.formState.errors.results?.message}>
        <Textarea rows={5} {...form.register("results")} />
      </FormField>
      <label className="inline-flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={form.watch("published")}
          onChange={(e) => form.setValue("published", e.target.checked)}
        />
        Published
      </label>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={saving} className="w-fit">
        {saving ? "Saving..." : mode === "create" ? "Create story" : "Save changes"}
      </Button>
    </form>
  );
}
