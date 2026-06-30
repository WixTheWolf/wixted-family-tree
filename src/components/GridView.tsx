import { motion } from "framer-motion";
import type { Person } from "../types";
import { getPersonAge } from "../utils/ages";
import PersonAvatar from "./PersonAvatar";

interface Props {
  people: Person[];
  selectedId: string | null;
  focusLine?: string[];
  onSelect: (p: Person) => void;
}

export default function GridView({ people, selectedId, focusLine, onSelect }: Props) {
  const sorted = [...people].sort((a, b) => (a.generation ?? 0) - (b.generation ?? 0) || a.col - b.col);

  return (
    <div className="grid-view">
      {sorted.map((p, i) => (
        <motion.button
          key={p.id}
          className={`grid-card ${selectedId === p.id ? "selected" : ""} ${focusLine?.includes(p.id) ? "focus-line" : ""} ${p.isFocus ? "is-focus" : ""}`}
          onClick={() => onSelect(p)}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.985 }}
          transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.5) }}
        >
          <div className="grid-card-sheen" />
          <div className="grid-card-header">
            <PersonAvatar person={p} size={52} />
            <div className="grid-card-title">
              <div className="grid-card-name">{p.name}</div>
              {(p.dates || getPersonAge(p)) && (
                <div className="grid-card-dates">{p.dates || getPersonAge(p)}</div>
              )}
            </div>
          </div>
          {p.notes.length > 0 && (
            <div className="grid-card-note">{p.notes[0]}</div>
          )}
          <div className="grid-card-footer">
            <span>{p.isFocus ? "Focus" : `Gen ${p.generation ?? "?"}`}</span>
            <span>{p.branch}</span>
          </div>
        </motion.button>
      ))}

      <style>{`
        .grid-view {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 12px; padding: 4px;
          max-height: calc(100vh - 280px); overflow-y: auto;
        }
        .grid-card {
          position: relative;
          text-align: left; padding: 18px;
          background:
            linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.015)),
            var(--bg-elevated);
          border-radius: 18px;
          border: 1.5px solid var(--border); box-shadow: var(--shadow-sm);
          transition: box-shadow 0.2s, border-color 0.2s, background 0.2s;
          overflow: hidden;
          min-height: 168px;
        }
        .grid-card-sheen {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 0% 0%, rgba(201,162,39,0.12), transparent 34%),
            radial-gradient(circle at 100% 100%, rgba(74,158,255,0.1), transparent 32%);
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: none;
        }
        .grid-card-header {
          position: relative;
          display: flex;
          align-items: center;
          gap: 13px;
          z-index: 1;
        }
        .grid-card-title { min-width: 0; }
        .grid-card.focus-line, .grid-card.is-focus {
          border-color: var(--border-accent);
        }
        .grid-card.is-focus {
          background: rgba(201, 162, 39, 0.06);
        }
        .grid-card:hover {
          box-shadow: var(--shadow-md); border-color: var(--border-accent);
        }
        .grid-card:hover .grid-card-sheen {
          opacity: 1;
        }
        .grid-card.selected {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-glow), var(--shadow-md);
        }
        .grid-card-name {
          font-size: 15px; font-weight: 600; color: var(--text); line-height: 1.3;
        }
        .grid-card-dates {
          font-size: 13px; color: var(--text-tertiary); margin-top: 6px;
        }
        .grid-card-note {
          position: relative;
          font-size: 12px; color: var(--text-secondary); margin-top: 8px;
          line-height: 1.4;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden;
          z-index: 1;
        }
        .grid-card-footer {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 14px;
          z-index: 1;
        }
        .grid-card-footer span {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 4px 9px;
          border-radius: 980px;
          background: rgba(255,255,255,0.055);
          color: var(--text-tertiary);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .grid-card.is-focus .grid-card-footer span:first-child,
        .grid-card.focus-line .grid-card-footer span:first-child {
          background: rgba(201,162,39,0.14);
          color: var(--accent-bright);
        }
      `}</style>
    </div>
  );
}