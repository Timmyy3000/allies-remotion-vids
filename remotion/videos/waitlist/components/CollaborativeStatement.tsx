import React from "react";
import { interpolate, Easing } from "remotion";
import { COLLABORATIVE_LAYOUT, TYPOGRAPHY } from "../constants/layout";

export interface CollaborativeStatementProps {
  startFrame: number;
  currentFrame: number;
  exitProgress?: number;
}

/**
 * Collaborative Statement Component
 *
 * Renders the shared teamwork statement:
 * "When a task needs more than one of us, we work together"
 * Unified, elegant, solid black typography appearing above the snuggle cluster.
 */
export function CollaborativeStatement({
  startFrame,
  currentFrame,
  exitProgress = 0,
}: CollaborativeStatementProps) {
  if (currentFrame < startFrame && exitProgress === 0) {
    return null;
  }

  // Global exit translation & opacity
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitY = interpolate(exitProgress, [0, 1], [0, -20], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (exitOpacity <= 0) {
    return null;
  }

  const { words, centerX, centerY, fontSize, fontWeight, letterSpacing } = COLLABORATIVE_LAYOUT;

  return (
    <div
      style={{
        position: "absolute",
        left: centerX,
        top: centerY,
        transform: `translate(-50%, -50%) translateY(${exitY.toFixed(2)}px)`,
        display: "inline-flex",
        alignItems: "baseline",
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
        fontFamily: TYPOGRAPHY.fontFamily,
        fontSize,
        fontWeight,
        letterSpacing: `${letterSpacing}px`,
        color: "#121212",
        opacity: exitOpacity,
        userSelect: "none",
        pointerEvents: "none",
        zIndex: 40,
      }}
    >
      {words.map((word, index) => {
        const wordStartFrame = startFrame + index * 6;
        const age = currentFrame - wordStartFrame;

        if (age < 0) {
          return (
            <span
              key={index}
              style={{
                display: "inline-block",
                opacity: 0,
                marginRight: `${fontSize * 0.26}px`,
              }}
            >
              {word}
            </span>
          );
        }

        const revealProgress = interpolate(age, [0, 12], [0, 1], {
          easing: Easing.out(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const wordOpacity = interpolate(revealProgress, [0, 0.4, 1], [0, 0.8, 1]);
        const wordBlur = interpolate(revealProgress, [0, 1], [10, 0]);

        return (
          <span
            key={index}
            style={{
              display: "inline-block",
              marginRight: index < words.length - 1 ? `${fontSize * 0.26}px` : "0px",
              opacity: wordOpacity,
              filter: wordBlur > 0.05 ? `blur(${wordBlur.toFixed(2)}px)` : "none",
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
