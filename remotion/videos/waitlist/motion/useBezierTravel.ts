import { getPointAtLength, getLength } from "@remotion/paths";
import { motionEasing } from "../constants/motionEasing";
import { AllyIdentity } from "../constants/allyStates";

export type AllyMotionState = "idle" | "anticipating" | "traveling" | "settling";

export interface IdleConfig {
  yRange: readonly [number, number];
  xRange: readonly [number, number];
  rotRange: readonly [number, number];
  periodFrames: number;
  phase: number;
}

export interface MotionSegment {
  id?: string;
  path: string;
  startFrame: number;
  durationInFrames: number;
  timingEase?: (t: number) => number;
}

export interface UseBezierTravelOptions {
  path?: string;
  startFrame?: number;
  durationInFrames?: number;
  segments?: MotionSegment[];
  frame: number;
  identity?: AllyIdentity;
  timingEase?: (t: number) => number;
  responsiveness?: number; // Follower physical inertia response (alpha in (0, 1), default 0.28)
  organicDeviation?: number; // Micro-deviation amplitude in px (default 1.5)
  anticipateFrames?: number; // Fade-in anticipation window (default: 8 frames)
  settleFadeLead?: number; // How many frames before duration end fade-out begins (default: 6 frames)
  settleFadeDuration?: number; // Duration of fade-out settle (default: 10 frames)
  orbSize?: number; // Ally orb diameter (default: 153px)
  pointerSize?: number; // Cursor pointer diameter (default: 110.5px)
  clearance?: number; // Visible edge-to-edge clearance (default: 35.0px)
  cursorSteerResponsiveness?: number; // Steering catch-up rate (default: 0.22, ~8-10 frames window)
  idle?: IdleConfig;
}

export interface BezierTravelResult {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  distance: number;
  totalLength: number;
  directionDeg: number; // Smoothed displayed cursor angle (in degrees)
  targetDirectionDeg: number; // Raw target heading from velocity / tangent (in degrees)
  cursorX: number; // Orbital X position relative to ally center
  cursorY: number; // Orbital Y position relative to ally center
  rawTargetCursorX: number; // Debug: Raw unsmoothed target cursor X
  rawTargetCursorY: number; // Debug: Raw unsmoothed target cursor Y
  cursorOrbitRadius: number; // Exact orbital track radius
  cursorAnchorRadius: number; // Ally radius + clearance (inner anchor distance)
  cursorOpacity: number; // 0 in IDLE, 0->1 in ANTICIPATING, 1 in TRAVELING, 1->0 in SETTLING
  cursorRadialFraction: number; // 0 (inside blob edge) -> 1 (full orbital track)
  blobSquashX: number; // Subtle character squash/stretch X scale (anticipation & spit/swallow reaction)
  blobSquashY: number; // Subtle character squash/stretch Y scale
  motionState: AllyMotionState;
  velocity: number;
  isTraveling: boolean;
  isSettled: boolean;
  idleWeight: number;
}

/**
 * Calculates the exact cursor orbit radius from ally center
 * guaranteeing an exact visual clearance (in pixels) between the circular
 * ally orb and the nearest visible rear boundary/wings of the cursor accessory.
 *
 * For orbSize = 153, pointerSize = 110.5, clearance = 35.0: orbitRadius = 140.965px (exact 35px clearance).
 */
export function calculateCursorOrbitRadius(
  orbSize: number = 153,
  pointerSize: number = 110.5,
  clearance: number = 35.0
): number {
  const orbRadius = orbSize / 2;
  const S = pointerSize / 110.5;
  const baseOffset = (9.4833 + 0.0625 * (clearance - 10.0)) * S;
  const targetD = orbRadius + clearance + baseOffset;
  const notchToCenter = 18.4197 * S;
  return targetD + notchToCenter;
}

/**
 * Evaluates the pure Bézier path target position at any fractional frame.
 */
