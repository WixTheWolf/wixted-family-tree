import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Backdrop } from "../Backdrop";
import { HERITAGE } from "../data";
import { COLORS, bodyFont, displayFont } from "../theme";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const BAR_LEFT = 160;
const BAR_WIDTH = 1600;

export const HeritageScene: React.FC = () => {
  const frame = useCurrentFrame();
  let offset = 0;

  return (
    <AbsoluteFill name="Heritage scene">
      <Backdrop />
      <Interactive.Div
        name="Headline"
        style={{
          position: "absolute",
          top: 170,
          width: "100%",
          textAlign: "center",
          fontFamily: displayFont,
          fontSize: 100,
          fontWeight: 700,
          color: COLORS.text,
          opacity: interpolate(frame, [0, 25], [0, 1], clamp),
        }}
      >
        Matthew's heritage
      </Interactive.Div>
      {HERITAGE.map((part, i) => {
        const left = BAR_LEFT + offset * BAR_WIDTH;
        const width = part.share * BAR_WIDTH;
        offset += part.share;
        const start = 25 + i * 18;
        return (
          <div key={part.label}>
            <div
              style={{
                position: "absolute",
                left,
                top: 470,
                width: width - 8,
                height: 90,
                borderRadius: 16,
                backgroundColor: part.color,
                transformOrigin: "0% 50%",
                scale: interpolate(frame, [start, start + 25], ["0 1", "1 1"], {
                  ...clamp,
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                }),
              }}
            />
            <div
              style={{
                position: "absolute",
                left,
                top: 610,
                width: width - 8,
                opacity: interpolate(frame, [start + 10, start + 30], [0, 1], clamp),
              }}
            >
              <div
                style={{
                  fontFamily: displayFont,
                  fontSize: 76,
                  fontWeight: 700,
                  color: part.color,
                }}
              >
                {Math.round(part.share * 1000) / 10}%
              </div>
              <div
                style={{
                  fontFamily: bodyFont,
                  fontSize: 44,
                  color: COLORS.text,
                }}
              >
                {part.label}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
