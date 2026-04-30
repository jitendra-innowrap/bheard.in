import type { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import ImageKit from "@imagekit/nodejs";
import { isValidAdminSessionValue } from "@/lib/auth/adminSession";

type NextApiRequestWithFile = NextApiRequest & {
  file?: {
    buffer: Buffer;
    originalname: string;
  };
  body: {
    folder?: string;
  };
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (req: NextApiRequest, res: NextApiResponse, cb: (result?: unknown) => void) => void
) {
  return new Promise<void>((resolve, reject) => {
    fn(req, res, (result?: unknown) => {
      if (result instanceof Error) return reject(result);
      resolve();
    });
  });
}

function getCookieValue(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) return undefined;
  const token = `${name}=`;
  const part = cookieHeader.split(";").map((v) => v.trim()).find((v) => v.startsWith(token));
  return part ? decodeURIComponent(part.slice(token.length)) : undefined;
}

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequestWithFile, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: { message: "Method not allowed" } });
  }

  const sessionValue = getCookieValue(req.headers.cookie, "bheard_admin_session");
  if (!isValidAdminSessionValue(sessionValue)) {
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }

  if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    return res.status(500).json({ error: { message: "IMAGEKIT_PRIVATE_KEY is missing" } });
  }

  try {
    await runMiddleware(req, res, upload.single("image") as any);
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: { message: "Image file is required" } });
    }

    const targetFolder =
      typeof req.body?.folder === "string" && req.body.folder.trim().length > 0
        ? req.body.folder.trim()
        : "/bheard/blog";

    const uploaded = await imagekit.files.upload({
      file: file.buffer.toString("base64"),
      fileName: file.originalname,
      folder: targetFolder,
      useUniqueFileName: true,
    });

    return res.status(200).json({
      ok: true,
      url: uploaded.url,
      fileId: uploaded.fileId,
      name: uploaded.name,
    });
  } catch (error) {
    return res.status(500).json({ error: { message: "Failed to upload image", details: String(error) } });
  }
}

