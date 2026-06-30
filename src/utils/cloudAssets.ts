import type { AssetType, FamilyAsset } from "../types";
import { uploadAuthHeaders } from "./uploadAuth";

export interface CloudGalleryEntry {
  id: string;
  personId: string;
  personName: string;
  title: string;
  type: string;
  url: string;
  caption?: string;
  uploadedBy?: string;
  addedAt: string;
  blobPath?: string;
}

export interface CloudGalleryResponse {
  available: boolean;
  authRequired?: boolean;
  entries: CloudGalleryEntry[];
}

export interface CloudUploadInput {
  personId: string;
  personName: string;
  title: string;
  type: AssetType;
  caption: string;
  uploadedBy: string;
  file: File;
}

export interface CloudUploadResult {
  ok: boolean;
  entry?: CloudGalleryEntry;
  error?: string;
  code?: string;
}

export async function fetchCloudGallery(): Promise<CloudGalleryResponse> {
  try {
    const res = await fetch("/api/gallery");
    if (!res.ok) return { available: false, entries: [] };
    return (await res.json()) as CloudGalleryResponse;
  } catch {
    return { available: false, entries: [] };
  }
}

export async function uploadToCloud(input: CloudUploadInput): Promise<CloudUploadResult> {
  const buffer = await input.file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const data = btoa(binary);

  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...uploadAuthHeaders(),
      },
      body: JSON.stringify({
        personId: input.personId,
        personName: input.personName,
        title: input.title.trim() || input.file.name,
        type: input.type,
        caption: input.caption,
        uploadedBy: input.uploadedBy,
        fileName: input.file.name,
        mimeType: input.file.type || "application/octet-stream",
        data,
      }),
    });

    const payload = (await res.json()) as CloudUploadResult & { entry?: CloudGalleryEntry };

    if (!res.ok) {
      return {
        ok: false,
        error: payload.error ?? "Upload failed",
        code: payload.code,
      };
    }

    return { ok: true, entry: payload.entry };
  } catch {
    return { ok: false, error: "Network error" };
  }
}

export function cloudEntryToAsset(entry: CloudGalleryEntry): FamilyAsset {
  return {
    id: entry.id,
    personId: entry.personId,
    personName: entry.personName,
    title: entry.title,
    type: entry.type as FamilyAsset["type"],
    url: entry.url,
    caption: entry.caption,
    uploadedBy: entry.uploadedBy,
    addedAt: entry.addedAt,
    source: "cloud",
  };
}

export async function checkCloudAvailable(): Promise<boolean> {
  const data = await fetchCloudGallery();
  return data.available;
}
