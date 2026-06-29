import { motion, AnimatePresence } from "framer-motion";
import type { Person, CemeteryRecord } from "../types";

interface Props {
  person: Person | null;
  cemetery: CemeteryRecord[];
  relatives: Person[];
  onClose: () => void;
  onSelectRelative: (p: Person) => void;
}

export default function PersonDetail({ person, cemetery, relatives, onClose, onSelectRelative }: Props) {
  const cemMatch = person
    ? cemetery.filter((c) =>
        person.name.toLowerCase().includes(c.name.toLowerCase()) ||
        c.name.toLowerCase().includes(person.name.split(" ")[0].toLowerCase())
      )
    : [];

  return (
    <AnimatePresence>
      {person && (
        <>
          <motion.div
            className="detail-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="detail-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          >
            <button className="detail-close" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="detail-content">
              <h2>{person.name}</h2>
              {person.dates && <p className="detail-dates">{person.dates}</p>}

              {person.generation !== undefined && (
                <div className="detail-badge">Generation {person.generation + 1}</div>
              )}

              {person.notes.length > 0 && (
                <section className="detail-section">
                  <h3>Notes</h3>
                  <ul>
                    {person.notes.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                </section>
              )}

              {cemMatch.length > 0 && (
                <section className="detail-section">
                  <h3>Cemetery</h3>
                  {cemMatch.map((c) => (
                    <div key={c.id} className="cem-card">
                      <div className="cem-name">{c.name}</div>
                      {c.location && <div className="cem-loc">{c.location}</div>}
                      {c.died && <div className="cem-date">Died: {c.died}</div>}
                      {c.relation && <div className="cem-rel">{c.relation}</div>}
                    </div>
                  ))}
                </section>
              )}

              {relatives.length > 0 && (
                <section className="detail-section">
                  <h3>Related</h3>
                  <div className="relatives-list">
                    {relatives.map((r) => (
                      <button key={r.id} className="relative-chip" onClick={() => onSelectRelative(r)}>
                        <span>{r.name}</span>
                        {r.dates && <span className="relative-dates">{r.dates}</span>}
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </motion.aside>

          <style>{`
            .detail-backdrop {
              position: fixed; inset: 0; background: rgba(0,0,0,0.2);
              backdrop-filter: blur(4px); z-index: 200;
            }
            .detail-panel {
              position: fixed; top: 0; right: 0; bottom: 0; width: 400px;
              max-width: 90vw; background: var(--bg-elevated);
              box-shadow: var(--shadow-lg); z-index: 201;
              overflow-y: auto;
            }
            .detail-close {
              position: absolute; top: 16px; right: 16px; z-index: 1;
              width: 32px; height: 32px; border-radius: 50%;
              display: flex; align-items: center; justify-content: center;
              color: var(--text-tertiary); transition: background 0.15s;
            }
            .detail-close:hover { background: rgba(0,0,0,0.06); }
            .detail-content { padding: 48px 32px 32px; }
            .detail-content h2 {
              font-size: 28px; font-weight: 700; letter-spacing: -0.02em;
              line-height: 1.2; color: var(--text);
            }
            .detail-dates {
              font-size: 17px; color: var(--text-secondary); margin-top: 8px;
            }
            .detail-badge {
              display: inline-block; margin-top: 16px;
              padding: 4px 12px; border-radius: 980px;
              background: rgba(0,113,227,0.08); color: var(--accent);
              font-size: 13px; font-weight: 500;
            }
            .detail-section { margin-top: 32px; }
            .detail-section h3 {
              font-size: 13px; font-weight: 600; text-transform: uppercase;
              letter-spacing: 0.06em; color: var(--text-tertiary); margin-bottom: 12px;
            }
            .detail-section ul { list-style: none; }
            .detail-section li {
              font-size: 15px; color: var(--text-secondary); line-height: 1.5;
              padding: 8px 0; border-bottom: 1px solid var(--border);
            }
            .cem-card {
              padding: 14px; border-radius: var(--radius-sm);
              background: var(--bg); border: 1px solid var(--border);
              margin-bottom: 8px;
            }
            .cem-name { font-weight: 600; font-size: 15px; }
            .cem-loc, .cem-date, .cem-rel {
              font-size: 13px; color: var(--text-tertiary); margin-top: 4px;
            }
            .relatives-list { display: flex; flex-direction: column; gap: 6px; }
            .relative-chip {
              display: flex; justify-content: space-between; align-items: center;
              padding: 10px 14px; border-radius: var(--radius-sm);
              background: var(--bg); border: 1px solid var(--border);
              text-align: left; transition: border-color 0.15s, background 0.15s;
            }
            .relative-chip:hover {
              border-color: rgba(0,113,227,0.3); background: rgba(0,113,227,0.04);
            }
            .relative-chip span:first-child { font-size: 14px; font-weight: 500; }
            .relative-dates { font-size: 12px; color: var(--text-tertiary); }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}