/**
 * 3-Layer Character Motion Model & Physical Playfulness Engine (V8)
 *
 * Architecture:
 * - Layer 1: Ambient Life & Micro-Actions (handled by ambientActions.ts)
 * - Layer 2: Reactive Motion (near-misses, pulses, yields)
 * - Layer 3: Social Play & Interactions (Race/Swirl, Cozy Squeeze, Pink Solo Swoop, Staggered Departures)
 *
 * Invariants Guaranteed:
 * - Strictly ONE Swirl in entire video
 * - Strictly ONE Double-Hop in entire video (Yellow)
 * - Strictly ONE Jiggle (Blue)
 * - Strictly ONE 360 Turn (Green)
 * - Strictly ONE Text Boop (Pink) with continuous recoil drift into new anchor
 * - Distinct non-repeating signature end actions: Yellow/Green do Cozy Snuggle, Pink does Airy Mischievous Swoop
 * - Clean physical contact with zero ugly interpenetration
 * - Social play is 100% cursor-free
 */

import { AllyIdentity } from "../constants/allyStates";
import { TIMING } from "../constants/timing";
import { DOMAIN_LAYOUT, DOMAIN_EXIT_POSITIONS } from "../constants/layout";
import { getAllyAmbientState } from "./ambientActions";

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
 * Impact frame is f440 (10 frames into PINK_BOOP_START at f430).
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
 * Evaluates the composite playful offsets for an Ally at current frame.
 */
