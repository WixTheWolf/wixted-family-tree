import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FamilyAsset } from "../types";

interface Props {
  assets: FamilyAsset[];
}

function isImageAsset(asset: FamilyAsset): boolean {
  if (asset.type === "photo" || asset.type === "headstone") return true;
  if (asset.mimeType?.startsWith("image/")) return true;
  return /\.(jpe?g|png|gif|webp|svg)$/i.test(asset.url);
}

export default function PersonGallery({ assets }: Props) {
  const [lightbox, setLightbox] = useState<FamilyAsset | null>(null);

  if (assets.length === 0) return null;

  return (
    <>
      <section className="detail-section">
        <h3>Photos & Documents ({assets.length})</h3>
        <div className="gallery-grid">
          {assets.map((asset) => (
            <button
              key={asset.id}
              className="gallery-item"
              onClick={() => setLightbox(asset)}
              type="button"
            >
              <div className="gallery-thumb">
                {isImageAsset(asset) ? (
                  <img src={asset.url} alt={asset.title} loading="lazy" />
                ) : (
                  <span className="gallery-doc-icon">📄</span>
                )}
                {asset.source === "local" && <span className="gallery-badge">Local</span>}
              </div>
              <span className="gallery-title">{asset.title}</span>
              <span className="gallery-type">{asset.type}</span>
            </button>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {lightbox && (
          <>
            <motion.div
              className="gallery-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightbox(null)}
            />
            <motion.div
              className="gallery-lightbox"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <button className="gallery-close" onClick={() => setLightbox(null)} type="button">
                ✕
              </button>
              {isImageAsset(lightbox) ? (
                <img src={lightbox.url} alt={lightbox.title} />
              ) : (
                <div className="gallery-doc-preview">
                  <span>📄</span>
                  <p>{lightbox.title}</p>
                  <a href={lightbox.url} target="_blank" rel="noopener noreferrer">
                    Open document
                  </a>
                </div>
              )}
              <div className="gallery-meta">
                <strong>{lightbox.title}</strong>
                {lightbox.caption && <p>{lightbox.caption}</p>}
                <div className="gallery-meta-row">
                  <span>{lightbox.type}</span>
                  {lightbox.uploadedBy && <span>by {lightbox.uploadedBy}</span>}
                  {lightbox.photoDate && <span>{lightbox.photoDate}</span>}
                  {lightbox.addedAt && <span>{lightbox.addedAt}</span>}
                  {lightbox.source === "local" && <span className="local-tag">Saved in this browser</span>}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 10px;
        }
        .gallery-item {
          text-align: left; border-radius: 10px; overflow: hidden;
          border: 1px solid var(--border); background: var(--bg-glass);
          transition: border-color 0.15s, transform 0.15s;
        }
        .gallery-item:hover {
          border-color: var(--border-accent); transform: translateY(-2px);
        }
        .gallery-thumb {
          position: relative; aspect-ratio: 1; background: rgba(0,0,0,0.2);
          display: flex; align-items: center; justify-content: center;
        }
        .gallery-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .gallery-doc-icon { font-size: 32px; }
        .gallery-badge {
          position: absolute; top: 6px; right: 6px;
          font-size: 9px; font-weight: 700; text-transform: uppercase;
          padding: 2px 6px; border-radius: 4px;
          background: rgba(74, 158, 255, 0.85); color: #fff;
        }
        .gallery-title {
          display: block; padding: 8px 8px 2px;
          font-size: 11px; font-weight: 600; line-height: 1.3;
          color: var(--text); overflow: hidden; text-overflow: ellipsis;
          white-space: nowrap;
        }
        .gallery-type {
          display: block; padding: 0 8px 8px;
          font-size: 10px; color: var(--text-tertiary); text-transform: capitalize;
        }
        .gallery-backdrop {
          position: fixed; inset: 0; background: rgba(0,0,0,0.75);
          z-index: 200;
        }
        .gallery-lightbox {
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
          z-index: 201; max-width: min(90vw, 720px); max-height: 90vh;
          background: var(--bg-elevated); border: 1px solid var(--border);
          border-radius: var(--radius-sm); overflow: hidden;
          display: flex; flex-direction: column;
          box-shadow: var(--shadow-md);
        }
        .gallery-lightbox img {
          max-height: 60vh; width: 100%; object-fit: contain;
          background: #000;
        }
        .gallery-close {
          position: absolute; top: 12px; right: 12px; z-index: 2;
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(0,0,0,0.5); color: #fff; font-size: 14px;
        }
        .gallery-doc-preview {
          padding: 48px 32px; text-align: center;
          background: var(--bg-glass);
        }
        .gallery-doc-preview span { font-size: 48px; }
        .gallery-doc-preview p { margin: 12px 0; font-weight: 600; }
        .gallery-doc-preview a { color: var(--accent); font-size: 14px; }
        .gallery-meta {
          padding: 16px 20px; border-top: 1px solid var(--border);
        }
        .gallery-meta strong { font-size: 15px; }
        .gallery-meta p {
          margin-top: 6px; font-size: 13px; color: var(--text-secondary); line-height: 1.5;
        }
        .gallery-meta-row {
          display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;
          font-size: 11px; color: var(--text-tertiary); text-transform: capitalize;
        }
        .local-tag { color: var(--accent-secondary); }
      `}</style>
    </>
  );
}
