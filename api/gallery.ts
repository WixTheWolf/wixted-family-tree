import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getGalleryManifest } from "./_lib/galleryManifest";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(200).json({ available: false, entries: [] });
  }

  try {
    const manifest = await getGalleryManifest();
    return res.status(200).json({
      available: true,
      entries: manifest.entries,
    });
  } catch (err) {
    console.error("Gallery fetch error:", err);
    return res.status(500).json({ error: "Failed to load gallery" });
  }
}
