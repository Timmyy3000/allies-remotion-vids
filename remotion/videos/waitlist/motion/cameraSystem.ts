/**
 * Central Deterministic Camera Motion System (V4)
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
  // 2. PINK TEXT BUMP MICRO-EMPHASIS (Frames 490 to 525)
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
  // 3. BLUE & PINK RACE PUSH-IN & ACTION CENTROID (Frames 530 to 630)
  // Camera gently pushes in (1.0 -> 1.032) and biases toward the race centroid
  // then breathes smoothly back toward 1.01 after the single swirl peels apart
  // =========================================================================
  const RACE_CAM_START = TIMING.RACE_START;
  const RACE_CAM_DURATION = 100;
  if (frame >= RACE_CAM_START && frame < RACE_CAM_START + RACE_CAM_DURATION) {
    const p = (frame - RACE_CAM_START) / RACE_CAM_DURATION;
    const raceEnv = p < 0.55
      ? interpolate(p, [0, 0.55], [0, 1], { easing: cameraEase })
      : interpolate(p, [0.55, 1.0], [1, 0.25], { easing: cameraEase });

    scale += raceEnv * 0.032;
    offsetX -= raceEnv * 12;
    offsetY -= raceEnv * 8;
  }

  // =========================================================================
  // 4. URL PUZZLE COMPLETION PUSH (Frames 855 to 945)
  // Camera pushes in (1.0 -> 1.035) during completion flash and stays closer
  // for the post-completion celebration window
  // =========================================================================
  const COMPLETION_CAM_START = TIMING.COMPLETION_WAVE_START;
  const COMPLETION_CAM_END = TIMING.COMPLETION_FULL_BLACK_FRAME + 20;
  if (frame >= COMPLETION_CAM_START && frame < TIMING.FINAL_CAMERA_PUSH_START) {
    const pushProgress = interpolate(
      frame,
      [COMPLETION_CAM_START, COMPLETION_CAM_END],
      [0, 1],
      { easing: cameraEase, extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    scale = Math.max(scale, 1.0 + pushProgress * 0.035);

    // Micro centroid shifts during post-completion play events
    if (frame >= TIMING.PEEK_BEHIND_START && frame < TIMING.PEEK_BEHIND_START + TIMING.PEEK_BEHIND_DURATION) {
      const p = (frame - TIMING.PEEK_BEHIND_START) / TIMING.PEEK_BEHIND_DURATION;
      const peekEnv = Math.sin(p * Math.PI);
      offsetX -= peekEnv * 8;
      offsetY -= peekEnv * 6;
    } else if (frame >= TIMING.GAP_THREAD_START && frame < TIMING.GAP_THREAD_START + TIMING.GAP_THREAD_DURATION) {
      const p = (frame - TIMING.GAP_THREAD_START) / TIMING.GAP_THREAD_DURATION;
      const threadEnv = Math.sin(p * Math.PI);
      offsetX += threadEnv * 10;
    }
  }

  // =========================================================================
  // 5. FINAL CAMERA PUSH & CENTERING ON URL (Frames 1360 to 1460)
  // Smooth transition from celebration scale (~1.035) to final hero scale (1.08x)
  // =========================================================================
  if (frame >= TIMING.FINAL_CAMERA_PUSH_START) {
    const finalPushProgress = interpolate(
      frame,
      [TIMING.FINAL_CAMERA_PUSH_START, TIMING.FINAL_HOLD_START],
      [0, 1],
      { easing: smoothStepEase, extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    scale = interpolate(finalPushProgress, [0, 1], [1.035, 1.08]);

    // Centering directly on the completed URL center
    offsetX = interpolate(finalPushProgress, [0, 1], [offsetX, 0]);
    offsetY = interpolate(finalPushProgress, [0, 1], [offsetY, 0]);
  }

  return {
    scale,
    x: offsetX,
    y: offsetY,
  };
}
