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
  const location = person.notes.find((n) => /Whittier|CA|California/i.test(n)) ?? "Whittier, California";

  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden />
      <div className="hero-inner">
        <motion.div
          className="hero-main"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-profile-row">
            <div className="hero-avatar-stack">
              <PersonAvatar person={person} size={112} />
              <div className="hero-ring" />
            </div>
            <div>
              <p className="hero-kicker">Wixted Family · Ten Generations</p>
              <h1>{person.name}</h1>
              <div className="hero-facts">
                {age && <span>{age}</span>}
                <span>{location}</span>
                <span>Wixted → Amor lines</span>
              </div>
            </div>
          </div>

          <p className="hero-lede">
            From <strong>Lambeth, London</strong> and <strong>Tipperary, Ireland</strong> to
            <strong> Corning & Rochester, New York</strong> — and west to
            <strong> Southern California</strong>. Explore {personCount} relatives, {storyCount} stories,
            and a direct line back to patriarch <em>Thomas James Wixted</em> (1796).
          </p>

          <div className="hero-actions">
            <motion.button
              className="hero-btn primary"
              onClick={onExplore}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Explore ancestors
            </motion.button>
            <span className="hero-stat-inline">{branchCount} branches · NY to CA</span>
          </div>
        </motion.div>

        <motion.div
          className="hero-aside"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <div className="hero-map-card">
            <span className="hero-map-label">Migration arc</span>
            <div className="hero-map-route">
              <span>Ireland</span>
              <span className="hero-map-arrow">→</span>
              <span>London</span>
              <span className="hero-map-arrow">→</span>
              <span>Corning</span>
              <span className="hero-map-arrow">→</span>
              <span>Rochester</span>
              <span className="hero-map-arrow">→</span>
              <span>California</span>
            </div>
            <p className="hero-map-note">
              Bruce & Evelyn Wixted moved Rochester → Phoenix (1963) → Orange County (1971),
              bringing the Wixted name to Matthew's generation in Whittier.
            </p>
          </div>
          <div className="hero-heritage-wrap">
            <HeritageChart heritage={heritage} name="Matthew" />
          </div>
        </motion.div>
      </div>

      <style>{`
        .hero {
          position: relative;
          padding: 56px 48px 40px;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 20% 0%, rgba(201, 162, 39, 0.12) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 90% 20%, rgba(74, 158, 255, 0.08) 0%, transparent 50%),
            linear-gradient(180deg, rgba(15, 22, 36, 0.4) 0%, transparent 100%);
          pointer-events: none;
        }
        .hero-inner {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 48px;
          align-items: start;
        }
        .hero-profile-row {
          display: flex; gap: 28px; align-items: center;
          margin-bottom: 28px;
        }
        .hero-avatar-stack { position: relative; flex-shrink: 0; }
        .hero-ring {
          position: absolute; inset: -8px;
          border-radius: 50%;
          border: 1px solid rgba(201, 162, 39, 0.45);
          animation: pulse-glow 4s ease-in-out infinite;
        }
        .hero-kicker {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.16em; color: var(--accent);
          margin-bottom: 10px;
        }
        .hero-main h1 {
          font-family: var(--font-display);
          font-size: clamp(36px, 5vw, 52px);
          font-weight: 600;
          line-height: 1.08;
          letter-spacing: -0.03em;
        }
        .hero-facts {
          display: flex; flex-wrap: wrap; gap: 8px 16px;
          margin-top: 14px; font-size: 14px; color: var(--text-secondary);
        }
        .hero-facts span:not(:last-child)::after {
          content: "·"; margin-left: 16px; color: var(--text-tertiary);
        }
        .hero-lede {
          font-size: 17px; line-height: 1.75;
          color: var(--text-secondary); max-width: 580px;
        }
        .hero-lede strong { color: var(--text); font-weight: 600; }
        .hero-lede em { color: var(--accent-bright); font-style: normal; }
        .hero-actions {
          display: flex; align-items: center; gap: 20px;
          margin-top: 32px;
        }
        .hero-btn.primary {
          padding: 14px 32px;
          background: var(--accent);
          color: #0a0e17;
          font-weight: 700; font-size: 15px;
          border-radius: 980px;
          box-shadow: 0 8px 32px var(--accent-glow);
        }
        .hero-stat-inline {
          font-size: 13px; color: var(--text-tertiary);
        }
        .hero-aside { display: flex; flex-direction: column; gap: 16px; }
        .hero-map-card {
          padding: 24px;
          background: var(--bg-glass);
          border: 1px solid var(--border);
          border-radius: 20px;
          backdrop-filter: blur(16px);
        }
        .hero-map-label {
          font-size: 10px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.12em; color: var(--text-tertiary);
        }
        .hero-map-route {
          display: flex; flex-wrap: wrap; align-items: center; gap: 6px;
          margin: 14px 0; font-size: 13px; font-weight: 600;
          color: var(--accent-bright);
        }
        .hero-map-arrow { color: var(--text-tertiary); font-weight: 400; }
        .hero-map-note {
          font-size: 13px; line-height: 1.6; color: var(--text-secondary);
        }
        .hero-heritage-wrap {
          padding: 20px;
          background: var(--bg-glass);
          border: 1px solid var(--border);
          border-radius: 20px;
        }
        @media (max-width: 960px) {
          .hero { padding: 40px 20px 28px; }
          .hero-inner { grid-template-columns: 1fr; gap: 32px; }
          .hero-profile-row { flex-direction: column; text-align: center; }
          .hero-facts { justify-content: center; }
          .hero-lede { max-width: none; }
          .hero-actions { justify-content: center; flex-wrap: wrap; }
        }
      `}</style>
    </section>
  );
}
