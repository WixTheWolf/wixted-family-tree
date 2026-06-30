import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getGalleryManifest } from "./_lib/galleryManifest";
import { isAuthRequired } from "./_lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const blobAvailable = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  if (!blobAvailable) {
    return res.status(200).json({
      available: false,
      authRequired: isAuthRequired(),
      entries: [],
    });
  }

  try {
    const manifest = await getGalleryManifest();
    return res.status(200).json({
      available: true,
      authRequired: isAuthRequired(),
      entries: manifest.entries,
    });
  } catch (err) {
    console.error("Gallery fetch error:", err);
    return res.status(500).json({ error: "Failed to load gallery" });
  }
}