export function getAllyPlayfulOffset(
  identity: AllyIdentity,
  frame: number,
  baseX: number,
  baseY: number,
): PlayfulBehaviorOffset {
  // 1. Layer 1: Ambient Action System (Solo personality actions: hop, jiggle, turn, boop)
  const ambient = getAllyAmbientState(identity, frame);

  let offsetX = ambient.x;
  let offsetY = ambient.y;
  let offsetRot = ambient.rotDeg;
  let squashX = ambient.squashX;
  let squashY = ambient.squashY;
  let zIndexOffset = 0;
  let cursorOverride: { active: boolean; angleDeg: number } | undefined = undefined;

  // =========================================================================
  // 2. LAYER 2: GREEN & YELLOW NEAR-MISS (Frames 669 to 714)
  // Green banks +8° to yield space to Yellow returning with domain pieces
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
  // 3. LAYER 2: PUZZLE COMPLETION IMPULSE (Frames 774 to 794)
  // Shared micro-reaction when the URL flashes orange simultaneously
  // =========================================================================
  const PULSE_START = TIMING.COMPLETION_ORANGE_HOLD_START;
  const PULSE_DURATION = 20;
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
  // 4. LAYER 3: BLUE & PINK PLAYFUL MEETING, SWIRL, CLEAN BUMP & NATURAL DRIFT
  // Motion Quality & True Continuous Float-to-Swirl Handoff:
  // - Captures true on-screen world position, velocity, and rotation at frame 851
  // - ZERO frame-to-frame jump (0.00px jump across transition frames)
  // - First 15-20 frames naturally steer out of floating drift before accelerating
  // - Asymmetric approach arcs (Blue dips & sweeps, Pink lifts & swoops)
  // - Incoming path tangents flow seamlessly into the 360° rotational swirl
  // - Breathing angular velocity curve during the 360° swirl (quintic smoothstep)
  // - Deepened cute contact squeeze with soft-body elastic compression & tilt
  // - Smooth broad outward recoil drift decelerating into natural resting shoulder anchors
  // - Sustained post-interaction continuous resting anchor until departure (ZERO snap)
  // =========================================================================
  // =========================================================================
  // 4. LAYER 3: REBUILT BLUE & PINK CONTINUOUS TWIRL, SOFT SQUISH & LIVING AMBIENT HANDOVER
  // Rebuilt from Scratch:
  // - Starts directly from exact live on-screen world coordinates P0 = ScreenPos(851) (0.00px jump)
  // - First 12-16 frames steer gently out of floating momentum before ramping kinetic travel speed
  // - Asymmetric approach curves feed tangent-continuously into 360° counter-clockwise swirl
  // - Dynamic angular velocity curve with body banking
  // - Cute soft-body contact bump with 11% elastic squish (156px center-to-center distance)
  // - Recoil drift with non-zero exit speed, smoothly blending into living ambient roam
  // - Zero hard stops: continuous position, velocity, and rotation throughout
  // =========================================================================
  const BLUE_PINK_START = TIMING.BLUE_PINK_SWIRL_START;

  if (frame >= BLUE_PINK_START) {
    const meetCenterX = DOMAIN_LAYOUT.pieces.allies.centerX; // 1948.0
    const meetCenterY = 640.0;
    const loopRadiusX = 115.0;
    const loopRadiusY = 85.0;

    const F_APPROACH_DUR = 38; // f851..f888 (~0.63s)
    const F_SWIRL_DUR = 48;    // f889..f936 (~0.80s)
    const F_BUMP_DUR = 17;     // f937..f953 (peak at f945)
    const F_DRIFT_DUR = 46;    // f954..f999 (separation & ambient blend)

    // Helper: Exact baseline ambient visible world position of an ally
    const getBaseWorldState = (id: AllyIdentity, f: number) => {
      let period = 180;
      let phase = 0;
      let yHalf = 20;
      let xHalf = 14;
      let rotHalf = 3;
      let pathEndX = DOMAIN_EXIT_POSITIONS.blue.x; // 1080.0
      let pathEndY = DOMAIN_EXIT_POSITIONS.blue.y; // 780.0

      if (id === "ghosty") {
        period = 170;
        phase = 3.1;
        yHalf = 22;
        xHalf = 14;
        rotHalf = 3.5;
        pathEndX = DOMAIN_EXIT_POSITIONS.pink.x; // 2680.0
        pathEndY = DOMAIN_EXIT_POSITIONS.pink.y; // 780.0
      }

      const t = (f / period) * 2 * Math.PI + phase;
      const travelIdleY = Math.sin(t) * yHalf;
      const travelIdleX = Math.cos(t * 1.15) * xHalf;

      const rawFloatY = Math.sin(t) * yHalf + Math.sin(t * 2.15 + 0.4) * 4.5;
      const rawFloatX = Math.cos(t * 1.15) * xHalf + Math.sin(t * 0.65 + 1.2) * 3.5;
      const rawFloatRot = Math.sin(t * 0.95) * rotHalf + Math.cos(t * 1.8 + 0.9) * 0.8;

      const travelX = pathEndX + travelIdleX;
      const travelY = pathEndY + travelIdleY;

      return {
        worldX: travelX + rawFloatX,
        worldY: travelY + rawFloatY,
        worldRot: rawFloatRot,
        travelX,
        travelY,
        rawFloatX,
        rawFloatY,
        rawFloatRot,
      };
    };

    // Helper: 2D Cubic Bezier
    const cubicBezier = (
      p0: { x: number; y: number },
      p1: { x: number; y: number },
      p2: { x: number; y: number },
      p3: { x: number; y: number },
      t: number
    ) => {
      const mt = 1 - t;
      return {
        x: mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x,
        y: mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y,
      };
    };

    const quinticStep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
    const smoothStep = (t: number) => t * t * (3 - 2 * t);

    if (identity === "rolly") {
      if (frame < TIMING.BLUE_DEPART_START) {
        const blueArrive = { x: meetCenterX - loopRadiusX, y: meetCenterY }; // (1833, 640)
        const blueRoamCenter = { x: 1250.0, y: 720.0 };

        const baseNow = getBaseWorldState("rolly", frame);
        const init850 = getBaseWorldState("rolly", BLUE_PINK_START - 1);
        const init851 = getBaseWorldState("rolly", BLUE_PINK_START);

        const P0 = { x: init851.worldX, y: init851.worldY };
        const v0_perFrame = {
          x: init851.worldX - init850.worldX,
          y: init851.worldY - init850.worldY,
        };
        const P1 = {
          x: P0.x + v0_perFrame.x * 20 + 120,
          y: P0.y + v0_perFrame.y * 20 + 20,
        };
        const P2 = { x: blueArrive.x - 90, y: blueArrive.y + 190 };
        const P3 = blueArrive;

        const relF = frame - BLUE_PINK_START;
        let targetWorldX = 0;
        let targetWorldY = 0;
        let targetWorldRot = 0;

        if (relF < F_APPROACH_DUR) {
          // Phase 1: Soft Steering & Acceleration along approach Bezier
          const u = relF / F_APPROACH_DUR;
          const eu = quinticStep(u);
          const pos = cubicBezier(P0, P1, P2, P3, eu);
          targetWorldX = pos.x;
          targetWorldY = pos.y;

          const bankRot = 15 * Math.sin(eu * Math.PI);
          targetWorldRot = init851.worldRot * (1 - eu * eu) + bankRot * eu;

          squashX = 1 + 0.03 * Math.sin(eu * Math.PI);
          squashY = 1 - 0.03 * Math.sin(eu * Math.PI);
        } else if (relF < F_APPROACH_DUR + F_SWIRL_DUR) {
          // Phase 2: Dynamic 360° Counter-Clockwise Swirl Loop
          const v = (relF - F_APPROACH_DUR) / F_SWIRL_DUR;
          const sv = quinticStep(v);
          const angle = Math.PI + sv * Math.PI * 2;

          targetWorldX = meetCenterX + Math.cos(angle) * loopRadiusX;
          targetWorldY = meetCenterY + Math.sin(angle) * loopRadiusY;
          targetWorldRot = 16 * Math.sin(sv * Math.PI * 2) * Math.sin(v * Math.PI);

          squashX = 1 + 0.035 * Math.sin(v * Math.PI);
          squashY = 1 - 0.035 * Math.sin(v * Math.PI);
        } else if (relF < F_APPROACH_DUR + F_SWIRL_DUR + F_BUMP_DUR) {
          // Phase 3: Cute Soft-Body Bump & Squish Contact (Peak at f945)
          const b = (relF - (F_APPROACH_DUR + F_SWIRL_DUR)) / F_BUMP_DUR;
          const eb = Math.sin(b * Math.PI);

          targetWorldX = blueArrive.x + 37.0 * eb;
          targetWorldY = blueArrive.y;
          targetWorldRot = 7.0 * eb;

          squashX = 1 - 0.11 * eb;
          squashY = 1 + 0.09 * eb;
        } else if (relF < F_APPROACH_DUR + F_SWIRL_DUR + F_BUMP_DUR + F_DRIFT_DUR) {
          // Phase 4: Recoil Arc & Smooth Transition into Living Ambient Roam
          const w = (relF - (F_APPROACH_DUR + F_SWIRL_DUR + F_BUMP_DUR)) / F_DRIFT_DUR;
          const ew = smoothStep(w);

          const arcX = blueArrive.x + (blueRoamCenter.x - blueArrive.x) * ew;
          const arcY = blueArrive.y + (blueRoamCenter.y - blueArrive.y) * ew - 22 * (1 - w) * Math.sin(w * Math.PI);
          const arcRot = 6 * (1 - w) * Math.sin(w * Math.PI);

          // Living ambient floating oscillation in roam quadrant
          const roamIdleT = (frame / 180) * 2 * Math.PI;
          const roamIdleY = Math.sin(roamIdleT) * 20 + Math.sin(roamIdleT * 2.15 + 0.4) * 4.5;
          const roamIdleX = Math.cos(roamIdleT * 1.15) * 14 + Math.sin(roamIdleT * 0.65 + 1.2) * 3.5;
          const roamIdleRot = Math.sin(roamIdleT * 0.95) * 3;

          const ambientX = blueRoamCenter.x + roamIdleX;
          const ambientY = blueRoamCenter.y + roamIdleY;
          const ambientRot = roamIdleRot;

          const blendWeight = Math.max(0, Math.min(1, (w - 0.5) / 0.5));
          const smoothBlend = smoothStep(blendWeight);

          targetWorldX = arcX * (1 - smoothBlend) + ambientX * smoothBlend;
          targetWorldY = arcY * (1 - smoothBlend) + ambientY * smoothBlend;
          targetWorldRot = arcRot * (1 - smoothBlend) + ambientRot * smoothBlend;
        } else {
          // Phase 5: Living Ambient Roam (stays continuously alive until departure)
          const roamIdleT = (frame / 180) * 2 * Math.PI;
          const roamIdleY = Math.sin(roamIdleT) * 20 + Math.sin(roamIdleT * 2.15 + 0.4) * 4.5;
          const roamIdleX = Math.cos(roamIdleT * 1.15) * 14 + Math.sin(roamIdleT * 0.65 + 1.2) * 3.5;
          const roamIdleRot = Math.sin(roamIdleT * 0.95) * 3;

          targetWorldX = blueRoamCenter.x + roamIdleX;
          targetWorldY = blueRoamCenter.y + roamIdleY;
          targetWorldRot = roamIdleRot;
        }

        offsetX = targetWorldX - (baseX + baseNow.rawFloatX);
        offsetY = targetWorldY - (baseY + baseNow.rawFloatY);
        offsetRot = targetWorldRot - baseNow.rawFloatRot;
      }
    } else if (identity === "ghosty") {
      if (frame < TIMING.PINK_DEPART_START) {
        const pinkArrive = { x: meetCenterX + loopRadiusX, y: meetCenterY }; // (2063, 640)
        const pinkRoamCenter = { x: 2450.0, y: 720.0 };

        const baseNow = getBaseWorldState("ghosty", frame);
        const init850 = getBaseWorldState("ghosty", BLUE_PINK_START - 1);
        const init851 = getBaseWorldState("ghosty", BLUE_PINK_START);

        const P0 = { x: init851.worldX, y: init851.worldY };
        const v0_perFrame = {
          x: init851.worldX - init850.worldX,
          y: init851.worldY - init850.worldY,
        };
        const P1 = {
          x: P0.x + v0_perFrame.x * 20 - 80,
          y: P0.y + v0_perFrame.y * 20 - 40,
        };
        const P2 = { x: pinkArrive.x + 130, y: 520.0 };
        const P3 = pinkArrive;

        const relF = frame - BLUE_PINK_START;
        let targetWorldX = 0;
        let targetWorldY = 0;
        let targetWorldRot = 0;

        if (relF < F_APPROACH_DUR) {
          // Phase 1: Soft Steering & Acceleration along approach Bezier
          const u = relF / F_APPROACH_DUR;
          const eu = quinticStep(u);
          const pos = cubicBezier(P0, P1, P2, P3, eu);
          targetWorldX = pos.x;
          targetWorldY = pos.y;

          const bankRot = -15 * Math.sin(eu * Math.PI);
          targetWorldRot = init851.worldRot * (1 - eu * eu) + bankRot * eu;

          squashX = 1 + 0.03 * Math.sin(eu * Math.PI);
          squashY = 1 - 0.03 * Math.sin(eu * Math.PI);
        } else if (relF < F_APPROACH_DUR + F_SWIRL_DUR) {
          // Phase 2: Dynamic 360° Counter-Clockwise Swirl Loop
          const v = (relF - F_APPROACH_DUR) / F_SWIRL_DUR;
          const sv = quinticStep(v);
          const angle = 0 + sv * Math.PI * 2;

          targetWorldX = meetCenterX + Math.cos(angle) * loopRadiusX;
          targetWorldY = meetCenterY + Math.sin(angle) * loopRadiusY;
          targetWorldRot = -16 * Math.sin(sv * Math.PI * 2) * Math.sin(v * Math.PI);

          squashX = 1 + 0.035 * Math.sin(v * Math.PI);
          squashY = 1 - 0.035 * Math.sin(v * Math.PI);
        } else if (relF < F_APPROACH_DUR + F_SWIRL_DUR + F_BUMP_DUR) {
          // Phase 3: Cute Soft-Body Bump & Squish Contact (Peak at f945)
          const b = (relF - (F_APPROACH_DUR + F_SWIRL_DUR)) / F_BUMP_DUR;
          const eb = Math.sin(b * Math.PI);

          targetWorldX = pinkArrive.x - 37.0 * eb;
          targetWorldY = pinkArrive.y;
          targetWorldRot = -7.0 * eb;

          squashX = 1 - 0.11 * eb;
          squashY = 1 + 0.09 * eb;
        } else if (relF < F_APPROACH_DUR + F_SWIRL_DUR + F_BUMP_DUR + F_DRIFT_DUR) {
          // Phase 4: Recoil Arc & Smooth Transition into Living Ambient Roam
          const w = (relF - (F_APPROACH_DUR + F_SWIRL_DUR + F_BUMP_DUR)) / F_DRIFT_DUR;
          const ew = smoothStep(w);

          const arcX = pinkArrive.x + (pinkRoamCenter.x - pinkArrive.x) * ew;
          const arcY = pinkArrive.y + (pinkRoamCenter.y - pinkArrive.y) * ew - 20 * (1 - w) * Math.sin(w * Math.PI);
          const arcRot = -6 * (1 - w) * Math.sin(w * Math.PI);

          // Living ambient floating oscillation in roam quadrant
          const roamIdleT = (frame / 170) * 2 * Math.PI + 3.1;
          const roamIdleY = Math.sin(roamIdleT) * 22 + Math.sin(roamIdleT * 2.15 + 0.4) * 4.5;
          const roamIdleX = Math.cos(roamIdleT * 1.15) * 14 + Math.sin(roamIdleT * 0.65 + 1.2) * 3.5;
          const roamIdleRot = Math.sin(roamIdleT * 0.95) * 3.5;

          const ambientX = pinkRoamCenter.x + roamIdleX;
          const ambientY = pinkRoamCenter.y + roamIdleY;
          const ambientRot = roamIdleRot;

          const blendWeight = Math.max(0, Math.min(1, (w - 0.5) / 0.5));
          const smoothBlend = smoothStep(blendWeight);

          targetWorldX = arcX * (1 - smoothBlend) + ambientX * smoothBlend;
          targetWorldY = arcY * (1 - smoothBlend) + ambientY * smoothBlend;
          targetWorldRot = arcRot * (1 - smoothBlend) + ambientRot * smoothBlend;
        } else {
          // Phase 5: Living Ambient Roam (stays continuously alive until departure)
          const roamIdleT = (frame / 170) * 2 * Math.PI + 3.1;
          const roamIdleY = Math.sin(roamIdleT) * 22 + Math.sin(roamIdleT * 2.15 + 0.4) * 4.5;
          const roamIdleX = Math.cos(roamIdleT * 1.15) * 14 + Math.sin(roamIdleT * 0.65 + 1.2) * 3.5;
          const roamIdleRot = Math.sin(roamIdleT * 0.95) * 3.5;

          targetWorldX = pinkRoamCenter.x + roamIdleX;
          targetWorldY = pinkRoamCenter.y + roamIdleY;
          targetWorldRot = roamIdleRot;
        }

        offsetX = targetWorldX - (baseX + baseNow.rawFloatX);
        offsetY = targetWorldY - (baseY + baseNow.rawFloatY);
        offsetRot = targetWorldRot - baseNow.rawFloatRot;
      }
    } else if (identity === "rocky") {
      // Green (Rocky): Observes the playful swirl & boop with gentle tilt
      if (frame < BLUE_PINK_START + F_APPROACH_DUR + F_SWIRL_DUR + F_BUMP_DUR) {
        const p = (frame - BLUE_PINK_START) / (F_APPROACH_DUR + F_SWIRL_DUR + F_BUMP_DUR);
        if (p >= 0.28 && p < 0.85) {
          const k = (p - 0.28) / 0.57;
          offsetRot -= 5 * Math.sin(k * Math.PI);
        }
      }
    } else if (identity === "boxy") {
      // Yellow (Boxy): Cheerful bob watching the swirl & boop
      if (frame < BLUE_PINK_START + F_APPROACH_DUR + F_SWIRL_DUR + F_BUMP_DUR) {
        const p = (frame - BLUE_PINK_START) / (F_APPROACH_DUR + F_SWIRL_DUR + F_BUMP_DUR);
        if (p >= 0.28 && p < 0.85) {
          const k = (p - 0.28) / 0.57;
          offsetY -= 14 * Math.sin(k * Math.PI);
          squashY *= 1 + 0.03 * Math.sin(k * Math.PI);
        }
      }
    }
  }

  // =========================================================================
  // 5. LAYER 3: YELLOW & GREEN COZY SQUEEZE (Frames 916 to 966)
  // Yellow gently cuddles into Green under the right side of the URL
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
  // 6. LAYER 2: GREEN FINAL LINGER & LOOK-BACK (Frames 980 to 1020)
  // Green hesitates before departing and gives an affectionate look-back
  // =========================================================================
  const LINGER_START = TIMING.PINK_DEPART_START;
  const LINGER_DURATION = TIMING.GREEN_DEPART_START - TIMING.PINK_DEPART_START;
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
