import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Backdrop } from "../Backdrop";
import { COLORS, bodyFont, displayFont } from "../theme";

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill name="Title scene">
      <Backdrop />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 36,
        }}
      >
        <Interactive.Div
          name="Eyebrow"
          style={{
            fontFamily: bodyFont,
            fontSize: 34,
            fontWeight: 600,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: COLORS.gold,
            opacity: interpolate(frame, [0, 25], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          A family history
        </Interactive.Div>
        <Interactive.Div
          name="Headline"
          style={{
            fontFamily: displayFont,
            fontSize: 168,
            fontWeight: 700,
            color: COLORS.text,
            lineHeight: 1,
            opacity: interpolate(frame, [10, 40], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            translate: interpolate(frame, [10, 50], ["0px 40px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          The Wixted Family
        </Interactive.Div>
        <Interactive.Div
          name="Rule"
          style={{
            height: 3,
            width: 520,
            backgroundColor: COLORS.gold,
            scale: interpolate(frame, [30, 65], ["0 1", "1 1"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        />
        <Interactive.Div
          name="Subtitle"
          style={{
            fontFamily: bodyFont,
            fontSize: 58,
            color: COLORS.textSecondary,
            opacity: interpolate(frame, [45, 75], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          From Tipperary to California
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
