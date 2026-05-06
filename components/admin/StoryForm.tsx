"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/admin/ui/input";
import { Textarea } from "@/components/admin/ui/textarea";
import { FormField } from "@/components/admin/ui/form-field";
import { Button } from "@/components/admin/ui/button";
import { Switch } from "@/components/admin/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";

const storyFormSchema = z.object({
  slug: z.string().min(3),
  title: z.string().min(4),
  industry: z.string().min(2),
  listImage: z.string().default(""),
  heroImage: z.string().default(""),
  caseData: z.string().default(""),
  summary: z.string().min(20),
  about: z.string().min(40),
  challenge: z.string().min(40),
  solution: z.string().min(40),
  results: z.string().min(40),
  contactCta: z.string().min(5),
  published: z.boolean(),
});

type StoryFormModel = z.infer<typeof storyFormSchema>;

type GuidedExecutionBlock = {
  heading: string;
  body: string;
  image: string;
  imageAlt: string;
  align: "left" | "right";
};

type GuidedStat = {
  value: string;
  label: string;
};

type GuidedCaseData = {
  heroTitle: string;
  heroSubtitle: string;
  heroMeta: string;
  overviewHeading: string;
  overviewBody: string;
  challengeHeading: string;
  challengeIntro: string;
  challengeBulletsText: string;
  strategyHeading: string;
  strategyIntro: string;
  strategyBulletsText: string;
  resultsHeading: string;
  resultsClosing: string;
  closingStatement: string;
  ctaTitle: string;
  ctaSubtext: string;
  stats: GuidedStat[];
  execution: GuidedExecutionBlock[];
};

function toLines(value: string[]) {
  return value.join("\n");
}

function parseLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function hasGuidedContent(data: GuidedCaseData) {
  return Boolean(
    data.heroTitle.trim() ||
      data.heroSubtitle.trim() ||
      data.heroMeta.trim() ||
      data.overviewHeading.trim() ||
      data.overviewBody.trim() ||
      data.challengeHeading.trim() ||
      data.challengeIntro.trim() ||
      parseLines(data.challengeBulletsText).length ||
      data.strategyHeading.trim() ||
      data.strategyIntro.trim() ||
      parseLines(data.strategyBulletsText).length ||
      data.resultsHeading.trim() ||
      data.resultsClosing.trim() ||
      data.closingStatement.trim() ||
      data.ctaTitle.trim() ||
      data.ctaSubtext.trim() ||
      data.stats.some((s) => s.value.trim() || s.label.trim()) ||
      data.execution.some((b) => b.heading.trim() || b.body.trim() || b.image.trim() || b.imageAlt.trim())
  );
}

function parseGuidedCaseData(raw: string): GuidedCaseData {
  const empty: GuidedCaseData = {
    heroTitle: "",
    heroSubtitle: "",
    heroMeta: "",
    overviewHeading: "",
    overviewBody: "",
    challengeHeading: "",
    challengeIntro: "",
    challengeBulletsText: "",
    strategyHeading: "",
    strategyIntro: "",
    strategyBulletsText: "",
    resultsHeading: "",
    resultsClosing: "",
    closingStatement: "",
    ctaTitle: "",
    ctaSubtext: "",
    stats: [],
    execution: [],
  };
  if (!raw.trim()) return empty;
  try {
    const parsed = JSON.parse(raw) as any;
    const execution = Array.isArray(parsed?.execution)
      ? parsed.execution.map((block: any) => ({
          heading: String(block?.heading ?? ""),
          body: String(block?.body ?? ""),
          image: String(block?.image ?? ""),
          imageAlt: String(block?.imageAlt ?? ""),
          align: block?.align === "right" ? "right" : "left",
        }))
      : [];
    const stats = Array.isArray(parsed?.results?.stats)
      ? parsed.results.stats.map((stat: any) => ({
          value: String(stat?.value ?? ""),
          label: String(stat?.label ?? ""),
        }))
      : [];
    return {
      heroTitle: String(parsed?.heroTitle ?? ""),
      heroSubtitle: String(parsed?.heroSubtitle ?? ""),
      heroMeta: String(parsed?.heroMeta ?? ""),
      overviewHeading: String(parsed?.overview?.heading ?? ""),
      overviewBody: String(parsed?.overview?.body ?? ""),
      challengeHeading: String(parsed?.challenge?.heading ?? ""),
      challengeIntro: String(parsed?.challenge?.intro ?? ""),
      challengeBulletsText: toLines(Array.isArray(parsed?.challenge?.bullets) ? parsed.challenge.bullets.map(String) : []),
      strategyHeading: String(parsed?.strategy?.heading ?? ""),
      strategyIntro: String(parsed?.strategy?.intro ?? ""),
      strategyBulletsText: toLines(Array.isArray(parsed?.strategy?.bullets) ? parsed.strategy.bullets.map(String) : []),
      resultsHeading: String(parsed?.results?.heading ?? ""),
      resultsClosing: String(parsed?.results?.closing ?? ""),
      closingStatement: String(parsed?.closingStatement ?? ""),
      ctaTitle: String(parsed?.cta?.title ?? ""),
      ctaSubtext: String(parsed?.cta?.subtext ?? ""),
      stats,
      execution,
    };
  } catch {
    return empty;
  }
}

