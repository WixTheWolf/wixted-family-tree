import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AssetType, FamilyAsset, Person } from "../types";
import { useCloudAssets } from "../context/CloudAssetsContext";
import { useContributions } from "../context/ContributionsContext";
import { getAllAssets } from "../utils/assets";

interface Props {
  people: Person[];
  onSelectPerson: (p: Person) => void;
}

const TYPE_FILTERS: { id: AssetType | "all"; label: string }[] = [
  { id: "all", label: "All types" },
  { id: "photo", label: "Photos" },
  { id: "headstone", label: "Headstones" },
  { id: "obituary", label: "Obituaries" },
  { id: "document", label: "Documents" },
  { id: "census", label: "Census" },
  { id: "other", label: "Other" },
  { id: "research", label: "Research" },
];

const SOURCE_LABELS: Record<FamilyAsset["source"], string> = {
  site: "Site",
  local: "Local",
  cloud: "Cloud",
};

function isImageAsset(asset: FamilyAsset): boolean {
  if (asset.type === "photo" || asset.type === "headstone") return true;
  if (asset.mimeType?.startsWith("image/")) return true;
  return /\.(jpe?g|png|gif|webp|svg)$/i.test(asset.url);
}

export default function GalleryView({ people, onSelectPerson }: Props) {
  const { contributions } = useContributions();
  const { cloudAssets, cloudAvailable } = useCloudAssets();
  const [typeFilter, setTypeFilter] = useState<AssetType | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<FamilyAsset["source"] | "all">("all");
  const [query, setQuery] = useState("");
  const [lightbox, setLightbox] = useState<FamilyAsset | null>(null);

  const allAssets = useMemo(
    () => getAllAssets(contributions, cloudAssets),
    [contributions, cloudAssets]
  );

  const peopleById = useMemo(
    () => new Map(people.map((p) => [p.id, p])),
    [people]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allAssets.filter((a) => {
      if (typeFilter !== "all" && a.type !== typeFilter) return false;
      if (sourceFilter !== "all" && a.source !== sourceFilter) return false;
      if (!q) return true;
      const person = peopleById.get(a.personId);
      const haystack = [a.title, a.caption, a.personName, person?.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [allAssets, typeFilter, sourceFilter, query, peopleById]);

  const stats = useMemo(() => ({
    total: allAssets.length,
    site: allAssets.filter((a) => a.source === "site").length,
    cloud: allAssets.filter((a) => a.source === "cloud").length,
    local: allAssets.filter((a) => a.source === "local").length,
    people: new Set(allAssets.map((a) => a.personId)).size,
  }), [allAssets]);

  return (
    <div className="gallery-view">
      <div className="gallery-header">
        <div>
          <p className="section-eyebrow">Gallery</p>
          <h2 className="section-title" style={{ fontSize: "clamp(28px, 4vw, 40px)" }}>Family photos</h2>
          <p>
            Browse all photos and documents across the tree — site assets, cloud uploads
            {cloudAvailable ? " (live)" : " (enable Vercel Blob to sync)"}, and local browser saves.
          </p>
        </div>
        <div className="gallery-stats">
          <span>{stats.total} assets</span>
          <span>{stats.people} people</span>
          {stats.cloud > 0 && <span>{stats.cloud} cloud</span>}
          {stats.local > 0 && <span>{stats.local} local</span>}
        </div>
      </div>

      <div className="gallery-toolbar">
        <input
          className="gallery-search"
          placeholder="Search by person or title…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="gallery-filters">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={typeFilter === f.id ? "active" : ""}
              onClick={() => setTypeFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="gallery-filters source">
          {(["all", "site", "cloud", "local"] as const).map((s) => (
            <button
              key={s}
              type="button"
              className={sourceFilter === s ? "active" : ""}
              onClick={() => setSourceFilter(s)}
            >
              {s === "all" ? "All sources" : SOURCE_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="gallery-empty">
          <span>📷</span>
          <p>No assets match your filters yet.</p>
          <p>Use the <strong>Contribute</strong> tab to upload gravesite photos, albums, and documents.</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {filtered.map((asset, i) => {
            const person = peopleById.get(asset.personId);
            return (
              <motion.button
                key={asset.id}
                type="button"
                className="gallery-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.4) }}
                onClick={() => setLightbox(asset)}
              >
                <div className="gallery-card-thumb">
                  {isImageAsset(asset) ? (
                    <img src={asset.url} alt={asset.title} loading="lazy" />
                  ) : (
                    <span>📄</span>
                  )}
                  <span className={`source-badge ${asset.source}`}>{SOURCE_LABELS[asset.source]}</span>
                </div>
                <div className="gallery-card-body">
                  <strong>{asset.title}</strong>
                  {person && (
                    <span className="gallery-person" onClick={(e) => { e.stopPropagation(); onSelectPerson(person); }}>
                      {person.name}
                    </span>
                  )}
                  <span className="gallery-type">{asset.type}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {lightbox && (
          <>
            <motion.div
              className="lb-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightbox(null)}
            />
            <motion.div
              className="lb-panel"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <button type="button" className="lb-close" onClick={() => setLightbox(null)}>✕</button>
              {isImageAsset(lightbox) ? (
                <img src={lightbox.url} alt={lightbox.title} />
              ) : (
                <div className="lb-doc">
                  <span>📄</span>
                  <p>{lightbox.title}</p>
                  <a href={lightbox.url} target="_blank" rel="noopener noreferrer">Open document</a>
                </div>
              )}
              <div className="lb-meta">
                <strong>{lightbox.title}</strong>
                {lightbox.caption && <p>{lightbox.caption}</p>}
                <div className="lb-actions">
                  {peopleById.get(lightbox.personId) && (
                    <button type="button" onClick={() => {
                      const p = peopleById.get(lightbox.personId)!;
                      setLightbox(null);
                      onSelectPerson(p);
                    }}>
                      View {peopleById.get(lightbox.personId)!.name.split(" ").slice(-2).join(" ")}
                    </button>
                  )}
                  <span>{SOURCE_LABELS[lightbox.source]} · {lightbox.type}</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .gallery-view { display: flex; flex-direction: column; gap: 20px; }
        .gallery-header {
          display: flex; justify-content: space-between; align-items: flex-start; gap: 24px;
        }
        .gallery-header h2 {
          font-size: clamp(28px, 4vw, 40px); font-weight: 700; letter-spacing: -0.03em;
        }
        .gallery-header p {
          font-size: 15px; color: var(--text-secondary); line-height: 1.6;
          margin-top: 8px; max-width: 640px;
        }
        .gallery-stats {
          display: flex; flex-direction: column; gap: 6px; align-items: flex-end;
          font-size: 12px; color: var(--text-tertiary);
        }
        .gallery-stats span {
          padding: 4px 10px; border-radius: 6px;
          background: var(--bg-glass); border: 1px solid var(--border);
        }
        .gallery-toolbar { display: flex; flex-direction: column; gap: 10px; }
        .gallery-search {
          padding: 12px 16px; border-radius: 10px; font-size: 14px;
          background: var(--bg-glass); border: 1px solid var(--border); color: var(--text);
        }
        .gallery-filters { display: flex; flex-wrap: wrap; gap: 6px; }
        .gallery-filters button {
          padding: 6px 14px; border-radius: 980px; font-size: 12px; font-weight: 500;
          color: var(--text-secondary); background: var(--bg-glass); border: 1px solid var(--border);
        }
        .gallery-filters button.active {
          background: rgba(201, 162, 39, 0.12); color: var(--accent-bright);
          border-color: var(--border-accent);
        }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 14px;
        }
        .gallery-card {
          text-align: left; border-radius: 12px; overflow: hidden;
          border: 1px solid var(--border); background: var(--bg-glass);
          transition: border-color 0.15s, transform 0.15s;
        }
        .gallery-card:hover {
          border-color: var(--border-accent); transform: translateY(-3px);
        }
        .gallery-card-thumb {
          position: relative; aspect-ratio: 4/3; background: rgba(0,0,0,0.25);
          display: flex; align-items: center; justify-content: center;
        }
        .gallery-card-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .gallery-card-thumb span { font-size: 36px; }
        .source-badge {
          position: absolute; top: 8px; left: 8px;
          font-size: 9px; font-weight: 700; text-transform: uppercase;
          padding: 3px 7px; border-radius: 4px;
        }
        .source-badge.site { background: rgba(80,200,120,0.85); color: #fff; }
        .source-badge.cloud { background: rgba(74,158,255,0.85); color: #fff; }
        .source-badge.local { background: rgba(201,162,39,0.85); color: #0a0e1a; }
        .gallery-card-body { padding: 12px; }
        .gallery-card-body strong {
          display: block; font-size: 13px; line-height: 1.35; margin-bottom: 4px;
        }
        .gallery-person {
          display: block; font-size: 12px; color: var(--accent-secondary);
          margin-bottom: 4px; cursor: pointer;
        }
        .gallery-type {
          font-size: 10px; color: var(--text-tertiary); text-transform: capitalize;
        }
        .gallery-empty {
          text-align: center; padding: 64px 24px;
          background: var(--bg-glass); border: 1px dashed var(--border);
          border-radius: var(--radius-sm);
        }
        .gallery-empty span { font-size: 48px; }
        .gallery-empty p { margin-top: 12px; color: var(--text-secondary); font-size: 14px; }
        .lb-backdrop {
          position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 300;
        }
        .lb-panel {
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
          z-index: 301; max-width: min(92vw, 800px); max-height: 90vh;
          background: var(--bg-elevated); border: 1px solid var(--border);
          border-radius: var(--radius-sm); overflow: hidden;
          display: flex; flex-direction: column;
        }
        .lb-panel img { max-height: 55vh; width: 100%; object-fit: contain; background: #000; }
        .lb-close {
          position: absolute; top: 12px; right: 12px; z-index: 2;
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(0,0,0,0.5); color: #fff;
        }
        .lb-doc { padding: 48px; text-align: center; }
        .lb-doc span { font-size: 48px; }
        .lb-doc a { color: var(--accent); font-size: 14px; }
        .lb-meta { padding: 16px 20px; border-top: 1px solid var(--border); }
        .lb-meta p { font-size: 13px; color: var(--text-secondary); margin-top: 6px; }
        .lb-actions {
          display: flex; justify-content: space-between; align-items: center;
          margin-top: 12px; font-size: 12px; color: var(--text-tertiary);
        }
        .lb-actions button { color: var(--accent); font-weight: 600; }
        @media (max-width: 768px) {
          .gallery-header { flex-direction: column; }
          .gallery-stats { flex-direction: row; align-items: center; }
        }
      `}</style>
    </div>
  );
}
