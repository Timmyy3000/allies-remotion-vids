/**
 * Central Deterministic Camera Motion System (V5)
 *
 * Implements subtle, tasteful camera scale and centroid framing adjustments
 * driven strictly by narrative and physical events (zero shake or random noise).
 */

import { Easing, interpolate } from "remotion";
import { TIMING } from "../constants/timing";

const cameraEase = Easing.bezier(0.22, 1, 0.36, 1);
const smoothStepEase = Easing.bezier(0.4, 0, 0.2, 1);

export interface CameraState {
  scale: number;
  x: number;
  y: number;
}

export function getCameraState(frame: number): CameraState {
  let scale = 1.0;
  let offsetX = 0;
  let offsetY = 0;

  // =========================================================================
  // 1. OPENING CAMERA PULL-BACK (1.15x -> 1.0x master framing)
  // =========================================================================
  if (frame < TIMING.ZOOM_OUT_START) {
    scale = 1.15;
  } else if (frame <= TIMING.ZOOM_OUT_END) {
    scale = interpolate(
      frame,
      [TIMING.ZOOM_OUT_START, TIMING.ZOOM_OUT_END],
      [1.15, 1.0],
      { easing: cameraEase, extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  }

  // =========================================================================
  // 2. PINK TEXT BUMP MICRO-EMPHASIS (Frames 590 to 625)
  // Subtle 1.0 -> 1.012 -> 1.0 reinforcement when Pink boops 'allies'
  // =========================================================================
  const BUMP_START = TIMING.PINK_BOOP_START;
  const BUMP_DURATION = 35;
  if (frame >= BUMP_START && frame < BUMP_START + BUMP_DURATION) {
    const p = (frame - BUMP_START) / BUMP_DURATION;
    const bumpEnv = Math.sin(p * Math.PI);
    scale += bumpEnv * 0.012;
    offsetX -= bumpEnv * 6;
  }

  // =========================================================================
  // 3. CENTERING & SUBTLE FRAMING
  // Camera stays stably at 1.0x master framing with zero ending zoom
  // =========================================================================
  if (frame >= TIMING.FINAL_CAMERA_PUSH_START) {
    scale = 1.0;
    offsetX = 0;
    offsetY = 0;
  }

  return {
    scale,
    x: offsetX,
    y: offsetY,
  };
}
