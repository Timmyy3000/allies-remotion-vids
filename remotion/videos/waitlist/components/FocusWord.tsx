import React from "react";
import { Easing, interpolate } from "remotion";

// Exact cushion cubic-bezier from generative-loaders: [0.22, 0.65, 0.3, 1]
const cushionEase = Easing.bezier(0.22, 0.65, 0.3, 1);

interface FocusWordProps {
  text: string;
  startFrame: number;
  currentFrame: number;
  color?: string;
  speed?: number; // default 1.15 matching onboarding speed
  blurScale?: number; // default 5.33 for 4K (2px at 72px * 2.6667)
  exitProgress?: number; // 0 (fully visible & focused) -> 1 (fully unresolved & dissolved)
  wordIndex?: number; // 0 for "Meet", 1 for "your", 2 for "allies"
  style?: React.CSSProperties;
}

export function FocusWord({
  text,
  startFrame,
  currentFrame,
  color = "#121212",
  speed = 1.15,
  blurScale = 5.33,
  exitProgress = 0,
  wordIndex = 0,
  style = {},
}: FocusWordProps) {
  const characters = Array.from(text);
  const isStarted = currentFrame >= startFrame;

  // Exact duration from generative-loaders: 0.28s / speed at 60fps
  const durationFrames = (0.28 / speed) * 60; // ~14.6 frames

  return (
    <span
      className="focus-word"
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: "100%",
        lineHeight: 1,
        color,
        userSelect: "none",
        ...style,
      }}
    >
      {characters.map((char, index) => {
        if (!isStarted) {
          // Keep layout space reserved before word triggers
          return (
            <span
              key={index}
              style={{
                display: "inline-block",
                lineHeight: 1,
                visibility: "hidden",
              }}
            >
              {char}
            </span>
          );
        }

        // --- 1. ENTRANCE FOCUS RESOLUTION (0 -> 1) ---
        const delaySeconds = Math.min(0.035, index * 0.005) / speed;
        const delayFrames = delaySeconds * 60;
        const charStart = startFrame + delayFrames;

        const enterProgress = interpolate(
          currentFrame,
          [charStart, charStart + durationFrames],
          [0, 1],
          {
            easing: cushionEase,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        let charOpacity = interpolate(enterProgress, [0, 1], [0.18, 1]);
        let charBlur = interpolate(enterProgress, [0, 1], [blurScale, 0]);
        let charScale = 1;

        // --- 2. REVERSE FOCUS EXIT DEGRADATION (1 -> 0) ---
        const effectiveExit = exitProgress;

        if (effectiveExit > 0) {
          const totalCharsInWord = characters.length;
          const isLeftOfLogo = wordIndex < 2;
          const dissolveIndex = isLeftOfLogo ? totalCharsInWord - 1 - index : index;

          const wordOffset = wordIndex === 1 ? 0.0 : wordIndex === 0 ? 0.12 : 0.0;
          const charOffset = wordOffset + dissolveIndex * 0.04;

          const charExitStart = Math.min(0.25, charOffset * 0.6);
          const charExitEnd = Math.min(0.92, charExitStart + 0.60);

          const rawCharExit = interpolate(
            effectiveExit,
            [charExitStart, charExitEnd],
            [0, 1],
            {
              easing: cushionEase,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          // As focus reverses, blur increases up to 14px in 4K
          const exitBlur = interpolate(
            rawCharExit,
            [0, 1],
            [0, blurScale * 2.6]
          );
          charBlur = Math.max(charBlur, exitBlur);

          // Opacity drops smoothly: 1.0 -> 0.18 as characters soften, and to 0.0 on complete exit
          const softenOpacity = interpolate(
            rawCharExit,
            [0, 1],
            [1.0, 0.18]
          );
          const finalCollapse = interpolate(
            effectiveExit,
            [0.82, 0.98],
            [1.0, 0.0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );
          charOpacity = Math.min(charOpacity, softenOpacity * finalCollapse);

          // Subtle dissolution scale toward logo (1.0 -> 0.95)
          charScale = interpolate(rawCharExit, [0, 1], [1.0, 0.95]);
        }

        return (
          <span
            key={index}
            style={{
              display: "inline-block",
              lineHeight: 1,
              opacity: charOpacity,
              transform:
                charScale !== 1
                  ? `scale(${charScale.toFixed(4)})`
                  : undefined,
              transformOrigin: "right center", // Dissolves toward the right (toward logo)
              filter:
                charBlur > 0.01 ? `blur(${charBlur.toFixed(2)}px)` : "none",
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}
