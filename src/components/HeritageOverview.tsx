import { motion } from "framer-motion";
import HeritageChart from "./HeritageChart";

interface Props {
  heritage: Record<string, number>;
  note?: string;
}

export default function HeritageOverview({ heritage, note }: Props) {
  return (
    <section className="heritage-overview">
      <div className="heritage-overview-inner">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-eyebrow">Ancestry mix</p>
          <h2 className="section-title">Your heritage</h2>
          <p className="section-lede heritage-note">
            {note ??
              "English, Irish, Swedish, and German roots through the Wixted and Jones lines — from Tipperary and Lambeth to Corning, Rochester, and California."}
          </p>
        </motion.div>
        <motion.div
          className="heritage-overview-chart"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <HeritageChart heritage={heritage} name="Matthew" />
        </motion.div>
      </div>
      <style>{`
        .heritage-overview {
          padding: 80px 24px;
          background: linear-gradient(180deg, transparent 0%, rgba(255,149,0,0.04) 50%, transparent 100%);
        }
        .heritage-overview-inner {
          max-width: 1000px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center;
        }
        .heritage-note { margin-top: 16px; max-width: 420px; }
        .heritage-overview-chart {
          padding: 28px; border-radius: var(--radius-sm);
          background: var(--bg-card); border: 1px solid var(--border);
        }
        @media (max-width: 768px) {
          .heritage-overview-inner { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
