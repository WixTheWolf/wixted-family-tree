import { useCallback, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { AssetType, Person } from "../types";
import { useContributions } from "../context/ContributionsContext";
import { useCloudAssets } from "../context/CloudAssetsContext";
import { getAllAssets, getPendingUploads, getStaticGallery } from "../utils/assets";
import { suggestedFileName } from "../utils/contributionStore";
import PersonAvatar from "./PersonAvatar";

interface Props {
  people: Person[];
  onSelectPerson: (p: Person) => void;
}

const ASSET_TYPES: { id: AssetType; label: string; icon: string }[] = [
  { id: "photo", label: "Family Photo", icon: "📷" },
  { id: "headstone", label: "Headstone / Cemetery", icon: "🪦" },
  { id: "obituary", label: "Obituary", icon: "📰" },
  { id: "document", label: "Document / Letter", icon: "📄" },
  { id: "census", label: "Census / Record", icon: "📋" },
  { id: "other", label: "Other", icon: "📎" },
  { id: "research", label: "Research Link", icon: "🔗" },
];

export default function ContributeView({ people, onSelectPerson }: Props) {
  const { contributions, loading, cloudAvailable, addContribution, removeContribution, exportAll } =
    useContributions();
  const { cloudAssets, authStatus, unlockUpload, lockUpload } = useCloudAssets();
  const [familyKey, setFamilyKey] = useState("");
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [unlocking, setUnlocking] = useState(false);

  const pendingUploads = useMemo(() => getPendingUploads(), []);
  const needsAuth = authStatus.authRequired && !authStatus.authenticated && cloudAvailable;
  const canCloudPublish = cloudAvailable && (!authStatus.authRequired || authStatus.authenticated);
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [personQuery, setPersonQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [uploadedBy, setUploadedBy] = useState("");
  const [assetType, setAssetType] = useState<AssetType>("photo");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const personMatches = useMemo(() => {
    const q = personQuery.trim().toLowerCase();
    if (!q) return people.filter((p) => p.recordType !== "location").slice(0, 8);
    return people
      .filter(
        (p) =>
          p.recordType !== "location" &&
          (p.name.toLowerCase().includes(q) || p.searchText?.toLowerCase().includes(q))
      )
      .slice(0, 10);
  }, [people, personQuery]);

  const siteGalleryCount = getStaticGallery().length;
  const allAssets = getAllAssets(contributions, cloudAssets);

  const resetForm = useCallback(() => {
    setPendingFile(null);
    setPreviewUrl(null);
    setTitle("");
    setCaption("");
    if (fileRef.current) fileRef.current.value = "";
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPendingFile(file);
      if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
      if (file.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    },
    [previewUrl, title]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleUnlock = async () => {
    setUnlocking(true);
    setUnlockError(null);
    const ok = await unlockUpload(familyKey);
    setUnlocking(false);
    if (!ok) {
      setUnlockError("Invalid family upload key. Contact the site admin.");
    } else {
      setFamilyKey("");
    }
  };

  const onSubmit = async () => {
    if (!selectedPerson || !pendingFile) {
      setMessage("Choose a family member and a file to upload.");
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const result = await addContribution({
        personId: selectedPerson.id,
        personName: selectedPerson.name,
        title: title.trim() || pendingFile.name,
        type: assetType,
        caption,
        uploadedBy,
        file: pendingFile,
      });
      const label = title || pendingFile.name;
      if (result.destination === "cloud") {
        setMessage(`Published "${label}" for ${selectedPerson.name} — live for everyone in the Gallery.`);
      } else if (result.code === "AUTH_REQUIRED") {
        setMessage("Family upload key required for cloud publish. Enter your key below, or save locally.");
      } else if (result.fallback) {
        setMessage(`Cloud upload unavailable — saved "${label}" locally. Export or enable Vercel Blob to publish.`);
      } else {
        setMessage(`Saved "${label}" for ${selectedPerson.name} — visible in this browser.`);
      }
      resetForm();
    } catch {
      setMessage("Could not save the file. Try a smaller image or different browser.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contribute">
      <div className="contribute-header">
        <div>
          <h2>Contribute Photos & Documents</h2>
          <p>
            Upload family photos, headstones, obituaries, and research documents.
            {cloudAvailable
              ? " Cloud upload is active — files publish live to the Gallery for everyone."
              : " Files save locally in your browser; export a package or enable Vercel Blob to publish live."}
          </p>
        </div>
        <div className="contribute-stats">
          <span>{siteGalleryCount} on site</span>
          <span>{cloudAssets.length} cloud</span>
          <span>{contributions.length} local</span>
          <span>{allAssets.length} total</span>
          {cloudAvailable && authStatus.authenticated && <span className="cloud-live">🔓 Authorized</span>}
        </div>
      </div>

      {needsAuth && (
        <section className="auth-gate">
          <div>
            <h3>🔒 Family upload key required</h3>
            <p>Cloud publishing is restricted to family members. Enter the upload key shared by Matthew or the site admin.</p>
          </div>
          <div className="auth-row">
            <input
              type="password"
              className="field-input"
              placeholder="Family upload key"
              value={familyKey}
              onChange={(e) => setFamilyKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
            />
            <button type="button" className="submit-btn auth-btn" disabled={unlocking || !familyKey.trim()} onClick={handleUnlock}>
              {unlocking ? "Checking…" : "Unlock cloud upload"}
            </button>
          </div>
          {unlockError && <p className="auth-error">{unlockError}</p>}
        </section>
      )}

      {authStatus.authenticated && authStatus.authRequired && (
        <div className="auth-banner">
          <span>🔓 Cloud upload unlocked for this session</span>
          <button type="button" onClick={lockUpload}>Lock</button>
        </div>
      )}

      <div className="contribute-layout">
        <section className="contribute-form">
          <h3>Add an asset</h3>

          <label className="field-label">Link to family member</label>
          <input
            className="field-input"
            placeholder="Search by name…"
            value={personQuery}
            onChange={(e) => setPersonQuery(e.target.value)}
          />
          <div className="person-picks">
            {personMatches.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`person-pick ${selectedPerson?.id === p.id ? "active" : ""}`}
                onClick={() => {
                  setSelectedPerson(p);
                  setPersonQuery(p.name);
                }}
              >
                <PersonAvatar person={p} size={28} />
                <span>{p.name}</span>
              </button>
            ))}
          </div>

          <label className="field-label">Asset type</label>
          <div className="type-grid">
            {ASSET_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`type-btn ${assetType === t.id ? "active" : ""}`}
                onClick={() => setAssetType(t.id)}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <div
            className={`drop-zone ${dragOver ? "over" : ""} ${pendingFile ? "has-file" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx,.txt"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="drop-preview" />
            ) : pendingFile ? (
              <div className="drop-file">
                <span>📄</span>
                <p>{pendingFile.name}</p>
              </div>
            ) : (
              <>
                <span className="drop-icon">📤</span>
                <p>Drop a photo or document here, or click to browse</p>
                <span className="drop-hint">JPEG, PNG, PDF, DOC — up to ~10 MB recommended</span>
              </>
            )}
          </div>

          <label className="field-label">Title</label>
          <input
            className="field-input"
            placeholder="e.g. Holy Sepulchre headstone, 1984"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="field-label">Caption (optional)</label>
          <textarea
            className="field-textarea"
            placeholder="Who, where, when — any story behind this asset"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
          />

          <label className="field-label">Your name (optional)</label>
          <input
            className="field-input"
            placeholder="Contributed by…"
            value={uploadedBy}
            onChange={(e) => setUploadedBy(e.target.value)}
          />

          {message && <p className="form-message">{message}</p>}

          <button
            type="button"
            className="submit-btn"
            disabled={submitting || !selectedPerson || !pendingFile}
            onClick={onSubmit}
          >
            {submitting ? "Uploading…" : canCloudPublish ? "Publish to Gallery" : "Save to this browser"}
          </button>
        </section>

        <aside className="contribute-side">
          {pendingUploads.length > 0 && (
            <section className="side-card priority-card">
              <h3>Still needed ({pendingUploads.length})</h3>
              <ul className="priority-list">
                {pendingUploads.map((p) => {
                  const person = people.find((x) => x.id === p.personId);
                  return (
                    <li key={p.id}>
                      <strong>{p.title}</strong>
                      {p.caption && <span>{p.caption}</span>}
                      {person && (
                        <button type="button" onClick={() => onSelectPerson(person)}>
                          → {person.name.split(" ").slice(-2).join(" ")}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
          <section className="side-card">
            <h3>Your local uploads ({contributions.length})</h3>
            <p className="side-desc">
              Visible on person profiles in this browser. Export when ready to publish to the live site.
            </p>
            {loading ? (
              <p className="side-empty">Loading…</p>
            ) : contributions.length === 0 ? (
              <p className="side-empty">No uploads yet — add gravesite photos, albums, or documents above.</p>
            ) : (
              <ul className="contrib-list">
                {contributions.map((c) => (
                  <li key={c.id}>
                    <div className="contrib-info">
                      <strong>{c.title}</strong>
                      <span>{c.personName} · {c.type}</span>
                      <code>{suggestedFileName(c)}</code>
                    </div>
                    <div className="contrib-actions">
                      <button type="button" onClick={() => {
                        const p = people.find((x) => x.id === c.personId);
                        if (p) onSelectPerson(p);
                      }}>View</button>
                      <button type="button" className="danger" onClick={() => removeContribution(c.id)}>Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {contributions.length > 0 && (
              <button type="button" className="export-btn" onClick={exportAll}>
                Export package for site ({contributions.length} files)
              </button>
            )}
          </section>

          <section className="side-card steps">
            <h3>Cloud setup (Vercel)</h3>
            <ol>
              <li>Vercel → Storage → Create <strong>Blob</strong> store</li>
              <li>Add env <code>FAMILY_UPLOAD_KEY</code> (family password)</li>
              <li>Redeploy — Contribute shows <strong>☁️ Live</strong></li>
              <li>Or export locally → <code>scripts/ingest_contribution.py</code></li>
            </ol>
          </section>

          <section className="side-card steps">
            <h3>Publish via export</h3>
            <ol>
              <li>Upload and review assets here</li>
              <li>Click <strong>Export package</strong> — downloads files + manifest JSON</li>
              <li>Place files in <code>public/assets/people/&#123;personId&#125;/</code></li>
              <li>Merge gallery entries into <code>src/data/assets.json</code></li>
              <li>Commit and deploy — assets appear for everyone</li>
            </ol>
          </section>

          <section className="side-card">
            <h3>Priority uploads from research</h3>
            <ul className="priority-list">
              <li>McGraw / Doane / Bursley gravesite photos (workbook notes)</li>
              <li>Bruce John Wixted obituary scan (1995)</li>
              <li>Rodney & Karyl Wixted family albums</li>
              <li>Corning / Rochester headstone photos</li>
              <li>Gilbert colonial history documents</li>
            </ul>
          </section>
        </aside>
      </div>

      <style>{`
        .contribute { display: flex; flex-direction: column; gap: 24px; }
        .contribute-header {
          display: flex; justify-content: space-between; align-items: flex-start; gap: 24px;
        }
        .contribute-header h2 {
          font-family: var(--font-display); font-size: 28px; font-weight: 700;
        }
        .contribute-header p {
          font-size: 15px; color: var(--text-secondary); line-height: 1.6;
          margin-top: 8px; max-width: 640px;
        }
        .contribute-stats {
          display: flex; flex-direction: column; gap: 6px; align-items: flex-end;
          font-size: 12px; color: var(--text-tertiary);
        }
        .contribute-stats span {
          padding: 4px 10px; border-radius: 6px;
          background: var(--bg-glass); border: 1px solid var(--border);
        }
        .cloud-live {
          color: var(--accent-secondary) !important;
          border-color: rgba(74, 158, 255, 0.35) !important;
        }
        .auth-gate {
          padding: 20px 24px; border-radius: var(--radius-sm);
          background: rgba(232, 93, 117, 0.06); border: 1px solid rgba(232, 93, 117, 0.25);
        }
        .auth-gate h3 { font-size: 16px; font-weight: 600; margin-bottom: 6px; }
        .auth-gate p { font-size: 13px; color: var(--text-secondary); margin-bottom: 14px; }
        .auth-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .auth-row .field-input { flex: 1; min-width: 200px; }
        .auth-btn { width: auto; padding: 10px 20px; margin-top: 0; }
        .auth-error { margin-top: 10px; font-size: 13px; color: #e85d75; }
        .auth-banner {
          display: flex; justify-content: space-between; align-items: center;
          padding: 10px 16px; border-radius: 8px;
          background: rgba(80, 200, 120, 0.08); border: 1px solid rgba(80, 200, 120, 0.2);
          font-size: 13px; color: #50c878;
        }
        .auth-banner button { font-size: 12px; color: var(--text-tertiary); }
        .priority-card li {
          margin-bottom: 12px; font-size: 13px; color: var(--text-secondary); line-height: 1.5;
        }
        .priority-card li strong { display: block; color: var(--text); margin-bottom: 4px; }
        .priority-card li span { display: block; font-size: 12px; color: var(--text-tertiary); }
        .priority-card li button {
          margin-top: 6px; font-size: 12px; color: var(--accent); font-weight: 600;
        }
        .contribute-layout {
          display: grid; grid-template-columns: 1fr 340px; gap: 20px; align-items: start;
        }
        .contribute-form, .side-card {
          padding: 24px; background: var(--bg-glass);
          border: 1px solid var(--border); border-radius: var(--radius-sm);
        }
        .contribute-form h3, .side-card h3 {
          font-size: 16px; font-weight: 600; margin-bottom: 16px;
        }
        .field-label {
          display: block; font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.06em;
          color: var(--text-tertiary); margin: 14px 0 6px;
        }
        .field-input, .field-textarea {
          width: 100%; padding: 10px 14px; border-radius: 8px;
          background: rgba(0,0,0,0.2); border: 1px solid var(--border);
          color: var(--text); font-size: 14px;
        }
        .field-input:focus, .field-textarea:focus {
          outline: none; border-color: var(--border-accent);
        }
        .person-picks { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
        .person-pick {
          display: flex; align-items: center; gap: 8px;
          padding: 6px 12px 6px 6px; border-radius: 980px;
          font-size: 12px; border: 1px solid var(--border);
          background: rgba(255,255,255,0.03); color: var(--text-secondary);
        }
        .person-pick.active {
          border-color: var(--border-accent);
          background: rgba(201, 162, 39, 0.1); color: var(--accent-bright);
        }
        .type-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
        }
        .type-btn {
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          padding: 12px 8px; border-radius: 10px; font-size: 11px;
          border: 1px solid var(--border); color: var(--text-secondary);
          transition: all 0.15s;
        }
        .type-btn span:first-child { font-size: 20px; }
        .type-btn.active {
          border-color: var(--border-accent);
          background: rgba(201, 162, 39, 0.1); color: var(--accent-bright);
        }
        .drop-zone {
          margin-top: 16px; padding: 32px 20px; border-radius: 12px;
          border: 2px dashed var(--border); text-align: center; cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .drop-zone.over, .drop-zone:hover {
          border-color: var(--border-accent);
          background: rgba(201, 162, 39, 0.04);
        }
        .drop-zone.has-file { padding: 12px; }
        .drop-icon { font-size: 36px; display: block; margin-bottom: 8px; }
        .drop-zone p { font-size: 14px; color: var(--text-secondary); }
        .drop-hint { font-size: 12px; color: var(--text-tertiary); margin-top: 6px; display: block; }
        .drop-preview {
          max-height: 200px; max-width: 100%; border-radius: 8px; object-fit: contain;
        }
        .drop-file span { font-size: 40px; }
        .form-message {
          margin-top: 12px; padding: 10px 14px; border-radius: 8px;
          font-size: 13px; background: rgba(80, 200, 120, 0.1);
          color: #50c878; border: 1px solid rgba(80, 200, 120, 0.2);
        }
        .submit-btn {
          margin-top: 16px; width: 100%; padding: 14px;
          border-radius: 10px; font-size: 14px; font-weight: 600;
          background: linear-gradient(135deg, var(--accent), #a88620);
          color: #0a0e1a; transition: opacity 0.15s;
        }
        .submit-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .contribute-side { display: flex; flex-direction: column; gap: 14px; }
        .side-desc { font-size: 13px; color: var(--text-tertiary); margin: -8px 0 12px; line-height: 1.5; }
        .side-empty { font-size: 13px; color: var(--text-tertiary); line-height: 1.55; }
        .contrib-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .contrib-list li {
          padding: 12px; border-radius: 8px;
          background: rgba(0,0,0,0.15); border: 1px solid var(--border);
        }
        .contrib-info strong { display: block; font-size: 13px; margin-bottom: 4px; }
        .contrib-info span { font-size: 11px; color: var(--text-tertiary); }
        .contrib-info code {
          display: block; margin-top: 6px; font-size: 10px;
          color: var(--accent-secondary); word-break: break-all;
        }
        .contrib-actions { display: flex; gap: 8px; margin-top: 8px; }
        .contrib-actions button {
          font-size: 11px; font-weight: 600; color: var(--accent);
          padding: 4px 8px; border-radius: 6px;
          background: rgba(201, 162, 39, 0.08);
        }
        .contrib-actions button.danger { color: #e85d75; background: rgba(232, 93, 117, 0.08); }
        .export-btn {
          margin-top: 14px; width: 100%; padding: 12px;
          border-radius: 10px; font-size: 13px; font-weight: 600;
          border: 1px solid var(--border-accent); color: var(--accent-bright);
          background: rgba(201, 162, 39, 0.08);
        }
        .steps ol {
          padding-left: 18px; font-size: 13px; color: var(--text-secondary); line-height: 1.7;
        }
        .steps code {
          font-size: 11px; color: var(--accent-secondary);
          background: rgba(255,255,255,0.04); padding: 1px 4px; border-radius: 4px;
        }
        .priority-list {
          padding-left: 18px; font-size: 13px; color: var(--text-secondary); line-height: 1.65;
        }
        @media (max-width: 960px) {
          .contribute-layout { grid-template-columns: 1fr; }
          .contribute-header { flex-direction: column; }
          .contribute-stats { flex-direction: row; align-items: center; }
          .type-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
