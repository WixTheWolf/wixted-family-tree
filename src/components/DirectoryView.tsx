import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Person, Branch } from "../types";
import { groupByLetter } from "../utils/people";

interface Props {
  people: Person[];
  branches: Branch[];
  selectedId: string | null;
  onSelect: (p: Person) => void;
}

export default function DirectoryView({ people, branches, selectedId, onSelect }: Props) {
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [letterFilter, setLetterFilter] = useState<string>("all");
  const [onlyDocumented, setOnlyDocumented] = useState(false);

  const filtered = useMemo(() => {
    let list = people;
    if (branchFilter !== "all") list = list.filter((p) => p.branch === branchFilter);
    if (onlyDocumented) list = list.filter((p) => p.notes.length > 0);
    if (letterFilter !== "all") {
      list = list.filter((p) => {
        const last = p.name.split(/[\s\-]+/).pop()?.charAt(0).toUpperCase() ?? "#";
        return last === letterFilter;
      });
    }
    return list;
  }, [people, branchFilter, letterFilter, onlyDocumented]);

  const groups = useMemo(() => groupByLetter(filtered), [filtered]);
  const letters = useMemo(() => [...groups.keys()].sort(), [groups]);

  const branchLabel = (id: string) => branches.find((b) => b.id === id)?.label ?? id;

  return (
    <div className="directory">
      <div className="directory-toolbar">
        <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
          <option value="all">All branches</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>{b.label} ({b.count})</option>
          ))}
        </select>

        <label className="directory-check">
          <input
            type="checkbox"
            checked={onlyDocumented}
            onChange={(e) => setOnlyDocumented(e.target.checked)}
          />
          With research notes
        </label>

        <span className="directory-count">{filtered.length} people</span>
      </div>

      <div className="directory-letters">
        <button
          className={letterFilter === "all" ? "active" : ""}
          onClick={() => setLetterFilter("all")}
        >
          All
        </button>
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => (
          <button
            key={l}
            className={letterFilter === l ? "active" : ""}
            onClick={() => setLetterFilter(l)}
            disabled={!groups.has(l)}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="directory-list">
        {letters.map((letter) => (
          <section key={letter} className="directory-section">
            <h3 className="directory-letter">{letter}</h3>
            <div className="directory-grid">
              {groups.get(letter)!.map((p, i) => (
                <motion.button
                  key={p.id}
                  className={`directory-card ${selectedId === p.id ? "selected" : ""}`}
                  onClick={() => onSelect(p)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.015, 0.3) }}
                >
                  <div className="directory-card-top">
                    <span className="directory-name">{p.name}</span>
                    <span className="directory-branch">{branchLabel(p.branch)}</span>
                  </div>
                  {p.dates && <div className="directory-dates">{p.dates}</div>}
                  {p.notes.length > 0 && (
                    <div className="directory-note">{p.notes[0]}</div>
                  )}
                  {p.generation !== undefined && (
                    <span className="directory-gen">Gen {p.generation + 1}</span>
                  )}
                </motion.button>
              ))}
            </div>
          </section>
        ))}
      </div>

      <style>{`
        .directory { display: flex; flex-direction: column; gap: 16px; }
        .directory-toolbar {
          display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
        }
        .directory-toolbar select {
          padding: 8px 14px; border-radius: 10px; border: 1px solid var(--border);
          background: var(--bg-elevated); font-size: 14px; color: var(--text);
        }
        .directory-check {
          display: flex; align-items: center; gap: 8px;
          font-size: 14px; color: var(--text-secondary); cursor: pointer;
        }
        .directory-count {
          margin-left: auto; font-size: 13px; color: var(--text-tertiary);
        }
        .directory-letters {
          display: flex; flex-wrap: wrap; gap: 4px;
        }
        .directory-letters button {
          width: 32px; height: 32px; border-radius: 8px;
          font-size: 12px; font-weight: 600; color: var(--text-secondary);
          transition: all 0.15s;
        }
        .directory-letters button:hover:not(:disabled) {
          background: rgba(0,113,227,0.08); color: var(--accent);
        }
        .directory-letters button.active {
          background: var(--accent); color: white;
        }
        .directory-letters button:disabled { opacity: 0.25; cursor: default; }
        .directory-list {
          max-height: calc(100vh - 340px); overflow-y: auto;
          padding-right: 4px;
        }
        .directory-section { margin-bottom: 28px; }
        .directory-letter {
          font-size: 22px; font-weight: 700; color: var(--accent);
          letter-spacing: -0.02em; margin-bottom: 12px;
          position: sticky; top: 0; background: var(--bg);
          padding: 8px 0; z-index: 1;
        }
        .directory-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 10px;
        }
        .directory-card {
          text-align: left; padding: 16px 18px;
          background: var(--bg-elevated); border-radius: var(--radius-sm);
          border: 1.5px solid var(--border); transition: all 0.2s;
          position: relative;
        }
        .directory-card:hover {
          border-color: rgba(0,113,227,0.25);
          box-shadow: var(--shadow-sm);
        }
        .directory-card.selected {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(0,113,227,0.12);
        }
        .directory-card-top {
          display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;
        }
        .directory-name { font-size: 15px; font-weight: 600; line-height: 1.3; }
        .directory-branch {
          font-size: 10px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.05em; color: var(--text-tertiary);
          white-space: nowrap; flex-shrink: 0;
        }
        .directory-dates {
          font-size: 13px; color: var(--text-tertiary); margin-top: 6px;
        }
        .directory-note {
          font-size: 12px; color: var(--text-secondary); margin-top: 8px;
          line-height: 1.4;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .directory-gen {
          position: absolute; bottom: 10px; right: 12px;
          font-size: 10px; color: var(--text-tertiary);
        }
      `}</style>
    </div>
  );
}
