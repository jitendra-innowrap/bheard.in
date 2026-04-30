import { PageHeader } from "@/components/admin/PageHeader";
import PageContentForm from "@/components/admin/PageContentForm";
import { getPageBySlug } from "@/lib/services/page.service";

type Props = { params: Promise<{ slug: string }> };

export default async function AdminPageEditPage({ params }: Props) {
  const { slug } = await params;
  let page: { title: string; content: string } | null = null;

  try {
    page = await getPageBySlug(slug);
  } catch {
    page = null;
  }

  const label = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pages"
        title={`Edit — ${label}`}
        action={{ href: "/admin/pages", label: "← Back to Pages" }}
      />
      <PageContentForm
        slug={slug}
        initial={page ? { title: page.title, content: page.content } : undefined}
      />
    </div>
  );
}
