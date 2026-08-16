/**
 * Deterministic Ambient Action & Idle Motion Architecture (V7)
 *
 * Principles:
 * 1. World-Space State Evolution:
 *    current ally state -> ambient action -> resulting ally state -> normal drift continues from there.
 *    NEVER: home position -> action offset -> animation ends -> snap back to home.
 * 2. Distinct Solo Actions:
 *    - Yellow (Boxy): Signature double-hop with flight stretch and contact squish.
 *    - Blue (Rolly): Energetic micro-jiggle / shimmy with soft-body deformation.
 *    - Green (Rocky): Organic 360-degree full body turn with anticipation and speed ramp.
 *    - Pink (Ghosty): Physical text bump on 'allies' text with recoil drift into a new resting position.
 * 3. 100% Deterministic & Remotion-pure:
 *    - Zero Math.random() during render.
 *    - Frame-by-frame mathematical continuity (C0 position continuity, C1 velocity continuity).
 * 4. Cursor Rule:
 *    - Zero cursors during ambient actions.
 */

import { AllyIdentity } from "../constants/allyStates";
import { TIMING } from "../constants/timing";
import { BRAND_GATHER_POSITIONS } from "../constants/layout";
import { evaluateContactResponse } from "./contactPhysics";

export type AmbientActionType =
  | "yellow-hop"
  | "blue-jiggle"
  | "green-turn"
  | "pink-boop"
  | "drift"
  | "none";

export interface AmbientActionState {
  x: number;
  y: number;
  rotDeg: number;
  squashX: number;
  squashY: number;
  activeAction: AmbientActionType;
  baseAnchorX: number;
  baseAnchorY: number;
}

/**
 * Checks whether an ally is actively participating in a major task/movement
 * (e.g. entrance travel, domain piece retrieval/drag, final departure, or race).
 * When isAllyBusy is false, the ally is eligible for ambient life and micro-actions.
 */
export function isAllyBusy(identity: AllyIdentity, frame: number): boolean {
  switch (identity) {
    case "rolly": // Blue
      if (frame < TIMING.BLUE_ENTRANCE_START + TIMING.BLUE_ENTRANCE_DURATION) return true;
      if (frame >= TIMING.BLUE_DOMAIN_EDGE_START && frame < TIMING.DOMAIN_PIECES_SETTLED + 50) return true;
      if (frame >= TIMING.BLUE_DEPART_START) return true;
      return false;

    case "rocky": // Green
      if (frame < TIMING.GREEN_ENTRANCE_START + TIMING.GREEN_ENTRANCE_DURATION) return true;
      if (frame >= TIMING.GREEN_DOMAIN_EDGE_START && frame < TIMING.DOMAIN_PIECES_SETTLED + 50) return true;
      if (frame >= TIMING.GREEN_DEPART_START) return true;
      return false;

    case "ghosty": // Pink
      if (frame < TIMING.PINK_ENTRANCE_START + TIMING.PINK_ENTRANCE_DURATION) return true;
      if (frame >= TIMING.PINK_DOMAIN_EDGE_START && frame < TIMING.DOMAIN_PIECES_SETTLED + 50) return true;
      if (frame >= TIMING.PINK_DEPART_START) return true;
      return false;

    case "boxy": // Yellow
      if (frame < TIMING.YELLOW_ENTRANCE_START + TIMING.YELLOW_ENTRANCE_DURATION) return true;
      if (frame >= TIMING.YELLOW_DOMAIN_EDGE_START && frame < TIMING.DOMAIN_PIECES_SETTLED + 50) return true;
      if (frame >= TIMING.YELLOW_DEPART_START) return true;
      return false;
  }
}

/**
 * Evaluates Yellow's (Boxy) signature double-hop.
 * Range: f240 - f305 (65 frames)
 * Settles with a net shift of (+25px X, -15px Y) to (2085, 1425).
 */
function evaluateYellowHop(frame: number): {
  x: number;
  y: number;
  rotDeg: number;
  squashX: number;
  squashY: number;
} {
  const START = TIMING.YELLOW_DOUBLE_HOP_START; // f240
  const DURATION = TIMING.YELLOW_DOUBLE_HOP_DURATION; // 65f

  if (frame < START) {
    return { x: 0, y: 0, rotDeg: 0, squashX: 1, squashY: 1 };
  }

  const p = Math.min(1, (frame - START) / DURATION);
  const env = Math.sin(p * Math.PI);

  // Double-hop cycle: 2 buoyant parabolic arcs
  const hopCycle = Math.sin(p * Math.PI * 4);
  const hopHeight = Math.max(0, hopCycle) * 34 * env;

  // Progressive net drift during the hop
  const netX = p * 25;
  const netY = -p * 15;

  const y = -hopHeight + netY;
  const x = netX;
  const rotDeg = Math.sin(p * Math.PI * 2) * 7 * env;

  let squashX = 1;
  let squashY = 1;
  if (hopHeight > 4) {
    squashX = 0.93;
    squashY = 1.07;
  } else if (env > 0.1) {
    squashX = 1.06;
    squashY = 0.94;
  }

  return { x, y, rotDeg, squashX, squashY };
}

