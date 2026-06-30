import { motion } from "framer-motion";
import type { Person } from "../types";
import { CARD_W, CARD_H } from "../utils/tree";
import { getPersonAge } from "../utils/ages";

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
      onClick={onClick}
    >
      <foreignObject x={x} y={y} width={CARD_W} height={CARD_H}>
        <div className={cls}>
          <div className="person-card-name">{person.name}</div>
          {(person.dates || age) && (
            <div className="person-card-dates">{person.dates || age}</div>
          )}
        </div>
      </foreignObject>

      <style>{`
        .person-card {
          width: ${CARD_W}px; height: ${CARD_H}px;
          background: var(--bg-card); border-radius: 14px;
          border: 1.5px solid var(--border); padding: 14px 16px;
          box-shadow: var(--shadow-sm);
          transition: box-shadow 0.2s, border-color 0.2s, transform 0.2s;
          display: flex; flex-direction: column; justify-content: center;
          overflow: hidden; backdrop-filter: blur(8px);
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
        .person-card.is-focus .person-card-name { color: var(--accent-bright); }
        .person-card-name {
          font-size: 14px; font-weight: 600; color: var(--text);
          line-height: 1.3; overflow: hidden;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
        }
        .person-card-dates {
          font-size: 12px; color: var(--text-tertiary); margin-top: 4px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
      `}</style>
    </motion.g>
  );
}
