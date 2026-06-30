import { motion } from "framer-motion";
import assets from "../data/assets.json";

interface Props {
  onViewCemetery: () => void;
  onViewStories: () => void;
  onViewArchives?: () => void;
  onViewContribute?: () => void;
  onViewGallery?: () => void;
}

const CARD_GRADIENTS: Record<string, string> = {
  cemetery: "linear-gradient(135deg, #2d2d2f 0%, #1a1a1c 100%)",
  research: "linear-gradient(135deg, #1a2332 0%, #0d1117 100%)",
  census: "linear-gradient(135deg, #1f2a1a 0%, #121810 100%)",
  photo: "linear-gradient(135deg, #2a1f14 0%, #1a1208 100%)",
  spreadsheet: "linear-gradient(135deg, #1a1a2e 0%, #0f0f18 100%)",
};

export default function MediaStrip({
  onViewCemetery,
  onViewStories,
  onViewArchives,
  onViewContribute,
  onViewGallery,
}: Props) {
  const docs = assets.documents;

  const actions: Record<string, () => void> = {
    cemetery: onViewCemetery,
    research: onViewArchives ?? onViewStories,
    census: onViewArchives ?? onViewStories,
    photo: onViewGallery ?? onViewContribute ?? onViewArchives ?? onViewCemetery,
    spreadsheet: onViewContribute ?? onViewArchives ?? onViewStories,
  };

  return (
    <section className="media-strip">
      <div className="media-strip-head">
        <div>
          <p className="section-eyebrow">Collections</p>
          <h2 className="section-title" style={{ fontSize: "clamp(28px, 4vw, 40px)" }}>
            Explore the archive
          </h2>
        </div>
        <p className="media-strip-hint">Swipe →</p>
      </div>

      <div className="media-rail">
        {docs.map((doc, i) => (
          <motion.button
            key={doc.title}
            type="button"
            className="media-tile"
            style={{ background: CARD_GRADIENTS[doc.type] ?? CARD_GRADIENTS.research }}
            onClick={actions[doc.type]}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.03, y: -6 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="media-tile-icon">{doc.icon}</span>
            <span className="media-tile-title">{doc.title}</span>
            <span className="media-tile-desc">{doc.desc}</span>
            <span className="media-tile-cta">Open →</span>
          </motion.button>
        ))}
      </div>

      <style>{`
        .media-strip {
          padding: 80px 24px;
          max-width: 1280px;
          margin: 0 auto;
        }
        .media-strip-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 28px;
          gap: 16px;
        }
        .media-strip-hint {
          font-size: 14px;
          color: var(--text-tertiary);
          font-weight: 500;
        }
        .media-rail {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding: 8px 4px 24px;
          scrollbar-width: none;
        }
        .media-rail::-webkit-scrollbar { display: none; }
        .media-tile {
          flex: 0 0 min(300px, 85vw);
          scroll-snap-align: start;
          text-align: left;
          padding: 28px 24px;
          min-height: 220px;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.3s;
        }
        .media-tile:hover {
          box-shadow: var(--shadow-lg);
          border-color: var(--border-strong);
        }
        .media-tile-icon {
          font-size: 32px;
          margin-bottom: auto;
        }
        .media-tile-title {
          display: block;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 16px 0 8px;
        }
        .media-tile-desc {
          font-size: 14px;
          line-height: 1.45;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }
        .media-tile-cta {
          font-size: 15px;
          font-weight: 600;
          color: var(--accent-link);
        }
      `}</style>
    </section>
  );
}
