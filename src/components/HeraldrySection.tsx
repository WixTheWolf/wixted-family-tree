import { motion } from "framer-motion";
import WickstedArms, { WICKSTED_ARMS_BLAZON, WICKSTED_CREST_BLAZON } from "./WickstedArms";

const DECORATIVE_MARKS = [
  {
    label: "Boar, eagle, bridge, cottage",
    verdict: "Not documented",
    detail: "Common in gift-shop and AI crests; not in the Cheshire visitation record.",
  },
  {
    label: "“Steadfast Through Time”",
    verdict: "Modern motto",
    detail: "Not found on the 1613 Wicksted pedigree or 1607 crest grant.",
  },
  {
    label: "Tollemache fret — “Confido Conquiesco”",
    verdict: "Different family",
    detail: "Arms of the Tollemache (Earls of Dysart), not Wixted.",
  },
  {
    label: "Schwerin peacock — “Fidelitate et Veritate”",
    verdict: "Different family",
    detail: "German noble arms; no connection to the Wixted surname.",
  },
];

export default function HeraldrySection() {
  return (
    <section className="heraldry-section" id="heraldry">
      <div className="heraldry-inner">
        <motion.div
          className="heraldry-copy"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-eyebrow">Surname origins</p>
          <h2 className="section-title">Wixted heraldry</h2>
          <p className="section-lede heraldry-lede">
            The name Wixted comes from English place names (Wickstead/Wixted in Cheshire and
            Wiltshire) and has been in Ireland since the 1600s. Coats of arms belong to specific
            lineages, not every person who shares a surname — but the Wicksted family of Nantwich
            did record arms at the Cheshire Herald&apos;s Visitation of 1613.
          </p>

          <div className="heraldry-blazon">
            <p className="heraldry-blazon-label">Recorded arms (1613)</p>
            <p className="heraldry-blazon-text">{WICKSTED_ARMS_BLAZON}</p>
            <p className="heraldry-blazon-label">Crest grant (1607)</p>
            <p className="heraldry-blazon-text">{WICKSTED_CREST_BLAZON}</p>
          </div>

          <p className="heraldry-source">
            Source:{" "}
            <a
              href="http://cheshire-heraldry.org.uk/visitations1613/CV1613_26.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cheshire Heraldry — Visitations 1613, Wicksted of Nantwich
            </a>
          </p>
        </motion.div>

        <motion.div
          className="heraldry-visual"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="heraldry-shield-card">
            <WickstedArms size={160} showCrest className="heraldry-shield-svg" />
            <p className="heraldry-shield-caption">Wicksted of Nantwich</p>
            <p className="heraldry-shield-sub">White field · blue bend · gold garbs · Cornish choughs</p>
          </div>

          <div className="heraldry-audit">
            <p className="heraldry-audit-title">Images you may see online</p>
            <ul className="heraldry-audit-list">
              {DECORATIVE_MARKS.map((item) => (
                <li key={item.label}>
                  <span className="heraldry-audit-label">{item.label}</span>
                  <span className={`heraldry-verdict heraldry-verdict--${item.verdict.includes("Not") ? "no" : "other"}`}>
                    {item.verdict}
                  </span>
                  <span className="heraldry-audit-detail">{item.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      <style>{`
        .heraldry-section {
          padding: 80px 24px;
          background:
            radial-gradient(ellipse 60% 40% at 20% 50%, rgba(26, 58, 107, 0.12) 0%, transparent 55%),
            radial-gradient(ellipse 50% 30% at 80% 60%, rgba(197, 160, 89, 0.08) 0%, transparent 50%);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .heraldry-inner {
          max-width: 1080px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: start;
        }
        .heraldry-lede { margin-top: 16px; max-width: 480px; }
        .heraldry-blazon {
          margin-top: 28px;
          padding: 20px 22px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-left: 3px solid var(--herald-or);
          border-radius: var(--radius-sm);
        }
        .heraldry-blazon-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--herald-or);
          margin-bottom: 6px;
        }
        .heraldry-blazon-label:not(:first-child) { margin-top: 16px; }
        .heraldry-blazon-text {
          font-family: var(--font-display);
          font-size: 15px;
          line-height: 1.5;
          color: var(--text);
          font-style: italic;
        }
        .heraldry-source {
          margin-top: 16px;
          font-size: 13px;
          color: var(--text-tertiary);
        }
        .heraldry-source a { color: var(--accent-link); }
        .heraldry-shield-card {
          padding: 36px 28px 28px;
          text-align: center;
          background: linear-gradient(165deg, var(--bg-card) 0%, rgba(26, 58, 107, 0.15) 100%);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius);
          box-shadow: var(--shadow-md);
        }
        .heraldry-shield-svg { display: block; margin: 0 auto; filter: drop-shadow(0 8px 24px rgba(0,0,0,0.35)); }
        .heraldry-shield-caption {
          margin-top: 20px;
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 600;
        }
        .heraldry-shield-sub {
          margin-top: 6px;
          font-size: 13px;
          color: var(--text-secondary);
        }
        .heraldry-audit {
          margin-top: 24px;
          padding: 22px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
        }
        .heraldry-audit-title {
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-tertiary);
          margin-bottom: 14px;
        }
        .heraldry-audit-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .heraldry-audit-list li {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 4px 12px;
          font-size: 14px;
        }
        .heraldry-audit-label { font-weight: 500; color: var(--text); grid-column: 1; }
        .heraldry-verdict {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 3px 8px;
          border-radius: 6px;
          align-self: start;
        }
        .heraldry-verdict--no {
          background: rgba(255, 149, 0, 0.15);
          color: var(--accent);
        }
        .heraldry-verdict--other {
          background: rgba(41, 151, 255, 0.12);
          color: var(--accent-link);
        }
        .heraldry-audit-detail {
          grid-column: 1 / -1;
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.45;
        }
        @media (max-width: 860px) {
          .heraldry-inner { grid-template-columns: 1fr; gap: 40px; }
        }
      `}</style>
    </section>
  );
}
