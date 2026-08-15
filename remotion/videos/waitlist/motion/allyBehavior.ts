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
 * Evaluates smooth interactive behaviors and spontaneous playful choreography.
 * All offsets seamlessly return 0 outside of active interaction windows.
 */
export function getAllyPlayfulOffset(
  identity: AllyIdentity,
  frame: number,
  baseX: number,
  baseY: number
): PlayfulBehaviorOffset {
  let offsetX = 0;
  let offsetY = 0;
  let offsetRot = 0;
  let squashX = 1;
  let squashY = 1;

  // =========================================================================
  // 1. GATHER HOLD SWIRL DANCE (Frames 500 to 575)
  // Blue (Rolly) & Pink (Ghosty) meet above [LOGO] allies and swirl around each other
  // Green (Rocky) & Yellow (Boxy) eagerly watch and bounce
  // =========================================================================
  const SWIRL_1_START = 500;
  const SWIRL_1_DURATION = 75;
  if (frame >= SWIRL_1_START && frame < SWIRL_1_START + SWIRL_1_DURATION) {
    const p = (frame - SWIRL_1_START) / SWIRL_1_DURATION;
    const env = Math.sin(p * Math.PI); // Smooth 0 -> 1 -> 0 bell envelope
    const easeProgress = 0.5 - 0.5 * Math.cos(p * Math.PI);

    // Mutual swirl center above the central logo
    const swirlCenterX = (BRAND_GATHER_POSITIONS.blue.x + BRAND_GATHER_POSITIONS.pink.x) / 2;
    const swirlCenterY = 700;
    const swirlRadius = 140 * env;
    const revolutions = 2.25;
    const angle = easeProgress * revolutions * Math.PI * 2;

    if (identity === "rolly") {
      // Blue orbits clockwise starting from top-left
      const targetX = swirlCenterX + Math.cos(angle + Math.PI * 0.8) * swirlRadius;
      const targetY = swirlCenterY + Math.sin(angle + Math.PI * 0.8) * (swirlRadius * 0.75);
      offsetX += (targetX - baseX) * env;
      offsetY += (targetY - baseY) * env;
      offsetRot += Math.sin(angle) * 22 * env;
      squashX += Math.sin(p * Math.PI * 4) * 0.08 * env;
      squashY -= Math.sin(p * Math.PI * 4) * 0.08 * env;
    } else if (identity === "ghosty") {
      // Pink orbits opposite to Blue
      const targetX = swirlCenterX + Math.cos(angle + Math.PI * 1.8) * swirlRadius;
      const targetY = swirlCenterY + Math.sin(angle + Math.PI * 1.8) * (swirlRadius * 0.75);
      offsetX += (targetX - baseX) * env;
      offsetY += (targetY - baseY) * env;
      offsetRot += Math.sin(angle + Math.PI) * 24 * env;
      squashX += Math.sin(p * Math.PI * 4) * 0.08 * env;
      squashY -= Math.sin(p * Math.PI * 4) * 0.08 * env;
    } else if (identity === "rocky" || identity === "boxy") {
      // Green and Yellow watch the swirl above them and do excited hops
      const hop = Math.abs(Math.sin(p * Math.PI * 3.5)) * 26 * env;
      offsetY -= hop;
      offsetRot += (identity === "rocky" ? 7 : -7) * Math.sin(p * Math.PI * 2) * env;
      squashX -= Math.sin(p * Math.PI * 7) * 0.06 * env;
      squashY += Math.sin(p * Math.PI * 7) * 0.06 * env;
    }
  }

  // =========================================================================
  // 2. ENTRANCE HOLD PLAYFUL MICRO-ACTIONS (Frames 270 to 320)
  // Yellow does an excited double-hop; Blue does a curious alert tilt
  // =========================================================================
  const HOP_START = 270;
  const HOP_DURATION = 35;
  if (frame >= HOP_START && frame < HOP_START + HOP_DURATION) {
    const p = (frame - HOP_START) / HOP_DURATION;
    const env = Math.sin(p * Math.PI);
    if (identity === "boxy") {
      const hop = Math.abs(Math.sin(p * Math.PI * 2.5)) * 24 * env;
      offsetY -= hop;
      offsetRot += Math.sin(p * Math.PI * 3) * 6 * env;
      squashX -= Math.sin(p * Math.PI * 5) * 0.07 * env;
      squashY += Math.sin(p * Math.PI * 5) * 0.07 * env;
    } else if (identity === "rolly") {
      offsetRot += Math.sin(p * Math.PI * 2) * 8 * env;
    }
  }

  // =========================================================================
  // 3. POST-DOMAIN ASSEMBLY CELEBRATION 1 (Frames 960 to 1040)
  // Rocky (Green) & Boxy (Yellow) do a playful swirl loop on the right side of .io
  // =========================================================================
  const CELEB_1_START = 960;
  const CELEB_1_DURATION = 80;
  if (frame >= CELEB_1_START && frame < CELEB_1_START + CELEB_1_DURATION) {
    const p = (frame - CELEB_1_START) / CELEB_1_DURATION;
    const env = Math.sin(p * Math.PI);
    const easeProgress = 0.5 - 0.5 * Math.cos(p * Math.PI);

    const celebCenterX = DOMAIN_LAYOUT.pieces.o.centerX + 260;
    const celebCenterY = DOMAIN_LAYOUT.centerY + 140;
    const swirlRadius = 110 * env;
    const angle = easeProgress * 2.0 * Math.PI * 2;

    if (identity === "rocky") {
      const targetX = celebCenterX + Math.cos(angle) * swirlRadius;
      const targetY = celebCenterY + Math.sin(angle) * (swirlRadius * 0.7);
      offsetX += (targetX - baseX) * env;
      offsetY += (targetY - baseY) * env;
      offsetRot += Math.sin(angle) * 18 * env;
      squashX += Math.sin(p * Math.PI * 4) * 0.06 * env;
      squashY -= Math.sin(p * Math.PI * 4) * 0.06 * env;
    } else if (identity === "boxy") {
      const targetX = celebCenterX + Math.cos(angle + Math.PI) * swirlRadius;
      const targetY = celebCenterY + Math.sin(angle + Math.PI) * (swirlRadius * 0.7);
      offsetX += (targetX - baseX) * env;
      offsetY += (targetY - baseY) * env;
      offsetRot += Math.sin(angle + Math.PI) * 18 * env;
      squashX += Math.sin(p * Math.PI * 4) * 0.06 * env;
      squashY -= Math.sin(p * Math.PI * 4) * 0.06 * env;
    } else if (identity === "rolly" || identity === "ghosty") {
      // Blue and Pink cheer with gentle bobs
      const hop = Math.abs(Math.sin(p * Math.PI * 2)) * 14 * env;
      offsetY -= hop;
      offsetRot += (identity === "rolly" ? -5 : 5) * env;
    }
  }

  // =========================================================================
  // 4. POST-DOMAIN ASSEMBLY CELEBRATION 2 (Frames 1090 to 1180)
  // Rolly (Blue) & Ghosty (Pink) do a celebratory arc over yourallies
  // =========================================================================
  const CELEB_2_START = 1090;
  const CELEB_2_DURATION = 85;
  if (frame >= CELEB_2_START && frame < CELEB_2_START + CELEB_2_DURATION) {
    const p = (frame - CELEB_2_START) / CELEB_2_DURATION;
    const env = Math.sin(p * Math.PI);
    const easeProgress = 0.5 - 0.5 * Math.cos(p * Math.PI);

    const celebCenterX = DOMAIN_LAYOUT.pieces.allies.centerX;
    const celebCenterY = DOMAIN_LAYOUT.centerY - 320;
    const swirlRadius = 160 * env;
    const angle = easeProgress * 2.0 * Math.PI * 2;

    if (identity === "rolly") {
      const targetX = celebCenterX + Math.cos(angle + Math.PI * 0.5) * swirlRadius;
      const targetY = celebCenterY + Math.sin(angle + Math.PI * 0.5) * (swirlRadius * 0.65);
      offsetX += (targetX - baseX) * env;
      offsetY += (targetY - baseY) * env;
      offsetRot += Math.sin(angle) * 20 * env;
      squashX += Math.sin(p * Math.PI * 4) * 0.07 * env;
      squashY -= Math.sin(p * Math.PI * 4) * 0.07 * env;
    } else if (identity === "ghosty") {
      const targetX = celebCenterX + Math.cos(angle + Math.PI * 1.5) * swirlRadius;
      const targetY = celebCenterY + Math.sin(angle + Math.PI * 1.5) * (swirlRadius * 0.65);
      offsetX += (targetX - baseX) * env;
      offsetY += (targetY - baseY) * env;
      offsetRot += Math.sin(angle + Math.PI) * 22 * env;
      squashX += Math.sin(p * Math.PI * 4) * 0.07 * env;
      squashY -= Math.sin(p * Math.PI * 4) * 0.07 * env;
    } else if (identity === "rocky" || identity === "boxy") {
      const hop = Math.abs(Math.sin(p * Math.PI * 3)) * 18 * env;
      offsetY -= hop;
      offsetRot += (identity === "rocky" ? 6 : -6) * Math.sin(p * Math.PI * 2) * env;
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
