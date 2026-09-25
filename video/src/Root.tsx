import { Composition, Folder } from "remotion";
import { FAMILY_TREE_DURATION, FamilyTreeVideo, SCENES } from "./FamilyTreeVideo";
import { BranchesScene } from "./scenes/BranchesScene";
import { HeritageScene } from "./scenes/HeritageScene";
import { JourneyScene } from "./scenes/JourneyScene";
import { OutroScene } from "./scenes/OutroScene";
import { TitleScene } from "./scenes/TitleScene";
import { TreeScene } from "./scenes/TreeScene";
import { FPS, HEIGHT, WIDTH } from "./theme";

const size = { fps: FPS, width: WIDTH, height: HEIGHT };

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="FamilyTree-Scenes">
        <Composition id="Title" component={TitleScene} durationInFrames={SCENES.title} {...size} />
        <Composition id="Tree" component={TreeScene} durationInFrames={SCENES.tree} {...size} />
        <Composition id="Journey" component={JourneyScene} durationInFrames={SCENES.journey} {...size} />
        <Composition id="Branches" component={BranchesScene} durationInFrames={SCENES.branches} {...size} />
        <Composition id="Heritage" component={HeritageScene} durationInFrames={SCENES.heritage} {...size} />
        <Composition id="Outro" component={OutroScene} durationInFrames={SCENES.outro} {...size} />
      </Folder>
      <Composition
        id="FamilyTree"
        component={FamilyTreeVideo}
        durationInFrames={FAMILY_TREE_DURATION}
        {...size}
      />
    </>
  );
};