/**
 * Evaluates Blue's (Rolly) energetic micro-jiggle / shimmy.
 * Range: f470 - f502 (32 frames)
 * Settles with a net shift of (+12px X, -8px Y) to (1692, 712).
 */
function evaluateBlueJiggle(frame: number): {
  x: number;
  y: number;
  rotDeg: number;
  squashX: number;
  squashY: number;
} {
  const START = TIMING.BLUE_SOLO_JIGGLE_START; // f470
  const DURATION = TIMING.BLUE_SOLO_JIGGLE_DURATION; // 32f

  if (frame < START) {
    return { x: 0, y: 0, rotDeg: 0, squashX: 1, squashY: 1 };
  }

  const p = Math.min(1, (frame - START) / DURATION);
  const env = Math.sin(p * Math.PI);

  // 3 alternating organic side-to-side micro oscillations
  const shimmyX = Math.sin(p * Math.PI * 3.5) * 8.5 * env;
  const bobY = -Math.sin(p * Math.PI * 7.0) * 3.5 * env;

  // Progressive net translation
  const netX = p * 12;
  const netY = -p * 8;

  const x = shimmyX + netX;
  const y = bobY + netY;
  const rotDeg = Math.sin(p * Math.PI * 3.5) * 6.0 * env;

  const squashX = 1 + Math.sin(p * Math.PI * 7.0) * 0.045 * env;
  const squashY = 1 - Math.sin(p * Math.PI * 7.0) * 0.045 * env;

  return { x, y, rotDeg, squashX, squashY };
}

/**
 * Evaluates Green's (Rocky) organic 360-degree full body turn and icon gesture.
 * Range: f519 - f569 (50 frames)
 *
 * Sequence:
 * 1. Anticipation tilt (f519..f526): tilts back -8deg
 * 2. Full 360 body rotation around own center (f526..f548):
 *    Upright (0) -> Sideways (90) -> Upside down (180) -> Sideways (270) -> Upright (360)
 *    Smooth quintic angular velocity curve with peak speed at upside-down midpoint.
 *    Stays in local area with subtle natural breath (not orbiting in a circle).
 * 3. Settle upright & notice icon (f548..f553): stabilizes facing forward.
 * 4. Gesture toward visible Allies logo mark (f553..f562):
 *    "Hey, look at this" - curves gently toward the icon (dx = +28px, dy = -20px),
 *    leans body toward the icon (+7.5deg tilt), lingers.
 * 5. Smooth curve away into new resting offset (f562..f569):
 *    Decelerates smoothly into natural resting anchor (+16px X, -12px Y, 0deg)
 *    which flows continuously into subsequent idle drift without any snap.
 */
