/** Authentic Wicksted/Wixted arms — Cheshire Herald's Visitation, 1613. */
interface Props {
  size?: number;
  showCrest?: boolean;
  className?: string;
  title?: string;
}

export default function WickstedArms({
  size = 120,
  showCrest = false,
  className,
  title = "Wicksted of Nantwich — Argent, on a bend Azure, between three Cornish choughs proper, as many garbs Or",
}: Props) {
  const h = showCrest ? size * 1.22 : size;

  return (
    <svg
      className={className}
      width={size}
      height={h}
      viewBox={showCrest ? "0 0 100 122" : "0 0 100 115"}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      {showCrest && (
        <g transform="translate(50, 14)">
          <ellipse cx="0" cy="0" rx="14" ry="4" fill="#c5a059" opacity="0.9" />
          <path
            d="M-6 -2 L6 -2 L4 8 L-4 8 Z"
            fill="#c5a059"
            stroke="#8a6d2f"
            strokeWidth="0.5"
          />
          <path
            d="M-8 2 Q-12 8 -6 14 Q-2 10 0 6 Q2 10 6 14 Q12 8 8 2"
            fill="none"
            stroke="#2d6a4f"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M8 2 Q12 8 6 14 Q2 10 0 6 Q-2 10 -6 14 Q-12 8 -8 2"
            fill="none"
            stroke="#2d6a4f"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>
      )}
      <path
        d="M50 8 L92 28 L92 88 L50 108 L8 88 L8 28 Z"
        fill="#f4f1ea"
        stroke="#c5a059"
        strokeWidth="2"
        transform={showCrest ? "translate(0, 10)" : undefined}
      />
      <g transform={showCrest ? "translate(0, 10)" : undefined}>
        <path d="M22 22 L78 94" stroke="#1a3a6b" strokeWidth="14" strokeLinecap="round" />
        <g fill="#c5a059" stroke="#8a6d2f" strokeWidth="0.4">
          <path d="M38 48 L42 38 L46 48 L42 56 Z" />
          <path d="M46 58 L50 48 L54 58 L50 66 Z" />
          <path d="M54 68 L58 58 L62 68 L58 76 Z" />
        </g>
        <g>
          <Chough cx={32} cy={36} />
          <Chough cx={68} cy={36} />
          <Chough cx={50} cy={82} />
        </g>
      </g>
    </svg>
  );
}

function Chough({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <ellipse cx="0" cy="2" rx="7" ry="5" fill="#1a1a1a" />
      <circle cx="4" cy="-1" r="3.5" fill="#1a1a1a" />
      <path d="M7 -1 L10 0 L7 1 Z" fill="#c0392b" />
      <line x1="-3" y1="6" x2="-3" y2="9" stroke="#c0392b" strokeWidth="1.2" />
      <line x1="3" y1="6" x2="3" y2="9" stroke="#c0392b" strokeWidth="1.2" />
    </g>
  );
}

export const WICKSTED_ARMS_BLAZON =
  "Argent, on a bend Azure, between three Cornish choughs proper, as many garbs Or";

export const WICKSTED_CREST_BLAZON =
  "On a wreath, a garb Or entwined by two serpents proper (granted to John Wicksteed, 1607)";
