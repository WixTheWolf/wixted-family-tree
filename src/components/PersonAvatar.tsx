import { useMemo } from "react";
import type { Person } from "../types";
import { getPersonAge } from "../utils/ages";
import manifest from "../data/assets.json";

const COLORS = [
  "#c9a227", "#4a9eff", "#e85d75", "#50c878", "#b07aff", "#ff9f43", "#26c6da",
];

function initials(name: string): string {
  return name
    .replace(/\([^)]*\)/g, "")
    .split(/[\s\-]+/)
    .filter((w) => w.length > 1 && /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

interface Props {
  person: Person;
  size?: number;
  className?: string;
}

export default function PersonAvatar({ person, size = 48, className = "" }: Props) {
  const photo = useMemo(() => {
    const entry = (manifest.people as Record<string, { photo?: string }>)[person.id];
    return entry?.photo ?? null;
  }, [person.id]);

  const colorIdx = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < person.name.length; i++) hash = person.name.charCodeAt(i) + ((hash << 5) - hash);
    return Math.abs(hash) % COLORS.length;
  }, [person.name]);

  const ini = initials(person.name);
  const age = getPersonAge(person);

  if (photo) {
    return (
      <div
        className={`avatar avatar-photo ${className}`}
        style={{ width: size, height: size }}
        title={age ? `${person.name}, ${age}` : person.name}
      >
        <img src={photo} alt={person.name} loading="lazy" />
        <style>{`
          .avatar-photo {
            border-radius: 50%; overflow: hidden; flex-shrink: 0;
            border: 2px solid var(--border-accent);
            box-shadow: 0 0 16px var(--accent-glow);
          }
          .avatar-photo img { width: 100%; height: 100%; object-fit: cover; }
        `}</style>
      </div>
    );
  }

  return (
    <div
      className={`avatar avatar-initials ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${COLORS[colorIdx]}88, ${COLORS[colorIdx]}44)`,
        fontSize: size * 0.36,
      }}
      title={age ? `${person.name}, ${age}` : person.name}
    >
      {ini || "?"}
      <style>{`
        .avatar-initials {
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-weight: 700; letter-spacing: -0.02em; flex-shrink: 0;
          border: 2px solid var(--border);
          color: var(--text);
        }
      `}</style>
    </div>
  );
}

export { initials };
