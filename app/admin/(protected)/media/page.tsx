import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import MediaManager from "@/components/admin/MediaManager";
import type { MediaAsset } from "@prisma/client";

export default async function AdminMediaPage() {
  let assets: MediaAsset[] = [];
  try {
    assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    assets = [];
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin · Media"
        title="Media Library"
        description="Upload and manage reusable attachments for blogs, careers and stories."
      />
      <MediaManager initialRows={assets as any} />
    </div>
  );
}
