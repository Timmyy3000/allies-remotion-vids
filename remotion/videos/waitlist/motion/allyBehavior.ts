import { AllyIdentity } from "../constants/allyStates";
import { PLAY_EVENTS } from "./playRegistry";

export interface PlayfulBehaviorOffset {
  x: number;
  y: number;
  rotDeg: number;
  squashX: number;
  squashY: number;
  cursorOverride?: {
    active: boolean;
    angleDeg: number;
  };
}

/**
 * Calculates directional 2D squash & stretch given a contact angle and compression magnitude.
 * Compresses along the collision normal and expands orthogonally to preserve visual volume.
 */
export function getContactSquish(
  angleRad: number,
  compression: number,
): { squashX: number; squashY: number } {
  const cos2 = Math.cos(angleRad) * Math.cos(angleRad);
  const sin2 = Math.sin(angleRad) * Math.sin(angleRad);
  // Compression along normal (c), expansion orthogonal (+ c/2)
  const sx = 1 - compression * cos2 + (compression * 0.5) * sin2;
  const sy = 1 - compression * sin2 + (compression * 0.5) * cos2;
  return { squashX: sx, squashY: sy };
}

/**
 * Physical Reaction for the 'allies' text when booped by Pink.
 * Returns text displacement, rotation, and squash factors.
 */
export function getTextBoopReaction(frame: number): {
  x: number;
  y: number;
  rotDeg: number;
  scaleX: number;
  scaleY: number;
} {
  const BOOP_START = 495;
  const BOOP_DURATION = 32;

  if (frame < BOOP_START || frame >= BOOP_START + BOOP_DURATION) {
    return { x: 0, y: 0, rotDeg: 0, scaleX: 1, scaleY: 1 };
  }

  const p = (frame - BOOP_START) / BOOP_DURATION;
  // Impact occurs at frame 500 (p = 0.15)
  if (p < 0.15) {
    return { x: 0, y: 0, rotDeg: 0, scaleX: 1, scaleY: 1 };
  }

  const impactT = (p - 0.15) / 0.85;
  // Elastic damped response: squish -> recoil -> single slight overshoot -> settle
  const decay = Math.exp(-impactT * 4.8);
  const osc = Math.sin(impactT * Math.PI * 2.2);

  // Pink hits from top-right towards down-left: displacement in (-X, +Y)
  const dispX = -18 * decay * osc;
  const dispY = 10 * decay * osc;
  const rot = -1.2 * decay * osc;

  // 4.5% compression along impact axis, orthogonal expansion
  const compression = 0.045 * decay * Math.max(0, Math.sin(impactT * Math.PI));
  const squish = getContactSquish(Math.PI * 0.25, compression);

  return {
    x: dispX,
    y: dispY,
    rotDeg: rot,
    scaleX: squish.squashX,
    scaleY: squish.squashY,
  };
}