function getRawTargetAtFrame(
  path: string,
  totalLength: number,
  f: number,
  startFrame: number,
  duration: number,
  timingEase: (t: number) => number
): { x: number; y: number; normalX: number; normalY: number; progress: number } {
  if (f <= startFrame) {
    const p = getPointAtLength(path, 0)!;
    const pNext = getPointAtLength(path, Math.min(totalLength, 1.0))!;
    const dx = pNext.x - p.x;
    const dy = pNext.y - p.y;
    const len = Math.hypot(dx, dy) || 1;
    return { x: p.x, y: p.y, normalX: -dy / len, normalY: dx / len, progress: 0 };
  }

  if (f >= startFrame + duration) {
    const p = getPointAtLength(path, totalLength)!;
    const pPrev = getPointAtLength(path, Math.max(0, totalLength - 1.0))!;
    const dx = p.x - pPrev.x;
    const dy = p.y - pPrev.y;
    const len = Math.hypot(dx, dy) || 1;
    return { x: p.x, y: p.y, normalX: -dy / len, normalY: dx / len, progress: 1 };
  }

  const rawP = Math.max(0, Math.min(1, (f - startFrame) / duration));
  const eased = timingEase(rawP);
  const dist = eased * totalLength;
  const p = getPointAtLength(path, dist)!;

  // Tangent & normal vector
  const delta = 1.0;
  const pA = getPointAtLength(path, Math.max(0, dist - delta))!;
  const pB = getPointAtLength(path, Math.min(totalLength, dist + delta))!;
  const tx = pB.x - pA.x;
  const ty = pB.y - pA.y;
  const tLen = Math.hypot(tx, ty) || 1;

  return {
    x: p.x,
    y: p.y,
    normalX: -ty / tLen,
    normalY: tx / tLen,
    progress: eased,
  };
}

/**
 * Deterministic Target + Follower Lag Engine:
 * Follows the target with controlled physical inertia and subtle course micro-variation.
 */
function getLaggedAllyTravelPosition(
  path: string,
  totalLength: number,
  f: number,
  startFrame: number,
  duration: number,
  timingEase: (t: number) => number,
  alpha: number,
  organicDeviation: number
): { x: number; y: number; targetX: number; targetY: number; progress: number } {
  const target = getRawTargetAtFrame(path, totalLength, f, startFrame, duration, timingEase);
  if (f <= startFrame) {
    return {
      x: target.x,
      y: target.y,
      targetX: target.x,
      targetY: target.y,
      progress: target.progress,
    };
  }

  // Follower integration step by step from startFrame
  const pStart = getPointAtLength(path, 0)!;
  let followerX = pStart.x;
  let followerY = pStart.y;

  const simStep = 0.5; // Fine sub-frame step for flawless integration
  const steps = Math.floor((f - startFrame) / simStep);

  for (let s = 1; s <= steps; s++) {
    const curF = startFrame + s * simStep;
    const curTarget = getRawTargetAtFrame(
      path,
      totalLength,
      curF,
      startFrame,
      duration,
      timingEase
    );
    const subAlpha = 1 - Math.pow(1 - alpha, simStep);
    followerX += (curTarget.x - followerX) * subAlpha;
    followerY += (curTarget.y - followerY) * subAlpha;
  }

  // Remaining fractional step
  const remainder = (f - startFrame) - steps * simStep;
  if (remainder > 0.001) {
    const curTarget = getRawTargetAtFrame(
      path,
      totalLength,
      f,
      startFrame,
      duration,
      timingEase
    );
    const subAlpha = 1 - Math.pow(1 - alpha, remainder);
    followerX += (curTarget.x - followerX) * subAlpha;
    followerY += (curTarget.y - followerY) * subAlpha;
  }

  // Smooth convergence window
  const settleWindow = 12;
  const settleStart = startFrame + duration;
  let blendFactor = 0;
  if (f >= settleStart) {
    blendFactor = Math.min(1, (f - settleStart) / settleWindow);
    blendFactor = blendFactor * blendFactor * (3 - 2 * blendFactor);
  }

  let finalX = followerX * (1 - blendFactor) + target.x * blendFactor;
  let finalY = followerY * (1 - blendFactor) + target.y * blendFactor;

  // Organic micro-deviation during active travel
  if (organicDeviation > 0 && target.progress > 0.02 && target.progress < 0.98) {
    const envelope = Math.sin(target.progress * Math.PI);
    const dev =
      Math.sin(target.progress * Math.PI * 4 + 1.2) *
      organicDeviation *
      envelope;
    finalX += target.normalX * dev;
    finalY += target.normalY * dev;
  }

  return {
    x: finalX,
    y: finalY,
    targetX: target.x,
    targetY: target.y,
    progress: target.progress,
  };
}

