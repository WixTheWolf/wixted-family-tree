import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import externalResources from "../data/externalResources.json";
import type { Person } from "../types";

interface Resource {
  id: string;
  title: string;
  desc: string;
  url: string;
  category: string;
  tags?: string[];
  verified?: boolean;
  matches?: string[];
}

interface Props {
  people: Person[];
  onSelectPerson: (p: Person) => void;
}

export default function ArchivesView({ people, onSelectPerson }: Props) {
  const [category, setCategory] = useState<string>("all");
  const data = externalResources;

  const filtered = useMemo(() => {
    const list = data.resources as Resource[];
    if (category === "all") return list;
    return list.filter((r) => r.category === category);
  }, [category]);

  const catLabel = (id: string) =>
    data.categories.find((c) => c.id === id)?.label ?? id;

  return (
    <div className="archives">
      <div className="archives-header">
        <div>
          <h2>Research Archives</h2>
          <p>
            {data.resources.length} verified public sources discovered online — cemetery indexes,
            obituaries, genealogy databases, and historical records matching the family workbook.
          </p>
        </div>
        <span className="archives-date">Researched {data.meta.researched}</span>
      </div>

      <div className="archives-cats">
        <button className={category === "all" ? "active" : ""} onClick={() => setCategory("all")}>
          All ({data.resources.length})
        </button>
        {data.categories.map((c) => {
          const count = data.resources.filter((r) => r.category === c.id).length;
          return (
            <button
              key={c.id}
              className={category === c.id ? "active" : ""}
              onClick={() => setCategory(c.id)}
            >
              {c.icon} {c.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="archives-grid">
        {filtered.map((r, i) => {
          const linked = (r.matches ?? [])
            .map((id) => people.find((p) => p.id === id))
            .filter(Boolean) as Person[];

          return (
            <motion.a
              key={r.id}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="archive-card"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.4) }}
              whileHover={{ y: -4, borderColor: "var(--border-accent)" }}
            >
              <div className="archive-card-top">
                <span className="archive-cat">{catLabel(r.category)}</span>
                {r.verified && <span className="archive-verified">Verified</span>}
              </div>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
              {r.tags && (
                <div className="archive-tags">
                  {r.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              )}
              {linked.length > 0 && (
                <div className="archive-people" onClick={(e) => e.preventDefault()}>
                  {linked.map((p) => (
                    <button
                      key={p.id}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectPerson(p);
                      }}
                    >
                      {p.name.split(" ").slice(-2).join(" ")}
                    </button>
                  ))}
                </div>
              )}
              <span className="archive-link">Open resource →</span>
            </motion.a>
          );
        })}
      </div>

      <section className="burials-section">
        <h3>Verified Burials from Public Records</h3>
        <p className="burials-intro">
          Cross-referenced against the Steuben County Historian obituary index and Find a Grave.
        </p>
        <div className="burials-table-wrap">
          <table className="burials-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Dates</th>
                <th>Cemetery</th>
                <th>Source</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.verifiedBurials.map((b) => (
                <tr key={b.name}>
                  <td>{b.name}</td>
                  <td>{b.dates}</td>
                  <td>{b.cemetery}</td>
                  <td>{b.source}</td>
                  <td>
                    {b.personId && (
                      <button
                        className="burial-link"
                        onClick={() => {
                          const p = people.find((x) => x.id === b.personId);
                          if (p) onSelectPerson(p);
                        }}
                      >
                        View in tree
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <style>{`
        .archives { display: flex; flex-direction: column; gap: 24px; }
        .archives-header {
          display: flex; justify-content: space-between; align-items: flex-start; gap: 24px;
        }
        .archives-header h2 {
          font-family: var(--font-display); font-size: 28px; font-weight: 700;
        }
        .archives-header p {
          font-size: 15px; color: var(--text-secondary); line-height: 1.6;
          margin-top: 8px; max-width: 640px;
        }
        .archives-date {
          font-size: 12px; color: var(--text-tertiary); white-space: nowrap;
          padding: 6px 12px; border-radius: 8px;
          background: var(--bg-glass); border: 1px solid var(--border);
        }
        .archives-cats { display: flex; flex-wrap: wrap; gap: 8px; }
        .archives-cats button {
          padding: 8px 16px; border-radius: 980px; font-size: 13px;
          font-weight: 500; color: var(--text-secondary);
          background: var(--bg-glass); border: 1px solid var(--border);
          transition: all 0.15s;
        }
        .archives-cats button:hover { border-color: var(--border-accent); }
        .archives-cats button.active {
          background: rgba(201, 162, 39, 0.12); color: var(--accent-bright);
          border-color: var(--border-accent);
        }
        .archives-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 14px;
        }
        .archive-card {
          display: flex; flex-direction: column; padding: 22px;
          background: var(--bg-glass); border: 1px solid var(--border);
          border-radius: var(--radius-sm); text-decoration: none; color: inherit;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .archive-card:hover { box-shadow: var(--shadow-md); }
        .archive-card-top {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 10px;
        }
        .archive-cat {
          font-size: 10px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--accent);
        }
        .archive-verified {
          font-size: 10px; font-weight: 600; padding: 2px 8px;
          border-radius: 6px; background: rgba(80, 200, 120, 0.12);
          color: #50c878;
        }
        .archive-card h3 {
          font-size: 16px; font-weight: 600; line-height: 1.35; margin-bottom: 8px;
        }
        .archive-card p {
          font-size: 13px; color: var(--text-secondary); line-height: 1.55; flex: 1;
        }
        .archive-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
        .archive-tags span {
          font-size: 11px; padding: 3px 8px; border-radius: 6px;
          background: rgba(255,255,255,0.04); color: var(--text-tertiary);
        }
        .archive-people {
          display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px;
          padding-top: 12px; border-top: 1px solid var(--border);
        }
        .archive-people button {
          font-size: 12px; font-weight: 500; color: var(--accent-secondary);
          padding: 4px 10px; border-radius: 6px;
          background: rgba(74, 158, 255, 0.08);
        }
        .archive-link {
          margin-top: 14px; font-size: 13px; font-weight: 500; color: var(--accent);
        }
        .burials-section { margin-top: 16px; }
        .burials-section h3 {
          font-family: var(--font-display); font-size: 20px; font-weight: 600;
        }
        .burials-intro {
          font-size: 14px; color: var(--text-tertiary); margin: 8px 0 16px;
        }
        .burials-table-wrap {
          overflow-x: auto; border-radius: var(--radius-sm);
          border: 1px solid var(--border);
        }
        .burials-table {
          width: 100%; border-collapse: collapse; font-size: 14px;
        }
        .burials-table th {
          text-align: left; padding: 12px 16px;
          font-size: 11px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.06em; color: var(--text-tertiary);
          background: var(--bg-glass); border-bottom: 1px solid var(--border);
        }
        .burials-table td {
          padding: 12px 16px; border-bottom: 1px solid var(--border);
          color: var(--text-secondary);
        }
        .burials-table tr:last-child td { border-bottom: none; }
        .burials-table td:first-child { color: var(--text); font-weight: 500; }
        .burial-link {
          font-size: 12px; font-weight: 500; color: var(--accent);
          white-space: nowrap;
        }
        @media (max-width: 768px) {
          .archives-header { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
