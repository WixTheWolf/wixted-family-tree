import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { CemeteryRecord, LocationRef, Person } from "../types";

interface Props {
  cemetery: CemeteryRecord[];
  locationRefs: LocationRef[];
  people: Person[];
  onSelectPerson: (p: Person) => void;
}

function matchPerson(name: string, people: Person[]): Person | undefined {
  const low = name.toLowerCase();
  const first = low.split(/[\s,]+/).find((w) => w.length > 2) ?? "";
  return people.find(
    (p) =>
      p.name.toLowerCase().includes(first) ||
      low.includes(p.name.split(" ")[0].toLowerCase())
  );
}

export default function CemeteryView({
  cemetery,
  locationRefs,
  people,
  onSelectPerson,
}: Props) {
  const [query, setQuery] = useState("");

  const filteredCemetery = useMemo(() => {
    if (!query) return cemetery;
    const q = query.toLowerCase();
    return cemetery.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.notes.toLowerCase().includes(q)
    );
  }, [cemetery, query]);

  const filteredLocations = useMemo(() => {
    if (!query) return locationRefs;
    const q = query.toLowerCase();
    return locationRefs.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.notes.some((n) => n.toLowerCase().includes(q))
    );
  }, [locationRefs, query]);

  return (
    <div className="cemetery-view">
      <p className="cemetery-intro">
        Grave records and burial locations from the family research workbook — {cemetery.length} headstone
        records and {locationRefs.length} cemetery references across all branches.
      </p>

      <div className="cemetery-search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search by name, cemetery, or location…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filteredLocations.length > 0 && (
        <section className="cemetery-section">
          <h3>Burial Locations ({filteredLocations.length})</h3>
          <div className="cemetery-grid">
            {filteredLocations.map((loc, i) => (
              <motion.div
                key={loc.id}
                className="cemetery-card location-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.3) }}
              >
                <div className="cemetery-card-name">{loc.name}</div>
                {loc.notes.map((n, j) => (
                  <div key={j} className="cemetery-card-detail">{n}</div>
                ))}
                {loc.relatedPersonIds.length > 0 && (
                  <div className="cemetery-links">
                    {loc.relatedPersonIds.slice(0, 3).map((pid) => {
                      const p = people.find((x) => x.id === pid);
                      return p ? (
                        <button key={pid} onClick={() => onSelectPerson(p)}>{p.name}</button>
                      ) : null;
                    })}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <section className="cemetery-section">
        <h3>Headstone Records ({filteredCemetery.length})</h3>
        <div className="cemetery-grid">
          {filteredCemetery.map((c, i) => {
            const linked = matchPerson(c.name, people);
            return (
              <motion.div
                key={c.id}
                className="cemetery-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.3) }}
              >
                <div className="cemetery-card-name">{c.name}</div>
                {c.location && <div className="cemetery-card-loc">{c.location}</div>}
                {c.died && <div className="cemetery-card-detail">Died: {c.died}</div>}
                {c.born && <div className="cemetery-card-detail">Born: {c.born}</div>}
                {c.relation && <div className="cemetery-card-detail">{c.relation}</div>}
                {c.notes && <div className="cemetery-card-detail">{c.notes}</div>}
                {linked && (
                  <button className="cemetery-link" onClick={() => onSelectPerson(linked)}>
                    View {linked.name} →
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      <style>{`
        .cemetery-view { display: flex; flex-direction: column; gap: 24px; }
        .cemetery-intro {
          font-size: 15px; color: var(--text-secondary); line-height: 1.6;
        }
        .cemetery-search {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 16px; border-radius: 12px;
          background: var(--bg-elevated); border: 1px solid var(--border);
          max-width: 480px;
        }
        .cemetery-search svg { color: var(--text-tertiary); flex-shrink: 0; }
        .cemetery-search input {
          flex: 1; border: none; outline: none; background: transparent;
          font-size: 15px;
        }
        .cemetery-section h3 {
          font-size: 14px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.06em; color: var(--text-tertiary);
          margin-bottom: 12px;
        }
        .cemetery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 12px;
        }
        .cemetery-card {
          padding: 18px; background: var(--bg-elevated);
          border-radius: var(--radius-sm); border: 1px solid var(--border);
        }
        .location-card { border-left: 3px solid var(--accent); }
        .cemetery-card-name { font-weight: 600; font-size: 15px; line-height: 1.3; }
        .cemetery-card-loc {
          font-size: 13px; color: var(--accent); margin-top: 6px; font-weight: 500;
        }
        .cemetery-card-detail {
          font-size: 13px; color: var(--text-tertiary); margin-top: 4px;
        }
        .cemetery-link, .cemetery-links button {
          margin-top: 12px; font-size: 13px; font-weight: 500;
          color: var(--accent); text-align: left;
        }
        .cemetery-links { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
        .cemetery-links button {
          padding: 4px 10px; border-radius: 6px;
          background: rgba(0,113,227,0.06); margin-top: 0;
        }
      `}</style>
    </div>
  );
}
