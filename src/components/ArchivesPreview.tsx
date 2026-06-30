import { motion } from "framer-motion";

interface Resource {
  id: string;
  title: string;
  desc: string;
  url: string;
  category: string;
  verified?: boolean;
}

interface Props {
  resources: Resource[];
  onViewAll: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  cemetery: "Cemetery",
  genealogy: "Genealogy",
  origins: "Origins",
  history: "History",
  libraries: "Archives",
  photos: "Photos",
  obituaries: "Obituaries",
};

export default function ArchivesPreview({ resources, onViewAll }: Props) {
  const picks = resources.filter((r) => r.verified).slice(0, 4);

  return (
    <section className="archives-preview">
      <div className="archives-preview-head">
        <div>
          <p className="section-eyebrow">Verified research</p>
          <h2 className="section-title">Online archives</h2>
        </div>
        <button type="button" className="btn-secondary" onClick={onViewAll}>
          Browse all
        </button>
      </div>
      <div className="archives-preview-grid">
        {picks.map((res, i) => (
          <motion.a
            key={res.id}
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
            className="archives-preview-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.5 }}
          >
            <span className="archives-preview-cat">{CATEGORY_LABELS[res.category] ?? res.category}</span>
            <h3>{res.title}</h3>
            <p>{res.desc}</p>
            <span className="archives-preview-link">Open resource →</span>
          </motion.a>
        ))}
      </div>
      <style>{`
        .archives-preview {
          max-width: 1200px; margin: 0 auto; padding: 80px 24px;
        }
        .archives-preview-head {
          display: flex; justify-content: space-between; align-items: flex-end;
          gap: 24px; margin-bottom: 32px; flex-wrap: wrap;
        }
        .archives-preview-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px;
        }
        .archives-preview-card {
          display: block; padding: 24px; border-radius: var(--radius-sm);
          background: var(--bg-card); border: 1px solid var(--border);
          text-decoration: none; color: inherit;
          transition: border-color 0.2s, transform 0.25s var(--ease-out-expo);
        }
        .archives-preview-card:hover {
          border-color: var(--border-strong); transform: translateY(-2px);
        }
        .archives-preview-cat {
          font-size: 10px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--accent-secondary);
        }
        .archives-preview-card h3 {
          font-size: 16px; font-weight: 600; margin: 10px 0 8px;
          letter-spacing: -0.02em; line-height: 1.3;
        }
        .archives-preview-card p {
          font-size: 13px; line-height: 1.5; color: var(--text-secondary); margin-bottom: 12px;
        }
        .archives-preview-link { font-size: 13px; font-weight: 500; color: var(--accent-link); }
      `}</style>
    </section>
  );
}
