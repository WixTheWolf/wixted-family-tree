import { motion } from "framer-motion";
import type { Story } from "../types";

interface Props {
  stories: Story[];
  onViewAll: () => void;
  onSelectStory: (story: Story) => void;
}

export default function FeaturedStories({ stories, onViewAll, onSelectStory }: Props) {
  const featured = stories
    .filter((s) => s.tags?.includes("family-history") || s.tags?.includes("ancestry") || s.tags?.includes("research"))
    .slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="featured-stories">
      <div className="featured-stories-head">
        <div>
          <p className="section-eyebrow">From the workbook</p>
          <h2 className="section-title">Family stories</h2>
        </div>
        <button type="button" className="btn-secondary" onClick={onViewAll}>
          All stories
        </button>
      </div>
      <div className="featured-stories-grid">
        {featured.map((story, i) => (
          <motion.button
            key={story.id}
            type="button"
            className="featured-story-card"
            onClick={() => onSelectStory(story)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="featured-story-tag">{story.branch}</span>
            <h3>{story.title}</h3>
            <p>{story.body.slice(0, 160)}{story.body.length > 160 ? "…" : ""}</p>
          </motion.button>
        ))}
      </div>
      <style>{`
        .featured-stories {
          max-width: 1200px; margin: 0 auto; padding: 80px 24px;
        }
        .featured-stories-head {
          display: flex; justify-content: space-between; align-items: flex-end;
          gap: 24px; margin-bottom: 32px; flex-wrap: wrap;
        }
        .featured-stories-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;
        }
        .featured-story-card {
          text-align: left; padding: 28px; border-radius: var(--radius-sm);
          background: var(--bg-card); border: 1px solid var(--border);
          transition: border-color 0.2s, transform 0.25s var(--ease-out-expo);
        }
        .featured-story-card:hover {
          border-color: var(--border-strong); transform: translateY(-3px);
        }
        .featured-story-tag {
          display: inline-block; font-size: 10px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.08em;
          color: var(--accent); margin-bottom: 12px;
        }
        .featured-story-card h3 {
          font-family: var(--font-display); font-size: 20px; font-weight: 600;
          letter-spacing: -0.02em; margin-bottom: 10px; line-height: 1.25;
        }
        .featured-story-card p {
          font-size: 14px; line-height: 1.55; color: var(--text-secondary);
        }
      `}</style>
    </section>
  );
}
