import React from "react";
import { interpolate, Easing } from "remotion";

export interface ClickSparkProps {
  x: number; // Exact click point X
  y: number; // Exact click point Y
  triggerFrame: number;
  currentFrame: number;
  color: string;
  sparkCount?: number;
  sparkRadius?: number;
  sparkLength?: number;
  duration?: number;
  strokeWidth?: number;
}

/**
 * Deterministic Remotion Click Spark Burst Component
 *
 * Emits radiating spark strokes at the exact click point when an ally
 * clicks to initiate a line of text.
 * Pure frame-driven Remotion implementation (no DOM click/rAF dependencies).
 */
export function ClickSpark({
  x,
  y,
  triggerFrame,
  currentFrame,
  color,
  sparkCount = 8,
  sparkRadius = 24,
  sparkLength = 12,
  duration = 22,
  strokeWidth = 2.5,
}: ClickSparkProps) {
  const age = currentFrame - triggerFrame;

  // Active window guard
  if (age < 0 || age >= duration) {
    return null;
  }

  // Normalized progress [0, 1] with smooth deceleration
  const progress = interpolate(age, [0, duration], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Radiating travel distance
  const currentRadius = interpolate(progress, [0, 1], [0, sparkRadius]);

  // Dynamic stroke length: grows quickly then shrinks to 0
  const currentLength = interpolate(
    progress,
    [0, 0.35, 1.0],
    [3, sparkLength, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Smooth opacity dissipation
  const opacity = interpolate(progress, [0, 0.7, 1.0], [1, 0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sparks = Array.from({ length: sparkCount }).map((_, i) => {
    const angleRad = (i * 2 * Math.PI) / sparkCount;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);

    const startX = cos * currentRadius;
    const startY = sin * currentRadius;
    const endX = cos * (currentRadius + currentLength);
    const endY = sin * (currentRadius + currentLength);

    return (
      <line
        key={i}
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    );
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 50,
        opacity,
      }}
    >
      <svg
        width={sparkRadius * 4}
        height={sparkRadius * 4}
        viewBox={`${-sparkRadius * 2} ${-sparkRadius * 2} ${sparkRadius * 4} ${sparkRadius * 4}`}
        style={{ overflow: "visible", display: "block" }}
      >
        {sparks}
      </svg>
    </div>
  );
}
