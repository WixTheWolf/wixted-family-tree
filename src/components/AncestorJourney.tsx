import { motion } from "framer-motion";
import ancestryData from "../data/ancestryLine.json";
import type { CSSProperties } from "react";
import type { Person } from "../types";

interface AncestorEntry {
  era: string;
  eraColor: string;
  personId: string | null;
  name: string;
  dates: string;
  role: string;
  location: string;
  detail: string;
}

interface Props {
  onSelectPerson?: (p: Person) => void;
  peopleById: Map<string, Person>;
}

export default function AncestorJourney({ onSelectPerson, peopleById }: Props) {
  const data = ancestryData;
  const generations = data.generations as AncestorEntry[];

  return (
    <section className="ancestor-journey">
      <div className="aj-intro">
        <p className="section-eyebrow">Direct line</p>
        <h2 className="section-title">{data.meta.title}</h2>
        <p className="section-lede">{data.meta.summary}</p>
      </div>

      <div className="aj-migrations">
        {data.meta.migrations.map((m, i) => (
          <motion.div
            key={m.year}
            className="aj-migration-chip"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <span className="aj-migration-year">{m.year}</span>
            <span className="aj-migration-text">{m.label}</span>
            <span className="aj-migration-route">{m.from} → {m.to}</span>
          </motion.div>
        ))}
      </div>

      <div className="aj-rail-wrap">
        <p className="aj-rail-hint">Scroll the timeline →</p>
        <div className="aj-rail">
          {generations.map((gen, i) => {
            const person = gen.personId ? peopleById.get(gen.personId) : null;
            const isFocus = gen.personId === data.meta.focusPersonId;

            return (
              <motion.article
                key={`${gen.name}-${i}`}
                className={`aj-card ${isFocus ? "focus" : ""} ${person ? "clickable" : ""}`}
                style={{ "--era-color": gen.eraColor } as CSSProperties}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.04, duration: 0.45 }}
                whileHover={person ? { y: -8, scale: 1.02 } : undefined}
                onClick={() => person && onSelectPerson?.(person)}
                role={person ? "button" : undefined}
                tabIndex={person ? 0 : undefined}
                onKeyDown={(e) => {
                  if (person && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onSelectPerson?.(person);
                  }
                }}
              >
                <span className="aj-era">{gen.era}</span>
                <span className="aj-role">{gen.role}</span>
                <h3>{gen.name}</h3>
                <div className="aj-meta">
                  <span>{gen.dates}</span>
                  <span>{gen.location}</span>
                </div>
                <p>{gen.detail}</p>
                {isFocus && <span className="aj-badge">You</span>}
                {person && !isFocus && <span className="aj-open">View →</span>}
              </motion.article>
            );
          })}
        </div>
      </div>

      <div className="aj-footnotes">
        <h4>From the workbook</h4>
        <ul>
          {data.researchNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>

      <style>{`
        .ancestor-journey {
          padding: 80px 24px;
          max-width: 1280px;
          margin: 0 auto;
          border-top: 1px solid var(--border);
        }
        .aj-intro { max-width: 720px; margin-bottom: 40px; }
        .aj-intro .section-title { margin: 12px 0 16px; }
        .aj-migrations {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 48px;
        }
        .aj-migration-chip {
          flex: 1 1 240px;
          padding: 18px 20px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          border-left: 3px solid var(--accent);
        }
        .aj-migration-year {
          font-size: 12px;
          font-weight: 700;
          color: var(--accent);
          letter-spacing: 0.04em;
        }
        .aj-migration-text {
          display: block;
          font-size: 15px;
          font-weight: 600;
          margin: 6px 0 4px;
          letter-spacing: -0.01em;
        }
        .aj-migration-route {
          font-size: 13px;
          color: var(--text-tertiary);
        }
        .aj-rail-hint {
          font-size: 13px;
          color: var(--text-tertiary);
          margin-bottom: 16px;
          font-weight: 500;
        }
        .aj-rail {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding: 8px 4px 32px;
          scrollbar-width: none;
        }
        .aj-rail::-webkit-scrollbar { display: none; }
        .aj-card {
          flex: 0 0 min(320px, 88vw);
          scroll-snap-align: start;
          padding: 28px 24px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          position: relative;
          transition: box-shadow 0.3s, border-color 0.2s;
        }
        .aj-card.clickable { cursor: pointer; }
        .aj-card.clickable:hover {
          border-color: var(--border-strong);
          box-shadow: var(--shadow-md);
        }
        .aj-card.focus {
          border-color: var(--accent);
          background: linear-gradient(160deg, rgba(255, 149, 0, 0.08) 0%, var(--bg-card) 50%);
        }
        .aj-era {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 4px 10px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--era-color, var(--border));
          color: var(--era-color, var(--text-secondary));
          margin-bottom: 12px;
        }
        .aj-role {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .aj-card h3 {
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 10px;
        }
        .aj-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 13px;
          color: var(--accent-link);
          margin-bottom: 12px;
        }
        .aj-card p {
          font-size: 14px;
          line-height: 1.55;
          color: var(--text-secondary);
        }
        .aj-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: var(--radius-pill);
          background: var(--accent);
          color: #000;
        }
        .aj-open {
          display: inline-block;
          margin-top: 16px;
          font-size: 14px;
          font-weight: 600;
          color: var(--accent-link);
        }
        .aj-footnotes {
          margin-top: 24px;
          padding: 28px;
          background: var(--bg-card);
          border-radius: var(--radius);
          border: 1px solid var(--border);
        }
        .aj-footnotes h4 {
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-tertiary);
          margin-bottom: 16px;
        }
        .aj-footnotes ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .aj-footnotes li {
          font-size: 15px;
          line-height: 1.5;
          color: var(--text-secondary);
          padding-left: 16px;
          border-left: 2px solid var(--accent);
        }
      `}</style>
    </section>
  );
}
