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

import { Easing, interpolate } from "remotion";
import { AllyIdentity } from "../constants/allyStates";
import { TIMING } from "../constants/timing";
import { BRAND_GATHER_POSITIONS, HEADLINE_LAYOUT, POST_ACTION_ANCHORS } from "../constants/layout";
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
 * Evaluates Green's (Rocky) physical logo bump and smooth recoil return.
 * Range: f519 - f574 (55 frames, impact at f532)
 *
 * Motion Lifecycle:
 * 1. Approach / Surge (frames 0 to 13, f519..f532):
 *    Green accelerates up and right from (0,0) toward the lower-left corner of the Allies logo.
 *    Reaches peak displacement (x = +185px, y = -140px) at f532 with forward flight lean (+12deg).
 * 2. Peak Impact at f532:
 *    Green compresses elastically on contact (squashX = 1.08, squashY = 0.92) while triggering the logo jiggle reaction.
 * 3. Elastic Recoil & Continuous Deceleration Return (frames 13 to 55, f532..f574):
 *    Green recoils smoothly back from the logo, decelerating exponentially back to (0, 0, 0deg)
 *    and seamlessly resumes undisturbed ambient floating with zero jump.
 */
function evaluateGreenLogoBump(frame: number): {
  x: number;
  y: number;
  rotDeg: number;
  squashX: number;
  squashY: number;
} {
  const START = TIMING.GREEN_SOLO_TURN_START; // f519
  const DURATION = TIMING.GREEN_SOLO_TURN_DURATION; // 55f

  if (frame < START) {
    return { x: 0, y: 0, rotDeg: 0, squashX: 1, squashY: 1 };
  }

  const age = frame - START;

  // 1. Approach / Surge toward logo (frames 0 to 13)
  if (age <= 13) {
    const inP = age / 13;
    const easeIn = inP * inP;
    const x = 100.0 * easeIn;
    const y = -65.0 * easeIn;
    const rotDeg = 8.0 * easeIn;

    let squashX = 1.0 - 0.03 * Math.sin(inP * Math.PI);
    let squashY = 1.0 + 0.03 * Math.sin(inP * Math.PI);
    if (age === 13) {
      // Peak impact compression
      squashX = 1.06;
      squashY = 0.94;
    }
    return { x, y, rotDeg, squashX, squashY };
  }

  // 2. Post-collision recoil & smooth continuous return to starting position
  const outP = Math.min(1, (age - 13) / (DURATION - 13));
  const decay = Math.exp(-outP * 3.4);

  // Recoils smoothly from x=100 to x=0, and y=-65 to y=0
  const recoilX = 100.0 * decay;
  const recoilY = -65.0 * decay;
  const rotDeg = 8.0 * decay;

  const contact = evaluateContactResponse(frame, {
    startFrame: START + 13,
    durationFrames: 25,
    impactAngleRad: Math.PI * 0.25,
    maxCompression: 0.07,
    maxRecoil: 22,
  });

  return {
    x: recoilX,
    y: recoilY,
    rotDeg,
    squashX: contact.squashX,
    squashY: contact.squashY,
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
  const color = IDENTITY_TO_COLOR[identity];
  const origin = BRAND_GATHER_POSITIONS[color];
  const postAnchor = POST_ACTION_ANCHORS[color];

  // Each ally stops ambient offsets when their own domain-edge anticipation begins (startFrame - 8)
  const DOMAIN_EDGE_START_FRAMES: Record<AllyIdentity, number> = {
    rolly: TIMING.BLUE_DOMAIN_EDGE_START - 8,
    ghosty: TIMING.PINK_DOMAIN_EDGE_START - 8,
    rocky: TIMING.GREEN_DOMAIN_EDGE_START - 8,
    boxy: TIMING.YELLOW_DOMAIN_EDGE_START - 8,
  };

  if (frame >= DOMAIN_EDGE_START_FRAMES[identity]) {
    return {
      x: 0,
      y: 0,
      rotDeg: 0,
      squashX: 1,
      squashY: 1,
      activeAction: "none",
      baseAnchorX: postAnchor.x,
      baseAnchorY: postAnchor.y,
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
      const bump = evaluateGreenLogoBump(frame);
      const isBumpActive =
        frame >= TIMING.GREEN_SOLO_TURN_START &&
        frame < TIMING.GREEN_SOLO_TURN_START + TIMING.GREEN_SOLO_TURN_DURATION;

      return {
        x: bump.x,
        y: bump.y,
        rotDeg: bump.rotDeg,
        squashX: bump.squashX,
        squashY: bump.squashY,
        activeAction: isBumpActive ? "green-turn" : "drift",
        baseAnchorX: origin.x + (frame >= TIMING.GREEN_SOLO_TURN_START ? bump.x : 0),
        baseAnchorY: origin.y + (frame >= TIMING.GREEN_SOLO_TURN_START ? bump.y : 0),
      };
    }

    case "ghosty": { // Pink
      // Before recenter settles (frame 406), Pink hovers above "allies" at (2820, 700)
      // and glides down and left to (2660, 1020) alongside the centered "allies" text
      let recenterShiftX = 0;
      let recenterShiftY = 0;
      if (frame < TIMING.BRAND_RECENTER_START) {
        recenterShiftX = 0;
        recenterShiftY = 0;
      } else if (frame <= TIMING.BRAND_RECENTER_END) {
        const p = interpolate(
          frame,
          [TIMING.BRAND_RECENTER_START, TIMING.BRAND_RECENTER_END],
          [0, 1],
          {
            easing: Easing.bezier(0.22, 1, 0.36, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );
        recenterShiftX = (2660 - 2820) * p; // -160 * p
        recenterShiftY = (1020 - 700) * p;  // +320 * p
      } else {
        recenterShiftX = 2660 - 2820; // -160
        recenterShiftY = 1020 - 700;  // +320
      }

      const boop = evaluatePinkBoop(frame);
      const isBoopActive =
        frame >= TIMING.PINK_BOOP_START &&
        frame < TIMING.PINK_BOOP_START + TIMING.PINK_BOOP_DURATION;

      return {
        x: boop.x + recenterShiftX,
        y: boop.y + recenterShiftY,
        rotDeg: boop.rotDeg,
        squashX: boop.squashX,
        squashY: boop.squashY,
        activeAction: isBoopActive ? "pink-boop" : "drift",
        baseAnchorX: origin.x + recenterShiftX + (frame >= TIMING.PINK_BOOP_START ? boop.x : 0),
        baseAnchorY: origin.y + recenterShiftY + (frame >= TIMING.PINK_BOOP_START ? boop.y : 0),
      };
    }
  }
}
