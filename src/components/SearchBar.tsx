import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SearchResult } from "../types";

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  results: SearchResult[];
  onSelect: (r: SearchResult) => void;
  onClose: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  person: "Person",
  story: "Story",
  cemetery: "Cemetery",
  location: "Location",
};

export default function SearchBar({ query, onQueryChange, results, onSelect, onClose }: Props) {
  const listRef = useRef<HTMLDivElement>(null);
  const activeIndex = useRef(0);

  useEffect(() => {
    activeIndex.current = 0;
  }, [query, results]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex.current = Math.min(activeIndex.current + 1, results.length - 1);
      listRef.current?.children[activeIndex.current]?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex.current = Math.max(activeIndex.current - 1, 0);
      listRef.current?.children[activeIndex.current]?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter" && results[activeIndex.current]) {
      onSelect(results[activeIndex.current]);
    } else if (e.key === "Escape") {
      onQueryChange("");
      onClose();
    }
  };

  return (
    <div className="search-wrapper">
      <div className="search-bar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search people, stories, cemeteries…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
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
            ref={listRef}
          >
            {results.map((r) => (
              <button key={`${r.type}-${r.id}`} className="search-result" onClick={() => onSelect(r)}>
                <div className="search-result-left">
                  <span className="search-result-type">{TYPE_LABELS[r.type]}</span>
                  <span className="search-result-name">{r.title}</span>
                  {r.snippet && <span className="search-result-snippet">{r.snippet}</span>}
                </div>
                <div className="search-result-right">
                  {r.branch && <span className="search-result-branch">{r.branch}</span>}
                  {r.subtitle && <span className="search-result-dates">{r.subtitle}</span>}
                </div>
              </button>
            ))}
          </motion.div>
        )}
        {query.length >= 2 && results.length === 0 && (
          <motion.div
            className="search-results search-empty"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            No results for "{query}"
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .search-wrapper { position: relative; width: 100%; max-width: 480px; }
        .search-bar {
          display: flex; align-items: center; gap: 12px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-pill);
          padding: 12px 20px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-bar:focus-within {
          border-color: var(--border-strong);
          box-shadow: 0 0 0 4px rgba(255, 149, 0, 0.12);
        }
        .search-bar svg { color: var(--text-tertiary); flex-shrink: 0; }
        .search-bar input {
          flex: 1; border: none; outline: none; background: transparent;
          font-size: 17px; color: var(--text); letter-spacing: -0.01em;
        }
        .search-bar input::placeholder { color: var(--text-tertiary); }
        .search-clear {
          display: flex; align-items: center; justify-content: center;
          width: 28px; height: 28px; border-radius: 50%;
          color: var(--text-tertiary); transition: background 0.15s;
        }
        .search-clear:hover { background: var(--bg-hover); color: var(--text); }
        .search-results {
          position: absolute; top: calc(100% + 10px); left: 0; right: 0;
          background: var(--bg-surface);
          border-radius: var(--radius);
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border);
          overflow: hidden; z-index: 100; max-height: 420px; overflow-y: auto;
        }
        .search-result {
          display: flex; justify-content: space-between; align-items: flex-start;
          width: 100%; padding: 14px 20px; text-align: left; gap: 12px;
          transition: background 0.15s;
          border-bottom: 1px solid var(--border);
        }
        .search-result:last-child { border-bottom: none; }
        .search-result:hover { background: var(--bg-hover); }
        .search-result-left { flex: 1; min-width: 0; }
        .search-result-type {
          display: block; font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.06em;
          color: var(--text-tertiary); margin-bottom: 4px;
        }
        .search-result-name {
          display: block; font-size: 16px; font-weight: 600; color: var(--text);
          letter-spacing: -0.01em;
        }
        .search-result-snippet {
          display: block; font-size: 13px; color: var(--text-tertiary);
          margin-top: 4px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .search-result-right { text-align: right; flex-shrink: 0; }
        .search-result-branch {
          display: block; font-size: 11px; font-weight: 600;
          color: var(--accent); margin-bottom: 2px;
        }
        .search-result-dates { font-size: 13px; color: var(--text-tertiary); }
        .search-empty {
          padding: 24px; text-align: center;
          font-size: 15px; color: var(--text-tertiary);
        }
      `}</style>
    </div>
  );
}