function evaluateGreenTurn(frame: number): {
  x: number;
  y: number;
  rotDeg: number;
  squashX: number;
  squashY: number;
} {
  const START = TIMING.GREEN_SOLO_TURN_START; // f519
  const DURATION = TIMING.GREEN_SOLO_TURN_DURATION; // 50f

  if (frame < START) {
    return { x: 0, y: 0, rotDeg: 0, squashX: 1, squashY: 1 };
  }

  const p = Math.min(1, (frame - START) / DURATION);

  // Phase 1: Anticipation back-tilt (0 -> 0.09, ~6 frames)
  if (p < 0.09) {
    const tau = p / 0.09;
    const anticEase = tau * tau;
    return {
      x: tau * 1.5,
      y: -tau * 1.0,
      rotDeg: -8.0 * anticEase,
      squashX: 1.0 + 0.025 * anticEase,
      squashY: 1.0 - 0.025 * anticEase,
    };
  }

  // Phase 2: Full 360 Body Rotation around own center (0.09 -> 0.43, ~22 frames)
  // Literal body rotation: Upright -> Sideways -> Upside down at 180° -> Sideways -> Upright
  if (p < 0.43) {
    const tau = (p - 0.09) / 0.34;
    // Quintic smoothstep for smooth acceleration & deceleration
    const eased = tau * tau * tau * (tau * (tau * 6 - 15) + 10);
    // Continuous rotation from -8deg to 360deg
    const rotDeg = -8.0 * (1 - eased) + 360.0 * eased;

    // Body deformation during spin (maximum near midpoint)
    const spinSquash = Math.sin(tau * Math.PI) * 0.04;
    const localFloatX = 1.5 + Math.sin(tau * Math.PI) * 3.5;
    const localFloatY = -1.0 - Math.sin(tau * Math.PI) * 4.0;

    return {
      x: localFloatX,
      y: localFloatY,
      rotDeg,
      squashX: 1.0 - spinSquash,
      squashY: 1.0 + spinSquash,
    };
  }

  // Phase 3: Settle Upright & Notice Logo (0.43 -> 0.51, ~5 frames)
  if (p < 0.51) {
    const tau = (p - 0.43) / 0.08;
    const settleEase = tau * tau * (3 - 2 * tau);
    return {
      x: 1.5 + (1 - settleEase) * 3.5,
      y: -1.0 - (1 - settleEase) * 4.0,
      rotDeg: 360.0,
      squashX: 1.0,
      squashY: 1.0,
    };
  }

  // Phase 4: First Nudge / Lean Gesture toward Allies Logo (0.51 -> 0.69, ~12 frames)
  // "Hey, look at this" - moves +85px X, -60px Y toward logo, leans +10deg, eases back slightly
  if (p < 0.69) {
    const tau = (p - 0.51) / 0.18;
    const nudgeEnv = Math.sin(tau * Math.PI);
    const returnEnv = tau * tau;
    const x = 1.5 + 85.0 * nudgeEnv + 35.0 * returnEnv;
    const y = -1.0 - 60.0 * nudgeEnv - 25.0 * returnEnv;
    const rot = 360.0 + 10.0 * nudgeEnv + 4.0 * returnEnv;
    const gestureSquash = nudgeEnv * 0.04;

    return {
      x,
      y,
      rotDeg: rot,
      squashX: 1.0 - gestureSquash,
      squashY: 1.0 + gestureSquash,
    };
  }

  // Phase 5: Second Nudge toward Logo (0.69 -> 0.89, ~13 frames)
  // Noticeably closer to logo: moves +115px X, -80px Y, leans +13deg, lingers clearly
  if (p < 0.89) {
    const tau = (p - 0.69) / 0.20;
    const nudgeEnv = Math.sin(tau * Math.PI);
    const x = 36.5 + (115.0 - 36.5) * nudgeEnv;
    const y = -26.0 + (-80.0 - (-26.0)) * nudgeEnv;
    const rot = 364.0 + 9.0 * nudgeEnv;
    const gestureSquash = nudgeEnv * 0.05;

    return {
      x,
      y,
      rotDeg: rot,
      squashX: 1.0 - gestureSquash,
      squashY: 1.0 + gestureSquash,
    };
  }

  // Phase 6: Smooth ease into resting anchor (0.89 -> 1.0, ~7 frames)
  const tau = (p - 0.89) / 0.11;
  const recoverEase = tau * tau * (3 - 2 * tau);
  const endX = 36.5 + (28.0 - 36.5) * recoverEase;
  const endY = -26.0 + (-20.0 - (-26.0)) * recoverEase;
  const endRot = 364.0 + (360.0 - 364.0) * recoverEase;

  return {
    x: endX,
    y: endY,
    rotDeg: endRot,
    squashX: 1.0,
    squashY: 1.0,
  };
}


/**
 * Evaluates Pink's (Ghosty) physical text boop and post-collision recoil drift.
 * Range: f430 - f470 (40 frames, impact at f440)
 * Settles with a net shift of (-80px X, -50px Y) to (2580, 970).
 */
function evaluatePinkBoop(frame: number): {
  x: number;
  y: number;
  rotDeg: number;
  squashX: number;
  squashY: number;
} {
  const START = TIMING.PINK_BOOP_START; // f430
  const DURATION = TIMING.PINK_BOOP_DURATION; // 40f

  if (frame < START) {
    return { x: 0, y: 0, rotDeg: 0, squashX: 1, squashY: 1 };
  }

  const age = frame - START;

  // 1. Approach right edge of "allies" text (frames 0 to 10)
  if (age <= 10) {
    const inP = age / 10;
    const easeIn = inP * inP;
    const x = -170 * easeIn;
    const y = 40 * easeIn;
    const rotDeg = -10 * easeIn;

    let squashX = 1;
    let squashY = 1;
    if (age === 10) {
      // Peak impact compression at f440
      squashX = 0.94;
      squashY = 1.06;
    }
    return { x, y, rotDeg, squashX, squashY };
  }

  // 2. Post-collision recoil & continuous drag deceleration into new resting anchor
  const outP = Math.min(1, (age - 10) / (DURATION - 10));
  const decay = Math.exp(-outP * 3.2);

  // Recoils smoothly from x=-170 to x=-80, and y=+40 to y=-50
  const recoilX = -170 + (1 - decay) * 90;
  const recoilY = 40 - (1 - decay) * 90;
  const rotDeg = -10 * decay;

  const contact = evaluateContactResponse(frame, {
    startFrame: START + 10,
    durationFrames: 25,
    impactAngleRad: -Math.PI * 0.2,
    maxCompression: 0.06,
    maxRecoil: 20,
  });

  return {
    x: recoilX,
    y: recoilY,
    rotDeg,
    squashX: contact.squashX,
    squashY: contact.squashY,
  };
}

