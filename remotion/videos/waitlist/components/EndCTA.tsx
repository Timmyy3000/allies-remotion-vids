import React from "react";
import { interpolate, Easing } from "remotion";
import { CTA_LAYOUT, TYPOGRAPHY } from "../constants/layout";

export interface EndCTAProps {
  textStartFrame: number;
  urlStartFrame: number;
  currentFrame: number;
}

/**
 * End CTA & Waitlist URL Component
 *
 * Renders:
 * 1. "Come meet your ally" in crisp #121212 black.
 * 2. "yourallies.io" in signature Allies Orange (#FF5800).
 */
export function EndCTA({
  textStartFrame,
  urlStartFrame,
  currentFrame,
}: EndCTAProps) {
  if (currentFrame < textStartFrame) {
    return null;
  }

  const {
    centerX,
    mainTextY,
    mainFontSize,
    mainFontWeight,
    mainLetterSpacing,
    mainText,
    urlY,
    urlFontSize,
    urlFontWeight,
    urlLetterSpacing,
    urlText,
    urlColor,
  } = CTA_LAYOUT;

  // 1. Main CTA Text reveal
  const textAge = currentFrame - textStartFrame;
  const textProgress = interpolate(textAge, [0, 24], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textOpacity = interpolate(textProgress, [0, 0.4, 1], [0, 0.85, 1]);
  const textBlur = interpolate(textProgress, [0, 1], [16, 0]);
  const textYOffset = interpolate(textProgress, [0, 1], [14, 0]);

  // 2. Waitlist URL reveal (starts slightly after)
  const urlAge = currentFrame - urlStartFrame;
  const urlProgress = urlAge >= 0
    ? interpolate(urlAge, [0, 22], [0, 1], {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  const urlOpacity = interpolate(urlProgress, [0, 0.4, 1], [0, 0.85, 1]);
  const urlBlur = interpolate(urlProgress, [0, 1], [14, 0]);
  const urlYOffset = interpolate(urlProgress, [0, 1], [10, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: centerX,
        top: 0,
        width: "100%",
        height: "100%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 45,
      }}
    >
      {/* 1. Main Headline: "Come meet your ally" */}
      <div
        style={{
          position: "absolute",
          top: mainTextY,
          transform: `translateY(-50%) translateY(${textYOffset.toFixed(2)}px)`,
          fontFamily: TYPOGRAPHY.fontFamily,
          fontSize: mainFontSize,
          fontWeight: mainFontWeight,
          letterSpacing: `${mainLetterSpacing}px`,
          color: "#121212",
          opacity: textOpacity,
          filter: textBlur > 0.05 ? `blur(${textBlur.toFixed(2)}px)` : "none",
          whiteSpace: "nowrap",
          willChange: "transform, opacity, filter",
        }}
      >
        {mainText}
      </div>

      {/* 2. Waitlist URL: "yourallies.io" */}
      {urlAge >= 0 && (
        <div
          style={{
            position: "absolute",
            top: urlY,
            transform: `translateY(-50%) translateY(${urlYOffset.toFixed(2)}px)`,
            fontFamily: TYPOGRAPHY.fontFamily,
            fontSize: urlFontSize,
            fontWeight: urlFontWeight,
            letterSpacing: `${urlLetterSpacing}px`,
            color: urlColor,
            opacity: urlOpacity,
            filter: urlBlur > 0.05 ? `blur(${urlBlur.toFixed(2)}px)` : "none",
            whiteSpace: "nowrap",
            willChange: "transform, opacity, filter",
          }}
        >
          {urlText}
        </div>
      )}
    </div>
  );
}
