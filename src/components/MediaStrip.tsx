import { motion } from "framer-motion";
import assets from "../data/assets.json";

interface Props {
  onViewCemetery: () => void;
  onViewStories: () => void;
}

export default function MediaStrip({ onViewCemetery, onViewStories }: Props) {
  const docs = assets.documents;

  const actions: Record<string, () => void> = {
    cemetery: onViewCemetery,
    research: onViewStories,
  };

  return (
    <section className="media-strip">
      <h3 className="media-strip-title">Research & Archives</h3>
      <div className="media-strip-scroll">
        {docs.map((doc, i) => (
          <motion.button
            key={doc.title}
            className="media-card"
            onClick={actions[doc.type] ?? undefined}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4, borderColor: "var(--border-accent)" }}
          >
            <span className="media-icon">{doc.icon}</span>
            <span className="media-title">{doc.title}</span>
            <span className="media-desc">{doc.desc}</span>
          </motion.button>
        ))}
      </div>

      <style>{`
        .media-strip {
          padding: 0 48px 24px; max-width: 1200px; margin: 0 auto; width: 100%;
        }
        .media-strip-title {
          font-size: 12px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--text-tertiary); margin-bottom: 14px;
        }
        .media-strip-scroll {
          display: flex; gap: 12px; overflow-x: auto;
          padding-bottom: 8px; scrollbar-width: thin;
        }
        .media-card {
          flex: 0 0 200px; text-align: left; padding: 18px;
          background: var(--bg-glass); border: 1px solid var(--border);
          border-radius: var(--radius-sm); backdrop-filter: blur(8px);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .media-card:hover {
          box-shadow: var(--shadow-md);
        }
        .media-icon { font-size: 24px; display: block; margin-bottom: 10px; }
        .media-title {
          display: block; font-size: 14px; font-weight: 600;
          color: var(--text); margin-bottom: 4px;
        }
        .media-desc {
          font-size: 12px; color: var(--text-tertiary); line-height: 1.45;
        }
        @media (max-width: 768px) {
          .media-strip { padding: 0 20px 20px; }
        }
      `}</style>
    </section>
  );
}
