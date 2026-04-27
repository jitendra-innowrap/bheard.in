"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { Input } from "@/components/admin/ui/input";
import { Textarea } from "@/components/admin/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/admin/ui/select";
import { FormField } from "@/components/admin/ui/form-field";
import { Button } from "@/components/admin/ui/button";

const careerFormSchema = z.object({
  slug: z.string().min(3, "Slug is required"),
  title: z.string().min(4, "Title is required"),
  department: z.string().min(2, "Department is required"),
  type: z.string().min(2, "Type is required"),
  location: z.string().min(2, "Location is required"),
  description: z.string().min(120, "Description must be at least 120 characters"),
  active: z.boolean(),
});

type CareerFormModel = z.infer<typeof careerFormSchema>;

export default function CareerForm({
  initial,
  mode,
}: {
  initial?: CareerFormModel;
  mode: "create" | "edit";
}) {
  const form = useForm<CareerFormModel>({
    resolver: zodResolver(careerFormSchema),
    defaultValues:
      initial ?? {
        slug: "",
        title: "",
        department: "",
        type: "Full-time",
        location: "Remote",
        description: "",
        active: true,
      },
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submit = form.handleSubmit(async (model) => {
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
  });

  return (
    <form onSubmit={submit} className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Role title" error={form.formState.errors.title?.message}>
          <Input {...form.register("title")} />
        </FormField>
        <FormField label="Slug" error={form.formState.errors.slug?.message}>
          <Input {...form.register("slug")} disabled={mode === "edit"} />
        </FormField>
        <FormField label="Department" error={form.formState.errors.department?.message}>
          <Input {...form.register("department")} />
        </FormField>
        <FormField label="Type" error={form.formState.errors.type?.message}>
          <Controller
            control={form.control}
            name="type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
        <FormField label="Location" error={form.formState.errors.location?.message}>
          <Input {...form.register("location")} className="md:col-span-2" />
        </FormField>
      </div>

      <FormField label="Role description" error={form.formState.errors.description?.message}>
        <Textarea rows={14} {...form.register("description")} />
      </FormField>

      <label className="inline-flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={form.watch("active")}
          onChange={(e) => form.setValue("active", e.target.checked)}
        />
        Active
      </label>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button
        disabled={saving}
        className="w-fit"
      >
        {saving ? "Saving..." : mode === "create" ? "Create role" : "Save changes"}
      </Button>
    </form>
  );
}
