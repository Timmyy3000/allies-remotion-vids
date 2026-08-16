import { getPointAtLength, getLength } from "@remotion/paths";
import { motionEasing } from "../constants/motionEasing";
import { AllyIdentity } from "../constants/allyStates";

export type AllyMotionState =
  | "idle"
  | "anticipating"
  | "traveling"
  | "settling";

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
  cursorEndBehavior?: "suction" | "hold";
  /** Optional final heading used to point the cursor precisely at a delivered target. */
  cursorEndDirectionDeg?: number;
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
  anticipateFrames?: number; // Fade-in anticipation window (default: 12 frames)
  settleDelayFrames?: number; // Stationary buffer after arrival before suction (default: 12 frames)
  settleFadeDuration?: number; // Maximum duration of the suction settle (default: 24 frames)
  orbSize?: number; // Ally orb diameter (default: 153px)
  pointerSize?: number; // Cursor pointer diameter (default: 110.5px)
  clearance?: number; // Visible edge-to-edge clearance (default: 35.0px)
  cursorSteerResponsiveness?: number; // Steering catch-up rate (default: 0.10, ~22 frames window)
  idle?: IdleConfig;
}

const smoothstep01 = (value: number) => {
  const clamped = Math.max(0, Math.min(1, value));
  return clamped * clamped * (3 - 2 * clamped);
};

