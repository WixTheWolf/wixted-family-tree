import WickstedArms from "./WickstedArms";

interface Props {
  version: string;
  updated: string;
  focus: string;
  resourceCount: number;
}

export default function SiteFooter({ version, updated, focus, resourceCount }: Props) {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <span className="site-footer-mark">
            <WickstedArms size={36} />
          </span>
          <div>
            <strong>Wixted Family Tree</strong>
            <span>{version} · Est. 1796 Lambeth → America</span>
          </div>
        </div>
        <p className="site-footer-copy">
          Curated for {focus}. {resourceCount} verified research sources from the family workbook and public archives.
        </p>
        <p className="site-footer-meta">Last updated {updated}</p>
      </div>
      <style>{`
        .site-footer {
          border-top: 1px solid var(--border);
          padding: 56px 24px 72px;
          background: var(--bg-surface);
        }
        .site-footer-inner { max-width: 1080px; margin: 0 auto; }
        .site-footer-brand {
          display: flex; align-items: center; gap: 16px; margin-bottom: 20px;
        }
        .site-footer-mark {
          width: 44px; height: 44px; border-radius: 10px;
          background: rgba(244, 241, 234, 0.95);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 0 1px rgba(197, 160, 89, 0.3);
        }
        .site-footer-mark svg { width: 30px; height: auto; }
        .site-footer-brand strong { display: block; font-size: 16px; letter-spacing: -0.02em; }
        .site-footer-brand span { font-size: 13px; color: var(--text-tertiary); }
        .site-footer-copy {
          font-size: 15px; color: var(--text-secondary); line-height: 1.55; max-width: 520px;
        }
        .site-footer-meta {
          margin-top: 16px; font-size: 13px; color: var(--text-tertiary);
        }
      `}</style>
    </footer>
  );
}
