/**
 * 3-Layer Character Motion Model & Physical Playfulness Engine (V5)
 *
 * Architecture:
 * - Layer 1: Ambient Life (continuous organic Lissajous drift, gentle breathing, eyeball gaze)
 * - Layer 2: Reactive Motion (startles, side-steps, leans, yielding, curiosity bobs)
 * - Layer 3: Intentional Hero Actions (Double-Hop, Physical Text Boop, Brand Race,
 *             Single Momentum Swirl, Near-Miss, Peek-Behind, Squeeze-In, Gap-Thread,
 *             Follow-and-Peel, Final Linger)
 *
 * Invariants Guaranteed:
 * - Single-Swirl Count = 1 in entire video (strictly as consequence of race contact)
 * - Single-Race Count = 1 in entire video
 * - Single Double-Hop Count = 1 in entire video
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
 * Impact frame is f500 (10 frames into PINK_BOOP_START).
 */
export function getTextBoopReaction(frame: number): TextBoopReaction {
  const BOOP_START = TIMING.PINK_BOOP_START;
  const BOOP_DURATION = TIMING.PINK_BOOP_DURATION;

  if (frame < BOOP_START || frame >= BOOP_START + BOOP_DURATION) {
    return { x: 0, y: 0, rotDeg: 0, scaleX: 1, scaleY: 1 };
  }

  const age = frame - BOOP_START;

  // Pre-impact drift (frames 0-9 before contact)
  if (age < 10) {
    return { x: 0, y: 0, rotDeg: 0, scaleX: 1, scaleY: 1 };
  }

  // Impact curve at age >= 10: sharp impulse -> single overshoot -> damped elastic settle
  const p = (age - 10) / (BOOP_DURATION - 10);

  if (p < 0.15) {
    // Sharp impact compression (15% of reaction window)
    const inP = p / 0.15;
    const squish = Math.sin(inP * Math.PI * 0.5);
    return {
      x: -24 * squish,
      y: -8 * squish,
      rotDeg: -3.2 * squish,
      scaleX: 1 - 0.052 * squish,
      scaleY: 1 + 0.042 * squish,
    };
  }

  const recoveryP = (p - 0.15) / 0.85;
  const decay = Math.exp(-recoveryP * 4.0);
  const oscillation = Math.cos(recoveryP * Math.PI * 3.0);
  const currentDisplacement = decay * oscillation;

  return {
    x: -24 * currentDisplacement,
    y: -8 * currentDisplacement,
    rotDeg: -3.2 * currentDisplacement,
    scaleX: 1 - 0.052 * currentDisplacement,
    scaleY: 1 + 0.042 * currentDisplacement,
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
    const hopHeight = Math.max(0, hopCycle) * 34 * env;
    offsetY -= hopHeight;
    offsetRot += Math.sin(p * Math.PI * 2) * 7 * env;

    // Contact bounce compression vs flight stretch
    if (hopHeight > 4) {
      squashX *= 0.93;
      squashY *= 1.07;
    } else {
      squashX *= 1.06;
      squashY *= 0.94;
    }
  }

  // =========================================================================
  // 2. LAYER 3: PINK'S PHYSICAL TEXT BOOP (Frames 490 to 530)
  // Pink approaches from base (2660, 1020) and physically impacts right edge
  // of centered "allies" text (rendered right edge at x=2439.2) at frame 500
  // =========================================================================
  const BOOP_START = TIMING.PINK_BOOP_START;
  const BOOP_DURATION = TIMING.PINK_BOOP_DURATION;
  if (frame >= BOOP_START && frame < BOOP_START + BOOP_DURATION && identity === "ghosty") {
    const age = frame - BOOP_START;

    if (age <= 10) {
      // Approach right edge of "allies": reaches x=2490 (overlap ~25px with x=2439 edge)
      const inP = age / 10;
      const easeIn = inP * inP;
      offsetX = -170 * easeIn;
      offsetY = 40 * easeIn;
      offsetRot = -10 * easeIn;

      if (age === 10) {
        // Peak impact compression at f500
        squashX *= 0.94;
        squashY *= 1.06;
      }
    } else {
      // Elastic collision recoil and rebound into new position
      const outP = (age - 10) / (BOOP_DURATION - 10);
      const decay = Math.exp(-outP * 3.6);
      const recoilX = -170 + (1 - decay) * 70; // Settles at offsetX = -100 (x = 2560)
      const recoilY = 40 - (1 - decay) * 80;  // Settles at offsetY = -40 (y = 980)
      offsetX = recoilX;
      offsetY = recoilY;
      offsetRot = decay * -10 + (1 - decay) * 4;

      const contact = evaluateContactResponse(frame, {
        startFrame: BOOP_START + 10,
        durationFrames: 25,
        impactAngleRad: -Math.PI * 0.2,
        maxCompression: 0.06,
        maxRecoil: 20,
      });
      squashX *= contact.squashX;
      squashY *= contact.squashY;
    }
  }

  // =========================================================================
  // 3. LAYER 3: BLUE & PINK RACE AROUND 'allies' (Frames 515 to 595)
  // Blue notices Pink's bump (f515-f535), squashes in anticipation, then darts off at f535!
  // Pink notices Blue and gives chase at f542!
  // =========================================================================
  const RACE_START = TIMING.RACE_START;
  const RACE_DURATION = TIMING.RACE_DURATION;

  // A. Blue Notice Phase (Frames 515 to 535)
  if (frame >= 515 && frame < 535 && identity === "rolly") {
    const p = (frame - 515) / 20;
    const env = Math.sin(p * Math.PI);
    // Blue tilts toward Pink (down-right), bobs in curiously, squashes in anticipation
    offsetX += env * 25;
    offsetY += env * 15;
    offsetRot += env * 14;
    squashX *= 1 + env * 0.05;
    squashY *= 1 - env * 0.045;
  }

  // B. Active Race Phase (Frames 535 to 595)
  if (frame >= RACE_START && frame < RACE_START + RACE_DURATION) {
    const p = (frame - RACE_START) / RACE_DURATION;
    const env = Math.sin(p * Math.PI);

    if (identity === "rolly") {
      // Blue takes wide outer route around the top and right of the brand lockup
      const raceAngle = p * Math.PI * 1.55 - Math.PI * 0.45;
      const rx = 380;
      const ry = 220;
      offsetX += (Math.cos(raceAngle) * rx + 60) * env;
      offsetY += (Math.sin(raceAngle) * ry + 180) * env;
      offsetRot += Math.sin(p * Math.PI * 2) * 16 * env;
      squashX *= 1 + 0.05 * env;
      squashY *= 1 - 0.045 * env;
    } else if (identity === "ghosty") {
      // Pink starts chase 7 frames delayed on tighter inside line, catching up to Blue!
      const delayedP = Math.max(0, p - 0.12) / 0.88;
      const delayedEnv = Math.sin(delayedP * Math.PI);
      const raceAngle = delayedP * Math.PI * 1.65 - Math.PI * 0.55;
      const rx = 310;
      const ry = 175;
      offsetX += (Math.cos(raceAngle) * rx - 100) * delayedEnv;
      offsetY += (Math.sin(raceAngle) * ry + 120) * delayedEnv;
      offsetRot += Math.sin(delayedP * Math.PI * 2) * 15 * delayedEnv;
      squashX *= 1 + 0.055 * delayedEnv;
      squashY *= 1 - 0.05 * delayedEnv;
    } else if (identity === "rocky") {
      // Layer 2: Green leans away as racers zoom by
      const leanX = -Math.sin(p * Math.PI) * 28 * env;
      const leanY = Math.sin(p * Math.PI) * 16 * env;
      offsetX += leanX;
      offsetY += leanY;
      offsetRot -= Math.sin(p * Math.PI) * 6 * env;
    } else if (identity === "boxy") {
      // Layer 2: Yellow does an excited micro-bob
      const bob = Math.sin(p * Math.PI * 2) * 10 * env;
      offsetY += bob;
    }
  }

  // =========================================================================
  // 4. LAYER 3: THE ONE SINGLE MOMENTUM SWIRL (Frames 595 to 640)
  // STRICTLY THE ONLY SWIRL IN THE ENTIRE VIDEO:
  // Pink catches Blue -> soft collision squash -> 220° shared spiral rotation -> peel apart
  // =========================================================================
  const SWIRL_START = TIMING.SWIRL_START;
  const SWIRL_DURATION = TIMING.SWIRL_DURATION;
  if (frame >= SWIRL_START && frame < SWIRL_START + SWIRL_DURATION) {
    const p = (frame - SWIRL_START) / SWIRL_DURATION;
    const env = Math.sin(p * Math.PI);
    const easeProgress = 0.5 - 0.5 * Math.cos(p * Math.PI);

    const swirlRadius = 75 * env;
    const angle = easeProgress * Math.PI * 1.22; // 220° smooth spiral

    if (identity === "rolly") {
      offsetX += Math.cos(angle) * swirlRadius - 40 * env;
      offsetY += Math.sin(angle) * (swirlRadius * 0.6) + 120 * env;
      offsetRot += Math.sin(angle) * 12 * env;

      if (p < 0.25) {
        squashX *= 0.94;
        squashY *= 1.06;
      }
    } else if (identity === "ghosty") {
      offsetX += Math.cos(angle + Math.PI) * swirlRadius - 40 * env;
      offsetY += Math.sin(angle + Math.PI) * (swirlRadius * 0.6) + 120 * env;
      offsetRot += Math.sin(angle + Math.PI) * 12 * env;

      if (p < 0.25) {
        squashX *= 0.94;
        squashY *= 1.06;
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
  // Yellow snuggles next to Green; both compress 4.5%, Green yields 20px left
  // =========================================================================
  const SQUEEZE_START = TIMING.SQUEEZE_START;
  const SQUEEZE_DURATION = TIMING.SQUEEZE_DURATION;
  if (frame >= SQUEEZE_START && frame < SQUEEZE_START + SQUEEZE_DURATION) {
    const p = (frame - SQUEEZE_START) / SQUEEZE_DURATION;
    const env = Math.sin(p * Math.PI);

    if (identity === "boxy") {
      const approach = p < 0.4 ? (p / 0.4) * -45 : -45 + ((p - 0.4) / 0.6) * 15;
      offsetX += approach * env;
      offsetY -= Math.sin(p * Math.PI) * 10;
      offsetRot -= 5 * env;
      squashX *= 1 - 0.05 * env;
      squashY *= 1 + 0.045 * env;
    } else if (identity === "rocky") {
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
      const threadX = Math.sin(p * Math.PI) * 520 * env;
      const threadY = Math.sin(p * Math.PI) * -85 * env;
      offsetX += threadX;
      offsetY += threadY;
      offsetRot += Math.sin(p * Math.PI * 2) * 14 * env;
      squashX *= 1 + 0.045 * env;
      squashY *= 1 - 0.04 * env;
    } else if (identity === "ghosty") {
      offsetY -= Math.sin(p * Math.PI) * 28 * env;
      offsetRot += 5 * env;
    } else if (identity === "rocky") {
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
      offsetX += Math.sin(p * Math.PI) * -110 * env;
      offsetY += Math.sin(p * Math.PI) * 45 * env;
      offsetRot -= Math.sin(p * Math.PI) * 6 * env;
    } else if (identity === "ghosty") {
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