function buildCaseDataPayload(data: GuidedCaseData) {
  if (!hasGuidedContent(data)) return "";
  const payload: Record<string, unknown> = {};
  if (data.heroTitle.trim()) payload.heroTitle = data.heroTitle.trim();
  if (data.heroSubtitle.trim()) payload.heroSubtitle = data.heroSubtitle.trim();
  if (data.heroMeta.trim()) payload.heroMeta = data.heroMeta.trim();
  if (data.overviewHeading.trim() || data.overviewBody.trim()) {
    payload.overview = {
      ...(data.overviewHeading.trim() ? { heading: data.overviewHeading.trim() } : {}),
      ...(data.overviewBody.trim() ? { body: data.overviewBody.trim() } : {}),
    };
  }
  const challengeBullets = parseLines(data.challengeBulletsText);
  if (data.challengeHeading.trim() || data.challengeIntro.trim() || challengeBullets.length) {
    payload.challenge = {
      ...(data.challengeHeading.trim() ? { heading: data.challengeHeading.trim() } : {}),
      ...(data.challengeIntro.trim() ? { intro: data.challengeIntro.trim() } : {}),
      ...(challengeBullets.length ? { bullets: challengeBullets } : {}),
    };
  }
  const strategyBullets = parseLines(data.strategyBulletsText);
  if (data.strategyHeading.trim() || data.strategyIntro.trim() || strategyBullets.length) {
    payload.strategy = {
      ...(data.strategyHeading.trim() ? { heading: data.strategyHeading.trim() } : {}),
      ...(data.strategyIntro.trim() ? { intro: data.strategyIntro.trim() } : {}),
      ...(strategyBullets.length ? { bullets: strategyBullets } : {}),
    };
  }
  const stats = data.stats
    .map((s) => ({ value: s.value.trim(), label: s.label.trim() }))
    .filter((s) => s.value && s.label);
  if (data.resultsHeading.trim() || data.resultsClosing.trim() || stats.length) {
    payload.results = {
      ...(data.resultsHeading.trim() ? { heading: data.resultsHeading.trim() } : {}),
      ...(stats.length ? { stats } : {}),
      ...(data.resultsClosing.trim() ? { closing: data.resultsClosing.trim() } : {}),
    };
  }
  if (data.closingStatement.trim()) payload.closingStatement = data.closingStatement.trim();
  if (data.ctaTitle.trim() || data.ctaSubtext.trim()) {
    payload.cta = {
      ...(data.ctaTitle.trim() ? { title: data.ctaTitle.trim() } : {}),
      ...(data.ctaSubtext.trim() ? { subtext: data.ctaSubtext.trim() } : {}),
    };
  }
  const execution = data.execution
    .map((b) => ({
      heading: b.heading.trim(),
      body: b.body.trim(),
      image: b.image.trim(),
      imageAlt: b.imageAlt.trim() || b.heading.trim(),
      align: b.align,
    }))
    .filter((b) => b.heading && b.body && b.image);
  if (execution.length) payload.execution = execution;
  return JSON.stringify(payload);
}

