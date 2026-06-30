import type { ContributionDraft } from "../types";

const DB_NAME = "wixted-family-contributions";
const DB_VERSION = 1;
const STORE = "contributions";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
  });
}

export async function listContributions(): Promise<ContributionDraft[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onerror = () => reject(req.error);
    req.onsuccess = () => {
      const rows = (req.result as ContributionDraft[]).sort(
        (a, b) => b.createdAt.localeCompare(a.createdAt)
      );
      resolve(rows);
    };
  });
}

export async function saveContribution(draft: ContributionDraft): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(draft);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteContribution(id: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function clearContributions(): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export function suggestedFileName(draft: ContributionDraft): string {
  const ext = draft.fileName.includes(".")
    ? draft.fileName.slice(draft.fileName.lastIndexOf("."))
    : "";
  return `${draft.personId}-${slugify(draft.title || draft.type)}${ext}`;
}

export function buildManifestSnippet(drafts: ContributionDraft[]): string {
  const entries = drafts.map((d) => ({
    id: d.id,
    personId: d.personId,
    title: d.title,
    type: d.type,
    url: `/assets/people/${d.personId}/${suggestedFileName(d)}`,
    caption: d.caption || undefined,
    uploadedBy: d.uploadedBy || undefined,
    addedAt: d.createdAt.slice(0, 10),
    source: "site",
  }));

  return JSON.stringify({ gallery: entries }, null, 2);
}

export async function downloadContribution(draft: ContributionDraft): Promise<void> {
  const url = URL.createObjectURL(draft.blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = suggestedFileName(draft);
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportContributionPackage(drafts: ContributionDraft[]): Promise<void> {
  const manifest = buildManifestSnippet(drafts);
  const readme = `# Wixted Family Tree — Asset Contribution

Add these files to the repository:

1. Place each downloaded file under \`public/assets/people/{personId}/\`
2. Merge the gallery entries from \`contribution-manifest.json\` into \`src/data/assets.json\`
3. Run \`npm run build\` and deploy

Files included: ${drafts.length}
Generated: ${new Date().toISOString()}
`;

  for (const draft of drafts) {
    await downloadContribution(draft);
    await new Promise((r) => setTimeout(r, 300));
  }

  const manifestBlob = new Blob([manifest], { type: "application/json" });
  const readmeBlob = new Blob([readme], { type: "text/plain" });

  for (const [name, blob] of [
    ["contribution-manifest.json", manifestBlob],
    ["CONTRIBUTION-README.txt", readmeBlob],
  ] as const) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
    await new Promise((r) => setTimeout(r, 200));
  }
}
