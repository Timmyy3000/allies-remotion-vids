import React from "react";
import { ALLY_PATHS } from "../constants/allyPaths";
import { CANVAS, TEXT_STAGE_SAFE_RECT } from "../constants/layout";

export function MotionPathDebug() {
  return (
    <svg
      width={CANVAS.width}
      height={CANVAS.height}
      viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      {/* Central Crosshair */}
      <line x1={1920} y1={0} x2={1920} y2={2160} stroke="#E0E0E0" strokeWidth="1.5" strokeDasharray="6 6" />
      <line x1={0} y1={1080} x2={3840} y2={1080} stroke="#E0E0E0" strokeWidth="1.5" strokeDasharray="6 6" />

      {/* Central Text Stage Safe Area Rectangle */}
      <rect
        x={TEXT_STAGE_SAFE_RECT.left}
        y={TEXT_STAGE_SAFE_RECT.top}
        width={TEXT_STAGE_SAFE_RECT.right - TEXT_STAGE_SAFE_RECT.left}
        height={TEXT_STAGE_SAFE_RECT.bottom - TEXT_STAGE_SAFE_RECT.top}
        fill="none"
        stroke="#FF5800"
        strokeWidth="2"
        strokeDasharray="10 6"
        opacity="0.4"
      />
      <text
        x={TEXT_STAGE_SAFE_RECT.left + 20}
        y={TEXT_STAGE_SAFE_RECT.top + 35}
        fill="#FF5800"
        fontSize="22"
        fontWeight="bold"
        opacity="0.6"
      >
        TEXT_STAGE_SAFE_RECT (Central Workspace)
      </text>

      {Object.values(ALLY_PATHS).map((ally) => {
        const beziers = [
          { tag: "entrance", b: ally.allBeziers.entrance, dash: "8 8", opacity: 0.5 },
          { tag: "gather", b: ally.allBeziers.gather, dash: "4 4", opacity: 0.75 },
          { tag: "spread", b: ally.allBeziers.spread, dash: "6 6", opacity: 0.75 },
        ];

        return (
          <g key={ally.id}>
            {beziers.map(({ tag, b, dash, opacity }) => (
              <g key={tag}>
                {/* Guide lines from anchors to control points */}
                <line
                  x1={b.start.x}
                  y1={b.start.y}
                  x2={b.c1.x}
                  y2={b.c1.y}
                  stroke={ally.color}
                  strokeWidth="2"
                  strokeDasharray="3 3"
                  opacity={opacity * 0.5}
                />
                <line
                  x1={b.end.x}
                  y1={b.end.y}
                  x2={b.c2.x}
                  y2={b.c2.y}
                  stroke={ally.color}
                  strokeWidth="2"
                  strokeDasharray="3 3"
                  opacity={opacity * 0.5}
                />

                {/* Path Curve */}
                <path
                  d={b.svgPath}
                  fill="none"
                  stroke={ally.color}
                  strokeWidth="3.5"
                  strokeDasharray={dash}
                  opacity={opacity}
                />

                {/* Control Point 1 (C1) */}
                <circle
                  cx={b.c1.x}
                  cy={b.c1.y}
                  r="6"
                  fill="#FFFFFF"
                  stroke={ally.color}
                  strokeWidth="2.5"
                  opacity={opacity}
                />

                {/* Control Point 2 (C2) */}
                <circle
                  cx={b.c2.x}
                  cy={b.c2.y}
                  r="6"
                  fill="#FFFFFF"
                  stroke={ally.color}
                  strokeWidth="2.5"
                  opacity={opacity}
                />
              </g>
            ))}

            {/* Gather Anchor Marker */}
            <circle
              cx={ally.allBeziers.gather.end.x}
              cy={ally.allBeziers.gather.end.y}
              r="8"
              fill={ally.color}
              stroke="#FFFFFF"
              strokeWidth="2"
            />

            {/* Spread / Final Anchor Marker */}
            <circle
              cx={ally.allBeziers.spread.end.x}
              cy={ally.allBeziers.spread.end.y}
              r="10"
              fill="#000000"
              stroke={ally.color}
              strokeWidth="3"
            />
            <text
              x={ally.allBeziers.spread.end.x + 14}
              y={ally.allBeziers.spread.end.y + 6}
              fill="#000000"
              fontSize="20"
              fontWeight="bold"
            >
              {ally.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
