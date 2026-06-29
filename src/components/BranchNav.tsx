import { motion } from "framer-motion";
import type { Branch } from "../types";

interface Props {
  branches: Branch[];
  active: string;
  onSelect: (id: string) => void;
}

export default function BranchNav({ branches, active, onSelect }: Props) {
  return (
    <nav className="branch-nav">
      {branches.map((b) => (
        <button
          key={b.id}
          className={`branch-pill ${active === b.id ? "active" : ""}`}
          onClick={() => onSelect(b.id)}
        >
          {active === b.id && (
            <motion.div
              className="branch-pill-bg"
              layoutId="branch-bg"
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}
          <span className="branch-pill-label">{b.label}</span>
          <span className="branch-pill-count">{b.count}</span>
        </button>
      ))}

      <style>{`
        .branch-nav {
          display: flex; gap: 8px; overflow-x: auto;
          padding: 4px 0; scrollbar-width: none;
        }
        .branch-nav::-webkit-scrollbar { display: none; }
        .branch-pill {
          position: relative; display: flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 980px; white-space: nowrap;
          font-size: 14px; font-weight: 500; color: var(--text-secondary);
          transition: color 0.2s; flex-shrink: 0;
        }
        .branch-pill:hover { color: var(--text); }
        .branch-pill.active { color: var(--text); }
        .branch-pill-bg {
          position: absolute; inset: 0; background: var(--bg-elevated);
          border-radius: 980px; box-shadow: var(--shadow-sm);
          border: 1px solid var(--border);
        }
        .branch-pill-label, .branch-pill-count { position: relative; z-index: 1; }
        .branch-pill-count {
          font-size: 12px; color: var(--text-tertiary); font-weight: 400;
        }
        .branch-pill.active .branch-pill-count { color: var(--text-secondary); }
      `}</style>
    </nav>
  );
}