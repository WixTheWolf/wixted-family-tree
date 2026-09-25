import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { Backdrop } from "../Backdrop";
import { TREE_ROWS, type TreeRow } from "../data";
import { COLORS, bodyFont, displayFont } from "../theme";

// World layout (unscaled pixels). Row i is centred at y = i * ROW_H, x = 0.
const ROW_H = 330;
const CARD_W = 440;
const CARD_H = 210;
const COUPLE_GAP = 70;

// Timing: each generation holds the spotlight for STEP frames.
const FIRST = 20;
const STEP = 150;
const MOVE = 35;
const focusAt = (i: number) => FIRST + i * STEP;
const LAST = TREE_ROWS.length - 1;
const ZOOM_START = focusAt(LAST) + 140;
const ZOOM_END = ZOOM_START + 60;
export const TREE_SCENE_DURATION = ZOOM_END + 120;

// Camera: tree column sits left of the caption panel, then recentres for the overview.
const TREE_X = 560;
const OVERVIEW_SCALE = 0.44;
const OVERVIEW_Y = 540 - OVERVIEW_SCALE * ((LAST * ROW_H) / 2);

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const smooth = Easing.bezier(0.65, 0, 0.35, 1);

const cameraFrames = [0, ...TREE_ROWS.slice(1).flatMap((_, k) => [focusAt(k + 1) - MOVE, focusAt(k + 1)]), ZOOM_START, ZOOM_END];
const cameraY = [540, ...TREE_ROWS.slice(1).flatMap((_, k) => [540 - k * ROW_H, 540 - (k + 1) * ROW_H]), 540 - LAST * ROW_H, OVERVIEW_Y];

const rowOpacity = (frame: number, i: number) =>
  interpolate(frame, [focusAt(i) - 15, focusAt(i) + 10], [0, 1], clamp);

// Brightness keyframes for a row: dim once the camera moves on, and light
// back up for the overview. Uses brightness rather than opacity so the
// connector lines never show through a dimmed card.
const rowBrightness = (frame: number, i: number) => {
  if (i === LAST) {
    return 1;
  }
  return interpolate(
    frame,
    [focusAt(i + 1) - MOVE, focusAt(i + 1) - 10, ZOOM_START, ZOOM_START + 30],
    [1, 0.45, 0.45, 1],
    clamp,
  );
};

const PersonCard: React.FC<{
  name: string;
  dates: string;
  role: string;
  color: string;
  left: number;
  top: number;
  highlight: boolean;
}> = ({ name, dates, role, color, left, top, highlight }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width: CARD_W,
      height: CARD_H,
      boxSizing: "border-box",
      padding: "0 32px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 10,
      borderRadius: 22,
      backgroundColor: COLORS.card,
      border: `2px solid ${highlight ? COLORS.gold : COLORS.border}`,
      borderLeft: `10px solid ${color}`,
      boxShadow: highlight
        ? `0 0 60px rgba(197, 160, 89, 0.35)`
        : "0 20px 60px rgba(0, 0, 0, 0.55)",
    }}
  >
    <div
      style={{
        fontFamily: bodyFont,
        fontSize: 20,
        fontWeight: 600,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color,
      }}
    >
      {role}
    </div>
    <div
      style={{
        fontFamily: displayFont,
        fontSize: 40,
        fontWeight: 700,
        lineHeight: 1.1,
        color: COLORS.text,
      }}
    >
      {name}
    </div>
    <div style={{ fontFamily: bodyFont, fontSize: 28, color: COLORS.textSecondary }}>
      {dates}
    </div>
  </div>
);

