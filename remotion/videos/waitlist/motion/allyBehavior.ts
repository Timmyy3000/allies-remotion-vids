/**
 * 3-Layer Character Motion Model & Physical Playfulness Engine (V4)
 *
 * Architecture:
 * - Layer 1: Ambient Life (continuous organic Lissajous drift, gentle breathing, eyeball gaze)
 * - Layer 2: Reactive Motion (startles, side-steps, leans, yielding, curiosity bobs)
 * - Layer 3: Intentional Hero Actions (Double-Hop, Text Boop, Race, Single Swirl, Near-Miss,
 *             Peek-Behind, Squeeze-In, Gap-Thread, Follow-and-Peel, Final Linger)
 *
 * Enforces strictly:
 * - Single-Swirl Count = 1 in entire video
 * - Single-Race Count = 1 in entire video
 * - Continuous velocity blending & smooth area-preserving soft-body deformations
 */

import { AllyIdentity } from "../constants/allyStates";
import { TIMING } from "../constants/timing";
import { evaluateContactResponse } from "./contactPhysics";

export interface PlayfulBehaviorOffset {
  x: number;
  y: number;
  rotDeg: number;
  squashX: number;
  squashY: number;
  zIndexOffset?: number;
  cursorOverride?: {
    active: boolean;
    angleDeg: number;
  };
}

export interface TextBoopReaction {
  x: number;
  y: number;
  rotDeg: number;
  scaleX: number;
  scaleY: number;
}

/**
 * Evaluates the physical reaction of the 'allies' text when booped by Pink.
 */
export function getTextBoopReaction(frame: number): TextBoopReaction {
  const BOOP_START = TIMING.PINK_BOOP_START;
  const BOOP_DURATION = TIMING.PINK_BOOP_DURATION;

  if (frame < BOOP_START || frame >= BOOP_START + BOOP_DURATION) {
    return { x: 0, y: 0, rotDeg: 0, scaleX: 1, scaleY: 1 };
  }

  const p = (frame - BOOP_START) / BOOP_DURATION;

  // Impact curve: sharp displacement (first 20%) -> damped elastic oscillation (remaining 80%)
  if (p < 0.2) {
    const inP = p / 0.2;
    const squish = Math.sin(inP * Math.PI * 0.5);
    return {
      x: -18 * squish,
      y: 9 * squish,
      rotDeg: -2.8 * squish,
      scaleX: 1 - 0.045 * squish,
      scaleY: 1 + 0.038 * squish,
    };
  }

  const recoveryP = (p - 0.2) / 0.8;
  const decay = Math.exp(-recoveryP * 4.2);
  const oscillation = Math.cos(recoveryP * Math.PI * 3.5);

  const currentDisplacement = decay * oscillation;

  return {
    x: -18 * currentDisplacement,
    y: 9 * currentDisplacement,
    rotDeg: -2.8 * currentDisplacement,
    scaleX: 1 - 0.045 * currentDisplacement,
    scaleY: 1 + 0.038 * currentDisplacement,
  };
}

/**
 * Evaluates the composite 3-layer playful offsets for an Ally at current frame.
 */
