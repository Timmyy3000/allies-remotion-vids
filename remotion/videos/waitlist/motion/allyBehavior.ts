import { AllyIdentity } from "../constants/allyStates";
import { BRAND_GATHER_POSITIONS, DOMAIN_LAYOUT } from "../constants/layout";

export interface PlayfulBehaviorOffset {
  x: number;
  y: number;
  rotDeg: number;
  squashX: number;
  squashY: number;
}

/**
 * Calculates directional 2D squash & stretch given a contact angle and compression magnitude.
 * Compresses along the collision normal and expands orthogonally to preserve visual volume.
 */
function getContactSquish(
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
 * Social Autonomy & Physicality Engine
 *
 * Implements non-repetitive, organic, physics-informed interactions:
 * - 1. Soft boop + recoil with directional contact squish
 * - 2. Make-space yielding side-step
 * - 3. Curiosity hover and alert typography inspection
 * - 4. Max ONE single gentle half-orbit greeting in the entire video
 * - 5. Non-repeating celebratory hop-and-peel
 * - 6. No magnet snap-backs: all motions ease into natural new drift positions
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

  // =========================================================================
  // 1. ENTRANCE HOLD INTERACTIONS (Frames 270 to 350)
  // - Yellow (Boxy): Cheerful double-hop with physical bounce
  // - Blue (Rolly): Curiosity Hover leaning toward center headline
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
  // 2. GATHER INSPECTION: MAKE-SPACE SIDE-STEP (Frames 465 to 515)
  // Green (Rocky) notices Yellow (Boxy) approaching and yields space with a smooth side-step
  // =========================================================================
  const MAKE_SPACE_START = 465;
  const MAKE_SPACE_DURATION = 50;
  if (frame >= MAKE_SPACE_START && frame < MAKE_SPACE_START + MAKE_SPACE_DURATION) {
    const p = (frame - MAKE_SPACE_START) / MAKE_SPACE_DURATION;
    const env = Math.sin(p * Math.PI);
    if (identity === "rocky") {
      // Smooth side-step to the left and slight tilt
      const shiftX = -Math.sin(p * Math.PI) * 38 * env;
      const shiftY = Math.sin(p * Math.PI) * 12 * env;
      offsetX += shiftX;
      offsetY += shiftY;
      offsetRot -= Math.sin(p * Math.PI) * 6 * env;
    }
  }

  // =========================================================================
  // 3. GATHER INSPECTION: SOFT BOOP + RECOIL & CONTACT SQUISH (Frames 515 to 575)
  // Pink (Ghosty) and Blue (Rolly) meet near logo top; Pink gives Blue a soft boop.
  // Both compress 6.5% along collision axis, recoil, and drift to new positions.
  // =========================================================================
  const BOOP_START = 515;
  const BOOP_DURATION = 60;
  if (frame >= BOOP_START && frame < BOOP_START + BOOP_DURATION) {
    const p = (frame - BOOP_START) / BOOP_DURATION;
    const env = Math.sin(p * Math.PI);

    // Contact peak happens around p = 0.35 (frame 536)
    const contactP = Math.max(0, 1 - Math.abs(p - 0.35) / 0.25);
    const contactEnv = Math.sin(contactP * Math.PI * 0.5);

    if (identity === "ghosty") {
      // Pink moves toward Blue (dx = -50), boops, recoils (+25)
      const approach = p < 0.35
        ? (p / 0.35) * -45
        : -45 + ((p - 0.35) / 0.65) * 65;
      offsetX += approach * env;
      offsetRot += Math.sin(p * Math.PI) * 12 * env;

      if (contactEnv > 0) {
        const squish = getContactSquish(0, 0.065 * contactEnv);
        squashX *= squish.squashX;
        squashY *= squish.squashY;
      }
    } else if (identity === "rolly") {
      // Blue absorbs the boop at p = 0.35 and recoils left (-35px)
      const recoil = p > 0.35
        ? Math.sin(((p - 0.35) / 0.65) * Math.PI) * -38
        : 0;
      offsetX += recoil * env;
      offsetRot -= Math.sin(p * Math.PI) * 10 * env;

      if (contactEnv > 0) {
        const squish = getContactSquish(0, 0.065 * contactEnv);
        squashX *= squish.squashX;
        squashY *= squish.squashY;
      }
    } else if (identity === "rocky" || identity === "boxy") {
      // Green and Yellow watch the boop and give small attentive tilts
      offsetRot += (identity === "rocky" ? 4 : -4) * env;
    }
  }

  // =========================================================================
  // 4. GATHER INSPECTION: SINGLE GENTLE HALF-ORBIT GREETING (Frames 575 to 620)
  // Ghosty and Rolly do a subtle, relaxed 180° passing greeting (ONLY orbit in video)
  // =========================================================================
  const GREET_START = 575;
  const GREET_DURATION = 45;
  if (frame >= GREET_START && frame < GREET_START + GREET_DURATION) {
    const p = (frame - GREET_START) / GREET_DURATION;
    const env = Math.sin(p * Math.PI);
    const easeProgress = 0.5 - 0.5 * Math.cos(p * Math.PI);

    const greetRadius = 70 * env;
    const angle = easeProgress * Math.PI; // Exact 180° half-turn

    if (identity === "rolly") {
      offsetX += Math.cos(angle) * greetRadius;
      offsetY += Math.sin(angle) * (greetRadius * 0.5);
      offsetRot += Math.sin(angle) * 8 * env;
    } else if (identity === "ghosty") {
      offsetX += Math.cos(angle + Math.PI) * greetRadius;
      offsetY += Math.sin(angle + Math.PI) * (greetRadius * 0.5);
      offsetRot += Math.sin(angle + Math.PI) * 8 * env;
    }
  }

  // =========================================================================
  // 5. POST-DOMAIN ASSEMBLY CELEBRATION (Frames 960 to 1050)
  // Rocky (Green) & Boxy (Yellow): Cheerful follow-and-peel hop & drift (NO SWIRLS)
  // =========================================================================
  const CELEB_1_START = 960;
  const CELEB_1_DURATION = 80;
  if (frame >= CELEB_1_START && frame < CELEB_1_START + CELEB_1_DURATION) {
    const p = (frame - CELEB_1_START) / CELEB_1_DURATION;
    const env = Math.sin(p * Math.PI);

    if (identity === "boxy") {
      // Boxy leads with an excited double-hop and outward glide
      const hop = Math.max(0, Math.sin(p * Math.PI * 3)) * 28 * env;
      offsetY -= hop;
      offsetX += Math.sin(p * Math.PI) * 22 * env;
      offsetRot += Math.sin(p * Math.PI * 2) * 10 * env;
      squashX += (hop > 2 ? -0.06 : 0.05) * env;
      squashY += (hop > 2 ? 0.06 : -0.05) * env;
    } else if (identity === "rocky") {
      // Rocky follows in a soft peel arc
      const delayedP = Math.max(0, p - 0.12) / 0.88;
      const delayedEnv = Math.sin(delayedP * Math.PI);
      const hop = Math.max(0, Math.sin(delayedP * Math.PI * 3)) * 22 * delayedEnv;
      offsetY -= hop;
      offsetX -= Math.sin(delayedP * Math.PI) * 18 * delayedEnv;
      offsetRot -= Math.sin(delayedP * Math.PI * 2) * 8 * delayedEnv;
      squashX += (hop > 2 ? -0.05 : 0.04) * delayedEnv;
      squashY += (hop > 2 ? 0.05 : -0.05) * delayedEnv;
    } else if (identity === "rolly" || identity === "ghosty") {
      // Blue and Pink give synchronized gentle bobs of approval
      const bob = Math.sin(p * Math.PI * 2) * 10 * env;
      offsetY -= Math.max(0, bob);
      offsetRot += (identity === "rolly" ? -4 : 4) * env;
    }
  }

  // =========================================================================
  // 6. POST-DOMAIN ASSEMBLY: ELEVATED VICTORY ARC (Frames 1080 to 1170)
  // Rolly (Blue) & Ghosty (Pink) perform an elegant elevated arching glide over "your"
  // with generous text clearance (NO SWIRLS)
  // =========================================================================
  const CELEB_2_START = 1080;
  const CELEB_2_DURATION = 85;
  if (frame >= CELEB_2_START && frame < CELEB_2_START + CELEB_2_DURATION) {
    const p = (frame - CELEB_2_START) / CELEB_2_DURATION;
    const env = Math.sin(p * Math.PI);

    if (identity === "rolly") {
      // Blue arches gracefully upward and to the right, then eases back
      const arcY = Math.sin(p * Math.PI) * -50 * env;
      const arcX = Math.sin(p * Math.PI * 2) * 35 * env;
      offsetY += arcY;
      offsetX += arcX;
      offsetRot += Math.sin(p * Math.PI * 2) * 12 * env;
      squashX += Math.sin(p * Math.PI * 4) * 0.04 * env;
      squashY -= Math.sin(p * Math.PI * 4) * 0.04 * env;
    } else if (identity === "ghosty") {
      // Pink accompanies with a mirrored buoyant glide
      const arcY = Math.sin(p * Math.PI) * -45 * env;
      const arcX = Math.sin(p * Math.PI * 2) * -30 * env;
      offsetY += arcY;
      offsetX += arcX;
      offsetRot += Math.sin(p * Math.PI * 2) * 12 * env;
      squashX += Math.sin(p * Math.PI * 4) * 0.04 * env;
      squashY -= Math.sin(p * Math.PI * 4) * 0.04 * env;
    } else if (identity === "rocky" || identity === "boxy") {
      // Green and Yellow hop together from below
      const hop = Math.max(0, Math.sin(p * Math.PI * 3)) * 14 * env;
      offsetY -= hop;
      offsetRot += (identity === "rocky" ? 4 : -4) * Math.sin(p * Math.PI * 2) * env;
    }
  }

  return {
    x: offsetX,
    y: offsetY,
    rotDeg: offsetRot,
    squashX,
    squashY,
  };
}
