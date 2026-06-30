import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Story, Branch, Person } from "../types";

interface Props {
  stories: Story[];
  branches: Branch[];
  people: Person[];
  onSelectPerson: (p: Person) => void;
}

const TAG_LABELS: Record<string, string> = {
  "family-history": "Family History",
  narrative: "Narrative",
  "history-doc": "History Document",
  colonial: "Colonial Era",
  biography: "Biography",
};

export default function StoriesView({ stories, branches, people, onSelectPerson }: Props) {
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    stories.forEach((s) => s.tags.forEach((t) => tags.add(t)));
    return [...tags].sort();
  }, [stories]);

  const filtered = useMemo(() => {
    let list = stories;
    if (tagFilter !== "all") list = list.filter((s) => s.tags.includes(tagFilter));
    if (branchFilter !== "all") list = list.filter((s) => s.branch === branchFilter);
    return list;
  }, [stories, tagFilter, branchFilter]);

  const branchLabel = (id: string) => branches.find((b) => b.id === id)?.label ?? id;

  return (
    <div className="stories">
      <p className="stories-intro">
        Family narratives, migration stories, and research notes pulled from the Wixted Family workbook.
        These are the human stories behind the names on the tree.
      </p>

      <div className="stories-filters">
        <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
          <option value="all">All branches</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>{b.label}</option>
          ))}
        </select>
        <div className="stories-tags">
          <button
            className={tagFilter === "all" ? "active" : ""}
            onClick={() => setTagFilter("all")}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={tagFilter === tag ? "active" : ""}
              onClick={() => setTagFilter(tag)}
            >
              {TAG_LABELS[tag] ?? tag}
            </button>
          ))}
        </div>
      </div>

      <div className="stories-grid">
        {filtered.map((story, i) => {
          const linked = story.personIds
            .map((id) => people.find((p) => p.id === id))
            .filter(Boolean) as Person[];

          return (
            <motion.article
              key={story.id}
              className="story-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.4) }}
            >
              <div className="story-meta">
                <span className="story-branch">{branchLabel(story.branch)}</span>
                {story.tags.map((t) => (
                  <span key={t} className="story-tag">{TAG_LABELS[t] ?? t}</span>
                ))}
              </div>
              <h3 className="story-title">{story.title}</h3>
              <p className="story-body">{story.body}</p>
              {linked.length > 0 && (
                <div className="story-people">
                  <span className="story-people-label">Related:</span>
                  {linked.map((p) => (
                    <button key={p.id} onClick={() => onSelectPerson(p)}>
                      {p.name}
                    </button>
                  ))}
                </div>
              )}
            </motion.article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="stories-empty">No stories match your filters.</p>
      )}

      <style>{`
        .stories { display: flex; flex-direction: column; gap: 20px; }
        .stories-intro {
          font-size: 15px; color: var(--text-secondary); line-height: 1.6;
          max-width: 720px;
        }
        .stories-filters {
          display: flex; flex-direction: column; gap: 12px;
        }
        .stories-filters select {
          align-self: flex-start;
          padding: 8px 14px; border-radius: 10px; border: 1px solid var(--border);
          background: var(--bg-elevated); font-size: 14px;
        }
        .stories-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .stories-tags button {
          padding: 6px 14px; border-radius: 980px; font-size: 13px;
          font-weight: 500; color: var(--text-secondary);
          background: var(--bg-elevated); border: 1px solid var(--border);
          transition: all 0.15s;
        }
        .stories-tags button:hover { border-color: rgba(0,113,227,0.3); }
        .stories-tags button.active {
          background: rgba(0,113,227,0.1); color: var(--accent);
          border-color: rgba(0,113,227,0.3);
        }
        .stories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 16px;
          max-height: calc(100vh - 360px); overflow-y: auto;
          padding-right: 4px;
        }
        .story-card {
          padding: 24px; background: var(--bg-elevated);
          border-radius: var(--radius); border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
        }
        .story-meta { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
        .story-branch {
          font-size: 11px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.06em; color: var(--accent);
        }
        .story-tag {
          font-size: 11px; padding: 2px 8px; border-radius: 6px;
          background: rgba(0,0,0,0.04); color: var(--text-tertiary);
        }
        .story-title {
          font-size: 18px; font-weight: 700; letter-spacing: -0.02em;
          line-height: 1.3; margin-bottom: 10px;
        }
        .story-body {
          font-size: 14px; color: var(--text-secondary); line-height: 1.65;
        }
        .story-people {
          display: flex; flex-wrap: wrap; align-items: center; gap: 6px;
          margin-top: 16px; padding-top: 14px;
          border-top: 1px solid var(--border);
        }
        .story-people-label {
          font-size: 12px; color: var(--text-tertiary); font-weight: 500;
        }
        .story-people button {
          font-size: 13px; font-weight: 500; color: var(--accent);
          padding: 4px 10px; border-radius: 6px;
          background: rgba(0,113,227,0.06);
          transition: background 0.15s;
        }
        .story-people button:hover { background: rgba(0,113,227,0.12); }
        .stories-empty {
          text-align: center; color: var(--text-tertiary); padding: 48px;
        }
      `}</style>
    </div>
  );
}
