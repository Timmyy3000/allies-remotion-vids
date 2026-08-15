import React from "react";
import { getTimelinePhase, FPS } from "../constants/timing";

interface TimelineDebugOverlayProps {
  frame: number;
}

/**
 * Optional Development Timeline Debug Overlay
 * Displays current frame, seconds, and active choreography phase.
 */
export function TimelineDebugOverlay({ frame }: TimelineDebugOverlayProps) {
  const phase = getTimelinePhase(frame);
  const seconds = (frame / FPS).toFixed(2);

  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 40,
        backgroundColor: "rgba(0, 0, 0, 0.82)",
        color: "#00E676",
        fontFamily: 'SF Mono, Consolas, Monaco, "Liberation Mono", Menlo, monospace',
        fontSize: 22,
        padding: "12px 20px",
        borderRadius: 8,
        zIndex: 1000,
        pointerEvents: "none",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div style={{ color: "#FFFFFF", fontWeight: "bold" }}>
        FRAME: {frame} <span style={{ color: "#9E9E9E", fontWeight: "normal" }}>({seconds}s)</span>
      </div>
      <div style={{ color: "#00E676" }}>
        PHASE: <span style={{ color: "#FFD54F" }}>{phase}</span>
      </div>
    </div>
  );
}
