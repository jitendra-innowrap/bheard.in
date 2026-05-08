import { connectToDatabase } from "@/lib/db/mongoose";
import { PageModel } from "@/lib/db/models";
import type { PageUpdateInput } from "@/lib/validators/page.validator";

function requireDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }
}

function buildPageTitleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function getPageBySlug(slug: string) {
  requireDb();
  await connectToDatabase();
  const row = await PageModel.findOne({ slug });
  return row ? row.toJSON() : null;
}

export async function listAllPages() {
  requireDb();
  await connectToDatabase();
  const rows = await PageModel.find({}).sort({ updatedAt: -1 });
  return rows.map((row) => row.toJSON());
}

export async function upsertPage(slug: string, input: PageUpdateInput) {
  requireDb();
  await connectToDatabase();

  const updateData: Record<string, unknown> = {
    content: input.content,
  };
  if (input.title) {
    updateData.title = input.title;
  }

  const row = await PageModel.findOneAndUpdate(
    { slug },
    {
      $set: updateData,
      $setOnInsert: {
        slug,
        title: input.title ?? buildPageTitleFromSlug(slug),
      },
    },
    { upsert: true, new: true }
  );

  return row ? row.toJSON() : null;
}
