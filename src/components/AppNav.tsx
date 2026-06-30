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
  { id: "explore" as const, label: "Family Tree", icon: "🌳" },
  { id: "directory" as const, label: "Directory", icon: "📖" },
  { id: "gallery" as const, label: "Gallery", icon: "🖼️" },
  { id: "stories" as const, label: "Stories", icon: "📜" },
  { id: "cemetery" as const, label: "Cemetery", icon: "🪦" },
  { id: "archives" as const, label: "Archives", icon: "🔗" },
  { id: "contribute" as const, label: "Contribute", icon: "📤" },
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
    <nav className="app-nav">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`app-nav-tab ${active === tab.id ? "active" : ""}`}
          onClick={() => onChange(tab.id)}
          aria-current={active === tab.id ? "page" : undefined}
        >
          {active === tab.id && (
            <motion.span
              className="app-nav-active-bg"
              layoutId="app-nav-active-bg"
              transition={{ type: "spring", stiffness: 480, damping: 36 }}
            />
          )}
          <span className="app-nav-icon">{tab.icon}</span>
          <span className="app-nav-label">{tab.label}</span>
          {countFor(tab.id) !== null && (
            <span className="app-nav-count">{countFor(tab.id)}</span>
          )}
        </button>
      ))}

      <style>{`
        .app-nav {
          display: flex; gap: 6px; flex-wrap: wrap;
          padding: 5px; background: linear-gradient(135deg, rgba(255,255,255,0.065), rgba(255,255,255,0.025));
          border-radius: 16px; border: 1px solid var(--border);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), var(--shadow-sm);
          backdrop-filter: blur(16px);
        }
        .app-nav-tab {
          position: relative;
          display: flex; align-items: center; gap: 8px;
          padding: 10px 16px; border-radius: 10px;
          font-size: 13px; font-weight: 500; color: var(--text-secondary);
          transition: color 0.2s, transform 0.2s;
        }
        .app-nav-tab:hover { color: var(--text); transform: translateY(-1px); }
        .app-nav-tab:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }
        .app-nav-tab.active {
          color: var(--text);
        }
        .app-nav-active-bg {
          position: absolute;
          inset: 0;
          border-radius: 11px;
          background:
            linear-gradient(135deg, rgba(201,162,39,0.18), rgba(74,158,255,0.08)),
            var(--bg-elevated);
          border: 1px solid var(--border-accent);
          box-shadow: 0 10px 28px rgba(0,0,0,0.28), 0 0 24px rgba(201,162,39,0.12);
        }
        .app-nav-icon, .app-nav-label, .app-nav-count {
          position: relative;
          z-index: 1;
        }
        .app-nav-icon { font-size: 16px; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.28)); }
        .app-nav-count {
          font-size: 11px; font-weight: 600; padding: 2px 7px;
          border-radius: 980px; background: rgba(201, 162, 39, 0.12);
          color: var(--accent-bright);
          transition: background 0.2s, color 0.2s;
        }
        .app-nav-tab.active .app-nav-count {
          background: rgba(201, 162, 39, 0.22);
          color: var(--text);
        }
        @media (max-width: 720px) {
          .app-nav {
            justify-content: center;
            position: sticky;
            top: 8px;
            z-index: 20;
          }
          .app-nav-label { display: none; }
          .app-nav-tab { padding: 10px 12px; }
        }
      `}</style>
    </nav>
  );
}
