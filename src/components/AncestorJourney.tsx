import { motion } from "framer-motion";
import ancestryData from "../data/ancestryLine.json";
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
      <div className="aj-header">
        <div>
          <span className="aj-eyebrow">Direct Wixted Line</span>
          <h2>{data.meta.title}</h2>
          <p>{data.meta.summary}</p>
        </div>
        <div className="aj-migrations">
          {data.meta.migrations.map((m) => (
            <div key={m.year} className="aj-migration">
              <span className="aj-migration-year">{m.year}</span>
              <span className="aj-migration-label">{m.label}</span>
              <span className="aj-migration-route">{m.from} → {m.to}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="aj-timeline">
        {generations.map((gen, i) => {
          const person = gen.personId ? peopleById.get(gen.personId) : null;
          const isFocus = gen.personId === data.meta.focusPersonId;

          return (
            <motion.div
              key={`${gen.name}-${i}`}
              className={`aj-node ${isFocus ? "focus" : ""} ${person ? "clickable" : ""}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.45 }}
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
              <div className="aj-rail">
                <span className="aj-era" style={{ borderColor: gen.eraColor, color: gen.eraColor }}>
                  {gen.era}
                </span>
                {i < generations.length - 1 && <span className="aj-connector" />}
              </div>
              <div className="aj-card">
                <div className="aj-card-top">
                  <span className="aj-role">{gen.role}</span>
                  {isFocus && <span className="aj-you">Focus</span>}
                </div>
                <h3>{gen.name}</h3>
                <div className="aj-meta">
                  <span>{gen.dates}</span>
                  <span>{gen.location}</span>
                </div>
                <p>{gen.detail}</p>
                {person && <span className="aj-link">View in tree →</span>}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="aj-research">
        <h4>From the family workbook & archives</h4>
        <ul>
          {data.researchNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>

      <style>{`
        .ancestor-journey {
          padding: 48px;
          max-width: 1200px;
          margin: 0 auto;
          border-top: 1px solid var(--border);
        }
        .aj-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 48px;
        }
        .aj-eyebrow {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.14em; color: var(--accent);
        }
        .aj-header h2 {
          font-family: var(--font-display);
          font-size: clamp(28px, 3vw, 36px);
          font-weight: 600;
          margin: 10px 0 12px;
          letter-spacing: -0.02em;
        }
        .aj-header p {
          font-size: 16px; line-height: 1.65; color: var(--text-secondary);
          max-width: 520px;
        }
        .aj-migrations { display: flex; flex-direction: column; gap: 12px; }
        .aj-migration {
          padding: 16px 18px;
          background: var(--bg-glass);
          border: 1px solid var(--border);
          border-radius: 12px;
          border-left: 3px solid var(--accent);
        }
        .aj-migration-year {
          font-size: 11px; font-weight: 700; color: var(--accent-bright);
          letter-spacing: 0.06em;
        }
        .aj-migration-label {
          display: block; font-size: 14px; font-weight: 600;
          margin: 4px 0 2px;
        }
        .aj-migration-route {
          font-size: 12px; color: var(--text-tertiary);
        }
        .aj-timeline { display: flex; flex-direction: column; gap: 0; }
        .aj-node {
          display: grid;
          grid-template-columns: 120px 1fr;
          gap: 24px;
          position: relative;
        }
        .aj-node.clickable { cursor: pointer; }
        .aj-node.clickable:hover .aj-card {
          border-color: var(--border-accent);
          transform: translateX(4px);
        }
        .aj-node.focus .aj-card {
          border-color: var(--accent);
          background: rgba(201, 162, 39, 0.06);
        }
        .aj-rail {
          display: flex; flex-direction: column; align-items: center;
          padding-top: 20px;
        }
        .aj-era {
          font-size: 10px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em; padding: 5px 10px;
          border: 1px solid; border-radius: 980px;
          background: rgba(0,0,0,0.2); white-space: nowrap;
        }
        .aj-connector {
          width: 2px; flex: 1; min-height: 40px;
          background: linear-gradient(to bottom, var(--border-accent), var(--border));
          margin: 8px 0;
        }
        .aj-card {
          padding: 22px 26px;
          margin-bottom: 16px;
          background: var(--bg-glass);
          border: 1px solid var(--border);
          border-radius: 16px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .aj-card-top {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 8px;
        }
        .aj-role {
          font-size: 11px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--text-tertiary);
        }
        .aj-you {
          font-size: 10px; font-weight: 700; padding: 3px 8px;
          border-radius: 6px; background: rgba(201, 162, 39, 0.15);
          color: var(--accent-bright);
        }
        .aj-card h3 {
          font-family: var(--font-display);
          font-size: 22px; font-weight: 600;
          letter-spacing: -0.01em;
        }
        .aj-meta {
          display: flex; flex-wrap: wrap; gap: 12px;
          margin: 8px 0 12px; font-size: 13px; color: var(--accent-secondary);
        }
        .aj-card p {
          font-size: 14px; line-height: 1.65; color: var(--text-secondary);
        }
        .aj-link {
          display: inline-block; margin-top: 12px;
          font-size: 12px; font-weight: 600; color: var(--accent);
        }
        .aj-research {
          margin-top: 40px; padding: 28px;
          background: rgba(255,255,255,0.02);
          border: 1px dashed var(--border);
          border-radius: 16px;
        }
        .aj-research h4 {
          font-size: 13px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--text-tertiary);
          margin-bottom: 14px;
        }
        .aj-research ul {
          list-style: none; display: flex; flex-direction: column; gap: 10px;
        }
        .aj-research li {
          font-size: 14px; color: var(--text-secondary); line-height: 1.55;
          padding-left: 16px; position: relative;
        }
        .aj-research li::before {
          content: "◆"; position: absolute; left: 0;
          color: var(--accent); font-size: 8px; top: 6px;
        }
        @media (max-width: 900px) {
          .ancestor-journey { padding: 32px 20px; }
          .aj-header { grid-template-columns: 1fr; gap: 24px; }
          .aj-node { grid-template-columns: 80px 1fr; gap: 14px; }
        }
      `}</style>
    </section>
  );
}
