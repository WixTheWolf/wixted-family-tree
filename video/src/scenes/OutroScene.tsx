import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Backdrop } from "../Backdrop";
import { COLORS, bodyFont, displayFont } from "../theme";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill name="Outro scene">
      <Backdrop />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 40,
        }}
      >
        <Interactive.Div
          name="Headline"
          style={{
            fontFamily: displayFont,
            fontSize: 120,
            fontWeight: 700,
            color: COLORS.text,
            opacity: interpolate(frame, [0, 30], [0, 1], clamp),
            scale: interpolate(frame, [0, 150], [0.96, 1], {
              ...clamp,
              easing: Easing.out(Easing.quad),
              output: "perceptual-scale",
            }),
          }}
        >
          Every name is a story.
        </Interactive.Div>
        <Interactive.Div
          name="Credit"
          style={{
            fontFamily: bodyFont,
            fontSize: 40,
            color: COLORS.gold,
            opacity: interpolate(frame, [25, 55], [0, 1], clamp),
          }}
        >
          The Wixted Family Tree
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
