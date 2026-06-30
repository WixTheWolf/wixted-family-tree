import { motion } from "framer-motion";
import ancestryLine from "../data/ancestryLine.json";

export default function MigrationMap() {
  const migrations = ancestryLine.meta.migrations;

  const stops = [
    { label: "Tipperary", x: 8, y: 42, era: "1600s" },
    { label: "Lambeth, London", x: 18, y: 38, era: "1796" },
    { label: "Corning, NY", x: 32, y: 35, era: "1800s" },
    { label: "Rochester, NY", x: 38, y: 32, era: "1930s" },
    { label: "Phoenix, AZ", x: 22, y: 58, era: "1963" },
    { label: "Orange County, CA", x: 12, y: 62, era: "1971" },
    { label: "Whittier, CA", x: 10, y: 65, era: "You" },
  ];

  return (
    <section className="migration-map">
      <div className="migration-map-inner">
        <p className="section-eyebrow">The journey west</p>
        <h2 className="section-title">Four centuries, three continents</h2>
        <p className="section-lede migration-lede">
          Blacksmiths in Tipperary. Emigrants from Lambeth. Five decades in Corning censuses.
          Then Bruce & Evelyn carried the name to Arizona and Southern California.
        </p>

        <div className="migration-layout">
          <svg className="migration-svg" viewBox="0 0 100 80" aria-hidden>
            <defs>
              <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#50c878" stopOpacity="0.6" />
                <stop offset="35%" stopColor="#b07aff" stopOpacity="0.6" />
                <stop offset="60%" stopColor="#4a9eff" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ff9500" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 8 42 Q 14 36 18 38 Q 26 34 32 35 Q 36 33 38 32 Q 30 48 22 58 Q 16 60 12 62 L 10 65"
              fill="none"
              stroke="url(#routeGrad)"
              strokeWidth="0.8"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            />
            {stops.map((stop, i) => (
              <motion.g
                key={stop.label}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.5 }}
              >
                <circle cx={stop.x} cy={stop.y} r="1.8" fill="#ff9500" opacity="0.9" />
                <circle cx={stop.x} cy={stop.y} r="3.5" fill="none" stroke="#ff9500" strokeWidth="0.3" opacity="0.4" />
              </motion.g>
            ))}
          </svg>

          <div className="migration-stops">
            {migrations.map((m, i) => (
              <motion.div
                key={m.year}
                className="migration-stop"
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <span className="migration-year">{m.year}</span>
                <div>
                  <strong>{m.label}</strong>
                  <span>{m.from} → {m.to}</span>
                </div>
              </motion.div>
            ))}
            <div className="migration-stop migration-stop-you">
              <span className="migration-year">1987</span>
              <div>
                <strong>Matthew Scott Wixted born</strong>
                <span>Whittier, California</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .migration-map { padding: 80px 24px; max-width: 1100px; margin: 0 auto; }
        .migration-lede { margin: 16px 0 40px; max-width: 640px; }
        .migration-layout {
          display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center;
        }
        .migration-svg {
          width: 100%; aspect-ratio: 5/4; background: var(--bg-card);
          border-radius: var(--radius-sm); border: 1px solid var(--border); padding: 16px;
        }
        .migration-stops { display: flex; flex-direction: column; gap: 12px; }
        .migration-stop {
          display: flex; gap: 16px; align-items: flex-start;
          padding: 16px 18px; border-radius: var(--radius-sm);
          background: var(--bg-card); border: 1px solid var(--border);
        }
        .migration-stop-you { border-color: var(--border-accent); }
        .migration-year {
          font-size: 13px; font-weight: 700; color: var(--accent);
          min-width: 44px; font-variant-numeric: tabular-nums;
        }
        .migration-stop strong { display: block; font-size: 14px; margin-bottom: 2px; }
        .migration-stop span { font-size: 13px; color: var(--text-secondary); }
        @media (max-width: 768px) {
          .migration-layout { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
