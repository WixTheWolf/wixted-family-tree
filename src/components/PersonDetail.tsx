import { motion, AnimatePresence } from "framer-motion";
import type { Person, CemeteryRecord, Story, Branch } from "../types";
import { NOTE_LABELS, NOTE_ORDER, groupNotes } from "../utils/notes";
import { getBranchLabel } from "../utils/people";
import { getPersonAge, filterDisplayNotes } from "../utils/ages";
import PersonAvatar from "./PersonAvatar";

interface Props {
  person: Person | null;
  cemetery: CemeteryRecord[];
  relatives: Person[];
  stories: Story[];
  branches: Branch[];
  onClose: () => void;
  onSelectRelative: (p: Person) => void;
}

export default function PersonDetail({
  person,
  cemetery,
  relatives,
  stories,
  branches,
  onClose,
  onSelectRelative,
}: Props) {
  const cemMatch = person
    ? cemetery.filter((c) => {
        const first = person.name.split(/[\s\-]+/)[0].toLowerCase();
        const clow = c.name.toLowerCase();
        return clow.includes(first) || person.name.toLowerCase().includes(clow.split(/[\s,]+/)[0]);
      })
    : [];

  const personStories = person
    ? stories.filter((s) => s.personIds.includes(person.id))
    : [];

  const noteGroups = person?.categorizedNotes
    ? groupNotes(person.categorizedNotes)
    : new Map();

  const sortedCategories = NOTE_ORDER.filter((c) => noteGroups.has(c));
  const age = person ? getPersonAge(person) : null;

  function relativeRole(r: Person): string {
    if (!person) return "";
    if (r.id === person.parentId) return "Father";
    if (r.id === person.motherId) return "Mother";
    if (r.parentId === person.id || r.motherId === person.id) return "Child";
    if (person.exSpouseIds?.includes(r.id)) return "Ex-spouse";
    if (person.spouseIds?.includes(r.id)) return "Spouse";
    if (person.exSpouseIds?.includes(r.id) || r.exSpouseIds?.includes(person.id)) return "Ex-spouse";
    if (r.parentId === person.parentId) return "Sibling";
    return getBranchLabel(branches, r.branch);
  }

  return (
    <AnimatePresence>
      {person && (
        <>
          <motion.div
            className="detail-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="detail-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          >
            <button className="detail-close" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="detail-content">
              <div className="detail-top">
                <PersonAvatar person={person} size={64} />
                <div>
                  <div className="detail-branch">{getBranchLabel(branches, person.branch)}</div>
                  <h2>{person.name}</h2>
                  {person.dates && <p className="detail-dates">{person.dates}</p>}
                </div>
              </div>

              <div className="detail-badges">
                {age && <span className="detail-badge">{age} old</span>}
                {person.generation !== undefined && (
                  <span className="detail-badge muted">Generation {person.generation + 1}</span>
                )}
                {person.isFocus && <span className="detail-badge focus">Family Focus</span>}
                {filterDisplayNotes(person.notes).length > 0 && (
                  <span className="detail-badge muted">{filterDisplayNotes(person.notes).length} notes</span>
                )}
              </div>

              {sortedCategories.length > 0 && (
                <section className="detail-section">
                  <h3>Research Notes</h3>
                  {sortedCategories.map((cat) => (
                    <div key={cat} className="note-group">
                      <h4>{NOTE_LABELS[cat]}</h4>
                      <ul>
                        {noteGroups.get(cat)!.map((n: string, i: number) => (
                          <li key={i}>{n}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              )}

              {personStories.length > 0 && (
                <section className="detail-section">
                  <h3>Stories</h3>
                  {personStories.map((s) => (
                    <div key={s.id} className="story-snippet">
                      <div className="story-snippet-title">{s.title}</div>
                      <p>{s.body}</p>
                    </div>
                  ))}
                </section>
              )}

              {cemMatch.length > 0 && (
                <section className="detail-section">
                  <h3>Cemetery Records</h3>
                  {cemMatch.map((c) => (
                    <div key={c.id} className="cem-card">
                      <div className="cem-name">{c.name}</div>
                      {c.location && <div className="cem-loc">{c.location}</div>}
                      {c.died && <div className="cem-date">Died: {c.died}</div>}
                      {c.born && <div className="cem-date">Born: {c.born}</div>}
                      {c.relation && <div className="cem-rel">{c.relation}</div>}
                      {c.notes && <div className="cem-rel">{c.notes}</div>}
                    </div>
                  ))}
                </section>
              )}

              {relatives.length > 0 && (
                <section className="detail-section">
                  <h3>Family Connections</h3>
                  <div className="relatives-list">
                    {relatives.map((r) => (
                      <button key={r.id} className="relative-chip" onClick={() => onSelectRelative(r)}>
                        <div>
                          <span>{r.name}</span>
                          <span className="relative-branch">{relativeRole(r)}</span>
                        </div>
                        {(r.dates || getPersonAge(r)) && (
                          <span className="relative-dates">{r.dates || getPersonAge(r)}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </motion.aside>

          <style>{`
            .detail-backdrop {
              position: fixed; inset: 0; background: rgba(0,0,0,0.2);
              backdrop-filter: blur(4px); z-index: 200;
            }
            .detail-panel {
              position: fixed; top: 0; right: 0; bottom: 0; width: 440px;
              max-width: 90vw; background: var(--bg-elevated);
              box-shadow: var(--shadow-lg); z-index: 201;
              overflow-y: auto;
            }
            .detail-close {
              position: absolute; top: 16px; right: 16px; z-index: 1;
              width: 32px; height: 32px; border-radius: 50%;
              display: flex; align-items: center; justify-content: center;
              color: var(--text-tertiary); transition: background 0.15s;
            }
            .detail-close:hover { background: rgba(0,0,0,0.06); }
            .detail-content { padding: 48px 32px 32px; }
            .detail-top {
              display: flex; gap: 16px; align-items: flex-start; margin-bottom: 16px;
            }
            .detail-branch {
              font-size: 12px; font-weight: 600; text-transform: uppercase;
              letter-spacing: 0.06em; color: var(--accent); margin-bottom: 8px;
            }
            .detail-content h2 {
              font-size: 28px; font-weight: 700; letter-spacing: -0.02em;
              line-height: 1.2; color: var(--text);
            }
            .detail-dates {
              font-size: 17px; color: var(--text-secondary); margin-top: 8px;
            }
            .detail-badges { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
            .detail-badge {
              display: inline-block; padding: 4px 12px; border-radius: 980px;
              background: rgba(201, 162, 39, 0.12); color: var(--accent);
              font-size: 13px; font-weight: 500;
            }
            .detail-badge.muted {
              background: var(--bg-glass); color: var(--text-tertiary);
            }
            .detail-badge.focus {
              background: rgba(201, 162, 39, 0.15); color: var(--accent-bright);
            }
            .detail-section { margin-top: 32px; }
            .detail-section h3 {
              font-size: 13px; font-weight: 600; text-transform: uppercase;
              letter-spacing: 0.06em; color: var(--text-tertiary); margin-bottom: 12px;
            }
            .note-group { margin-bottom: 16px; }
            .note-group h4 {
              font-size: 12px; font-weight: 600; color: var(--text-secondary);
              margin-bottom: 6px;
            }
            .note-group ul { list-style: none; }
            .note-group li {
              font-size: 14px; color: var(--text-secondary); line-height: 1.5;
              padding: 6px 0; border-bottom: 1px solid var(--border);
            }
            .story-snippet {
              padding: 14px; border-radius: var(--radius-sm);
              background: var(--bg); border: 1px solid var(--border);
              margin-bottom: 8px;
            }
            .story-snippet-title { font-weight: 600; font-size: 14px; margin-bottom: 6px; }
            .story-snippet p { font-size: 13px; color: var(--text-secondary); line-height: 1.55; }
            .cem-card {
              padding: 14px; border-radius: var(--radius-sm);
              background: var(--bg); border: 1px solid var(--border);
              margin-bottom: 8px;
            }
            .cem-name { font-weight: 600; font-size: 15px; }
            .cem-loc, .cem-date, .cem-rel {
              font-size: 13px; color: var(--text-tertiary); margin-top: 4px;
            }
            .relatives-list { display: flex; flex-direction: column; gap: 6px; }
            .relative-chip {
              display: flex; justify-content: space-between; align-items: center;
              padding: 10px 14px; border-radius: var(--radius-sm);
              background: var(--bg); border: 1px solid var(--border);
              text-align: left; transition: border-color 0.15s, background 0.15s;
            }
            .relative-chip:hover {
              border-color: rgba(0,113,227,0.3); background: rgba(0,113,227,0.04);
            }
            .relative-chip span:first-child { font-size: 14px; font-weight: 500; display: block; }
            .relative-branch {
              font-size: 10px; color: var(--text-tertiary); font-weight: 500;
              text-transform: uppercase; letter-spacing: 0.04em;
            }
            .relative-dates { font-size: 12px; color: var(--text-tertiary); }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}
