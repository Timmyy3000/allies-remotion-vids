import React from "react";

interface CursorGeometryDebugProps {
  orbSize: number;
  orbitRadius: number;
  clearance?: number;
  cursorX: number;
  cursorY: number;
  rawTargetCursorX?: number;
  rawTargetCursorY?: number;
  pointerRotation: number;
  targetRotation?: number;
  color?: string;
}

/**
 * Visual Debugger for Cursor Orbit, Steering & Clearance Verification
 *
 * Renders:
 * 1. Center dot: Ally center coordinate (0, 0)
 * 2. Dashed blue circle: Outer boundary of circular Ally Orb (radius = orbSize / 2)
 * 3. Solid green circle: Clearance target boundary (radius = orbRadius + clearance)
 * 4. Dotted magenta circle: Cursor center orbit path (radius = orbitRadius)
 * 5. Dashed amber ray & dot: Raw target heading & raw target cursor position
 * 6. Solid green ray & ring: Smoothed displayed heading & actual cursor position
 * 7. Live angle text readout
 */
export function CursorGeometryDebug({
  orbSize = 153,
  orbitRadius = 141.0,
  clearance = 35.0,
  cursorX,
  cursorY,
  rawTargetCursorX,
  rawTargetCursorY,
  pointerRotation,
  targetRotation,
  color = "#3446E9",
}: CursorGeometryDebugProps) {
  const orbRadius = orbSize / 2;
  const clearanceRadius = orbRadius + clearance;
  const extent = orbitRadius + 90;

  const rawX = rawTargetCursorX ?? cursorX;
  const rawY = rawTargetCursorY ?? cursorY;

  return (
    <svg
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: extent * 2,
        height: extent * 2,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 50,
        overflow: "visible",
      }}
      viewBox={`-${extent} -${extent} ${extent * 2} ${extent * 2}`}
    >
      {/* 1. Ally Center Dot */}
      <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />

      {/* 2. Ally Orb Boundary */}
      <circle
        cx="0"
        cy="0"
        r={orbRadius}
        fill="none"
        stroke="#0066FF"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        opacity="0.8"
      />

      {/* 3. Exact 10px Clearance Ring */}
      <circle
        cx="0"
        cy="0"
        r={clearanceRadius}
        fill="none"
        stroke="#00E676"
        strokeWidth="1.5"
        opacity="0.9"
      />

      {/* 4. Cursor Center Orbit Track */}
      <circle
        cx="0"
        cy="0"
        r={orbitRadius}
        fill="none"
        stroke="#E040FB"
        strokeWidth="1"
        strokeDasharray="3 4"
        opacity="0.7"
      />

      {/* 5. Raw Target Heading Ray & Position Dot (Amber) */}
      <line
        x1="0"
        y1="0"
        x2={rawX * 1.25}
        y2={rawY * 1.25}
        stroke="#FF9100"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        opacity="0.8"
      />
      <circle cx={rawX} cy={rawY} r="4" fill="#FF9100" opacity="0.9" />

      {/* 6. Smoothed Displayed Heading Ray & Actual Cursor Position (Green) */}
      <line
        x1="0"
        y1="0"
        x2={cursorX * 1.35}
        y2={cursorY * 1.35}
        stroke="#00E676"
        strokeWidth="2"
        opacity="0.9"
      />
      <circle
        cx={cursorX}
        cy={cursorY}
        r="6"
        fill="none"
        stroke="#00E676"
        strokeWidth="2"
        opacity="1"
      />
      <circle cx={cursorX} cy={cursorY} r="2.5" fill="#00E676" />

      {/* 7. Live Angle Text Readout */}
      <text
        x="0"
        y={extent - 15}
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="12"
        fontWeight="600"
        fontFamily="sans-serif"
        filter="drop-shadow(0px 1px 2px rgba(0,0,0,0.8))"
      >
        θ: {pointerRotation.toFixed(1)}° {targetRotation !== undefined ? `(raw: ${targetRotation.toFixed(1)}°)` : ""}
      </text>
    </svg>
  );
}
