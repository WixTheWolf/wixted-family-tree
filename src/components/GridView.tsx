import { motion } from "framer-motion";
import type { Person } from "../types";

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
          transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.5) }}
        >
          <div className="grid-card-name">{p.name}</div>
          {p.dates && <div className="grid-card-dates">{p.dates}</div>}
          {p.notes.length > 0 && (
            <div className="grid-card-note">{p.notes[0]}</div>
          )}
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
          text-align: left; padding: 20px;
          background: var(--bg-elevated); border-radius: var(--radius-sm);
          border: 1.5px solid var(--border); box-shadow: var(--shadow-sm);
          transition: box-shadow 0.2s, border-color 0.2s, transform 0.2s;
        }
        .grid-card.focus-line, .grid-card.is-focus {
          border-color: var(--border-accent);
        }
        .grid-card.is-focus {
          background: rgba(201, 162, 39, 0.06);
        }
        .grid-card:hover {
          box-shadow: var(--shadow-md); border-color: var(--border-accent);
          transform: translateY(-2px);
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
          font-size: 12px; color: var(--text-secondary); margin-top: 8px;
          line-height: 1.4;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}