export function getAllyPlayfulOffset(
  identity: AllyIdentity,
  frame: number,
  baseX: number,
  baseY: number,
): PlayfulBehaviorOffset {
  let offsetX = 0;
  let offsetY = 0;
  let offsetRot = 0;
  let squashX = 1;
  let squashY = 1;
  let zIndexOffset = 0;
  let cursorOverride: { active: boolean; angleDeg: number } | undefined = undefined;

  // =========================================================================
  // 1. LAYER 3: YELLOW ENTRANCE DOUBLE-HOP (Frames 240 to 305)
  // Yellow executes its signature double-hop with landing squash and stretch
  // =========================================================================
  const HOP_START = TIMING.YELLOW_DOUBLE_HOP_START;
  const HOP_DURATION = TIMING.YELLOW_DOUBLE_HOP_DURATION;
  if (frame >= HOP_START && frame < HOP_START + HOP_DURATION && identity === "boxy") {
    const p = (frame - HOP_START) / HOP_DURATION;
    const env = Math.sin(p * Math.PI);

    // Double-hop cycle: 2 peaks
    const hopCycle = Math.sin(p * Math.PI * 4);
    const hopHeight = Math.max(0, hopCycle) * 32 * env;
    offsetY -= hopHeight;
    offsetRot += Math.sin(p * Math.PI * 2) * 6 * env;

    // Contact bounce compression vs flight stretch
    if (hopHeight > 4) {
      squashX *= 0.94;
      squashY *= 1.06;
    } else {
      squashX *= 1.05;
      squashY *= 0.95;
    }
  }

  // =========================================================================
  // 2. LAYER 3: PINK'S PHYSICAL TEXT BOOP (Frames 490 to 530)
  // Pink drifts in curiously and bumps into the right edge of 'allies' text
  // =========================================================================
  const BOOP_START = TIMING.PINK_BOOP_START;
  const BOOP_DURATION = TIMING.PINK_BOOP_DURATION;
  if (frame >= BOOP_START && frame < BOOP_START + BOOP_DURATION && identity === "ghosty") {
    const p = (frame - BOOP_START) / BOOP_DURATION;
    const env = Math.sin(p * Math.PI);

    if (p < 0.25) {
      // Drift inward toward 'allies' text (around x=2200)
      const inP = p / 0.25;
      offsetX -= inP * 55;
      offsetY += inP * 38;
      offsetRot -= inP * 8;
    } else {
      // Elastic collision recoil
      const outP = (p - 0.25) / 0.75;
      const decay = Math.exp(-outP * 3.6);
      const recoilX = -55 + (1 - decay) * 75;
      const recoilY = 38 - (1 - decay) * 52;
      offsetX += recoilX * env;
      offsetY += recoilY * env;
      offsetRot += (decay * -8 + (1 - decay) * 6) * env;

      // Soft-body contact compression
      const contact = evaluateContactResponse(frame, {
        startFrame: BOOP_START + 8,
        durationFrames: 28,
        impactAngleRad: -Math.PI * 0.2,
        maxCompression: 0.055,
        maxRecoil: 18,
      });
      squashX *= contact.squashX;
      squashY *= contact.squashY;
    }
  }

  // =========================================================================
  // 3. LAYER 3: BLUE & PINK RACE AROUND 'allies' (Frames 530 to 585)
  // Blue accelerates around wordmark; Pink chases on tighter inner line
  // =========================================================================
  const RACE_START = TIMING.RACE_START;
  const RACE_DURATION = TIMING.RACE_DURATION;
  if (frame >= RACE_START && frame < RACE_START + RACE_DURATION) {
    const p = (frame - RACE_START) / RACE_DURATION;
    const env = Math.sin(p * Math.PI);

    if (identity === "rolly") {
      // Blue leads race along outer curve
      const raceAngle = p * Math.PI * 1.6 - Math.PI * 0.4;
      const rx = 190;
      const ry = 100;
      offsetX += Math.cos(raceAngle) * rx * env - 40 * env;
      offsetY += Math.sin(raceAngle) * ry * env - 20 * env;
      offsetRot += Math.sin(p * Math.PI * 2) * 14 * env;
      squashX *= 1 + 0.04 * env;
      squashY *= 1 - 0.035 * env;
    } else if (identity === "ghosty") {
      // Pink chases 7 frames delayed on a tighter inside cut (gaining on Blue)
      const delayedP = Math.max(0, p - 0.12) / 0.88;
      const delayedEnv = Math.sin(delayedP * Math.PI);
      const raceAngle = delayedP * Math.PI * 1.65 - Math.PI * 0.45;
      const rx = 160;
      const ry = 85;
      offsetX += Math.cos(raceAngle) * rx * delayedEnv - 30 * delayedEnv;
      offsetY += Math.sin(raceAngle) * ry * delayedEnv - 15 * delayedEnv;
      offsetRot += Math.sin(delayedP * Math.PI * 2) * 12 * delayedEnv;
      squashX *= 1 + 0.045 * delayedEnv;
      squashY *= 1 - 0.04 * delayedEnv;
    } else if (identity === "rocky") {
      // Layer 2: Green notices racers zooming by and leans away (-24px)
      const leanX = -Math.sin(p * Math.PI) * 26 * env;
      const leanY = Math.sin(p * Math.PI) * 15 * env;
      offsetX += leanX;
      offsetY += leanY;
      offsetRot -= Math.sin(p * Math.PI) * 6 * env;
    } else if (identity === "boxy") {
      // Layer 2: Yellow does an excited micro-bob as racers pass
      const bob = Math.sin(p * Math.PI * 2) * 8 * env;
      offsetY += bob;
    }
  }

  // =========================================================================
  // 4. LAYER 3: THE ONE SINGLE SWIRL (Frames 580 to 630)
  // THE ONLY SWIRL IN THE ENTIRE VIDEO: Pink catches Blue -> momentum spiral -> peel apart
  // =========================================================================
  const SWIRL_START = TIMING.SWIRL_START;
  const SWIRL_DURATION = TIMING.SWIRL_DURATION;
  if (frame >= SWIRL_START && frame < SWIRL_START + SWIRL_DURATION) {
    const p = (frame - SWIRL_START) / SWIRL_DURATION;
    const env = Math.sin(p * Math.PI);
    const easeProgress = 0.5 - 0.5 * Math.cos(p * Math.PI);

    const swirlRadius = 80 * env;
    const angle = easeProgress * Math.PI * 1.33; // 240° smooth spiral

    if (identity === "rolly") {
      offsetX += Math.cos(angle) * swirlRadius - 20 * env;
      offsetY += Math.sin(angle) * (swirlRadius * 0.55);
      offsetRot += Math.sin(angle) * 12 * env;

      // Contact compression at start of swirl
      if (p < 0.3) {
        squashX *= 0.95;
        squashY *= 1.05;
      }
    } else if (identity === "ghosty") {
      offsetX += Math.cos(angle + Math.PI) * swirlRadius + 20 * env;
      offsetY += Math.sin(angle + Math.PI) * (swirlRadius * 0.55);
      offsetRot += Math.sin(angle + Math.PI) * 12 * env;

      if (p < 0.3) {
        squashX *= 0.95;
        squashY *= 1.05;
      }
    }
  }

  // =========================================================================
  // 5. LAYER 2: GREEN & YELLOW NEAR-MISS (Frames 755 to 800)
  // Green banks +8° to avoid Yellow returning with domain pieces
  // =========================================================================
  const NEAR_MISS_START = TIMING.NEAR_MISS_START;
  const NEAR_MISS_DURATION = TIMING.NEAR_MISS_DURATION;
  if (frame >= NEAR_MISS_START && frame < NEAR_MISS_START + NEAR_MISS_DURATION) {
    const p = (frame - NEAR_MISS_START) / NEAR_MISS_DURATION;
    const env = Math.sin(p * Math.PI);

    if (identity === "rocky") {
      offsetX -= Math.sin(p * Math.PI) * 18 * env;
      offsetY -= Math.sin(p * Math.PI) * 14 * env;
      offsetRot += Math.sin(p * Math.PI) * 8 * env;
    } else if (identity === "boxy") {
      offsetY += Math.sin(p * Math.PI) * 10 * env;
      offsetRot -= Math.sin(p * Math.PI) * 5 * env;
    }
  }

  // =========================================================================
  // 6. LAYER 2: PUZZLE COMPLETION IMPULSE (Frames 885 to 925)
  // Shared micro-reaction when the URL flashes orange
  // =========================================================================
  const PULSE_START = TIMING.COMPLETION_ORANGE_HOLD_START;
  const PULSE_DURATION = 30;
  if (frame >= PULSE_START && frame < PULSE_START + PULSE_DURATION) {
    const p = (frame - PULSE_START) / PULSE_DURATION;
    const env = Math.sin(p * Math.PI);
    if (identity === "rolly") {
      offsetY -= env * 12;
      squashY *= 1 + env * 0.035;
    } else if (identity === "ghosty") {
      offsetX += env * 10;
      squashX *= 1 + env * 0.035;
    } else if (identity === "boxy") {
      offsetY += env * 8;
      squashY *= 1 - env * 0.04;
    } else if (identity === "rocky") {
      offsetRot -= env * 4;
    }
  }

  // =========================================================================
  // 7. LAYER 3: PINK PEEKS BEHIND BLUE + BLUE STARTLE (Frames 980 to 1055)
  // Pink sweeps across to Blue (z-index), peeks behind; Blue startles, compresses, jumps 25px
  // =========================================================================
  const PEEK_START = TIMING.PEEK_BEHIND_START;
  const PEEK_DURATION = TIMING.PEEK_BEHIND_DURATION;
  if (frame >= PEEK_START && frame < PEEK_START + PEEK_DURATION) {
    const p = (frame - PEEK_START) / PEEK_DURATION;
    const env = Math.sin(p * Math.PI);

    if (identity === "ghosty") {
      // Pink sweeps from right side across to Blue's vicinity and back
      const peekX = -650 * env;
      const peekY = Math.sin(p * Math.PI * 1.5) * 50 * env;
      offsetX += peekX;
      offsetY += peekY;
      offsetRot += Math.sin(p * Math.PI) * 12;
      zIndexOffset = p < 0.5 ? -2 : 2; // Behind Blue during first half, emerges in front
    } else if (identity === "rolly" && p > 0.35) {
      // Blue startles when Pink pops out (p > 0.35)
      const startleP = (p - 0.35) / 0.65;
      const decay = Math.exp(-startleP * 3.8);
      const startleX = -35 * decay * Math.sin(startleP * Math.PI);
      const startleY = -25 * decay * Math.sin(startleP * Math.PI);
      offsetX += startleX;
      offsetY += startleY;
      offsetRot -= decay * 8;
      squashX *= 1 - 0.06 * decay;
      squashY *= 1 + 0.06 * decay;
    }
  }

  // =========================================================================
  // 8. LAYER 3: YELLOW & GREEN COZY SQUEEZE (Frames 1060 to 1125)
  // Yellow snuggles next to Green; both compress 4.5%, Green yields 18px left
  // =========================================================================
  const SQUEEZE_START = TIMING.SQUEEZE_START;
  const SQUEEZE_DURATION = TIMING.SQUEEZE_DURATION;
  if (frame >= SQUEEZE_START && frame < SQUEEZE_START + SQUEEZE_DURATION) {
    const p = (frame - SQUEEZE_START) / SQUEEZE_DURATION;
    const env = Math.sin(p * Math.PI);

    if (identity === "boxy") {
      // Boxy moves toward Rocky
      const approach = p < 0.4 ? (p / 0.4) * -45 : -45 + ((p - 0.4) / 0.6) * 15;
      offsetX += approach * env;
      offsetY -= Math.sin(p * Math.PI) * 10;
      offsetRot -= 5 * env;
      squashX *= 1 - 0.05 * env;
      squashY *= 1 + 0.045 * env;
    } else if (identity === "rocky") {
      // Rocky yields gently leftward
      const yieldAmt = p < 0.4 ? (p / 0.4) * -22 : -22 + ((p - 0.4) / 0.6) * 8;
      offsetX += yieldAmt * env;
      offsetRot += 4 * env;
      squashX *= 1 - 0.045 * env;
      squashY *= 1 + 0.04 * env;
    }
  }

  // =========================================================================
  // 9. LAYER 3: BLUE GAP-THREADING (Frames 1130 to 1200)
  // Blue curves smoothly diagonally down-right through gap between Pink & Green
  // =========================================================================
  const THREAD_START = TIMING.GAP_THREAD_START;
  const THREAD_DURATION = TIMING.GAP_THREAD_DURATION;
  if (frame >= THREAD_START && frame < THREAD_START + THREAD_DURATION) {
    const p = (frame - THREAD_START) / THREAD_DURATION;
    const env = Math.sin(p * Math.PI);

    if (identity === "rolly") {
      // Blue sweeps diagonally across with safe elevation above text geometry
      const threadX = Math.sin(p * Math.PI) * 520 * env;
      const threadY = Math.sin(p * Math.PI) * -85 * env;
      offsetX += threadX;
      offsetY += threadY;
      offsetRot += Math.sin(p * Math.PI * 2) * 14 * env;
      squashX *= 1 + 0.045 * env;
      squashY *= 1 - 0.04 * env;
    } else if (identity === "ghosty") {
      // Pink leans upward to give Blue space
      offsetY -= Math.sin(p * Math.PI) * 28 * env;
      offsetRot += 5 * env;
    } else if (identity === "rocky") {
      // Green leans downward to give Blue space
      offsetY += Math.sin(p * Math.PI) * 25 * env;
      offsetRot -= 5 * env;
    }
  }

  // =========================================================================
  // 10. LAYER 3: FOLLOW-AND-PEEL (Frames 1210 to 1290)
  // Yellow leads a gentle curved drift; Pink follows in train then peels upward
  // =========================================================================
  const FOLLOW_START = TIMING.FOLLOW_PEEL_START;
  const FOLLOW_DURATION = TIMING.FOLLOW_PEEL_DURATION;
  if (frame >= FOLLOW_START && frame < FOLLOW_START + FOLLOW_DURATION) {
    const p = (frame - FOLLOW_START) / FOLLOW_DURATION;
    const env = Math.sin(p * Math.PI);

    if (identity === "boxy") {
      // Yellow drifts across
      offsetX += Math.sin(p * Math.PI) * -110 * env;
      offsetY += Math.sin(p * Math.PI) * 45 * env;
      offsetRot -= Math.sin(p * Math.PI) * 6 * env;
    } else if (identity === "ghosty") {
      // Pink follows 8 frames delayed, then peels upward
      const delayedP = Math.max(0, p - 0.12) / 0.88;
      const delayedEnv = Math.sin(delayedP * Math.PI);
      const followX = Math.sin(delayedP * Math.PI) * -95 * delayedEnv;
      const peelY = delayedP > 0.5 ? -((delayedP - 0.5) / 0.5) * 55 * delayedEnv : Math.sin(delayedP * Math.PI) * 35 * delayedEnv;
      offsetX += followX;
      offsetY += peelY;
      offsetRot += Math.sin(delayedP * Math.PI) * 10 * delayedEnv;
    }
  }

  // =========================================================================
  // 11. LAYER 2: GREEN FINAL LINGER & LOOK-BACK (Frames 1400 to 1445)
  // Green hesitates before departing and gives a subtle look back toward the URL
  // =========================================================================
  const LINGER_START = 1400;
  const LINGER_DURATION = 45;
  if (frame >= LINGER_START && frame < LINGER_START + LINGER_DURATION && identity === "rocky") {
    const p = (frame - LINGER_START) / LINGER_DURATION;
    const env = Math.sin(p * Math.PI);
    // Soft look-back bob
    offsetRot += Math.sin(p * Math.PI) * 7 * env;
    offsetY -= Math.sin(p * Math.PI) * 8 * env;
  }

  return {
    x: offsetX,
    y: offsetY,
    rotDeg: offsetRot,
    squashX,
    squashY,
    zIndexOffset,
    cursorOverride,
  };
}