/**
 * Multi-Layered Playfulness & Physicality Engine
 *
 * Implements 3 distinct behavioral tiers:
 * - Layer A: Continuous subtle ambient life (drifts, bobs, gazes)
 * - Layer B: Spontaneous micro-reactions (make-space side-steps, race-avoidance, near-misses)
 * - Layer C: Hero playful moments (Pink sweep, text boop, race, ONE single swirl, cozy squeeze-in)
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
  let cursorOverride: { active: boolean; angleDeg: number } | undefined = undefined;

  // =========================================================================
  // LAYER C1. ENTRANCE LIFE & BOXY DOUBLE-HOP (Frames 270 to 335)
  // - Yellow (Boxy): Cheerful double-hop with physical bounce
  // - Blue (Rolly): Curiosity Hover leaning toward headline
  // - Green (Rocky) & Pink (Ghosty): Delayed copycat micro-bobs
  // =========================================================================
  const ENTRANCE_ACT_START = 270;
  const ENTRANCE_ACT_DURATION = 65;
  if (frame >= ENTRANCE_ACT_START && frame < ENTRANCE_ACT_START + ENTRANCE_ACT_DURATION) {
    const p = (frame - ENTRANCE_ACT_START) / ENTRANCE_ACT_DURATION;
    const env = Math.sin(p * Math.PI);

    if (identity === "boxy") {
      // Cheerful double-hop with bounce
      const hopCycle = Math.sin(p * Math.PI * 4);
      const hop = Math.max(0, hopCycle) * 26 * env;
      offsetY -= hop;
      offsetRot += Math.sin(p * Math.PI * 2) * 5 * env;
      squashX += (hop > 2 ? -0.06 : 0.05) * env;
      squashY += (hop > 2 ? 0.06 : -0.05) * env;
    } else if (identity === "rolly") {
      // Curiosity Hover: leans inward to inspect the headline
      const leanX = Math.sin(p * Math.PI) * 32 * env;
      const leanY = Math.sin(p * Math.PI) * 14 * env;
      offsetX += leanX;
      offsetY += leanY;
      offsetRot += Math.sin(p * Math.PI) * 10 * env;
    } else if (identity === "rocky" || identity === "ghosty") {
      // Gentle delayed copycat bob
      const delayedP = Math.max(0, p - 0.15) / 0.85;
      const delayedEnv = Math.sin(delayedP * Math.PI);
      const bob = Math.sin(delayedP * Math.PI * 2) * 8 * delayedEnv;
      offsetY += bob;
      offsetRot += (identity === "rocky" ? 3 : -3) * delayedEnv;
    }
  }



  // =========================================================================
  // LAYER B1. GATHER INSPECTION: ROCKY MAKE-SPACE SIDE-STEP (Frames 465 to 505)
  // Green (Rocky) notices Yellow (Boxy) approaching and yields space with a smooth side-step
  // =========================================================================
  const MAKE_SPACE_START = 465;
  const MAKE_SPACE_DURATION = 40;
  if (frame >= MAKE_SPACE_START && frame < MAKE_SPACE_START + MAKE_SPACE_DURATION) {
    const p = (frame - MAKE_SPACE_START) / MAKE_SPACE_DURATION;
    const env = Math.sin(p * Math.PI);
    if (identity === "rocky") {
      const shiftX = -Math.sin(p * Math.PI) * 38 * env;
      const shiftY = Math.sin(p * Math.PI) * 12 * env;
      offsetX += shiftX;
      offsetY += shiftY;
      offsetRot -= Math.sin(p * Math.PI) * 6 * env;
    }
  }

  // =========================================================================
  // LAYER C3. PINK ACCIDENTAL TEXT BOOP ON 'allies' (Frames 495 to 535)
  // Pink approaches 'allies' curiously, bumps it at frame 500, squashes & recoils
  // =========================================================================
  const BOOP_START = 495;
  const BOOP_DURATION = 40;
  if (frame >= BOOP_START && frame < BOOP_START + BOOP_DURATION) {
    const p = (frame - BOOP_START) / BOOP_DURATION;
    const env = Math.sin(p * Math.PI);

    if (identity === "ghosty") {
      // Pink leans in towards 'allies' (dx = -60, dy = +45), contacts at p=0.15, recoils
      if (p < 0.15) {
        const inP = p / 0.15;
        offsetX -= inP * 55;
        offsetY += inP * 42;
        offsetRot -= inP * 10;
      } else {
        const outP = (p - 0.15) / 0.85;
        const decay = Math.exp(-outP * 3.5);
        const recoilX = -55 + (1 - decay) * 75;
        const recoilY = 42 - (1 - decay) * 58;
        offsetX += recoilX * env;
        offsetY += recoilY * env;
        offsetRot += (decay * -10 + (1 - decay) * 8) * env;

        // Contact squish along collision normal (-45°)
        const squishEnv = Math.sin(Math.min(1, outP * 2) * Math.PI);
        const squish = getContactSquish(Math.PI * 0.25, 0.055 * squishEnv);
        squashX *= squish.squashX;
        squashY *= squish.squashY;
      }
    }
  }



  // =========================================================================
  // LAYER B2. DOMAIN ASSEMBLY: GREEN & YELLOW NEAR-MISS (Frames 755 to 795)
  // Rocky (Green) and Boxy (Yellow) cross paths returning with 'i' and 'o';
  // Rocky executes a subtle bank correction (+8° lean, 16px shift) to avoid collision.
  // =========================================================================
  const NEAR_MISS_START = 755;
  const NEAR_MISS_DURATION = 40;
  if (frame >= NEAR_MISS_START && frame < NEAR_MISS_START + NEAR_MISS_DURATION) {
    const p = (frame - NEAR_MISS_START) / NEAR_MISS_DURATION;
    const env = Math.sin(p * Math.PI);

    if (identity === "rocky") {
      // Rocky banks slightly to the left/up
      offsetX -= Math.sin(p * Math.PI) * 16 * env;
      offsetY -= Math.sin(p * Math.PI) * 12 * env;
      offsetRot += Math.sin(p * Math.PI) * 8 * env;
    } else if (identity === "boxy") {
      // Boxy gives a subtle responsive dip
      offsetY += Math.sin(p * Math.PI) * 8 * env;
      offsetRot -= Math.sin(p * Math.PI) * 4 * env;
    }
  }

  // =========================================================================
  // LAYER C6. POST-ASSEMBLY COMPANIONSHIP: YELLOW/GREEN SQUEEZE-IN (Frames 890 to 955)
  // Boxy (Yellow) gently cuddles up to Rocky (Green) in lower right; both squish 4.5%
  // and Rocky yields 18px left, settling cozy together (NO SWIRLS).
  // =========================================================================
  const SQUEEZE_START = 890;
  const SQUEEZE_DURATION = 65;
  if (frame >= SQUEEZE_START && frame < SQUEEZE_START + SQUEEZE_DURATION) {
    const p = (frame - SQUEEZE_START) / SQUEEZE_DURATION;
    const env = Math.sin(p * Math.PI);
    const contactP = Math.max(0, 1 - Math.abs(p - 0.4) / 0.3);
    const contactEnv = Math.sin(contactP * Math.PI * 0.5);

    if (identity === "boxy") {
      // Boxy snuggles leftward toward Rocky
      const approach = p < 0.4 ? (p / 0.4) * -32 : -32 + ((p - 0.4) / 0.6) * 10;
      offsetX += approach * env;
      offsetRot -= Math.sin(p * Math.PI) * 6 * env;

      if (contactEnv > 0) {
        const squish = getContactSquish(0, 0.045 * contactEnv);
        squashX *= squish.squashX;
        squashY *= squish.squashY;
      }
    } else if (identity === "rocky") {
      // Rocky yields 18px to the left to welcome Boxy
      const yieldX = p > 0.35 ? Math.sin(((p - 0.35) / 0.65) * Math.PI) * -18 : 0;
      offsetX += yieldX * env;
      offsetRot += Math.sin(p * Math.PI) * 4 * env;

      if (contactEnv > 0) {
        const squish = getContactSquish(0, 0.045 * contactEnv);
        squashX *= squish.squashX;
        squashY *= squish.squashY;
      }
    }
  }

  // =========================================================================
  // LAYER C7. POST-DOMAIN ASSEMBLY: ELEVATED VICTORY ARC (Frames 1080 to 1165)
  // Rolly (Blue) & Ghosty (Pink) perform an elegant elevated arching glide over "your"
  // with generous 130px text clearance (NO SWIRLS)
  // =========================================================================
  const CELEB_2_START = 1080;
  const CELEB_2_DURATION = 85;
  if (frame >= CELEB_2_START && frame < CELEB_2_START + CELEB_2_DURATION) {
    const p = (frame - CELEB_2_START) / CELEB_2_DURATION;
    const env = Math.sin(p * Math.PI);

    if (identity === "rolly") {
      const arcY = Math.sin(p * Math.PI) * -50 * env;
      const arcX = Math.sin(p * Math.PI * 2) * 35 * env;
      offsetY += arcY;
      offsetX += arcX;
      offsetRot += Math.sin(p * Math.PI * 2) * 12 * env;
      squashX += Math.sin(p * Math.PI * 4) * 0.04 * env;
      squashY -= Math.sin(p * Math.PI * 4) * 0.04 * env;
    } else if (identity === "ghosty") {
      const arcY = Math.sin(p * Math.PI) * -45 * env;
      const arcX = Math.sin(p * Math.PI * 2) * -30 * env;
      offsetY += arcY;
      offsetX += arcX;
      offsetRot += Math.sin(p * Math.PI * 2) * 12 * env;
      squashX += Math.sin(p * Math.PI * 4) * 0.04 * env;
      squashY -= Math.sin(p * Math.PI * 4) * 0.04 * env;
    } else if (identity === "rocky" || identity === "boxy") {
      const hop = Math.max(0, Math.sin(p * Math.PI * 3)) * 12 * env;
      offsetY -= hop;
      offsetRot += (identity === "rocky" ? 3 : -3) * Math.sin(p * Math.PI * 2) * env;
    }
  }

  return {
    x: offsetX,
    y: offsetY,
    rotDeg: offsetRot,
    squashX,
    squashY,
    cursorOverride,
  };
}