/**
 * Calculates complete visible position including smooth blending of idle oscillation.
 */
function getCompleteVisiblePosition(
  path: string,
  totalLength: number,
  f: number,
  startFrame: number,
  duration: number,
  timingEase: (t: number) => number,
  alpha: number,
  organicDeviation: number,
  idle?: IdleConfig
): {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  idleWeight: number;
} {
  const travel = getLaggedAllyTravelPosition(
    path,
    totalLength,
    f,
    startFrame,
    duration,
    timingEase,
    alpha,
    organicDeviation
  );

  if (!idle) {
    return { ...travel, idleWeight: 0 };
  }

  // Smooth blending of idle oscillation into arrival
  const idleStart = startFrame + duration - 8;
  const idleEnd = startFrame + duration + 12;
  let idleWeight = 0;
  if (f > idleStart) {
    const w = Math.min(1, Math.max(0, (f - idleStart) / (idleEnd - idleStart)));
    idleWeight = w * w * (3 - 2 * w); // Cubic Hermite smoothstep
  }

  const t = (f / idle.periodFrames) * 2 * Math.PI + idle.phase;
  const idleY = Math.sin(t) * ((idle.yRange[1] - idle.yRange[0]) / 2);
  const idleX = Math.cos(t * 1.15) * ((idle.xRange[1] - idle.xRange[0]) / 2);

  return {
    x: travel.x + idleX * idleWeight,
    y: travel.y + idleY * idleWeight,
    targetX: travel.targetX,
    targetY: travel.targetY,
    progress: travel.progress,
    idleWeight,
  };
}

/**
 * Intentional Action Motion State Machine & Deterministic Cursor Opacity:
 *
 * Phases:
 * Motion State Engine (4-Phase Lifecycle with Spit/Swallow Mechanics):
 * 1. IDLE (pre-action): Cursor Opacity = 0, Blob Normal (1, 1).
 * 2. ANTICIPATING (spit-out): Blob squashes (scaleX: 1.07, scaleY: 0.93), cursor pops outward from blob edge to orbital radius.
 * 3. TRAVELING: Cursor Opacity = 1, tracks visible velocity with smooth orbital steering.
 * 4. SETTLING (swallow): Blob compresses slightly (scale: 0.94), cursor retracts into blob center, blob recovers.
 * 5. IDLE (resting hover): Cursor Opacity = 0.
 */
