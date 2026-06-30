import { motion } from "framer-motion";

interface Props {
  onExplore: () => void;
  onGallery: () => void;
}

export default function SiteHeader({ onExplore, onGallery }: Props) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a href="/" className="site-logo" aria-label="Wixted Family home">
          <span className="site-logo-mark">W</span>
          <span className="site-logo-text">Wixted</span>
        </a>

        <nav className="site-header-nav" aria-label="Quick links">
          <button type="button" onClick={onExplore}>Tree</button>
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
          background: rgba(0, 0, 0, 0.72);
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
          font-size: 15px;
          font-weight: 700;
          background: var(--accent);
          color: #000;
          border-radius: 8px;
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
      `}</style>
    </header>
  );
}
