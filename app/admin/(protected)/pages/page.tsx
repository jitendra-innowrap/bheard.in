import Link from "next/link";
import { listAllPages } from "@/lib/services/page.service";
import { PageHeader } from "@/components/admin/PageHeader";

const MANAGED_PAGES = [
  { slug: "privacy-policy", label: "Privacy Policy" },
  { slug: "terms-and-conditions", label: "Terms & Conditions" },
];

export default async function AdminPagesListPage() {
  let pages: { slug: string; title: string; updatedAt: Date }[] = [];
  try {
    pages = await listAllPages();
  } catch {
    pages = [];
  }

  const pageMap = new Map(pages.map((p) => [p.slug, p]));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Content"
        title="Legal Pages"
        description="Manage Privacy Policy, Terms & Conditions, and other legal content."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {MANAGED_PAGES.map((mp) => {
          const existing = pageMap.get(mp.slug);
          return (
            <div
              key={mp.slug}
              className="flex items-center justify-between rounded-md border border-border bg-card p-5"
            >
              <div>
                <p className="font-headline text-base font-bold uppercase tracking-tight text-foreground">
                  {mp.label}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  /{mp.slug} ·{" "}
                  {existing
                    ? `Last updated ${new Date(existing.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                    : "Not yet created"}
                </p>
              </div>
              <Link
                href={`/admin/pages/${mp.slug}`}
                className="rounded-md bg-primary px-4 py-2 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {existing ? "Edit" : "Create"}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