function evaluateMotionState(
  frame: number,
  startFrame: number,
  durationInFrames: number,
  anticipateFrames: number = 8,
  settleFadeLead: number = 6,
  settleFadeDuration: number = 10
): {
  motionState: AllyMotionState;
  cursorOpacity: number;
  cursorRadialFraction: number;
  blobSquashX: number;
  blobSquashY: number;
} {
  const anticipateStart = startFrame - anticipateFrames;
  const settleStart = startFrame + durationInFrames - settleFadeLead;
  const settleEnd = settleStart + settleFadeDuration;

  // Pre-action IDLE
  if (frame < anticipateStart) {
    return {
      motionState: "idle",
      cursorOpacity: 0,
      cursorRadialFraction: 0,
      blobSquashX: 1,
      blobSquashY: 1,
    };
  }

  // ANTICIPATING: Squash & Spit Out Emergence
  if (frame < startFrame) {
    const t = (frame - anticipateStart) / anticipateFrames;
    if (t <= 0.45) {
      // Phase A: Anticipation Squash (4 frames)
      const tau = t / 0.45;
      const squash = Math.sin(Math.PI * tau) * 0.07;
      return {
        motionState: "anticipating",
        cursorOpacity: 0,
        cursorRadialFraction: 0,
        blobSquashX: 1.0 + squash,
        blobSquashY: 1.0 - squash,
      };
    } else {
      // Phase B: Pop outward and recover blob size (6 frames)
      const tau = (t - 0.45) / 0.55;
      const eased = tau * tau * (3 - 2 * tau);
      const residualSquash = (1 - eased) * 0.03;
      return {
        motionState: "anticipating",
        cursorOpacity: Math.max(0, Math.min(1, eased)),
        cursorRadialFraction: Math.max(0, Math.min(1, eased)),
        blobSquashX: 1.0 + residualSquash,
        blobSquashY: 1.0 - residualSquash,
      };
    }
  }

  // TRAVELING: Fully active
  if (frame < settleStart) {
    return {
      motionState: "traveling",
      cursorOpacity: 1,
      cursorRadialFraction: 1,
      blobSquashX: 1,
      blobSquashY: 1,
    };
  }

  // SETTLING: Compress & Swallow Retraction
  if (frame <= settleEnd) {
    const t = (frame - settleStart) / settleFadeDuration;
    if (t <= 0.55) {
      // Phase A: Swallow retraction and compression
      const tau = t / 0.55;
      const eased = 1 - tau * tau * (3 - 2 * tau);
      const compress = Math.sin(Math.PI * tau) * 0.05;
      return {
        motionState: "settling",
        cursorOpacity: Math.max(0, Math.min(1, eased)),
        cursorRadialFraction: Math.max(0, Math.min(1, eased)),
        blobSquashX: 1.0 - compress,
        blobSquashY: 1.0 - compress,
      };
    } else {
      // Phase B: Blob relaxation recovery to normal
      const tau = (t - 0.55) / 0.45;
      const recover = (1 - tau) * 0.02;
      return {
        motionState: "settling",
        cursorOpacity: 0,
        cursorRadialFraction: 0,
        blobSquashX: 1.0 - recover,
        blobSquashY: 1.0 - recover,
      };
    }
  }

  // Post-action IDLE
  return {
    motionState: "idle",
    cursorOpacity: 0,
    cursorRadialFraction: 0,
    blobSquashX: 1,
    blobSquashY: 1,
  };
}

/**
 * Internal single-segment motion physics evaluator.
 */
