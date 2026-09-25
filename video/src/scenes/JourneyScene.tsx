import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Backdrop } from "../Backdrop";
import { JOURNEY_STOPS } from "../data";
import { COLORS, bodyFont, displayFont } from "../theme";

const LINE_Y = 620;
const LINE_LEFT = 260;
const LINE_RIGHT = 1660;
const DRAW_START = 30;
const DRAW_END = 210;

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const stopX = (i: number) =>
  LINE_LEFT + ((LINE_RIGHT - LINE_LEFT) * i) / (JOURNEY_STOPS.length - 1);
const stopArrival = (i: number) =>
  DRAW_START + ((DRAW_END - DRAW_START) * i) / (JOURNEY_STOPS.length - 1);

export const JourneyScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill name="Journey scene">
      <Backdrop tint="rgba(80, 200, 120, 0.08)" />
      <Interactive.Div
        name="Headline"
        style={{
          position: "absolute",
          top: 130,
          width: "100%",
          textAlign: "center",
          fontFamily: displayFont,
          fontSize: 100,
          fontWeight: 700,
          color: COLORS.text,
          opacity: interpolate(frame, [0, 25], [0, 1], clamp),
        }}
      >
        The journey west
      </Interactive.Div>
      <div
        style={{
          position: "absolute",
          left: LINE_LEFT,
          top: LINE_Y - 3,
          width: LINE_RIGHT - LINE_LEFT,
          height: 6,
          borderRadius: 3,
          backgroundImage: `linear-gradient(90deg, ${JOURNEY_STOPS.map((s) => s.color).join(", ")})`,
          transformOrigin: "0% 50%",
          scale: interpolate(frame, [DRAW_START, DRAW_END], ["0 1", "1 1"], clamp),
        }}
      />
      {JOURNEY_STOPS.map((stop, i) => {
        const arrive = stopArrival(i);
        const above = i % 2 === 0;
        return (
          <div key={stop.place}>
            <div
              style={{
                position: "absolute",
                left: stopX(i) - 22,
                top: LINE_Y - 22,
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: COLORS.bg,
                border: `8px solid ${stop.color}`,
                boxSizing: "border-box",
                scale: interpolate(frame, [arrive - 5, arrive + 12], [0, 1], {
                  ...clamp,
                  easing: Easing.bezier(0.34, 1.56, 0.64, 1),
                }),
              }}
            />
            <div
              style={{
                position: "absolute",
                left: stopX(i) - 200,
                width: 400,
                top: above ? LINE_Y - 190 : LINE_Y + 60,
                textAlign: "center",
                opacity: interpolate(frame, [arrive, arrive + 20], [0, 1], clamp),
                translate: interpolate(
                  frame,
                  [arrive, arrive + 25],
                  [above ? "0px 20px" : "0px -20px", "0px 0px"],
                  { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) },
                ),
              }}
            >
              <div
                style={{
                  fontFamily: displayFont,
                  fontSize: 52,
                  fontWeight: 700,
                  color: COLORS.text,
                }}
              >
                {stop.place}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontFamily: bodyFont,
                  fontSize: 34,
                  color: stop.color,
                }}
              >
                {stop.note}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