const IDENTITY_TO_COLOR: Record<AllyIdentity, "blue" | "green" | "pink" | "yellow"> = {
  rolly: "blue",
  rocky: "green",
  ghosty: "pink",
  boxy: "yellow",
};

/**
 * Master Deterministic Ambient State Evaluator.
 * Returns the ally's exact world-space anchor and micro-action deformation at any frame.
 */
export function getAllyAmbientState(
  identity: AllyIdentity,
  frame: number,
): AmbientActionState {
  const origin = BRAND_GATHER_POSITIONS[IDENTITY_TO_COLOR[identity]];

  // Once domain fetch begins at frame 614, allies travel along dedicated Bézier segments
  if (frame >= TIMING.DOMAIN_EDGE_START) {
    return {
      x: 0,
      y: 0,
      rotDeg: 0,
      squashX: 1,
      squashY: 1,
      activeAction: "none",
      baseAnchorX: origin.x,
      baseAnchorY: origin.y,
    };
  }

  switch (identity) {
    case "boxy": { // Yellow
      const hop = evaluateYellowHop(frame);
      const isHopActive =
        frame >= TIMING.YELLOW_DOUBLE_HOP_START &&
        frame < TIMING.YELLOW_DOUBLE_HOP_START + TIMING.YELLOW_DOUBLE_HOP_DURATION;

      return {
        x: hop.x,
        y: hop.y,
        rotDeg: hop.rotDeg,
        squashX: hop.squashX,
        squashY: hop.squashY,
        activeAction: isHopActive ? "yellow-hop" : "drift",
        baseAnchorX: origin.x + (frame >= TIMING.YELLOW_DOUBLE_HOP_START ? hop.x : 0),
        baseAnchorY: origin.y + (frame >= TIMING.YELLOW_DOUBLE_HOP_START ? hop.y : 0),
      };
    }

    case "rolly": { // Blue
      const jiggle = evaluateBlueJiggle(frame);
      const isJiggleActive =
        frame >= TIMING.BLUE_SOLO_JIGGLE_START &&
        frame < TIMING.BLUE_SOLO_JIGGLE_START + TIMING.BLUE_SOLO_JIGGLE_DURATION;

      return {
        x: jiggle.x,
        y: jiggle.y,
        rotDeg: jiggle.rotDeg,
        squashX: jiggle.squashX,
        squashY: jiggle.squashY,
        activeAction: isJiggleActive ? "blue-jiggle" : "drift",
        baseAnchorX: origin.x + (frame >= TIMING.BLUE_SOLO_JIGGLE_START ? jiggle.x : 0),
        baseAnchorY: origin.y + (frame >= TIMING.BLUE_SOLO_JIGGLE_START ? jiggle.y : 0),
      };
    }

    case "rocky": { // Green
      const turn = evaluateGreenTurn(frame);
      const isTurnActive =
        frame >= TIMING.GREEN_SOLO_TURN_START &&
        frame < TIMING.GREEN_SOLO_TURN_START + TIMING.GREEN_SOLO_TURN_DURATION;

      return {
        x: turn.x,
        y: turn.y,
        rotDeg: turn.rotDeg,
        squashX: turn.squashX,
        squashY: turn.squashY,
        activeAction: isTurnActive ? "green-turn" : "drift",
        baseAnchorX: origin.x + (frame >= TIMING.GREEN_SOLO_TURN_START ? turn.x : 0),
        baseAnchorY: origin.y + (frame >= TIMING.GREEN_SOLO_TURN_START ? turn.y : 0),
      };
    }

    case "ghosty": { // Pink
      const boop = evaluatePinkBoop(frame);
      const isBoopActive =
        frame >= TIMING.PINK_BOOP_START &&
        frame < TIMING.PINK_BOOP_START + TIMING.PINK_BOOP_DURATION;

      return {
        x: boop.x,
        y: boop.y,
        rotDeg: boop.rotDeg,
        squashX: boop.squashX,
        squashY: boop.squashY,
        activeAction: isBoopActive ? "pink-boop" : "drift",
        baseAnchorX: origin.x + (frame >= TIMING.PINK_BOOP_START ? boop.x : 0),
        baseAnchorY: origin.y + (frame >= TIMING.PINK_BOOP_START ? boop.y : 0),
      };
    }
  }
}
