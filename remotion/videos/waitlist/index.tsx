import React from "react";
import { Composition, Folder } from "remotion";

import { AlliesIntro } from "./compositions/AlliesIntro";
import { AlliesIntroPreview } from "./compositions/AlliesIntroPreview";
import { AllyCharacterCompositions } from "./compositions/AllyCharacterComps";
import { MeasureComp } from "./compositions/MeasureComp";
import { CANVAS } from "./constants/layout";

const PREVIEW_CANVAS = {
  width: 1920,
  height: 1080,
};

/**
 * All compositions owned by the waitlist video.
 *
 * Keep this registry inside the video folder so a future video can have its
 * own registry without importing another video's implementation details.
 */
export function WaitlistCompositions() {
  return (
    <>
      <Composition
        id="Waitlist-AlliesIntro"
        component={AlliesIntro}
        durationInFrames={CANVAS.durationInFrames}
        fps={CANVAS.fps}
        width={CANVAS.width}
        height={CANVAS.height}
      />
      <Folder name="Preview">
        <Composition
          id="Waitlist-AlliesIntro-Preview"
          component={AlliesIntroPreview}
          durationInFrames={CANVAS.durationInFrames}
          fps={CANVAS.fps}
          width={PREVIEW_CANVAS.width}
          height={PREVIEW_CANVAS.height}
        />
      </Folder>
      <Composition
        id="Waitlist-MeasureComp"
        component={MeasureComp}
        durationInFrames={10}
        fps={60}
        width={CANVAS.width}
        height={CANVAS.height}
      />
      <AllyCharacterCompositions />
    </>
  );
}
