import { motion } from "framer-motion";
import type { Person } from "../types";
import PersonAvatar from "./PersonAvatar";
import WickstedArms from "./WickstedArms";
import { getPersonAge } from "../utils/ages";

interface Props {
  person: Person;
  personCount: number;
  storyCount: number;
  galleryCount: number;
  onExplore: () => void;
  onGallery: () => void;
}

export default function HeroSection({
  person,
  personCount,
  storyCount,
  galleryCount,
  onExplore,
  onGallery,
}: Props) {
  const age = getPersonAge(person);
  const location =
    person.notes.find((n) => /Whittier|CA|California/i.test(n)) ?? "Whittier, California";

  return (
    <section className="hero">
      <div
        className="hero-photo"
        aria-hidden
        style={{
          backgroundImage:
            "url(https://www.wikitree.com/photo.php/6/64/Wixted-3.png)",
        }}
      />
      <div className="hero-gradient" aria-hidden />
      <div className="hero-grid" aria-hidden />

      <div className="hero-content">
        <motion.div
          className="hero-crest"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden
        >
          <WickstedArms size={72} showCrest />
        </motion.div>

        <motion.p
          className="hero-eyebrow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.04, ease: [0.16, 1, 0.3, 1] }}
        >
          Wicksted of Nantwich · Ten generations · Ireland to California
        </motion.p>

        <motion.div
          className="hero-title-block"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        >
          <PersonAvatar person={person} size={88} />
          <h1>
            {person.name.split(" ").map((word, i) => (
              <span key={i} className={i === person.name.split(" ").length - 1 ? "hero-accent" : ""}>
                {word}{" "}
              </span>
            ))}
          </h1>
        </motion.div>

        <motion.p
          className="hero-tagline"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          {age && <span>{age}</span>}
          {location}
          <span className="hero-dot">·</span>
          {personCount} relatives
          <span className="hero-dot">·</span>
          {storyCount} stories
          <span className="hero-dot">·</span>
          {galleryCount} photos
        </motion.p>

        <motion.p
          className="hero-lede"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          Tipperary to Lambeth. Corning to Rochester. Phoenix to Whittier.
          One family line — built to explore, not just to read.
        </motion.p>

        <motion.div
          className="hero-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
        >
          <button type="button" className="btn-primary" onClick={onExplore}>
            Explore the tree
          </button>
          <button type="button" className="btn-secondary" onClick={onGallery}>
            View gallery →
          </button>
        </motion.div>

        <motion.div
          className="hero-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.8 }}
        >
          {[
            { label: "Patriarch", value: "1796", sub: "Thomas James Wixted" },
            { label: "Migration", value: "1963", sub: "Rochester → Phoenix" },
            { label: "Home", value: "CA", sub: "Whittier generation" },
          ].map((stat) => (
            <div key={stat.label} className="hero-stat">
              <span className="hero-stat-value">{stat.value}</span>
              <span className="hero-stat-label">{stat.label}</span>
              <span className="hero-stat-sub">{stat.sub}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <button type="button" className="hero-scroll" onClick={onExplore} aria-label="Scroll to explore">
        <span className="hero-scroll-line" />
      </button>

      <style>{`
        .hero {
          position: relative;
          min-height: calc(100vh - var(--header-h));
          margin-top: var(--header-h);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px 80px;
          overflow: hidden;
        }
        .hero-photo {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center 30%;
          opacity: 0.14;
          filter: saturate(0.6) sepia(0.25);
          pointer-events: none;
        }
        .hero-gradient {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 50% at 50% 100%, rgba(255, 149, 0, 0.12) 0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 80% 20%, rgba(26, 58, 107, 0.14) 0%, transparent 50%),
            radial-gradient(ellipse 35% 25% at 15% 25%, rgba(197, 160, 89, 0.08) 0%, transparent 45%);
          pointer-events: none;
        }
        .hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 70%);
          pointer-events: none;
        }
        .hero-content {
          position: relative;
          max-width: 980px;
          width: 100%;
          text-align: center;
        }
        .hero-crest {
          margin-bottom: 8px;
          opacity: 0.92;
          filter: drop-shadow(0 12px 32px rgba(26, 58, 107, 0.35));
        }
        .hero-eyebrow {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 20px;
        }
        .hero-title-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          margin-bottom: 16px;
        }
        .hero-title-block h1 {
          font-family: var(--font-display);
          font-size: clamp(40px, 8vw, 72px);
          font-weight: 600;
          letter-spacing: -0.04em;
          line-height: 1.02;
        }
        .hero-accent {
          background: linear-gradient(135deg, var(--text) 0%, var(--accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-tagline {
          font-size: clamp(15px, 2vw, 19px);
          color: var(--text-secondary);
          margin-bottom: 20px;
          letter-spacing: -0.01em;
        }
        .hero-dot { margin: 0 10px; opacity: 0.4; }
        .hero-lede {
          font-size: clamp(17px, 2.2vw, 21px);
          line-height: 1.45;
          color: var(--text-secondary);
          max-width: 640px;
          margin: 0 auto 36px;
          letter-spacing: -0.02em;
        }
        .hero-cta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px 20px;
          justify-content: center;
          margin-bottom: 56px;
        }
        .hero-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          max-width: 720px;
          margin: 0 auto;
        }
        .hero-stat {
          padding: 20px 16px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          text-align: center;
          transition: transform 0.3s var(--ease-out-expo), border-color 0.2s;
        }
        .hero-stat:hover {
          transform: translateY(-4px);
          border-color: var(--border-strong);
        }
        .hero-stat-value {
          display: block;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.03em;
          margin-bottom: 4px;
        }
        .hero-stat-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-tertiary);
        }
        .hero-stat-sub {
          display: block;
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 6px;
        }
        .hero-scroll {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          padding: 12px;
        }
        .hero-scroll-line {
          display: block;
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, var(--text-tertiary), transparent);
          animation: scroll-hint 2s ease-in-out infinite;
        }
        @media (max-width: 640px) {
          .hero-stats { grid-template-columns: 1fr; }
          .hero-dot { display: none; }
          .hero-tagline span { display: block; margin: 4px 0; }
        }
      `}</style>
    </section>
  );
}
