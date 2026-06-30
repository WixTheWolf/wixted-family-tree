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
          <span className="site-footer-mark">W</span>
          <div>
            <strong>Wixted Family Tree</strong>
            <span>{version} · Est. 1796 Lambeth → America</span>
          </div>
        </div>
        <p className="site-footer-copy">
          Curated for {focus}. {resourceCount} verified research sources from the May 2022 family workbook and public archives.
        </p>
        <p className="site-footer-meta">Last updated {updated}</p>
      </div>
      <style>{`
        .site-footer {
          border-top: 1px solid var(--border);
          padding: 48px 24px 64px;
          background: var(--bg-surface);
        }
        .site-footer-inner { max-width: 1200px; margin: 0 auto; }
        .site-footer-brand {
          display: flex; align-items: center; gap: 14px; margin-bottom: 16px;
        }
        .site-footer-mark {
          width: 40px; height: 40px; border-radius: 10px;
          background: var(--accent); color: #000;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 18px;
        }
        .site-footer-brand strong { display: block; font-size: 15px; }
        .site-footer-brand span { font-size: 12px; color: var(--text-tertiary); }
        .site-footer-copy {
          font-size: 14px; color: var(--text-secondary); line-height: 1.55; max-width: 560px;
        }
        .site-footer-meta {
          margin-top: 12px; font-size: 12px; color: var(--text-tertiary);
        }
      `}</style>
    </footer>
  );
}
