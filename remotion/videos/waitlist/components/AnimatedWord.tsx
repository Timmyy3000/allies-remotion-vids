import React from "react";
import { Easing, interpolate } from "remotion";

const cushionEase = Easing.bezier(0.22, 0.65, 0.3, 1);

interface AnimatedWordProps {
  text: string;
  startFrame: number;
  currentFrame: number;
  color?: string;
  speed?: number;
  blurScale?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedWord({
  text,
  startFrame,
  currentFrame,
  color = "#121212",
  speed = 1.15,
  blurScale = 5.33,
  className = "",
  style = {},
}: AnimatedWordProps) {
  const characters = Array.from(text);
  const isStarted = currentFrame >= startFrame;
  const durationFrames = (0.28 / speed) * 60;

  return (
    <span
      className={`animated-word ${className}`}
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

        const delaySeconds = Math.min(0.035, index * 0.005) / speed;
        const delayFrames = delaySeconds * 60;
        const charStart = startFrame + delayFrames;

        const progress = interpolate(
          currentFrame,
          [charStart, charStart + durationFrames],
          [0, 1],
          {
            easing: cushionEase,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        const opacity = interpolate(progress, [0, 1], [0.18, 1]);
        const blur = interpolate(progress, [0, 1], [blurScale, 0]);

        return (
          <span
            key={index}
            style={{
              display: "inline-block",
              lineHeight: 1,
              opacity,
              filter: blur > 0.01 ? `blur(${blur.toFixed(2)}px)` : "none",
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}

