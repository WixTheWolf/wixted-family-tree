import staticAssets from "../data/assets.json";
import type { ContributionDraft, FamilyAsset } from "../types";

interface StaticGalleryEntry {
  id: string;
  personId: string;
  title: string;
  type: string;
  url: string;
  caption?: string;
  uploadedBy?: string;
  addedAt?: string;
  source?: string;
}

interface StaticAssets {
  people: Record<string, { photo?: string; role?: string }>;
  gallery?: StaticGalleryEntry[];
  documents?: { title: string; desc: string; type: string; icon: string }[];
}

const assets = staticAssets as StaticAssets;

export function getStaticGallery(): FamilyAsset[] {
  return (assets.gallery ?? []).map((g) => ({
    id: g.id,
    personId: g.personId,
    title: g.title,
    type: g.type as FamilyAsset["type"],
    url: g.url,
    caption: g.caption,
    uploadedBy: g.uploadedBy,
    addedAt: g.addedAt,
    source: "site",
  }));
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

export function getPersonPhoto(
  personId: string,
  localContributions: ContributionDraft[] = []
): string | null {
  const profile = assets.people[personId]?.photo;
  if (profile) return profile;

  const localPhoto = localContributions.find(
    (c) => c.personId === personId && c.type === "photo"
  );
  if (localPhoto) return URL.createObjectURL(localPhoto.blob);

  const staticPhoto = getStaticGallery().find(
    (a) => a.personId === personId && a.type === "photo"
  );
  return staticPhoto?.url ?? null;
}

export function getPersonAssets(
  personId: string,
  localContributions: ContributionDraft[] = []
): FamilyAsset[] {
  const staticForPerson = getStaticGallery().filter((a) => a.personId === personId);
  const localForPerson = localContributions
    .filter((c) => c.personId === personId)
    .map(contributionToAsset);

  const profilePhoto = assets.people[personId]?.photo;
  const hasProfileInGallery = staticForPerson.some((a) => a.url === profilePhoto);

  const merged = [...staticForPerson, ...localForPerson];
  if (profilePhoto && !hasProfileInGallery) {
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

export function getAllAssets(localContributions: ContributionDraft[] = []): FamilyAsset[] {
  const personIds = new Set<string>();
  getStaticGallery().forEach((a) => personIds.add(a.personId));
  localContributions.forEach((c) => personIds.add(c.personId));
  Object.keys(assets.people).forEach((id) => personIds.add(id));

  return [...personIds].flatMap((id) => getPersonAssets(id, localContributions));
}

export { assets as staticAssetsManifest };
