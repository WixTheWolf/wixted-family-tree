import { motion } from "framer-motion";

interface Props {
  active: "explore" | "directory" | "stories" | "cemetery" | "archives" | "gallery" | "contribute";
  onChange: (view: "explore" | "directory" | "stories" | "cemetery" | "archives" | "gallery" | "contribute") => void;
  counts: {
    people: number;
    stories: number;
    cemetery: number;
    archives: number;
    gallery?: number;
    contributions?: number;
  };
}

const TABS = [
  { id: "explore" as const, label: "Tree" },
  { id: "directory" as const, label: "Directory" },
  { id: "gallery" as const, label: "Gallery" },
  { id: "stories" as const, label: "Stories" },
  { id: "cemetery" as const, label: "Cemetery" },
  { id: "archives" as const, label: "Archives" },
  { id: "contribute" as const, label: "Add photos" },
];

export default function AppNav({ active, onChange, counts }: Props) {
  const countFor = (id: string) => {
    if (id === "directory") return counts.people;
    if (id === "stories") return counts.stories;
    if (id === "cemetery") return counts.cemetery;
    if (id === "archives") return counts.archives;
    if (id === "gallery") return counts.gallery ?? null;
    if (id === "contribute") return counts.contributions ?? null;
    return null;
  };

  return (
    <nav className="app-nav" aria-label="Main sections">
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
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
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
          top: var(--header-h);
          z-index: 100;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: saturate(180%) blur(20px);
          -webkit-backdrop-filter: saturate(180%) blur(20px);
          border-bottom: 1px solid var(--border);
          margin: 0 -24px;
          padding: 0 24px;
        }
        .app-nav-scroll {
          display: flex;
          gap: 4px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          max-width: 1280px;
          margin: 0 auto;
          padding: 10px 0;
        }
        .app-nav-scroll::-webkit-scrollbar { display: none; }
        .app-nav-tab {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: var(--radius-pill);
          font-size: 14px;
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
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-pill);
          z-index: -1;
        }
        .app-nav-label { position: relative; }
        .app-nav-count {
          position: relative;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: var(--radius-pill);
          background: rgba(255, 149, 0, 0.15);
          color: var(--accent);
        }
      `}</style>
    </nav>
  );
}
