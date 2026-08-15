import React from "react";
import { Composition, useCurrentFrame } from "remotion";
import { TYPOGRAPHY, HEADLINE_LAYOUT, CANVAS } from "../constants/layout";
import { FONT_STYLE } from "../styles/font";

export function MeasureComp() {
  const frame = useCurrentFrame();

  React.useEffect(() => {
    const meetEl = document.getElementById("measure-meet");
    const yourEl = document.getElementById("measure-your");
    const alliesEl = document.getElementById("measure-allies");
    const containerEl = document.getElementById("measure-container");

    if (meetEl && yourEl && alliesEl && containerEl) {
      const meetRect = meetEl.getBoundingClientRect();
      const yourRect = yourEl.getBoundingClientRect();
      const alliesRect = alliesEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();

      console.log("=== EXACT GEOMETRY MEASUREMENTS ===");
      console.log("Meet width:", meetRect.width);
      console.log("Your width:", yourRect.width);
      console.log("Allies width:", alliesRect.width);
      console.log("WordGap:", HEADLINE_LAYOUT.wordGap);
      console.log("LogoShiftDistance:", HEADLINE_LAYOUT.logoShiftDistance);
      console.log("LogoWidth:", HEADLINE_LAYOUT.logoWidth);
      console.log("Container width:", containerRect.width);

      const exitWidth = meetRect.width + HEADLINE_LAYOUT.wordGap + yourRect.width;
      const brandWidth = HEADLINE_LAYOUT.logoShiftDistance + alliesRect.width;
      const totalWidth = exitWidth + HEADLINE_LAYOUT.wordGap + brandWidth;
      const A = exitWidth + HEADLINE_LAYOUT.wordGap; // meet + gap + your + gap
      const brandShiftX = -A / 2;

      console.log("Exit group width (Meet + gap + your):", exitWidth);
      console.log("Brand group width (LogoSlot + allies):", brandWidth);
      console.log("Total width calculated:", totalWidth);
      console.log("Brand shift required for center:", brandShiftX);
    }
  }, []);

  return (
    <div
      style={{
        width: CANVAS.width,
        height: CANVAS.height,
        position: "relative",
        fontFamily: TYPOGRAPHY.fontFamily,
        fontSize: TYPOGRAPHY.fontSize,
        fontWeight: TYPOGRAPHY.fontWeight,
        letterSpacing: `${TYPOGRAPHY.letterSpacing}px`,
        lineHeight: TYPOGRAPHY.lineHeight,
      }}
    >
      <style>{FONT_STYLE}</style>
      <div
        id="measure-container"
        style={{
          display: "inline-flex",
          alignItems: "center",
          whiteSpace: "nowrap",
        }}
      >
        <span id="measure-meet">Meet</span>
        <span style={{ width: HEADLINE_LAYOUT.wordGap }}>&nbsp;</span>
        <span id="measure-your">your</span>
        <span style={{ width: HEADLINE_LAYOUT.wordGap }}>&nbsp;</span>
        <div style={{ width: HEADLINE_LAYOUT.logoShiftDistance }}>&nbsp;</div>
        <span id="measure-allies">allies</span>
      </div>
    </div>
  );
}
