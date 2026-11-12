import React from "react";
import {Composition} from "remotion";
import {Episode} from "./Episode";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Episode"
      component={Episode}
      durationInFrames={18300}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{voiceover:false,aiVisuals:false}}
    />
  );
};
