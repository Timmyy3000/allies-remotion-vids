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
  // 3. URL PUZZLE COMPLETION PUSH (Frames 890 to 950)
  // Camera pushes in (1.0 -> 1.035) during completion flash and stays closer
  // for the post-completion celebration window
  // =========================================================================
  const COMPLETION_CAM_START = TIMING.COMPLETION_ORANGE_START;
  const COMPLETION_CAM_END = TIMING.COMPLETION_FULL_BLACK_FRAME + 20;
  if (frame >= COMPLETION_CAM_START && frame < TIMING.FINAL_CAMERA_PUSH_START) {
    const pushProgress = interpolate(
      frame,
      [COMPLETION_CAM_START, COMPLETION_CAM_END],
      [0, 1],
      { easing: cameraEase, extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    scale = Math.max(scale, 1.0 + pushProgress * 0.035);

    // Gentle centroid framing during Blue & Pink playful moment above 'allies'
    if (frame >= TIMING.BLUE_PINK_SWIRL_START && frame < TIMING.BLUE_PINK_SWIRL_START + TIMING.BLUE_PINK_SWIRL_DURATION) {
      const p = (frame - TIMING.BLUE_PINK_SWIRL_START) / TIMING.BLUE_PINK_SWIRL_DURATION;
      const playEnv = Math.sin(p * Math.PI);
      offsetY -= playEnv * 6;
    } else if (frame >= TIMING.SQUEEZE_START && frame < TIMING.SQUEEZE_START + TIMING.SQUEEZE_DURATION) {
      const p = (frame - TIMING.SQUEEZE_START) / TIMING.SQUEEZE_DURATION;
      const squeezeEnv = Math.sin(p * Math.PI);
      offsetX += squeezeEnv * 6;
    }
  }

  // =========================================================================
  // 4. FINAL CAMERA PUSH & CENTERING ON URL (Frames 1045 to 1215)
  // Smooth transition from departure scale (S0 = 1.035) to final hero scale
  // (S_final = S0 * 1.25 = 1.29375), centering dead on yourallies.io
  // =========================================================================
  if (frame >= TIMING.FINAL_CAMERA_PUSH_START) {
    const finalPushProgress = interpolate(
      frame,
      [TIMING.FINAL_CAMERA_PUSH_START, TIMING.FINAL_HOLD_START],
      [0, 1],
      {
        easing: Easing.inOut(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );

    scale = interpolate(finalPushProgress, [0, 1], [1.035, 1.29375]);

    // Centering directly on the completed URL geometric center (1920, 1080)
    offsetX = 0;
    offsetY = 0;
  }

  return {
    scale,
    x: offsetX,
    y: offsetY,
  };
}