function evaluateSingleSegmentMotion({
  path,
  frame,
  startFrame,
  durationInFrames,
  identity = "rolly",
  timingEase = motionEasing.travelIn,
  responsiveness = 0.28,
  organicDeviation = 1.5,
  anticipateFrames = 8,
  settleFadeLead = 6,
  settleFadeDuration = 10,
  orbSize = 153,
  pointerSize = 110.5,
  clearance = 35.0,
  cursorSteerResponsiveness = 0.22,
  idle,
}: Required<Omit<UseBezierTravelOptions, "segments">>): BezierTravelResult {
  const totalLength = getLength(path);

  // 1. Motion State, Cursor Opacity, and Blob Squash Dynamics
  const {
    motionState,
    cursorOpacity,
    cursorRadialFraction,
    blobSquashX,
    blobSquashY,
  } = evaluateMotionState(
    frame,
    startFrame,
    durationInFrames,
    anticipateFrames,
    settleFadeLead,
    settleFadeDuration
  );

  // 2. Calculate final visible ally position at the current frame
  const currentPos = getCompleteVisiblePosition(
    path,
    totalLength,
    frame,
    startFrame,
    durationInFrames,
    timingEase,
    responsiveness,
    organicDeviation,
    idle
  );

  // 3. Initial Path Tangent (for ANTICIPATING pre-movement alignment)
  const p0 = getPointAtLength(path, 0)!;
  const p1 = getPointAtLength(path, Math.min(totalLength, 1.0))!;
  const initialPathAngle = (Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180) / Math.PI;

  // 4. Derive ACTUAL visible ally velocity via central difference
  const dt = 0.25;
  const posAhead = getCompleteVisiblePosition(
    path,
    totalLength,
    frame + dt,
    startFrame,
    durationInFrames,
    timingEase,
    responsiveness,
    organicDeviation,
    idle
  );
  const posBehind = getCompleteVisiblePosition(
    path,
    totalLength,
    frame - dt,
    startFrame,
    durationInFrames,
    timingEase,
    responsiveness,
    organicDeviation,
    idle
  );

  const vx = (posAhead.x - posBehind.x) / (2 * dt);
  const vy = (posAhead.y - posBehind.y) / (2 * dt);
  const velocity = Math.hypot(vx, vy);

  // 5. Continuous Direction Steering Engine with Wrapped Shortest Angular Route
  // Simulates from pre-anticipation to current frame to guarantee deterministic subpixel continuity
  const MIN_TRAVEL_SPEED = 1.0; // px/frame threshold for intentional heading updates
  const simulationStart = Math.max(0, startFrame - anticipateFrames - 2);

  let currentDisplayedAngle = initialPathAngle;
  let lastStableIntentionalAngle = initialPathAngle;
  let rawTargetAngle = initialPathAngle;

  const tieBreakSign = identity === "rolly" || identity === "ghosty" ? 1 : -1;

  for (let k = simulationStart; k <= frame; k++) {
    let kTargetAngle = initialPathAngle;

    if (k < startFrame) {
      // During ANTICIPATING: Target is the upcoming Bézier path tangent
      kTargetAngle = initialPathAngle;
      lastStableIntentionalAngle = initialPathAngle;
    } else {
      // During TRAVELING: Derive from actual visible velocity
      const kAhead = getCompleteVisiblePosition(
        path,
        totalLength,
        k + dt,
        startFrame,
        durationInFrames,
        timingEase,
        responsiveness,
        organicDeviation,
        idle
      );
      const kBehind = getCompleteVisiblePosition(
        path,
        totalLength,
        k - dt,
        startFrame,
        durationInFrames,
        timingEase,
        responsiveness,
        organicDeviation,
        idle
      );
      const kVx = (kAhead.x - kBehind.x) / (2 * dt);
      const kVy = (kAhead.y - kBehind.y) / (2 * dt);
      const kSpeed = Math.hypot(kVx, kVy);

      if (kSpeed >= MIN_TRAVEL_SPEED) {
        kTargetAngle = (Math.atan2(kVy, kVx) * 180) / Math.PI;
        lastStableIntentionalAngle = kTargetAngle;
      } else {
        // Retain last stable intentional direction during deceleration/settling
        kTargetAngle = lastStableIntentionalAngle;
      }
    }

    if (k === frame) {
      rawTargetAngle = kTargetAngle;
    }

    // Shortest angular route calculation with wrap handling
    const diffRad =
      ((kTargetAngle - currentDisplayedAngle) * Math.PI) / 180;
    let deltaDeg = (Math.atan2(Math.sin(diffRad), Math.cos(diffRad)) * 180) / Math.PI;

    // Deterministic tie-breaker for near-180deg flips
    if (Math.abs(Math.abs(deltaDeg) - 180) < 0.05) {
      deltaDeg = tieBreakSign * 180;
    }

    // Progressively smooth displayed angle towards target angle
    currentDisplayedAngle += deltaDeg * cursorSteerResponsiveness;
  }

  // 6. Exact Cursor Orbit & Inner Anchor Radius Calculation
  const maxCursorOrbitRadius = calculateCursorOrbitRadius(
    orbSize,
    pointerSize,
    clearance
  );
  const cursorAnchorRadius = orbSize / 2 + clearance;

  // Dynamic emergence orbit radius (emerges from blob edge to full orbit)
  const minEmergenceRadius = orbSize / 2;
  const activeCursorOrbitRadius =
    minEmergenceRadius + (maxCursorOrbitRadius - minEmergenceRadius) * cursorRadialFraction;

  // 7. Orbital Placement & Direction Derivation
  // BOTH the orbital (x, y) coordinates around the circumference AND the cursor rotation
  // are calculated directly from currentDisplayedAngle
  const displayedRad = (currentDisplayedAngle * Math.PI) / 180;
  const cursorX = activeCursorOrbitRadius * Math.cos(displayedRad);
  const cursorY = activeCursorOrbitRadius * Math.sin(displayedRad);

  // Raw unsmoothed target coordinates (for debug mode)
  const targetRad = (rawTargetAngle * Math.PI) / 180;
  const rawTargetCursorX = maxCursorOrbitRadius * Math.cos(targetRad);
  const rawTargetCursorY = maxCursorOrbitRadius * Math.sin(targetRad);

  const isTraveling = motionState === "traveling";
  const isSettled =
    motionState === "idle" && frame >= startFrame + durationInFrames;

  return {
    x: currentPos.x,
    y: currentPos.y,
    targetX: currentPos.targetX,
    targetY: currentPos.targetY,
    progress: currentPos.progress,
    distance: currentPos.progress * totalLength,
    totalLength,
    directionDeg: currentDisplayedAngle,
    targetDirectionDeg: rawTargetAngle,
    cursorX,
    cursorY,
    rawTargetCursorX,
    rawTargetCursorY,
    cursorOrbitRadius: maxCursorOrbitRadius,
    cursorAnchorRadius,
    cursorOpacity,
    cursorRadialFraction,
    blobSquashX,
    blobSquashY,
    motionState,
    velocity,
    isTraveling,
    isSettled,
    idleWeight: currentPos.idleWeight,
  };
}

