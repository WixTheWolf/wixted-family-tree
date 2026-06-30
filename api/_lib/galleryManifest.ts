import { list } from "@vercel/blob";

export interface GalleryEntry {
  id: string;
  personId: string;
  personName: string;
  title: string;
  type: string;
  url: string;
  caption?: string;
  uploadedBy?: string;
  addedAt: string;
  blobPath: string;
}

export interface GalleryManifest {
  version: number;
  entries: GalleryEntry[];
}

const MANIFEST_PATH = "wixted/gallery-manifest.json";

export async function getGalleryManifest(): Promise<GalleryManifest> {
  const { blobs } = await list({ prefix: "wixted/gallery-manifest" });

  if (blobs.length === 0) {
    return { version: 1, entries: [] };
  }

  const manifestBlob = blobs.find((b) => b.pathname === MANIFEST_PATH) ?? blobs[0];
  const res = await fetch(manifestBlob.url, { cache: "no-store" });

  if (!res.ok) {
    return { version: 1, entries: [] };
  }

  const data = (await res.json()) as GalleryManifest;
  return { version: data.version ?? 1, entries: data.entries ?? [] };
}

export async function saveGalleryManifest(manifest: GalleryManifest): Promise<void> {
  const { put } = await import("@vercel/blob");
  await put(MANIFEST_PATH, JSON.stringify(manifest, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}
