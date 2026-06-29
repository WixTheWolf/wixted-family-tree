import { motion } from "framer-motion";
import type { Person } from "../types";
import { CARD_W, CARD_H } from "../utils/tree";

interface Props {
  person: Person;
  x: number;
  y: number;
  selected: boolean;
  highlighted: boolean;
  onClick: () => void;
}

export default function PersonCard({ person, x, y, selected, highlighted, onClick }: Props) {
  const isDirect = person.name.includes("Henry(1)") || person.name.includes("Henry(2)") ||
    person.name.includes("Wixted") || person.name.includes("McGraw");

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: Math.min(person.generation ?? 0, 5) * 0.05 }}
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <foreignObject x={x} y={y} width={CARD_W} height={CARD_H}>
        <div
          className={`person-card ${selected ? "selected" : ""} ${highlighted ? "highlighted" : ""} ${isDirect ? "direct" : ""}`}
        >
          <div className="person-card-name">{person.name}</div>
          {person.dates && <div className="person-card-dates">{person.dates}</div>}
        </div>
      </foreignObject>

      <style>{`
        .person-card {
          width: ${CARD_W}px; height: ${CARD_H}px;
          background: var(--bg-elevated); border-radius: 14px;
          border: 1.5px solid var(--border); padding: 14px 16px;
          box-shadow: var(--shadow-sm);
          transition: box-shadow 0.2s, border-color 0.2s, transform 0.2s;
          display: flex; flex-direction: column; justify-content: center;
          overflow: hidden;
        }
        .person-card:hover {
          box-shadow: var(--shadow-md); border-color: rgba(0,113,227,0.2);
          transform: translateY(-2px);
        }
        .person-card.selected {
          border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,113,227,0.15), var(--shadow-md);
        }
        .person-card.highlighted {
          border-color: #ff9500; box-shadow: 0 0 0 3px rgba(255,149,0,0.2), var(--shadow-md);
        }
        .person-card.direct .person-card-name { color: var(--accent); }
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