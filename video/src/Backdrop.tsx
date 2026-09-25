import { AbsoluteFill } from "remotion";
import { COLORS } from "./theme";

export const Backdrop: React.FC<{ tint?: string }> = ({
  tint = "rgba(197, 160, 89, 0.10)",
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        backgroundImage: `radial-gradient(ellipse 70% 60% at 50% 40%, ${tint}, transparent 70%)`,
      }}
    />
  );
};
