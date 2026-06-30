import { motion } from "framer-motion";
import type { Person } from "../types";
import PersonAvatar from "./PersonAvatar";
import HeritageChart from "./HeritageChart";
import { getPersonAge } from "../utils/ages";

interface Props {
  person: Person;
  heritage: Record<string, number>;
  personCount: number;
  storyCount: number;
  branchCount: number;
  onExplore: () => void;
}

export default function HeroSection({
  person,
  heritage,
  personCount,
  storyCount,
  branchCount,
  onExplore,
}: Props) {
  const age = getPersonAge(person);
  const location = person.notes.find((n) => /,\s*[A-Z]{2}/.test(n) || /CA|NY/.test(n));

  return (
    <section className="hero-section">
      <div className="hero-grid">
        <motion.div
          className="hero-profile"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="hero-avatar-wrap">
            <PersonAvatar person={person} size={120} />
            <div className="hero-avatar-ring" />
          </div>

          <div className="hero-text">
            <span className="hero-eyebrow">Wixted Family Tree</span>
            <h1 className="hero-name">{person.name}</h1>
            <div className="hero-meta">
              {age && <span>{age} old</span>}
              {location && <span>{location}</span>}
              {person.dates && <span>{person.dates}</span>}
            </div>
            <p className="hero-desc">
              Explore {personCount} ancestors across {branchCount} branches — stories, cemetery
              records, and {storyCount}+ family narratives from Corning, NY to California.
            </p>
            <motion.button
              className="hero-cta"
              onClick={onExplore}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Explore the Tree
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="hero-side"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="hero-stats">
            {[
              { val: personCount, label: "Ancestors" },
              { val: branchCount, label: "Branches" },
              { val: storyCount, label: "Stories" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                className="hero-stat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <span className="hero-stat-val">{s.val}</span>
                <span className="hero-stat-label">{s.label}</span>
              </motion.div>
            ))}
          </div>
          <div className="hero-heritage-card">
            <HeritageChart heritage={heritage} name="Matthew" />
          </div>
        </motion.div>
      </div>

      <style>{`
        .hero-section {
          padding: 40px 48px 24px;
          position: relative;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 48px;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }
        .hero-profile {
          display: flex; gap: 32px; align-items: flex-start;
        }
        .hero-avatar-wrap {
          position: relative; flex-shrink: 0;
        }
        .hero-avatar-ring {
          position: absolute; inset: -6px;
          border-radius: 50%;
          border: 2px solid var(--accent);
          opacity: 0.4;
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .hero-eyebrow {
          font-size: 12px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.12em; color: var(--accent);
        }
        .hero-name {
          font-family: var(--font-display);
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 700; letter-spacing: -0.02em;
          line-height: 1.15; margin-top: 8px;
          background: linear-gradient(135deg, var(--text) 0%, var(--accent-bright) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-meta {
          display: flex; flex-wrap: wrap; gap: 12px;
          margin-top: 12px; font-size: 14px; color: var(--text-secondary);
        }
        .hero-meta span:not(:last-child)::after {
          content: "·"; margin-left: 12px; color: var(--text-tertiary);
        }
        .hero-desc {
          margin-top: 16px; font-size: 16px; line-height: 1.65;
          color: var(--text-secondary); max-width: 520px;
        }
        .hero-cta {
          display: inline-flex; align-items: center; gap: 8px;
          margin-top: 24px; padding: 12px 28px;
          background: linear-gradient(135deg, var(--accent), #a88620);
          color: #070b14; font-weight: 600; font-size: 15px;
          border-radius: 980px;
          box-shadow: 0 4px 24px var(--accent-glow);
          transition: box-shadow 0.2s;
        }
        .hero-cta:hover { box-shadow: 0 8px 32px var(--accent-glow); }
        .hero-side { display: flex; flex-direction: column; gap: 20px; }
        .hero-stats {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
        }
        .hero-stat {
          text-align: center; padding: 16px 12px;
          background: var(--bg-glass); border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          backdrop-filter: blur(12px);
        }
        .hero-stat-val {
          display: block; font-size: 28px; font-weight: 700;
          color: var(--accent-bright); letter-spacing: -0.02em;
        }
        .hero-stat-label {
          font-size: 11px; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--text-tertiary); margin-top: 4px;
        }
        .hero-heritage-card {
          padding: 20px; background: var(--bg-glass);
          border: 1px solid var(--border); border-radius: var(--radius-sm);
          backdrop-filter: blur(12px);
        }
        @media (max-width: 900px) {
          .hero-section { padding: 32px 20px 20px; }
          .hero-grid { grid-template-columns: 1fr; gap: 32px; }
          .hero-profile { flex-direction: column; align-items: center; text-align: center; }
          .hero-desc { max-width: none; }
          .hero-meta { justify-content: center; }
        }
      `}</style>
    </section>
  );
}
