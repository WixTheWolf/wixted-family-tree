import WickstedArms from "./WickstedArms";

interface Props {
  onExplore: () => void;
  onGallery: () => void;
  onStories: () => void;
  onArchives: () => void;
}

export default function SiteHeader({ onExplore, onGallery, onStories, onArchives }: Props) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a href="/" className="site-logo" aria-label="Wixted Family home">
          <span className="site-logo-mark">
            <WickstedArms size={28} />
          </span>
          <span className="site-logo-text">Wixted</span>
        </a>

        <nav className="site-header-nav" aria-label="Quick links">
          <button type="button" onClick={onExplore}>Tree</button>
          <button type="button" onClick={onStories}>Stories</button>
          <button type="button" onClick={onArchives}>Archives</button>
          <button type="button" onClick={onGallery}>Gallery</button>
        </nav>
      </div>

      <style>{`
        .site-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 200;
          height: var(--header-h);
          background: var(--bg-glass);
          backdrop-filter: saturate(180%) blur(20px);
          -webkit-backdrop-filter: saturate(180%) blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .site-header-inner {
          max-width: 1280px;
          margin: 0 auto;
          height: 100%;
          padding: 0 max(24px, env(safe-area-inset-right)) 0 max(24px, env(safe-area-inset-left));
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .site-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: var(--text);
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
          letter-spacing: -0.02em;
        }
        .site-header-nav {
          display: flex;
          gap: 4px;
        }
        .site-header-nav button {
          padding: 8px 14px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
          border-radius: var(--radius-pill);
          transition: color 0.2s, background 0.2s;
        }
        .site-header-nav button:hover {
          color: var(--text);
          background: rgba(255, 255, 255, 0.08);
        }
        @media (max-width: 560px) {
          .site-header-nav button { padding: 8px 10px; font-size: 13px; }
        }
      `}</style>
    </header>
  );
}
