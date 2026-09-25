import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { BranchesScene } from "./scenes/BranchesScene";
import { HeritageScene } from "./scenes/HeritageScene";
import { JourneyScene } from "./scenes/JourneyScene";
import { OutroScene } from "./scenes/OutroScene";
import { TitleScene } from "./scenes/TitleScene";
import { TREE_SCENE_DURATION, TreeScene } from "./scenes/TreeScene";

export const SCENES = {
  title: 150,
  tree: TREE_SCENE_DURATION,
  journey: 300,
  branches: 240,
  heritage: 210,
  outro: 150,
};

const TRANSITION = 20;

export const FAMILY_TREE_DURATION =
  Object.values(SCENES).reduce((sum, d) => sum + d, 0) -
  TRANSITION * (Object.keys(SCENES).length - 1);

const Fade = () => (
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: TRANSITION })}
  />
);

export const FamilyTreeVideo: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence name="Title" durationInFrames={SCENES.title}>
      <TitleScene />
    </TransitionSeries.Sequence>
    {Fade()}
    <TransitionSeries.Sequence name="Tree" durationInFrames={SCENES.tree}>
      <TreeScene />
    </TransitionSeries.Sequence>
    {Fade()}
    <TransitionSeries.Sequence name="Journey" durationInFrames={SCENES.journey}>
      <JourneyScene />
    </TransitionSeries.Sequence>
    {Fade()}
    <TransitionSeries.Sequence name="Branches" durationInFrames={SCENES.branches}>
      <BranchesScene />
    </TransitionSeries.Sequence>
    {Fade()}
    <TransitionSeries.Sequence name="Heritage" durationInFrames={SCENES.heritage}>
      <HeritageScene />
    </TransitionSeries.Sequence>
    {Fade()}
    <TransitionSeries.Sequence name="Outro" durationInFrames={SCENES.outro}>
      <OutroScene />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
