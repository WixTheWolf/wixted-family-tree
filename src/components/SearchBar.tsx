import { motion, AnimatePresence } from "framer-motion";
import type { Person } from "../types";

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  results: Person[];
  onSelect: (p: Person) => void;
  onClose: () => void;
}

export default function SearchBar({ query, onQueryChange, results, onSelect, onClose }: Props) {
  return (
    <div className="search-wrapper">
      <div className="search-bar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search family members…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          autoFocus
        />
        {query && (
          <button className="search-clear" onClick={() => { onQueryChange(""); onClose(); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <AnimatePresence>
        {query.length >= 2 && results.length > 0 && (
          <motion.div
            className="search-results"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {results.slice(0, 12).map((p) => (
              <button key={p.id} className="search-result" onClick={() => onSelect(p)}>
                <span className="search-result-name">{p.name}</span>
                {p.dates && <span className="search-result-dates">{p.dates}</span>}
              </button>
            ))}
            {results.length > 12 && (
              <div className="search-more">{results.length - 12} more results…</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .search-wrapper { position: relative; width: 100%; max-width: 480px; }
        .search-bar {
          display: flex; align-items: center; gap: 10px;
          background: var(--bg-elevated); border: 1px solid var(--border);
          border-radius: 980px; padding: 10px 18px;
          box-shadow: var(--shadow-sm);
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .search-bar:focus-within {
          box-shadow: var(--shadow-md); border-color: rgba(0,113,227,0.3);
        }
        .search-bar svg { color: var(--text-tertiary); flex-shrink: 0; }
        .search-bar input {
          flex: 1; border: none; outline: none; background: transparent;
          font-size: 17px; color: var(--text);
        }
        .search-bar input::placeholder { color: var(--text-tertiary); }
        .search-clear {
          display: flex; align-items: center; justify-content: center;
          width: 24px; height: 24px; border-radius: 50%;
          color: var(--text-tertiary); transition: background 0.15s;
        }
        .search-clear:hover { background: rgba(0,0,0,0.06); }
        .search-results {
          position: absolute; top: calc(100% + 8px); left: 0; right: 0;
          background: var(--bg-elevated); border-radius: var(--radius-sm);
          box-shadow: var(--shadow-lg); border: 1px solid var(--border);
          overflow: hidden; z-index: 100;
        }
        .search-result {
          display: flex; justify-content: space-between; align-items: center;
          width: 100%; padding: 12px 18px; text-align: left;
          transition: background 0.15s;
        }
        .search-result:hover { background: rgba(0,113,227,0.06); }
        .search-result-name { font-size: 15px; font-weight: 500; color: var(--text); }
        .search-result-dates { font-size: 13px; color: var(--text-tertiary); }
        .search-more {
          padding: 10px 18px; font-size: 13px; color: var(--text-tertiary);
          border-top: 1px solid var(--border);
        }
      `}</style>
    </div>
  );
}