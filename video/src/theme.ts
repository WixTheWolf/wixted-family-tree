import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are bundled in public/fonts (Google Fonts, SIL Open Font License) so
// renders don't depend on network access. Both files are variable fonts.
export const bodyFont = "Inter";
export const displayFont = "Playfair Display";

loadFont({ family: bodyFont, url: staticFile("fonts/Inter.woff2"), weight: "100 900" });
loadFont({
  family: displayFont,
  url: staticFile("fonts/PlayfairDisplay.woff2"),
  weight: "400 900",
});

// Mirrors the site palette in ../src/index.css
export const COLORS = {
  bg: "#000000",
  card: "#161617",
  text: "#f5f5f7",
  textSecondary: "#a1a1a6",
  textTertiary: "#6e6e73",
  gold: "#c5a059",
  border: "rgba(255, 255, 255, 0.14)",
};

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
