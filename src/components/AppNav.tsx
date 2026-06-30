import { motion } from "framer-motion";
import type { AppView } from "./QuickAccessHub";

interface Props {
  active: AppView;
  onChange: (view: AppView) => void;
  counts: {
    people: number;
    stories: number;
    cemetery: number;
    archives: number;
    gallery?: number;
    contributions?: number;
  };
}

const TABS: { id: AppView; label: string }[] = [
  { id: "explore", label: "Tree" },
  { id: "directory", label: "Directory" },
  { id: "gallery", label: "Gallery" },
  { id: "stories", label: "Stories" },
  { id: "cemetery", label: "Cemetery" },
  { id: "archives", label: "Archives" },
  { id: "contribute", label: "Add photos" },
];

export default function AppNav({ active, onChange, counts }: Props) {
  const countFor = (id: AppView) => {
    if (id === "directory" || id === "explore") return counts.people;
    if (id === "stories") return counts.stories;
    if (id === "cemetery") return counts.cemetery;
    if (id === "archives") return counts.archives;
    if (id === "gallery") return counts.gallery ?? null;
    if (id === "contribute") return counts.contributions ?? null;
    return null;
  };

  return (
    <nav className="app-nav" aria-label="Section tabs">
      <div className="app-nav-scroll">
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          const count = countFor(tab.id);
          return (
            <button
              key={tab.id}
              type="button"
              className={`app-nav-tab ${isActive ? "active" : ""}`}
              onClick={() => onChange(tab.id)}
            >
              {isActive && (
                <motion.span
                  className="app-nav-pill"
                  layoutId="nav-pill"
                  transition={{ type: "spring", stiffness: 520, damping: 40 }}
                />
              )}
              <span className="app-nav-label">{tab.label}</span>
              {count !== null && count > 0 && (
                <span className="app-nav-count">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      <style>{`
        .app-nav {
          position: sticky;
          top: calc(var(--header-h) + 8px);
          z-index: 90;
          background: rgba(0, 0, 0, 0.72);
          backdrop-filter: saturate(180%) blur(16px);
          -webkit-backdrop-filter: saturate(180%) blur(16px);
          border: 1px solid var(--border);
          border-radius: var(--radius-pill);
          margin: 0 -4px;
          padding: 4px;
        }
        .app-nav-scroll {
          display: flex;
          gap: 2px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          padding: 2px;
        }
        .app-nav-scroll::-webkit-scrollbar { display: none; }
        .app-nav-tab {
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          border-radius: var(--radius-pill);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          white-space: nowrap;
          scroll-snap-align: start;
          flex-shrink: 0;
        }
        .app-nav-tab:hover { color: var(--text); }
        .app-nav-tab.active { color: var(--text); }
        .app-nav-pill {
          position: absolute;
          inset: 0;
          background: var(--bg-elevated);
          border-radius: var(--radius-pill);
          z-index: -1;
        }
        .app-nav-label { position: relative; }
        .app-nav-count {
          position: relative;
          font-size: 10px;
          font-weight: 600;
          padding: 2px 7px;
          border-radius: var(--radius-pill);
          background: rgba(41, 151, 255, 0.15);
          color: var(--accent-link);
        }
      `}</style>
    </nav>
  );
}