const Row: React.FC<{ row: TreeRow; index: number }> = ({ row, index }) => {
  const frame = useCurrentFrame();
  const y = index * ROW_H;
  const isCouple = row.people.length === 2;
  const isFocus = index === LAST;

  return (
    <div
      style={{
        opacity: rowOpacity(frame, index),
        filter: `brightness(${rowBrightness(frame, index)})`,
        translate: interpolate(frame, [focusAt(index) - 15, focusAt(index) + 15], ["0px 30px", "0px 0px"], {
          ...clamp,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      {isCouple ? (
        <div
          style={{
            position: "absolute",
            left: -COUPLE_GAP / 2,
            top: y - 1.5,
            width: COUPLE_GAP,
            height: 3,
            backgroundColor: COLORS.gold,
          }}
        />
      ) : null}
      {row.people.map((person, p) => (
        <PersonCard
          key={person.name}
          name={person.name}
          dates={person.dates}
          role={person.role.replace(/^You · /, "")}
          color={row.eraColor}
          highlight={isFocus}
          top={y - CARD_H / 2}
          left={
            isCouple
              ? p === 0
                ? -COUPLE_GAP / 2 - CARD_W
                : COUPLE_GAP / 2
              : -CARD_W / 2
          }
        />
      ))}
    </div>
  );
};

// A couple's line of descent hangs from the marriage link between their cards;
// a single person's from the bottom edge of their card.
const rowBottom = (i: number) =>
  i * ROW_H + (TREE_ROWS[i].people.length === 2 ? 0 : CARD_H / 2);
const rowTop = (i: number) =>
  i * ROW_H - (TREE_ROWS[i].people.length === 2 ? 0 : CARD_H / 2);

const Connector: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const from = TREE_ROWS[index - 1].eraColor;
  const to = TREE_ROWS[index].eraColor;
  const top = rowBottom(index - 1);

  return (
    <div
      style={{
        position: "absolute",
        left: -2,
        top,
        width: 4,
        height: rowTop(index) - top,
        backgroundImage: `linear-gradient(${from}, ${to})`,
        transformOrigin: "50% 0%",
        scale: interpolate(frame, [focusAt(index) - MOVE, focusAt(index) - 5], ["1 0", "1 1"], {
          ...clamp,
          easing: smooth,
        }),
      }}
    />
  );
};

const CaptionPanel: React.FC<{ row: TreeRow; duration: number }> = ({
  row,
  duration,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        left: 1110,
        width: 730,
        justifyContent: "center",
        gap: 28,
        opacity: interpolate(frame, [0, 20, duration - 15, duration], [0, 1, 1, 0], clamp),
        translate: interpolate(frame, [0, 25], ["40px 0px", "0px 0px"], {
          ...clamp,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      <div
        style={{
          fontFamily: bodyFont,
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: row.eraColor,
        }}
      >
        {row.era}
      </div>
      <div
        style={{
          fontFamily: displayFont,
          fontSize: 76,
          fontWeight: 700,
          lineHeight: 1.08,
          color: COLORS.text,
        }}
      >
        {row.location}
      </div>
      <div
        style={{
          fontFamily: bodyFont,
          fontSize: 44,
          lineHeight: 1.35,
          color: COLORS.textSecondary,
        }}
      >
        {row.caption}
      </div>
    </AbsoluteFill>
  );
};

export const TreeScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill name="Tree scene">
      <Backdrop tint="rgba(74, 158, 255, 0.08)" />
      <Interactive.Div
        name="Camera"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transformOrigin: "0px 0px",
          translate: `${interpolate(frame, [ZOOM_START, ZOOM_END], [TREE_X, 960], {
            ...clamp,
            easing: smooth,
          })}px ${interpolate(frame, cameraFrames, cameraY, {
            ...clamp,
            easing: smooth,
          })}px`,
          scale: interpolate(frame, [ZOOM_START, ZOOM_END], [1, OVERVIEW_SCALE], {
            ...clamp,
            easing: smooth,
          }),
        }}
      >
        {TREE_ROWS.slice(1).map((_, k) => (
          <Connector key={k} index={k + 1} />
        ))}
        {TREE_ROWS.map((row, i) => (
          <Row key={row.people[0].name} row={row} index={i} />
        ))}
      </Interactive.Div>
      {TREE_ROWS.map((row, i) => {
        const duration = i < LAST ? STEP : ZOOM_START - focusAt(LAST) + 15;
        return (
          <Sequence
            key={row.people[0].name}
            name={`Caption: ${row.era}`}
            from={focusAt(i) - 15}
            durationInFrames={duration}
          >
            <CaptionPanel row={row} duration={duration} />
          </Sequence>
        );
      })}
      <Interactive.Div
        name="Overview label"
        style={{
          position: "absolute",
          right: 120,
          bottom: 120,
          width: 680,
          fontFamily: displayFont,
          fontSize: 64,
          lineHeight: 1.15,
          color: COLORS.text,
          textAlign: "right",
          opacity: interpolate(frame, [ZOOM_END - 10, ZOOM_END + 20], [0, 1], clamp),
        }}
      >
        The direct Wixted line, Tipperary to Whittier
      </Interactive.Div>
    </AbsoluteFill>
  );
};