function segmentStartsWithVisibleCursor(
  segments: MotionSegment[],
  segmentIndex: number,
): boolean {
  return (
    segmentIndex > 0 && segments[segmentIndex - 1].cursorEndBehavior === "hold"
  );
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
  cursorOpacity: number; // 0 in IDLE, 0->1 in ANTICIPATING, 1 through SETTLING
  cursorScale: number; // Pop-in scale during ANTICIPATING, suction scale during SETTLING
  cursorOrbitScale: number; // Radial pop-out/settle scale during ANTICIPATING
  cursorSuctionProgress: number; // 0 at orbit, 1 pulled into the ally center
  activeSegmentId?: string;
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
  clearance: number = 35.0,
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
  timingEase: (t: number) => number,
): {
  x: number;
  y: number;
  normalX: number;
  normalY: number;
  progress: number;
} {
  if (f <= startFrame) {
    const p = getPointAtLength(path, 0)!;
    const pNext = getPointAtLength(path, Math.min(totalLength, 1.0))!;
    const dx = pNext.x - p.x;
    const dy = pNext.y - p.y;
    const len = Math.hypot(dx, dy) || 1;
    return {
      x: p.x,
      y: p.y,
      normalX: -dy / len,
      normalY: dx / len,
      progress: 0,
    };
  }

  if (f >= startFrame + duration) {
    const p = getPointAtLength(path, totalLength)!;
    const pPrev = getPointAtLength(path, Math.max(0, totalLength - 1.0))!;
    const dx = p.x - pPrev.x;
    const dy = p.y - pPrev.y;
    const len = Math.hypot(dx, dy) || 1;
    return {
      x: p.x,
      y: p.y,
      normalX: -dy / len,
      normalY: dx / len,
      progress: 1,
    };
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
  organicDeviation: number,
): {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
} {
  const target = getRawTargetAtFrame(
    path,
    totalLength,
    f,
    startFrame,
    duration,
    timingEase,
  );
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
      timingEase,
    );
    const subAlpha = 1 - Math.pow(1 - alpha, simStep);
    followerX += (curTarget.x - followerX) * subAlpha;
    followerY += (curTarget.y - followerY) * subAlpha;
  }

  // Remaining fractional step
  const remainder = f - startFrame - steps * simStep;
  if (remainder > 0.001) {
    const curTarget = getRawTargetAtFrame(
      path,
      totalLength,
      f,
      startFrame,
      duration,
      timingEase,
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
  if (
    organicDeviation > 0 &&
    target.progress > 0.02 &&
    target.progress < 0.98
  ) {
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
  idle?: IdleConfig,
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
    organicDeviation,
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
 * 1. IDLE (pre-action): Cursor Opacity = 0.
 * 2. ANTICIPATING (12 frames before travel): Cursor eases onto the upcoming path tangent.
 * 3. TRAVELING: Cursor Opacity = 1, tracks visible velocity with smooth orbital steering.
 * 4. SETTLING (stationary after travel): Cursor stays opaque, then gets sucked into the ally.
 * 5. IDLE (resting hover): Cursor Opacity = 0.
 */
function evaluateMotionState(
  frame: number,
  startFrame: number,
  durationInFrames: number,
  anticipateFrames: number = 12,
  settleDelayFrames: number = 12,
  settleFadeDuration: number = 24,
  cursorEndBehavior: MotionSegment["cursorEndBehavior"] = "suction",
  cursorStartsVisible: boolean = false,
): {
  motionState: AllyMotionState;
  cursorOpacity: number;
  cursorScale: number;
  cursorOrbitScale: number;
  cursorSuctionProgress: number;
} {
  const anticipateStart = startFrame - anticipateFrames;
  // Keep the ally stationary for a short buffer after arrival, then run the
  // full suction window while the cursor is still visible.
  const suctionDuration = Math.max(1, settleFadeDuration);
  const travelEnd = startFrame + durationInFrames;
  const settleStart = travelEnd + Math.max(0, settleDelayFrames);
  const settleEnd = settleStart + suctionDuration;

  const popScale = (t: number) => {
    if (t < 0.72) {
      return 0.2 + (1.12 - 0.2) * smoothstep01(t / 0.72);
    }

    return 1.12 - 0.12 * smoothstep01((t - 0.72) / 0.28);
  };

  const popOrbitScale = (t: number) => {
    if (t < 0.7) {
      return 0.72 + (1.12 - 0.72) * smoothstep01(t / 0.7);
    }

    return 1.12 - 0.12 * smoothstep01((t - 0.7) / 0.3);
  };

  // Pre-action IDLE
  if (frame < anticipateStart) {
    return {
      motionState: "idle",
      cursorOpacity: 0,
      cursorScale: 0,
      cursorOrbitScale: 0,
      cursorSuctionProgress: 1,
    };
  }

  // ANTICIPATING: A small, overshooting pop-in with a short visibility ramp.
  if (frame < startFrame) {
    if (cursorStartsVisible) {
      return {
        motionState: "anticipating",
        cursorOpacity: 1,
        cursorScale: 1,
        cursorOrbitScale: 1,
        cursorSuctionProgress: 0,
      };
    }

    const t = (frame - anticipateStart) / anticipateFrames;
    const eased = smoothstep01(t);
    return {
      motionState: "anticipating",
      cursorOpacity: Math.max(0, Math.min(1, eased)),
      cursorScale: popScale(Math.max(0, Math.min(1, t))),
      cursorOrbitScale: popOrbitScale(Math.max(0, Math.min(1, t))),
      cursorSuctionProgress: 0,
    };
  }

  // TRAVELING: Fully active. The cursor remains fully visible until the ally
  // reaches its destination; suction is reserved for the stationary phase.
  if (frame < travelEnd) {
    return {
      motionState: "traveling",
      cursorOpacity: 1,
      cursorScale: 1,
      cursorOrbitScale: 1,
      cursorSuctionProgress: 0,
    };
  }

  // SETTLING: A deliberate stationary hold for segments whose cursor remains
  // visible, or before a suction animation starts.
  if (cursorEndBehavior === "hold" || frame < settleStart) {
    return {
      motionState: "settling",
      cursorOpacity: 1,
      cursorScale: 1,
      cursorOrbitScale: 1,
      cursorSuctionProgress: 0,
    };
  }

  // SETTLING: Hold opacity while the cursor contracts and travels into the orb.
  if (frame <= settleEnd) {
    const suctionProgress = smoothstep01(
      (frame - settleStart) / suctionDuration,
    );
    return {
      motionState: "settling",
      cursorOpacity: 1,
      cursorScale: 1 - suctionProgress,
      cursorOrbitScale: 1,
      cursorSuctionProgress: suctionProgress,
    };
  }

  // Post-action IDLE
  return {
    motionState: "idle",
    cursorOpacity: 0,
    cursorScale: 0,
    cursorOrbitScale: 0,
    cursorSuctionProgress: 1,
  };
}

/**
 * Reusable Target + Follower Bézier Motion Hook with Fluid Orbital Steering
 *
 * System Concept:
 * ally actual movement -> target travel direction -> smoothed cursor direction -> orbital cursor position & cursor rotation
 *
 * Rules:
 * 1. The cursor NEVER teleports or snaps across the blob.
 * 2. When the ally changes direction, the cursor physically travels around the circumference of the blob.
 * 3. Position around the ally (orbit) and cursor rotation come strictly from the SAME smoothed direction system.
 * 4. Exact 10px edge-to-edge clearance uniformly maintained in all orientations.
 * 5. Deterministic Remotion frame evaluation with zero browser-clock or CSS animation dependencies.
 */
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
  anticipateFrames = 12,
  settleDelayFrames = 12,
  settleFadeDuration = 24,
  orbSize = 153,
  pointerSize = 110.5,
  clearance = 35.0,
  cursorSteerResponsiveness = 0.1,
  initialDirectionDeg,
  idle,
  cursorEndBehavior = "suction",
  cursorEndDirectionDeg,
  cursorStartsVisible = false,
  segmentId,
}: Required<Omit<UseBezierTravelOptions, "segments">> &
  Pick<MotionSegment, "cursorEndBehavior" | "cursorEndDirectionDeg"> & {
    segmentId?: string;
    initialDirectionDeg?: number;
    cursorStartsVisible?: boolean;
  }): BezierTravelResult {
  const totalLength = getLength(path);

  // 1. Motion State & Cursor Opacity
  const {
    motionState,
    cursorOpacity,
    cursorScale,
    cursorOrbitScale,
    cursorSuctionProgress,
  } = evaluateMotionState(
    frame,
    startFrame,
    durationInFrames,
    anticipateFrames,
    settleDelayFrames,
    settleFadeDuration,
    cursorEndBehavior,
    cursorStartsVisible,
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
    idle,
  );

  // 3. Initial Path Tangent (for ANTICIPATING pre-movement alignment)
  const p0 = getPointAtLength(path, 0)!;
  const p1 = getPointAtLength(path, Math.min(totalLength, 1.0))!;
  const initialPathAngle =
    (Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180) / Math.PI;
  const initialDisplayedAngle = initialDirectionDeg ?? initialPathAngle;

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
    idle,
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
    idle,
  );

  const vx = (posAhead.x - posBehind.x) / (2 * dt);
  const vy = (posAhead.y - posBehind.y) / (2 * dt);
  const velocity = Math.hypot(vx, vy);

  // 5. Continuous Direction Steering Engine with Wrapped Shortest Angular Route
  // Simulates from pre-anticipation to current frame to guarantee deterministic subpixel continuity
  const MIN_TRAVEL_SPEED = 1.0; // px/frame threshold for intentional heading updates
  // When a previous segment is still holding the cursor, begin the new
  // segment's steering exactly at the anticipation boundary. Starting earlier
  // would apply hidden extra steps and create a visible jump on the first
  // frame of the new segment.
  const simulationStart = Math.max(
    0,
    startFrame - anticipateFrames - (initialDirectionDeg == null ? 2 : 0),
  );

  let currentDisplayedAngle = initialDisplayedAngle;
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
        idle,
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
        idle,
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
    const diffRad = ((kTargetAngle - currentDisplayedAngle) * Math.PI) / 180;
    let deltaDeg =
      (Math.atan2(Math.sin(diffRad), Math.cos(diffRad)) * 180) / Math.PI;

    // Deterministic tie-breaker for near-180deg flips
    if (Math.abs(Math.abs(deltaDeg) - 180) < 0.05) {
      deltaDeg = tieBreakSign * 180;
    }

    // Progressively smooth displayed angle towards target angle
    currentDisplayedAngle += deltaDeg * cursorSteerResponsiveness;
  }

  // A path's final tangent can be slightly different from the direction the
  // cursor needs to face at a deliberate delivery. Blend to that authored
  // heading over the last few frames so the cursor tip and carried text meet
  // cleanly without a visible snap.
  const cursorHeadingBlendFrames = 18;
  const cursorHeadingBlendStart =
    startFrame + durationInFrames - cursorHeadingBlendFrames;
  const cursorHeadingBlend =
    cursorEndDirectionDeg == null
      ? 0
      : smoothstep01(
          (frame - cursorHeadingBlendStart) / cursorHeadingBlendFrames,
        );
  const directionDeg =
    cursorEndDirectionDeg == null
      ? currentDisplayedAngle
      : currentDisplayedAngle +
        (((cursorEndDirectionDeg - currentDisplayedAngle + 540) % 360) - 180) *
          cursorHeadingBlend;

  // 6. Exact Cursor Orbit & Inner Anchor Radius Calculation
  const cursorOrbitRadius = calculateCursorOrbitRadius(
    orbSize,
    pointerSize,
    clearance,
  );
  const cursorAnchorRadius = orbSize / 2 + clearance;

  // 7. Orbital Placement & Direction Derivation
  // BOTH the orbital (x, y) coordinates around the circumference AND the cursor rotation
  // are calculated directly from currentDisplayedAngle
  const displayedRad = (directionDeg * Math.PI) / 180;
  const cursorX = cursorOrbitRadius * Math.cos(displayedRad);
  const cursorY = cursorOrbitRadius * Math.sin(displayedRad);

  // Raw unsmoothed target coordinates (for debug mode)
  const targetRad = (rawTargetAngle * Math.PI) / 180;
  const rawTargetCursorX = cursorOrbitRadius * Math.cos(targetRad);
  const rawTargetCursorY = cursorOrbitRadius * Math.sin(targetRad);

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
    directionDeg,
    targetDirectionDeg: rawTargetAngle,
    cursorX,
    cursorY,
    rawTargetCursorX,
    rawTargetCursorY,
    cursorOrbitRadius,
    cursorAnchorRadius,
    cursorOpacity,
    cursorScale,
    cursorOrbitScale,
    cursorSuctionProgress,
    activeSegmentId: segmentId,
    motionState,
    velocity,
    isTraveling,
    isSettled,
    idleWeight: currentPos.idleWeight,
  };
}

