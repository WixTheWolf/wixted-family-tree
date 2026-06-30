import { motion } from "framer-motion";
import type { Person } from "../types";
import PersonAvatar from "./PersonAvatar";
import { getPersonAge } from "../utils/ages";
import { getInnerCircle } from "../utils/people";

export { getInnerCircle };

interface Props {
  root: Person;
  family: Person[];
  onSelect: (p: Person) => void;
}

export default function FamilyOrbit({ root, family, onSelect }: Props) {
  const members = family.filter((p) => p.id !== root.id);
  const angleStep = (2 * Math.PI) / Math.max(members.length, 1);

  return (
    <div className="orbit-container">
      <motion.button
        className="orbit-center"
        onClick={() => onSelect(root)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        whileHover={{ scale: 1.05 }}
      >
        <PersonAvatar person={root} size={88} />
        <div className="orbit-center-info">
          <span className="orbit-center-name">{root.name.split(" ").slice(0, 2).join(" ")}</span>
          {getPersonAge(root) && <span className="orbit-center-age">{getPersonAge(root)}</span>}
        </div>
      </motion.button>

      {members.map((p, i) => {
        const angle = angleStep * i - Math.PI / 2;
        const radius = members.length <= 4 ? 130 : 150;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const isChild = p.parentId === root.id || (p as Person & { motherId?: string }).motherId === root.id;

        return (
          <motion.button
            key={p.id}
            className={`orbit-member ${isChild ? "orbit-child" : ""}`}
            style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
            onClick={() => onSelect(p)}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.08, type: "spring", stiffness: 400, damping: 25 }}
            whileHover={{ scale: 1.12, zIndex: 10 }}
          >
            <PersonAvatar person={p} size={56} />
            <span className="orbit-member-name">{p.name.split(" ")[0]}</span>
            {getPersonAge(p) && <span className="orbit-member-age">{getPersonAge(p)}</span>}
          </motion.button>
        );
      })}

      <svg className="orbit-lines" viewBox="-200 -200 400 400">
        {members.map((p, i) => {
          const angle = angleStep * i - Math.PI / 2;
          const radius = members.length <= 4 ? 130 : 150;
          return (
            <motion.line
              key={p.id}
              x1={0} y1={0}
              x2={Math.cos(angle) * radius}
              y2={Math.sin(angle) * radius}
              stroke="rgba(201,162,39,0.15)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
            />
          );
        })}
      </svg>

      <style>{`
        .orbit-container {
          position: relative; width: 100%; max-width: 420px; height: 380px;
          margin: 0 auto;
        }
        .orbit-center {
          position: absolute; left: 50%; top: 50%;
          transform: translate(-50%, -50%);
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          z-index: 5;
        }
        .orbit-center-info { text-align: center; }
        .orbit-center-name {
          display: block; font-family: var(--font-display);
          font-size: 18px; font-weight: 600; color: var(--accent-bright);
        }
        .orbit-center-age { font-size: 13px; color: var(--text-tertiary); }
        .orbit-member {
          position: absolute; transform: translate(-50%, -50%);
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          z-index: 2;
        }
        .orbit-member-name {
          font-size: 11px; font-weight: 600; color: var(--text-secondary);
          white-space: nowrap;
        }
        .orbit-member-age { font-size: 10px; color: var(--text-tertiary); }
        .orbit-child .orbit-member-name { color: var(--accent-secondary); }
        .orbit-lines {
          position: absolute; inset: 0; width: 100%; height: 100%;
          pointer-events: none;
        }
        @media (max-width: 480px) {
          .orbit-container { height: 340px; max-width: 340px; }
        }
      `}</style>
    </div>
  );
}
