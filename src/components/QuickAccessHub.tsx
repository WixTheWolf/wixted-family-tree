import { motion } from "framer-motion";

export type AppView =
  | "explore"
  | "directory"
  | "stories"
  | "cemetery"
  | "archives"
  | "gallery"
  | "contribute";

interface HubItem {
  id: AppView | "inner-circle";
  title: string;
  subtitle: string;
  count?: number | string;
  accent: string;
}

interface Props {
  counts: {
    people: number;
    stories: number;
    cemetery: number;
    archives: number;
    gallery: number;
    contributions: number;
  };
  onNavigate: (view: AppView) => void;
  onInnerCircle?: () => void;
}

export default function QuickAccessHub({ counts, onNavigate, onInnerCircle }: Props) {
  const items: HubItem[] = [
    {
      id: "explore",
      title: "Family tree",
      subtitle: "Interactive branches from Tipperary to California",
      count: counts.people,
      accent: "linear-gradient(145deg, #1a3a6b 0%, #0d1f3c 100%)",
    },
    {
      id: "directory",
      title: "Directory",
      subtitle: "Find anyone by name across all branches",
      count: counts.people,
      accent: "linear-gradient(145deg, #2b2b2d 0%, #161617 100%)",
    },
    {
      id: "gallery",
      title: "Gallery",
      subtitle: "Photos, documents, and family artifacts",
      count: counts.gallery,
      accent: "linear-gradient(145deg, #3d2a14 0%, #1a1208 100%)",
    },
    {
      id: "stories",
      title: "Stories",
      subtitle: "Research notes, obituaries, and narratives",
      count: counts.stories,
      accent: "linear-gradient(145deg, #1f2937 0%, #0f1419 100%)",
    },
    {
      id: "archives",
      title: "Archives",
      subtitle: "Verified links to census, cemetery, and library records",
      count: counts.archives,
      accent: "linear-gradient(145deg, #1a2332 0%, #0d1117 100%)",
    },
    {
      id: "cemetery",
      title: "Cemetery",
      subtitle: "Burial locations and workbook grave references",
      count: counts.cemetery,
      accent: "linear-gradient(145deg, #252525 0%, #121212 100%)",
    },
    {
      id: "contribute",
      title: "Add photos",
      subtitle: "Upload images and attach them to relatives",
      count: counts.contributions,
      accent: "linear-gradient(145deg, #2a1a3d 0%, #140d1f 100%)",
    },
    {
      id: "inner-circle",
      title: "Inner circle",
      subtitle: "Matthew's parents, brothers, and closest relatives",
      accent: "linear-gradient(145deg, #3d2808 0%, #1a1408 100%)",
    },
  ];

  const handleClick = (item: HubItem) => {
    if (item.id === "inner-circle") {
      onInnerCircle?.();
      return;
    }
    onNavigate(item.id);
  };

  return (
    <section className="quick-hub" aria-label="Explore the family tree">
      <div className="quick-hub-inner">
        <header className="quick-hub-head">
          <p className="section-eyebrow">Browse</p>
          <h2 className="section-title">Everything in one place</h2>
          <p className="section-lede quick-hub-lede">
            Pick a section — same as the menu above. No digging required.
          </p>
        </header>

        <div className="quick-hub-grid">
          {items.map((item, i) => (
            <motion.button
              key={item.id}
              type="button"
              className="quick-hub-card"
              style={{ background: item.accent }}
              onClick={() => handleClick(item)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.04, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="quick-hub-card-top">
                {item.count !== undefined && (
                  <span className="quick-hub-count">{item.count}</span>
                )}
              </span>
              <span className="quick-hub-card-title">{item.title}</span>
              <span className="quick-hub-card-sub">{item.subtitle}</span>
              <span className="quick-hub-card-link">Open</span>
            </motion.button>
          ))}
        </div>
      </div>

      <style>{`
        .quick-hub {
          padding: 64px 24px 80px;
          background: var(--bg);
        }
        .quick-hub-inner {
          max-width: 1080px;
          margin: 0 auto;
        }
        .quick-hub-lede {
          margin-top: 12px;
          max-width: 480px;
        }
        .quick-hub-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-top: 40px;
        }
        .quick-hub-card {
          text-align: left;
          padding: 24px 22px 20px;
          min-height: 168px;
          border-radius: var(--radius);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.35s var(--ease-out-expo), border-color 0.25s;
        }
        .quick-hub-card:hover {
          box-shadow: var(--shadow-lg);
          border-color: rgba(255, 255, 255, 0.16);
        }
        .quick-hub-card-top {
          min-height: 28px;
          margin-bottom: auto;
        }
        .quick-hub-count {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: -0.02em;
          border-radius: var(--radius-pill);
          background: rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.92);
        }
        .quick-hub-card-title {
          display: block;
          font-size: 20px;
          font-weight: 600;
          letter-spacing: -0.03em;
          margin-bottom: 6px;
        }
        .quick-hub-card-sub {
          display: block;
          font-size: 13px;
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.65);
          margin-bottom: 14px;
        }
        .quick-hub-card-link {
          font-size: 14px;
          font-weight: 600;
          color: var(--accent-link);
        }
        @media (max-width: 960px) {
          .quick-hub-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 520px) {
          .quick-hub { padding: 48px 16px 64px; }
          .quick-hub-grid { grid-template-columns: 1fr; }
          .quick-hub-card { min-height: 140px; }
        }
      `}</style>
    </section>
  );
}
