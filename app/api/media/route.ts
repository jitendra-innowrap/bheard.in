import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api/responses";
import { assertAdminApiAuth } from "@/lib/auth/adminSession";
import { prisma } from "@/lib/db/prisma";

const uploadDir = path.join(process.cwd(), "public", "uploads");

export async function GET() {
  try {
    const isAuthed = await assertAdminApiAuth();
    if (!isAuthed) return apiError(401, "Unauthorized");
    const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ data: assets });
  } catch {
    return apiError(500, "Failed to fetch media assets");
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuthed = await assertAdminApiAuth();
    if (!isAuthed) return apiError(401, "Unauthorized");

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return apiError(400, "File is required");

    await mkdir(uploadDir, { recursive: true });
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const targetPath = path.join(uploadDir, fileName);
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(targetPath, bytes);
    const relativePath = `/uploads/${fileName}`;

    const created = await prisma.mediaAsset.create({
      data: {
        filename: fileName,
        path: relativePath,
        mimeType: file.type || "application/octet-stream",
        size: file.size,
      },
    });

    return NextResponse.json({ data: created }, { status: 201 });
  } catch {
    return apiError(500, "Failed to upload media");
  }
}
