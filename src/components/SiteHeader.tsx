import { useState } from "react";
import WickstedArms from "./WickstedArms";
import SearchBar from "./SearchBar";
import type { SearchResult } from "../types";
import type { AppView } from "./QuickAccessHub";

interface Props {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  onHome: () => void;
  query: string;
  onQueryChange: (q: string) => void;
  searchResults: SearchResult[];
  onSearchSelect: (r: SearchResult) => void;
  onSearchClose: () => void;
}

const NAV: { id: AppView; label: string }[] = [
  { id: "explore", label: "Tree" },
  { id: "stories", label: "Stories" },
  { id: "gallery", label: "Gallery" },
  { id: "archives", label: "Archives" },
  { id: "directory", label: "Directory" },
];

export default function SiteHeader({
  activeView,
  onNavigate,
  onHome,
  query,
  onQueryChange,
  searchResults,
  onSearchSelect,
  onSearchClose,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const go = (view: AppView) => {
    onNavigate(view);
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="site-header-bar">
        <a href="/" className="site-logo" aria-label="Wixted Family home" onClick={(e) => { e.preventDefault(); onHome(); }}>
          <span className="site-logo-mark">
            <WickstedArms size={28} />
          </span>
          <span className="site-logo-text">Wixted</span>
        </a>

        <nav className="site-header-nav" aria-label="Primary">
          {NAV.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={activeView === id ? "active" : ""}
              onClick={() => go(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="site-header-actions">
          <button
            type="button"
            className="site-search-toggle"
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
          <button
            type="button"
            className="site-menu-toggle"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {(searchOpen || query.length > 0) && (
        <div className="site-header-search">
          <SearchBar
            variant="header"
            query={query}
            onQueryChange={onQueryChange}
            results={searchResults}
            onSelect={(r) => {
              onSearchSelect(r);
              setSearchOpen(false);
            }}
            onClose={() => {
              onSearchClose();
              setSearchOpen(false);
            }}
          />
        </div>
      )}

      {menuOpen && (
        <nav className="site-header-drawer" aria-label="Mobile menu">
          {NAV.map(({ id, label }) => (
            <button key={id} type="button" className={activeView === id ? "active" : ""} onClick={() => go(id)}>
              {label}
            </button>
          ))}
          <button type="button" onClick={() => go("cemetery")}>Cemetery</button>
          <button type="button" onClick={() => go("contribute")}>Add photos</button>
        </nav>
      )}

      <style>{`
        .site-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 200;
          background: var(--bg-glass);
          backdrop-filter: saturate(180%) blur(20px);
          -webkit-backdrop-filter: saturate(180%) blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .site-header-bar {
          max-width: 1080px;
          margin: 0 auto;
          height: var(--header-h);
          padding: 0 max(20px, env(safe-area-inset-right)) 0 max(20px, env(safe-area-inset-left));
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
        }
        .site-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: var(--text);
          justify-self: start;
        }
        .site-logo-mark {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 6px;
          background: rgba(244, 241, 234, 0.95);
          box-shadow: 0 0 0 1px rgba(197, 160, 89, 0.35);
        }
        .site-logo-mark svg {
          width: 22px;
          height: auto;
          margin-top: 2px;
        }
        .site-logo-text {
          font-size: 17px;
          font-weight: 600;
          letter-spacing: -0.03em;
        }
        .site-header-nav {
          display: flex;
          gap: 2px;
          justify-self: center;
        }
        .site-header-nav button {
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: var(--text-secondary);
          border-radius: var(--radius-pill);
          transition: color 0.2s, background 0.2s;
        }
        .site-header-nav button:hover {
          color: var(--text);
          background: rgba(255, 255, 255, 0.06);
        }
        .site-header-nav button.active {
          color: var(--text);
          background: rgba(255, 255, 255, 0.1);
        }
        .site-header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          justify-self: end;
        }
        .site-search-toggle,
        .site-menu-toggle {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: var(--text-secondary);
          transition: background 0.2s, color 0.2s;
        }
        .site-search-toggle:hover,
        .site-menu-toggle:hover {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text);
        }
        .site-menu-toggle {
          display: none;
          flex-direction: column;
          gap: 5px;
        }
        .site-menu-toggle span {
          display: block;
          width: 16px;
          height: 1.5px;
          background: currentColor;
          border-radius: 1px;
        }
        .site-header-search {
          max-width: 1080px;
          margin: 0 auto;
          padding: 0 20px 14px;
          animation: fade-up 0.25s var(--ease-out-expo);
        }
        .site-header-drawer {
          display: none;
          flex-direction: column;
          padding: 8px 12px 16px;
          border-top: 1px solid var(--border);
          background: var(--bg-surface);
        }
        .site-header-drawer button {
          text-align: left;
          padding: 14px 12px;
          font-size: 17px;
          font-weight: 500;
          color: var(--text-secondary);
          border-radius: var(--radius-sm);
        }
        .site-header-drawer button.active,
        .site-header-drawer button:hover {
          color: var(--text);
          background: rgba(255, 255, 255, 0.06);
        }
        @media (max-width: 860px) {
          .site-header-nav { display: none; }
          .site-menu-toggle { display: flex; }
          .site-header-drawer { display: flex; }
          .site-header-bar {
            grid-template-columns: 1fr auto;
          }
          .site-header-actions { grid-column: 2; }
        }
        @media (min-width: 861px) {
          .site-header-search {
            position: absolute;
            top: calc(var(--header-h) + 4px);
            left: 50%;
            transform: translateX(-50%);
            width: min(480px, calc(100% - 40px));
            padding: 0;
            z-index: 210;
          }
        }
      `}</style>
    </header>
  );
}
