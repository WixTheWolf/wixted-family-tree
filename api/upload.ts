import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getGalleryManifest, saveGalleryManifest, type GalleryEntry } from "./_lib/galleryManifest";
import { verifyUploadAuth } from "./_lib/auth";

export const config = {
  api: { bodyParser: { sizeLimit: "12mb" } },
};

interface UploadBody {
  personId: string;
  personName: string;
  title: string;
  type: string;
  caption?: string;
  uploadedBy?: string;
  fileName: string;
  mimeType: string;
  data: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(503).json({ error: "Cloud storage not configured", code: "NO_BLOB" });
  }

  if (!verifyUploadAuth(req)) {
    return res.status(401).json({ error: "Family upload key required", code: "AUTH_REQUIRED" });
  }

  try {
    const body = req.body as UploadBody;
    const {
      personId,
      personName,
      title,
      type,
      caption = "",
      uploadedBy = "",
      fileName,
      mimeType,
      data,
    } = body;

    if (!personId || !fileName || !data) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const buffer = Buffer.from(data, "base64");
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(413).json({ error: "File exceeds 10 MB limit" });
    }

    const { put } = await import("@vercel/blob");
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
    const blobPath = `wixted/people/${personId}/${Date.now()}-${safeName}`;

    const blob = await put(blobPath, buffer, {
      access: "public",
      contentType: mimeType || "application/octet-stream",
    });

    const entry: GalleryEntry = {
      id: `cloud-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      personId,
      personName,
      title: title || safeName,
      type,
      url: blob.url,
      caption,
      uploadedBy,
      addedAt: new Date().toISOString().slice(0, 10),
      blobPath,
    };

    const manifest = await getGalleryManifest();
    manifest.entries.push(entry);
    await saveGalleryManifest(manifest);

    return res.status(200).json({ ok: true, entry });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
}
