interface Props {
  active: "explore" | "directory" | "stories" | "cemetery";
  onChange: (view: "explore" | "directory" | "stories" | "cemetery") => void;
  counts: { people: number; stories: number; cemetery: number };
}

const TABS = [
  { id: "explore" as const, label: "Family Tree", icon: "🌳" },
  { id: "directory" as const, label: "Directory", icon: "📖" },
  { id: "stories" as const, label: "Stories", icon: "📜" },
  { id: "cemetery" as const, label: "Cemetery", icon: "🪦" },
];

export default function AppNav({ active, onChange, counts }: Props) {
  const countFor = (id: string) => {
    if (id === "directory") return counts.people;
    if (id === "stories") return counts.stories;
    if (id === "cemetery") return counts.cemetery;
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
          padding: 4px; background: rgba(0,0,0,0.03);
          border-radius: 14px; border: 1px solid var(--border);
        }
        .app-nav-tab {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 18px; border-radius: 10px;
          font-size: 14px; font-weight: 500; color: var(--text-secondary);
          transition: all 0.2s;
        }
        .app-nav-tab:hover { color: var(--text); background: rgba(255,255,255,0.6); }
        .app-nav-tab.active {
          background: var(--bg-elevated); color: var(--text);
          box-shadow: var(--shadow-sm);
        }
        .app-nav-icon { font-size: 16px; }
        .app-nav-count {
          font-size: 11px; font-weight: 600; padding: 2px 7px;
          border-radius: 980px; background: rgba(0,113,227,0.08);
          color: var(--accent);
        }
        @media (max-width: 640px) {
          .app-nav-tab span:nth-child(2) { display: none; }
          .app-nav-tab { padding: 10px 14px; }
        }
      `}</style>
    </nav>
  );
}
