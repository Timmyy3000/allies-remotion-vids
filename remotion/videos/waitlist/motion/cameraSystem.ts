/**
 * Central Deterministic Camera Motion System
 *
 * Implements subtle, tasteful camera scale and centroid framing adjustments
 * driven strictly by narrative and physical events (zero shake or random noise).
 */

import { Easing, interpolate } from "remotion";
import { TIMING } from "../constants/timing";

const cameraEase = Easing.bezier(0.22, 1, 0.36, 1);

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
  // 2. PINK TEXT BUMP MICRO-EMPHASIS (Frames 495 to 520)
  // Subtle 1.0 -> 1.012 -> 1.0 reinforcement when Pink boops 'allies'
  // =========================================================================
  const BUMP_START = 495;
  const BUMP_DURATION = 25;
  if (frame >= BUMP_START && frame < BUMP_START + BUMP_DURATION) {
    const p = (frame - BUMP_START) / BUMP_DURATION;
    const bumpEnv = Math.sin(p * Math.PI);
    scale += bumpEnv * 0.012;
    // Micro-framing toward the boop point (around x=2200, y=1080)
    offsetX -= bumpEnv * 6;
  }

  // =========================================================================
  // 3. BLUE & PINK RACE PUSH-IN & CENTROID BIAS (Frames 530 to 625)
  // Camera gently pushes in (1.0 -> 1.032) and biases toward the race centroid
  // then breathes smoothly back to 1.0 after the single swirl peels apart
  // =========================================================================
  const RACE_CAM_START = 530;
  const RACE_CAM_DURATION = 95;
  if (frame >= RACE_CAM_START && frame < RACE_CAM_START + RACE_CAM_DURATION) {
    const p = (frame - RACE_CAM_START) / RACE_CAM_DURATION;
    // Smooth asymmetric bell curve (peaks during the single swirl around p=0.6)
    const raceEnv = p < 0.55
      ? interpolate(p, [0, 0.55], [0, 1], { easing: cameraEase })
      : interpolate(p, [0.55, 1.0], [1, 0], { easing: cameraEase });

    scale += raceEnv * 0.032;
    // Slight reframing bias toward the race centroid (centered around the wordmark)
    offsetX -= raceEnv * 12;
    offsetY -= raceEnv * 8;
  }

  // =========================================================================
  // 4. URL ASSEMBLY DOCKING COMPLETION (Frames 845 to 880)
  // Gentle 1.0 -> 1.008 -> 1.0 subtle breath of satisfaction upon final docking
  // =========================================================================
  const DOCK_CAM_START = 845;
  const DOCK_CAM_DURATION = 35;
  if (frame >= DOCK_CAM_START && frame < DOCK_CAM_START + DOCK_CAM_DURATION) {
    const p = (frame - DOCK_CAM_START) / DOCK_CAM_DURATION;
    const dockEnv = Math.sin(p * Math.PI);
    scale += dockEnv * 0.008;
  }

  return {
    scale,
    x: offsetX,
    y: offsetY,
  };
}
