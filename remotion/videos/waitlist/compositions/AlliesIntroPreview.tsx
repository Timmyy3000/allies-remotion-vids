import React from "react";
import { AbsoluteFill } from "remotion";
import { CANVAS } from "../constants/layout";
import { COLORS } from "../constants/colors";
import { AlliesIntro } from "./AlliesIntro";

// The preview keeps the 4K scene's coordinate system and timing, but asks the
// browser to composite it at half-size for a lighter Studio playback surface.
export const PREVIEW_SCALE = 0.5;

export function AlliesIntroPreview() {
  return (
    <>
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.background,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: CANVAS.width,
            height: CANVAS.height,
            transform: `scale(${PREVIEW_SCALE})`,
            transformOrigin: "top left",
          }}
        >
          <AlliesIntro />
        </div>
      </AbsoluteFill>
    </>
  );
}
