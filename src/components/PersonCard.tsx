import { motion } from "framer-motion";
import type { Person } from "../types";
import { CARD_W, CARD_H } from "../utils/tree";
import { getPersonAge } from "../utils/ages";
import PersonAvatar from "./PersonAvatar";

interface Props {
  person: Person;
  x: number;
  y: number;
  selected: boolean;
  highlighted: boolean;
  onFocusLine?: boolean;
  onClick: () => void;
}

export default function PersonCard({ person, x, y, selected, highlighted, onFocusLine, onClick }: Props) {
  const age = getPersonAge(person);
  const cls = [
    "person-card",
    selected && "selected",
    highlighted && "highlighted",
    onFocusLine && "focus-line",
    person.isFocus && "is-focus",
  ].filter(Boolean).join(" ");

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: Math.min(person.generation ?? 0, 5) * 0.05 }}
      style={{ cursor: "pointer" }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
    >
      <foreignObject x={x} y={y} width={CARD_W} height={CARD_H}>
        <div className={cls}>
          <div className="person-card-glow" />
          <PersonAvatar person={person} size={46} className="person-card-avatar" />
          <div className="person-card-copy">
            <div className="person-card-name">{person.name}</div>
            {(person.dates || age) && (
              <div className="person-card-dates">{person.dates || age}</div>
            )}
            <div className="person-card-meta">
              {person.isFocus ? "Focus person" : `Generation ${person.generation ?? "?"}`}
            </div>
          </div>
        </div>
      </foreignObject>

      <style>{`
        .person-card {
          position: relative;
          width: ${CARD_W}px; height: ${CARD_H}px;
          background:
            linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.015)),
            var(--bg-card);
          border-radius: 18px;
          border: 1.5px solid var(--border); padding: 16px;
          box-shadow: var(--shadow-sm);
          transition: box-shadow 0.2s, border-color 0.2s, transform 0.2s, background 0.2s;
          display: flex; align-items: center; gap: 12px;
          overflow: hidden; backdrop-filter: blur(10px);
        }
        .person-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent 38%);
          opacity: 0.55;
          pointer-events: none;
        }
        .person-card-glow {
          position: absolute;
          inset: auto -28px -42px auto;
          width: 92px;
          height: 92px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(74,158,255,0.16), transparent 68%);
          pointer-events: none;
        }
        .person-card:hover {
          box-shadow: var(--shadow-md); border-color: var(--border-accent);
          transform: translateY(-2px);
        }
        .person-card.selected {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-glow), var(--shadow-md);
        }
        .person-card.highlighted, .person-card.focus-line {
          border-color: var(--accent-bright);
          box-shadow: 0 0 0 2px var(--accent-glow);
        }
        .person-card.is-focus {
          background: rgba(201, 162, 39, 0.1);
          border-color: var(--accent);
        }
        .person-card.focus-line .person-card-glow,
        .person-card.is-focus .person-card-glow {
          background: radial-gradient(circle, rgba(201,162,39,0.28), transparent 68%);
        }
        .person-card.is-focus .person-card-name { color: var(--accent-bright); }
        .person-card-avatar {
          position: relative;
          z-index: 1;
        }
        .person-card-copy {
          position: relative;
          z-index: 1;
          min-width: 0;
        }
        .person-card-name {
          font-size: 14px; font-weight: 600; color: var(--text);
          line-height: 1.3; overflow: hidden;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
        }
        .person-card-dates {
          font-size: 12px; color: var(--text-tertiary); margin-top: 4px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .person-card-meta {
          display: inline-flex;
          margin-top: 7px;
          padding: 2px 8px;
          border-radius: 980px;
          background: rgba(255,255,255,0.055);
          color: var(--text-tertiary);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .person-card.is-focus .person-card-meta,
        .person-card.focus-line .person-card-meta {
          background: rgba(201,162,39,0.14);
          color: var(--accent-bright);
        }
      `}</style>
    </motion.g>
  );
}
