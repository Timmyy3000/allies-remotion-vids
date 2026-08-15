import React from "react";
import { Composition } from "remotion";
import { AlliesIntro } from "./compositions/AlliesIntro";
import { AllyCharacterCompositions } from "./compositions/AllyCharacterComps";
import { MeasureComp } from "./compositions/MeasureComp";
import { CANVAS } from "./constants/layout";

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="AlliesIntro"
        component={AlliesIntro}
        durationInFrames={CANVAS.durationInFrames}
        fps={CANVAS.fps}
        width={CANVAS.width}
        height={CANVAS.height}
      />
      <Composition
        id="MeasureComp"
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