interface SegmentDirectionEvaluationOptions {
  identity: AllyIdentity;
  timingEase: (t: number) => number;
  responsiveness: number;
  organicDeviation: number;
  anticipateFrames: number;
  settleDelayFrames: number;
  settleFadeDuration: number;
  orbSize: number;
  pointerSize: number;
  clearance: number;
  cursorSteerResponsiveness: number;
  idle: IdleConfig;
}

const segmentEndDirectionCache = new Map<string, number>();

function getCachedSegmentEndDirection(
  segment: MotionSegment,
  initialDirectionDeg: number | undefined,
  options: SegmentDirectionEvaluationOptions,
): number {
  const cacheKey = JSON.stringify({
    path: segment.path,
    startFrame: segment.startFrame,
    durationInFrames: segment.durationInFrames,
    cursorEndBehavior: segment.cursorEndBehavior,
    cursorEndDirectionDeg: segment.cursorEndDirectionDeg,
    initialDirectionDeg,
    ...options,
  });
  const cached = segmentEndDirectionCache.get(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  const result = evaluateSingleSegmentMotion({
    path: segment.path,
    frame: segment.startFrame + segment.durationInFrames,
    startFrame: segment.startFrame,
    durationInFrames: segment.durationInFrames,
    timingEase: segment.timingEase ?? options.timingEase,
    identity: options.identity,
    responsiveness: options.responsiveness,
    organicDeviation: options.organicDeviation,
    anticipateFrames: options.anticipateFrames,
    settleDelayFrames: options.settleDelayFrames,
    settleFadeDuration: options.settleFadeDuration,
    orbSize: options.orbSize,
    pointerSize: options.pointerSize,
    clearance: options.clearance,
    cursorSteerResponsiveness: options.cursorSteerResponsiveness,
    idle: options.idle,
    cursorEndBehavior: segment.cursorEndBehavior,
    cursorEndDirectionDeg: segment.cursorEndDirectionDeg,
    initialDirectionDeg,
    segmentId: segment.id,
  });

  segmentEndDirectionCache.set(cacheKey, result.directionDeg);
  return result.directionDeg;
}

function resolveSegmentStartDirections(
  segments: MotionSegment[],
  lastRequiredIndex: number,
  options: SegmentDirectionEvaluationOptions,
): Array<number | undefined> {
  const startDirections: Array<number | undefined> = [];
  let previousEndDirection: number | undefined;

  for (let i = 0; i <= lastRequiredIndex; i++) {
    startDirections[i] = previousEndDirection;
    if (i === lastRequiredIndex) {
      break;
    }

    previousEndDirection = getCachedSegmentEndDirection(
      segments[i],
      previousEndDirection,
      options,
    );
  }

  return startDirections;
}

/**
 * Reusable Target + Follower Bézier Motion Hook with Multi-Segment Support
 * & Fluid Orbital Steering
 */
export function useBezierTravel(
  options: UseBezierTravelOptions,
): BezierTravelResult {
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
    anticipateFrames = 12,
    settleDelayFrames = 12,
    settleFadeDuration = 24,
    orbSize = 153,
    pointerSize = 110.5,
    clearance = 35.0,
    cursorSteerResponsiveness = 0.1,
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
    const cursorOrbitRadius = calculateCursorOrbitRadius(
      orbSize,
      pointerSize,
      clearance,
    );
    const keepCursorVisible = lastSeg.cursorEndBehavior === "hold";
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
      cursorOpacity: keepCursorVisible ? 1 : 0,
      cursorScale: keepCursorVisible ? 1 : 0,
      cursorOrbitScale: keepCursorVisible ? 1 : 0,
      cursorSuctionProgress: keepCursorVisible ? 0 : 1,
      motionState: "idle",
      velocity: 0,
      isTraveling: false,
      isSettled: false,
      idleWeight: 0,
    };
  }

  const upcomingSegmentIndex = activeSegments.findIndex(
    (segment) => frame <= segment.startFrame + segment.durationInFrames,
  );
  const lastRequiredDirectionIndex =
    upcomingSegmentIndex === -1
      ? activeSegments.length - 1
      : upcomingSegmentIndex;
  const segmentStartDirections = resolveSegmentStartDirections(
    activeSegments,
    lastRequiredDirectionIndex,
    {
      identity,
      timingEase,
      responsiveness,
      organicDeviation,
      anticipateFrames,
      settleDelayFrames,
      settleFadeDuration,
      orbSize,
      pointerSize,
      clearance,
      cursorSteerResponsiveness,
      idle,
    },
  );

  // 2. Post-all-segments check
  const lastSegEnd = lastSeg.startFrame + lastSeg.durationInFrames;
  if (frame > lastSegEnd) {
    const lastLen = getLength(lastSeg.path);
    const restingPosition = getCompleteVisiblePosition(
      lastSeg.path,
      lastLen,
      frame,
      lastSeg.startFrame,
      lastSeg.durationInFrames,
      lastSeg.timingEase ?? timingEase,
      responsiveness,
      organicDeviation,
      idle,
    );
    const lastArrival = evaluateSingleSegmentMotion({
      path: lastSeg.path,
      frame: lastSegEnd,
      startFrame: lastSeg.startFrame,
      durationInFrames: lastSeg.durationInFrames,
      timingEase: lastSeg.timingEase ?? timingEase,
      identity,
      responsiveness,
      organicDeviation,
      anticipateFrames,
      settleDelayFrames,
      settleFadeDuration,
      orbSize,
      pointerSize,
      clearance,
      cursorSteerResponsiveness,
      idle,
      cursorEndBehavior: lastSeg.cursorEndBehavior,
      cursorEndDirectionDeg: lastSeg.cursorEndDirectionDeg,
      initialDirectionDeg: segmentStartDirections[activeSegments.length - 1],
      cursorStartsVisible: segmentStartsWithVisibleCursor(
        activeSegments,
        activeSegments.length - 1,
      ),
      segmentId: lastSeg.id,
    });
    const cursorOrbitRadius = calculateCursorOrbitRadius(
      orbSize,
      pointerSize,
      clearance,
    );
    return {
      x: restingPosition.x,
      y: restingPosition.y,
      targetX: restingPosition.targetX,
      targetY: restingPosition.targetY,
      progress: restingPosition.progress,
      distance: lastLen,
      totalLength: lastLen,
      directionDeg: lastArrival.directionDeg,
      targetDirectionDeg: lastArrival.targetDirectionDeg,
      cursorX: lastArrival.cursorX,
      cursorY: lastArrival.cursorY,
      rawTargetCursorX: lastArrival.rawTargetCursorX,
      rawTargetCursorY: lastArrival.rawTargetCursorY,
      cursorOrbitRadius,
      cursorAnchorRadius: orbSize / 2 + clearance,
      cursorOpacity: 0,
      cursorScale: 0,
      cursorOrbitScale: 0,
      cursorSuctionProgress: 1,
      motionState: "idle",
      velocity: 0,
      isTraveling: false,
      isSettled: true,
      idleWeight: restingPosition.idleWeight,
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
        const previousState = evaluateSingleSegmentMotion({
          path: prevSeg.path,
          frame,
          startFrame: prevSeg.startFrame,
          durationInFrames: prevSeg.durationInFrames,
          timingEase: prevSeg.timingEase ?? timingEase,
          identity,
          responsiveness,
          organicDeviation,
          anticipateFrames,
          settleDelayFrames,
          settleFadeDuration,
          orbSize,
          pointerSize,
          clearance,
          cursorSteerResponsiveness,
          idle,
          cursorEndBehavior: prevSeg.cursorEndBehavior,
          cursorEndDirectionDeg: prevSeg.cursorEndDirectionDeg,
          initialDirectionDeg: segmentStartDirections[i - 1],
          cursorStartsVisible: segmentStartsWithVisibleCursor(
            activeSegments,
            i - 1,
          ),
        });
        const restingPosition = getCompleteVisiblePosition(
          prevSeg.path,
          prevLen,
          frame,
          prevSeg.startFrame,
          prevSeg.durationInFrames,
          prevSeg.timingEase ?? timingEase,
          responsiveness,
          organicDeviation,
          idle,
        );
        const cursorOrbitRadius = calculateCursorOrbitRadius(
          orbSize,
          pointerSize,
          clearance,
        );
        return {
          x: restingPosition.x,
          y: restingPosition.y,
          targetX: restingPosition.targetX,
          targetY: restingPosition.targetY,
          progress: restingPosition.progress,
          distance: prevLen,
          totalLength: prevLen,
          directionDeg: previousState.directionDeg,
          targetDirectionDeg: previousState.targetDirectionDeg,
          cursorX: previousState.cursorX,
          cursorY: previousState.cursorY,
          rawTargetCursorX: previousState.rawTargetCursorX,
          rawTargetCursorY: previousState.rawTargetCursorY,
          cursorOrbitRadius,
          cursorAnchorRadius: orbSize / 2 + clearance,
          cursorOpacity: previousState.cursorOpacity,
          cursorScale: previousState.cursorScale,
          cursorOrbitScale: previousState.cursorOrbitScale,
          cursorSuctionProgress: previousState.cursorSuctionProgress,
          activeSegmentId: undefined,
          motionState: previousState.motionState,
          velocity: 0,
          isTraveling: previousState.isTraveling,
          isSettled: previousState.isSettled,
          idleWeight: restingPosition.idleWeight,
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
        settleDelayFrames,
        settleFadeDuration,
        orbSize,
        pointerSize,
        clearance,
        cursorSteerResponsiveness,
        idle,
        cursorEndBehavior: seg.cursorEndBehavior,
        cursorEndDirectionDeg: seg.cursorEndDirectionDeg,
        initialDirectionDeg: segmentStartDirections[i],
        cursorStartsVisible: segmentStartsWithVisibleCursor(activeSegments, i),
        segmentId: seg.id,
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
    settleDelayFrames,
    settleFadeDuration,
    orbSize,
    pointerSize,
    clearance,
    cursorSteerResponsiveness,
    idle,
    cursorEndBehavior: lastSeg.cursorEndBehavior,
    cursorEndDirectionDeg: lastSeg.cursorEndDirectionDeg,
    initialDirectionDeg: segmentStartDirections[activeSegments.length - 1],
    cursorStartsVisible: segmentStartsWithVisibleCursor(
      activeSegments,
      activeSegments.length - 1,
    ),
    segmentId: lastSeg.id,
  });
}
