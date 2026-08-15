import React from "react";
import { interpolate, Easing } from "remotion";
import { TYPOGRAPHY } from "../constants/layout";

export interface CapabilityLineProps {
  words: readonly string[];
  startX: number;
  startY: number;
  startFrame: number;
  currentFrame: number;
  allyColor: string;
  fontSize?: number;
  fontWeight?: number;
  letterSpacing?: number;
  exitProgress?: number;
  staggerFrames?: number;
}

/**
 * Reusable Capability Sentence Component
 *
 * Renders words individually with:
 * 1. Staggered generative focus reveal (focus blur + opacity).
 * 2. Words emerge in the active ally's signature color.
 * 3. Words smoothly transition to crisp black (#121212) as they settle.
 * 4. Stable layout rendering with subpixel precision.
 */
export function CapabilityLine({
  words,
  startX,
  startY,
  startFrame,
  currentFrame,
  allyColor,
  fontSize = 66,
  fontWeight = 600,
  letterSpacing = -0.6,
  exitProgress = 0,
  staggerFrames = 8,
}: CapabilityLineProps) {
  if (currentFrame < startFrame && exitProgress === 0) {
    return null;
  }

  // Global exit translation & opacity
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitY = interpolate(exitProgress, [0, 1], [0, -18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (exitOpacity <= 0) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: startX,
        top: startY,
        display: "inline-flex",
        alignItems: "baseline",
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
        fontFamily: TYPOGRAPHY.fontFamily,
        fontSize,
        fontWeight,
        letterSpacing: `${letterSpacing}px`,
        lineHeight: 1.25,
        opacity: exitOpacity,
        transform: `translateY(${exitY.toFixed(2)}px)`,
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      {words.map((word, index) => {
        const wordStartFrame = startFrame + index * staggerFrames;
        const age = currentFrame - wordStartFrame;

        // Word hasn't started yet
        if (age < 0) {
          return (
            <span
              key={index}
              style={{
                display: "inline-block",
                opacity: 0,
                marginRight: `${fontSize * 0.28}px`,
              }}
            >
              {word}
            </span>
          );
        }

        // 1. Focus reveal progress [0, 1]
        const revealProgress = interpolate(age, [0, 14], [0, 1], {
          easing: Easing.out(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const wordOpacity = interpolate(revealProgress, [0, 0.4, 1], [0, 0.8, 1]);
        const wordBlur = interpolate(revealProgress, [0, 1], [12, 0]);

        // 2. Color transition to black (#121212)
        // Starts after initial reveal (age ~8) and resolves to solid black by age ~26
        const colorProgress = interpolate(age, [8, 26], [0, 1], {
          easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <span
            key={index}
            style={{
              display: "inline-block",
              marginRight: index < words.length - 1 ? `${fontSize * 0.28}px` : "0px",
              opacity: wordOpacity,
              filter: wordBlur > 0.05 ? `blur(${wordBlur.toFixed(2)}px)` : "none",
              color: colorProgress >= 1 ? "#121212" : interpolateColor(allyColor, "#121212", colorProgress),
              transform: `translateY(${((1 - revealProgress) * 4).toFixed(2)}px)`,
              willChange: "transform, opacity, filter",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
}

/**
 * Deterministic RGB color interpolation helper
 */
function interpolateColor(colorA: string, colorB: string, factor: number): string {
  const cA = parseHex(colorA);
  const cB = parseHex(colorB);

  const r = Math.round(cA.r + (cB.r - cA.r) * factor);
  const g = Math.round(cA.g + (cB.g - cA.g) * factor);
  const b = Math.round(cA.b + (cB.b - cA.b) * factor);

  return `rgb(${r}, ${g}, ${b})`;
}

function parseHex(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace("#", "");
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}
