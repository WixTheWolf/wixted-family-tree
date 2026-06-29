import { motion } from "framer-motion";

interface Props {
  heritage: Record<string, number>;
  name: string;
}

const COLORS: Record<string, string> = {
  english: "#0071e3",
  german: "#bf5af2",
  irish: "#34c759",
  swedish: "#ff9500",
  mexican: "#ff3b30",
};

const LABELS: Record<string, string> = {
  english: "English",
  german: "German",
  irish: "Irish",
  swedish: "Swedish",
  mexican: "Mexican",
};

export default function HeritageChart({ heritage, name }: Props) {
  const entries = Object.entries(heritage).filter(([, v]) => v > 0);

  return (
    <div className="heritage">
      <h3>{name}'s Heritage</h3>
      <div className="heritage-bar">
        {entries.map(([key, pct], i) => (
          <motion.div
            key={key}
            className="heritage-segment"
            style={{ background: COLORS[key] ?? "#86868b", width: `${pct * 100}%` }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          />
        ))}
      </div>
      <div className="heritage-legend">
        {entries.map(([key, pct]) => (
          <div key={key} className="heritage-item">
            <span className="heritage-dot" style={{ background: COLORS[key] }} />
            <span className="heritage-label">{LABELS[key] ?? key}</span>
            <span className="heritage-pct">{Math.round(pct * 100)}%</span>
          </div>
        ))}
      </div>

      <style>{`
        .heritage { margin-top: 8px; }
        .heritage h3 {
          font-size: 13px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.06em; color: var(--text-tertiary); margin-bottom: 12px;
        }
        .heritage-bar {
          display: flex; height: 8px; border-radius: 4px; overflow: hidden;
          background: var(--border);
        }
        .heritage-segment {
          height: 100%; transform-origin: left;
        }
        .heritage-legend {
          display: flex; flex-wrap: wrap; gap: 12px; margin-top: 12px;
        }
        .heritage-item {
          display: flex; align-items: center; gap: 6px; font-size: 13px;
        }
        .heritage-dot {
          width: 8px; height: 8px; border-radius: 50%;
        }
        .heritage-label { color: var(--text-secondary); }
        .heritage-pct { color: var(--text-tertiary); font-weight: 500; }
      `}</style>
    </div>
  );
}