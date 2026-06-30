import staticAssets from "../data/assets.json";
import type { ContributionDraft, FamilyAsset } from "../types";

interface StaticGalleryEntry {
  id: string;
  personId: string;
  relatedPersonIds?: string[];
  title: string;
  type: string;
  url: string;
  previewUrl?: string;
  caption?: string;
  uploadedBy?: string;
  addedAt?: string;
  source?: string;
  status?: string;
}

function galleryEntryMatchesPerson(entry: StaticGalleryEntry, personId: string): boolean {
  return (
    entry.personId === personId ||
    (entry.relatedPersonIds ?? []).includes(personId)
  );
}

interface StaticAssets {
  people: Record<string, { photo?: string; role?: string }>;
  gallery?: StaticGalleryEntry[];
  documents?: { title: string; desc: string; type: string; icon: string }[];
}

const assets = staticAssets as StaticAssets;

export function getStaticGallery(): FamilyAsset[] {
  return (assets.gallery ?? [])
    .filter((g) => g.url && g.status !== "pending")
    .map((g) => ({
      id: g.id,
      personId: g.personId,
      title: g.title,
      type: g.type as FamilyAsset["type"],
      url: g.previewUrl || g.url,
      caption: g.caption,
      uploadedBy: g.uploadedBy,
      addedAt: g.addedAt,
      source: "site",
    }));
}

export function getPendingUploads(): Array<{
  id: string;
  personId: string;
  title: string;
  caption?: string;
}> {
  return (assets.gallery ?? [])
    .filter((g) => g.status === "pending" || !g.url)
    .map(({ id, personId, title, caption }) => ({ id, personId, title, caption }));
}

export function contributionToAsset(d: ContributionDraft): FamilyAsset {
  return {
    id: d.id,
    personId: d.personId,
    personName: d.personName,
    title: d.title,
    type: d.type,
    url: URL.createObjectURL(d.blob),
    caption: d.caption,
    uploadedBy: d.uploadedBy,
    addedAt: d.createdAt.slice(0, 10),
    source: "local",
    mimeType: d.mimeType,
  };
}

function dedupeAssets(items: FamilyAsset[]): FamilyAsset[] {
  const seen = new Set<string>();
  return items.filter((a) => {
    const key = `${a.personId}:${a.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function getPersonPhoto(
  personId: string,
  localContributions: ContributionDraft[] = [],
  cloudAssets: FamilyAsset[] = []
): string | null {
  const profile = assets.people[personId]?.photo;
  if (profile) return profile;

  const cloudPhoto = cloudAssets.find(
    (a) => a.personId === personId && a.type === "photo"
  );
  if (cloudPhoto) return cloudPhoto.url;

  const localPhoto = localContributions.find(
    (c) => c.personId === personId && c.type === "photo"
  );
  if (localPhoto) return URL.createObjectURL(localPhoto.blob);

  const staticPhoto = (assets.gallery ?? [])
    .filter((g) => g.url && g.status !== "pending")
    .find((g) => galleryEntryMatchesPerson(g, personId) && g.type === "photo");
  return staticPhoto ? staticPhoto.previewUrl || staticPhoto.url : null;
}

export function getPersonAssets(
  personId: string,
  localContributions: ContributionDraft[] = [],
  cloudAssets: FamilyAsset[] = []
): FamilyAsset[] {
  const staticForPerson = getStaticGallery().filter((a) => {
    const entry = (assets.gallery ?? []).find((g) => g.id === a.id);
    return entry ? galleryEntryMatchesPerson(entry, personId) : a.personId === personId;
  });
  const cloudForPerson = cloudAssets.filter((a) => a.personId === personId);
  const localForPerson = localContributions
    .filter((c) => c.personId === personId)
    .map(contributionToAsset);

  const profilePhoto = assets.people[personId]?.photo;
  const merged = dedupeAssets([...staticForPerson, ...cloudForPerson, ...localForPerson]);

  const hasProfile = merged.some((a) => a.url === profilePhoto);
  if (profilePhoto && !hasProfile) {
    merged.unshift({
      id: `profile-${personId}`,
      personId,
      title: "Profile photo",
      type: "photo",
      url: profilePhoto,
      source: "site",
    });
  }

  return merged;
}

export function getAllAssets(
  localContributions: ContributionDraft[] = [],
  cloudAssets: FamilyAsset[] = []
): FamilyAsset[] {
  const personIds = new Set<string>();
  getStaticGallery().forEach((a) => {
    personIds.add(a.personId);
    const entry = (assets.gallery ?? []).find((g) => g.id === a.id);
    entry?.relatedPersonIds?.forEach((id) => personIds.add(id));
  });
  cloudAssets.forEach((a) => personIds.add(a.personId));
  localContributions.forEach((c) => personIds.add(c.personId));
  Object.keys(assets.people).forEach((id) => personIds.add(id));

  return dedupeAssets(
    [...personIds].flatMap((id) => getPersonAssets(id, localContributions, cloudAssets))
  );
}

export { assets as staticAssetsManifest };