export default function StoryForm({
  initial,
  mode,
}: {
  initial?: StoryFormModel;
  mode: "create" | "edit";
}) {
  const form = useForm<StoryFormModel>({
    defaultValues:
      initial ?? {
        slug: "",
        title: "",
        industry: "",
        listImage: "",
        heroImage: "",
        caseData: "",
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
  const [uploadingListImage, setUploadingListImage] = useState(false);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [uploadingExecutionIndex, setUploadingExecutionIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [guidedCaseData, setGuidedCaseData] = useState<GuidedCaseData>(() => parseGuidedCaseData(form.getValues("caseData")));
  const advancedStorytellingEnabled = true;
  const [showGuidedStorytelling, setShowGuidedStorytelling] = useState(false);
  const executionBlocks = useMemo(() => guidedCaseData.execution, [guidedCaseData.execution]);

  const uploadImage = async (file: File, folder: string) => {
    const fd = new FormData();
    fd.set("image", file);
    fd.set("folder", folder);
    const res = await fetch("/api/admin/upload-image", { method: "POST", body: fd });
    const body = await res.json().catch(() => null);
    if (!res.ok || !body?.url) {
      throw new Error(body?.error?.message ?? "Image upload failed");
    }
    return body.url as string;
  };

  const uploadListImage = async (file: File) => {
    setUploadingListImage(true);
    setError(null);
    try {
      const url = await uploadImage(file, "/bheard/success-stories/list");
      form.setValue("listImage", url, { shouldDirty: true, shouldValidate: true });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed");
    } finally {
      setUploadingListImage(false);
    }
  };

  const uploadHeroImage = async (file: File) => {
    setUploadingHeroImage(true);
    setError(null);
    try {
      const url = await uploadImage(file, "/bheard/success-stories/hero");
      form.setValue("heroImage", url, { shouldDirty: true, shouldValidate: true });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed");
    } finally {
      setUploadingHeroImage(false);
    }
  };

  const uploadExecutionBlockImage = async (index: number, file: File) => {
    setUploadingExecutionIndex(index);
    setError(null);
    try {
      if (!guidedCaseData.execution[index]) {
        throw new Error("Execution block not found in caseData.");
      }
      const url = await uploadImage(file, "/bheard/success-stories/execution");
      setGuidedCaseData((prev) => ({
        ...prev,
        execution: prev.execution.map((block, blockIndex) =>
          blockIndex === index ? { ...block, image: url, imageAlt: block.imageAlt || block.heading } : block
        ),
      }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed");
    } finally {
      setUploadingExecutionIndex(null);
    }
  };

  const submit = form.handleSubmit(async (model) => {
    setSaving(true);
    setError(null);
    const serializedCaseData = advancedStorytellingEnabled ? buildCaseDataPayload(guidedCaseData) : "";
    const parsed = storyFormSchema.safeParse({ ...model, caseData: serializedCaseData });
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0];
        if (typeof key === "string") {
          form.setError(key as keyof StoryFormModel, { type: "manual", message: issue.message });
        }
      });
      setSaving(false);
      return;
    }
    const url = mode === "create" ? "/api/stories" : `/api/stories/${initial?.slug}`;
    const method = mode === "create" ? "POST" : "PUT";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
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
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md border border-border p-4">
          <p className="mb-2 text-sm font-medium">Upload listing image (ImageKit)</p>
          <Input
            type="file"
            accept="image/*"
            disabled={uploadingListImage}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              await uploadListImage(file);
              e.currentTarget.value = "";
            }}
          />
          {uploadingListImage ? <p className="mt-2 text-xs text-muted-foreground">Uploading listing image...</p> : null}
          {form.watch("listImage") ? (
            <p className="mt-2 truncate text-xs text-muted-foreground">{form.watch("listImage")}</p>
          ) : null}
        </div>
        <div className="rounded-md border border-border p-4">
          <p className="mb-2 text-sm font-medium">Upload hero image (ImageKit)</p>
          <Input
            type="file"
            accept="image/*"
            disabled={uploadingHeroImage}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              await uploadHeroImage(file);
              e.currentTarget.value = "";
            }}
          />
          {uploadingHeroImage ? <p className="mt-2 text-xs text-muted-foreground">Uploading hero image...</p> : null}
          {form.watch("heroImage") ? (
            <p className="mt-2 truncate text-xs text-muted-foreground">{form.watch("heroImage")}</p>
          ) : null}
        </div>
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
      {advancedStorytellingEnabled ? (
        <div className="rounded-md border border-border p-4 transition-all duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Storytelling structure (guided)</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Fill optional advanced fields to control animated detail page sections without editing JSON.
              </p>
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-foreground">
              <Switch checked={showGuidedStorytelling} onCheckedChange={(checked: boolean) => setShowGuidedStorytelling(checked)} />
              <span>{showGuidedStorytelling ? "Hide" : "Show"}</span>
            </label>
          </div>
          {showGuidedStorytelling ? (
          <div className="mt-4 space-y-4">
          <div className="grid items-start gap-4 md:grid-cols-3">
          <FormField label="Hero title override">
            <Input
              value={guidedCaseData.heroTitle}
              onChange={(e) => setGuidedCaseData((prev) => ({ ...prev, heroTitle: e.target.value }))}
            />
          </FormField>
          <FormField label="Hero subtitle override">
            <Input
              value={guidedCaseData.heroSubtitle}
              onChange={(e) => setGuidedCaseData((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
            />
          </FormField>
          <FormField label="Hero meta override">
            <Input
              value={guidedCaseData.heroMeta}
              onChange={(e) => setGuidedCaseData((prev) => ({ ...prev, heroMeta: e.target.value }))}
            />
          </FormField>
          </div>
          <div className="mt-2 grid items-start gap-4 md:grid-cols-2">
          <FormField label="Overview heading">
            <Input
              value={guidedCaseData.overviewHeading}
              onChange={(e) => setGuidedCaseData((prev) => ({ ...prev, overviewHeading: e.target.value }))}
            />
          </FormField>
          <FormField label="Overview body">
            <Textarea
              rows={3}
              value={guidedCaseData.overviewBody}
              onChange={(e) => setGuidedCaseData((prev) => ({ ...prev, overviewBody: e.target.value }))}
            />
          </FormField>
          <FormField label="Challenge heading">
            <Input
              value={guidedCaseData.challengeHeading}
              onChange={(e) => setGuidedCaseData((prev) => ({ ...prev, challengeHeading: e.target.value }))}
            />
          </FormField>
          <FormField label="Challenge intro">
            <Textarea
              rows={3}
              value={guidedCaseData.challengeIntro}
              onChange={(e) => setGuidedCaseData((prev) => ({ ...prev, challengeIntro: e.target.value }))}
            />
          </FormField>
          <FormField label="Challenge bullets (one per line)">
            <Textarea
              rows={4}
              value={guidedCaseData.challengeBulletsText}
              onChange={(e) => setGuidedCaseData((prev) => ({ ...prev, challengeBulletsText: e.target.value }))}
            />
          </FormField>
          <FormField label="Approach heading">
            <Input
              value={guidedCaseData.strategyHeading}
              onChange={(e) => setGuidedCaseData((prev) => ({ ...prev, strategyHeading: e.target.value }))}
            />
          </FormField>
          <FormField label="Approach intro">
            <Textarea
              rows={3}
              value={guidedCaseData.strategyIntro}
              onChange={(e) => setGuidedCaseData((prev) => ({ ...prev, strategyIntro: e.target.value }))}
            />
          </FormField>
          <FormField label="Approach bullets (one per line)">
            <Textarea
              rows={4}
              value={guidedCaseData.strategyBulletsText}
              onChange={(e) => setGuidedCaseData((prev) => ({ ...prev, strategyBulletsText: e.target.value }))}
            />
          </FormField>
          <FormField label="Impact heading">
            <Input
              value={guidedCaseData.resultsHeading}
              onChange={(e) => setGuidedCaseData((prev) => ({ ...prev, resultsHeading: e.target.value }))}
            />
          </FormField>
          <FormField label="Impact closing text">
            <Textarea
              rows={3}
              value={guidedCaseData.resultsClosing}
              onChange={(e) => setGuidedCaseData((prev) => ({ ...prev, resultsClosing: e.target.value }))}
            />
          </FormField>
          <FormField label="Closing statement">
            <Textarea
              rows={3}
              value={guidedCaseData.closingStatement}
              onChange={(e) => setGuidedCaseData((prev) => ({ ...prev, closingStatement: e.target.value }))}
            />
          </FormField>
          <FormField label="CTA title">
            <Input
              value={guidedCaseData.ctaTitle}
              onChange={(e) => setGuidedCaseData((prev) => ({ ...prev, ctaTitle: e.target.value }))}
            />
          </FormField>
          <FormField label="CTA subtext">
            <Textarea
              rows={3}
              value={guidedCaseData.ctaSubtext}
              onChange={(e) => setGuidedCaseData((prev) => ({ ...prev, ctaSubtext: e.target.value }))}
            />
          </FormField>
          </div>
          <div className="mt-4 rounded-md border border-border/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium">Impact stats</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setGuidedCaseData((prev) => ({ ...prev, stats: [...prev.stats, { value: "", label: "" }] }))
                }
              >
                Add stat
              </Button>
            </div>
            <div className="grid gap-3">
              {guidedCaseData.stats.length === 0 ? (
                <p className="text-xs text-muted-foreground">No stats added yet.</p>
              ) : null}
              {guidedCaseData.stats.map((stat, index) => (
                <div key={`stat-${index}`} className="grid items-start gap-2 md:grid-cols-[0.35fr_0.55fr_auto]">
                  <Input
                    placeholder="Value (e.g. +42%)"
                    value={stat.value}
                    onChange={(e) =>
                      setGuidedCaseData((prev) => ({
                        ...prev,
                        stats: prev.stats.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, value: e.target.value } : item
                        ),
                      }))
                    }
                  />
                  <Input
                    placeholder="Label"
                    value={stat.label}
                    onChange={(e) =>
                      setGuidedCaseData((prev) => ({
                        ...prev,
                        stats: prev.stats.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, label: e.target.value } : item
                        ),
                      }))
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setGuidedCaseData((prev) => ({
                        ...prev,
                        stats: prev.stats.filter((_, itemIndex) => itemIndex !== index),
                      }))
                    }
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 rounded-md border border-border/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium">Execution blocks</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setGuidedCaseData((prev) => ({
                    ...prev,
                    execution: [...prev.execution, { heading: "", body: "", image: "", imageAlt: "", align: "left" }],
                  }))
                }
              >
                Add execution block
              </Button>
            </div>
            {executionBlocks.length === 0 ? <p className="text-xs text-muted-foreground">No execution blocks added.</p> : null}
            <div className="mt-3 grid gap-3">
              {executionBlocks.map((block, index) => (
                <div key={index} className="rounded-md border border-border/80 p-3">
                  <div className="grid items-start gap-3 md:grid-cols-2">
                    <FormField label={`Block ${index + 1} heading`}>
                      <Input
                        value={block.heading}
                        onChange={(e) =>
                          setGuidedCaseData((prev) => ({
                            ...prev,
                            execution: prev.execution.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, heading: e.target.value } : item
                            ),
                          }))
                        }
                      />
                    </FormField>
                    <FormField label="Align">
                      <Select
                        value={block.align}
                        onValueChange={(value: "left" | "right") =>
                          setGuidedCaseData((prev) => ({
                            ...prev,
                            execution: prev.execution.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, align: value } : item
                            ),
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                    <FormField label="Body">
                      <Textarea
                        rows={4}
                        value={block.body}
                        onChange={(e) =>
                          setGuidedCaseData((prev) => ({
                            ...prev,
                            execution: prev.execution.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, body: e.target.value } : item
                            ),
                          }))
                        }
                      />
                    </FormField>
                    <FormField label="Image alt text">
                      <Input
                        value={block.imageAlt}
                        onChange={(e) =>
                          setGuidedCaseData((prev) => ({
                            ...prev,
                            execution: prev.execution.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, imageAlt: e.target.value } : item
                            ),
                          }))
                        }
                      />
                    </FormField>
                  </div>
                  <div className="mt-2 rounded-md border border-border p-3">
                    <p className="mb-2 text-sm font-medium">Upload execution image (ImageKit)</p>
                    <Input
                      type="file"
                      accept="image/*"
                      disabled={uploadingExecutionIndex === index}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        await uploadExecutionBlockImage(index, file);
                        e.currentTarget.value = "";
                      }}
                    />
                    {uploadingExecutionIndex === index ? (
                      <p className="mt-1 text-xs text-muted-foreground">Uploading execution image...</p>
                    ) : null}
                    <p className="mt-1 truncate text-xs text-muted-foreground">{block.image || "No image uploaded yet"}</p>
                  </div>
                  <div className="mt-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setGuidedCaseData((prev) => ({
                          ...prev,
                          execution: prev.execution.filter((_, itemIndex) => itemIndex !== index),
                        }))
                      }
                    >
                      Remove block
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">Guided structure is hidden. Toggle Show to edit advanced storytelling fields.</p>
          )}
        </div>
      ) : null}
      <label className="inline-flex items-center gap-2 text-sm text-foreground">
        <Switch
          checked={form.watch("published")}
          onCheckedChange={(checked: boolean) => form.setValue("published", checked)}
        />
        <span>Published</span>
      </label>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={saving} className="w-fit">
        {saving ? "Saving..." : mode === "create" ? "Create story" : "Save changes"}
      </Button>
    </form>
  );
}
