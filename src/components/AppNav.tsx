interface Props {
  active: "explore" | "directory" | "stories" | "cemetery" | "archives" | "contribute";
  onChange: (view: "explore" | "directory" | "stories" | "cemetery" | "archives" | "contribute") => void;
  counts: { people: number; stories: number; cemetery: number; archives: number; contributions?: number };
}

const TABS = [
  { id: "explore" as const, label: "Family Tree", icon: "🌳" },
  { id: "directory" as const, label: "Directory", icon: "📖" },
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
        >
          <span className="app-nav-icon">{tab.icon}</span>
          <span>{tab.label}</span>
          {countFor(tab.id) !== null && (
            <span className="app-nav-count">{countFor(tab.id)}</span>
          )}
        </button>
      ))}

      <style>{`
        .app-nav {
          display: flex; gap: 6px; flex-wrap: wrap;
          padding: 4px; background: rgba(255,255,255,0.03);
          border-radius: 14px; border: 1px solid var(--border);
        }
        .app-nav-tab {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 16px; border-radius: 10px;
          font-size: 13px; font-weight: 500; color: var(--text-secondary);
          transition: all 0.2s;
        }
        .app-nav-tab:hover { color: var(--text); background: rgba(255,255,255,0.04); }
        .app-nav-tab.active {
          background: var(--bg-elevated); color: var(--text);
          box-shadow: var(--shadow-sm);
        }
        .app-nav-icon { font-size: 16px; }
        .app-nav-count {
          font-size: 11px; font-weight: 600; padding: 2px 7px;
          border-radius: 980px; background: rgba(201, 162, 39, 0.12);
          color: var(--accent-bright);
        }
        @media (max-width: 720px) {
          .app-nav-tab span:nth-child(2) { display: none; }
          .app-nav-tab { padding: 10px 12px; }
        }
      `}</style>
    </nav>
  );
}