/**
 * Reusable Target + Follower Bézier Motion Hook with Multi-Segment Support
 * & Fluid Orbital Steering
 */
export function useBezierTravel(options: UseBezierTravelOptions): BezierTravelResult {
  const {
    path,
    frame,
    startFrame = 0,
    durationInFrames = 1,
    segments,
    identity = "rolly",
    timingEase = motionEasing.travelIn,
    responsiveness = 0.28,
    organicDeviation = 1.5,
    anticipateFrames = 8,
    settleFadeLead = 6,
    settleFadeDuration = 10,
    orbSize = 153,
    pointerSize = 110.5,
    clearance = 35.0,
    cursorSteerResponsiveness = 0.22,
    idle = {
      yRange: [-18, 18],
      xRange: [-12, 12],
      rotRange: [-2.5, 2.5],
      periodFrames: 190,
      phase: 0,
    },
  } = options;

  // Resolve active motion segments list
  const activeSegments: MotionSegment[] =
    segments && segments.length > 0
      ? segments
      : path
      ? [{ path, startFrame, durationInFrames, timingEase }]
      : [];

  if (activeSegments.length === 0) {
    throw new Error("useBezierTravel requires either path or segments");
  }

  const firstSeg = activeSegments[0];
  const lastSeg = activeSegments[activeSegments.length - 1];

  // 1. Pre-entrance check
  if (frame < firstSeg.startFrame - anticipateFrames) {
    const pStart = getPointAtLength(firstSeg.path, 0)!;
    const cursorOrbitRadius = calculateCursorOrbitRadius(orbSize, pointerSize, clearance);
    return {
      x: pStart.x,
      y: pStart.y,
      targetX: pStart.x,
      targetY: pStart.y,
      progress: 0,
      distance: 0,
      totalLength: getLength(firstSeg.path),
      directionDeg: 0,
      targetDirectionDeg: 0,
      cursorX: cursorOrbitRadius,
      cursorY: 0,
      rawTargetCursorX: cursorOrbitRadius,
      rawTargetCursorY: 0,
      cursorOrbitRadius,
      cursorAnchorRadius: orbSize / 2 + clearance,
      cursorOpacity: 0,
      cursorRadialFraction: 0,
      blobSquashX: 1,
      blobSquashY: 1,
      motionState: "idle",
      velocity: 0,
      isTraveling: false,
      isSettled: false,
      idleWeight: 0,
    };
  }

  // 2. Post-all-segments check
  const lastSegEnd = lastSeg.startFrame + lastSeg.durationInFrames;
  if (frame > lastSegEnd) {
    const lastLen = getLength(lastSeg.path);
    const pEnd = getPointAtLength(lastSeg.path, lastLen)!;
    const cursorOrbitRadius = calculateCursorOrbitRadius(orbSize, pointerSize, clearance);
    return {
      x: pEnd.x,
      y: pEnd.y,
      targetX: pEnd.x,
      targetY: pEnd.y,
      progress: 1,
      distance: lastLen,
      totalLength: lastLen,
      directionDeg: 0,
      targetDirectionDeg: 0,
      cursorX: cursorOrbitRadius,
      cursorY: 0,
      rawTargetCursorX: cursorOrbitRadius,
      rawTargetCursorY: 0,
      cursorOrbitRadius,
      cursorAnchorRadius: orbSize / 2 + clearance,
      cursorOpacity: 0,
      cursorRadialFraction: 0,
      blobSquashX: 1,
      blobSquashY: 1,
      motionState: "idle",
      velocity: 0,
      isTraveling: false,
      isSettled: true,
      idleWeight: 1,
    };
  }

  // 3. Find active segment or idle pause between segments
  for (let i = 0; i < activeSegments.length; i++) {
    const seg = activeSegments[i];
    const segEnd = seg.startFrame + seg.durationInFrames;
    if (frame <= segEnd) {
      if (i > 0 && frame < seg.startFrame - anticipateFrames) {
        // Idle resting between previous segment arrival and current segment anticipation
        const prevSeg = activeSegments[i - 1];
        const prevLen = getLength(prevSeg.path);
        const pEnd = getPointAtLength(prevSeg.path, prevLen)!;
        const cursorOrbitRadius = calculateCursorOrbitRadius(orbSize, pointerSize, clearance);
        return {
          x: pEnd.x,
          y: pEnd.y,
          targetX: pEnd.x,
          targetY: pEnd.y,
          progress: 1,
          distance: prevLen,
          totalLength: prevLen,
          directionDeg: 0,
          targetDirectionDeg: 0,
          cursorX: cursorOrbitRadius,
          cursorY: 0,
          rawTargetCursorX: cursorOrbitRadius,
          rawTargetCursorY: 0,
          cursorOrbitRadius,
          cursorAnchorRadius: orbSize / 2 + clearance,
          cursorOpacity: 0,
          cursorRadialFraction: 0,
          blobSquashX: 1,
          blobSquashY: 1,
          motionState: "idle",
          velocity: 0,
          isTraveling: false,
          isSettled: true,
          idleWeight: 1,
        };
      }

      // Active segment evaluation
      return evaluateSingleSegmentMotion({
        path: seg.path,
        frame,
        startFrame: seg.startFrame,
        durationInFrames: seg.durationInFrames,
        timingEase: seg.timingEase ?? timingEase,
        identity,
        responsiveness,
        organicDeviation,
        anticipateFrames,
        settleFadeLead,
        settleFadeDuration,
        orbSize,
        pointerSize,
        clearance,
        cursorSteerResponsiveness,
        idle,
      });
    }
  }

  // Fallback to last segment evaluation
  return evaluateSingleSegmentMotion({
    path: lastSeg.path,
    frame,
    startFrame: lastSeg.startFrame,
    durationInFrames: lastSeg.durationInFrames,
    timingEase: lastSeg.timingEase ?? timingEase,
    identity,
    responsiveness,
    organicDeviation,
    anticipateFrames,
    settleFadeLead,
    settleFadeDuration,
    orbSize,
    pointerSize,
    clearance,
    cursorSteerResponsiveness,
    idle,
  });
}
