import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Backdrop } from "../Backdrop";
import { BRANCHES, PERSON_COUNT } from "../data";
import { COLORS, bodyFont, displayFont } from "../theme";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const PER_COLUMN = Math.ceil(BRANCHES.length / 2);
const MAX_COUNT = Math.max(...BRANCHES.map((b) => b.count));
const BAR_MAX = 360;

export const BranchesScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill name="Branches scene">
      <Backdrop />
      <Interactive.Div
        name="Headline"
        style={{
          position: "absolute",
          top: 110,
          left: 160,
          fontFamily: displayFont,
          fontSize: 96,
          fontWeight: 700,
          color: COLORS.text,
          opacity: interpolate(frame, [0, 25], [0, 1], clamp),
        }}
      >
        {PERSON_COUNT} people · {BRANCHES.length} branches
      </Interactive.Div>
      {BRANCHES.map((branch, i) => {
        const col = Math.floor(i / PER_COLUMN);
        const rowIndex = i % PER_COLUMN;
        const start = 20 + i * 6;
        return (
          <div
            key={branch.id}
            style={{
              position: "absolute",
              left: 160 + col * 860,
              top: 300 + rowIndex * 96,
              display: "flex",
              alignItems: "center",
              gap: 28,
              opacity: interpolate(frame, [start, start + 15], [0, 1], clamp),
            }}
          >
            <div
              style={{
                width: 250,
                fontFamily: bodyFont,
                fontSize: 40,
                fontWeight: 600,
                color: COLORS.text,
              }}
            >
              {branch.label}
            </div>
            <div
              style={{
                width: (BAR_MAX * branch.count) / MAX_COUNT,
                height: 34,
                borderRadius: 17,
                backgroundColor: COLORS.gold,
                transformOrigin: "0% 50%",
                scale: interpolate(frame, [start, start + 30], ["0 1", "1 1"], {
                  ...clamp,
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                }),
              }}
            />
            <div
              style={{
                fontFamily: bodyFont,
                fontSize: 36,
                color: COLORS.textSecondary,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {branch.count}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
