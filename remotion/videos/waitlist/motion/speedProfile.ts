/**
 * High-Order Speed Profile & Numerical Arc-Length Engine
 *
 * Provides smooth, organic acceleration, cruise, and deceleration profiles
 * eliminating instantaneous "0 to 60" velocity jumps.
 */

/**
 * Quintic Smootherstep: S_5(t) = 6t^5 - 15t^4 + 10t^3
 * Features zero first and second derivatives at t=0 and t=1, guaranteeing
 * perfectly smooth jerk-free transitions.
 */
export function smootherstep(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped * clamped * clamped * (clamped * (clamped * 6 - 15) + 10);
}

export interface SpeedProfileOptions {
  frame: number;
  startFrame: number;
  durationInFrames: number;
  startingSpeed?: number; // Normalized initial velocity (default: 0)
  cruiseSpeed?: number; // Normalized peak cruise velocity multiplier (default: 1.0)
  endingSpeed?: number; // Normalized landing velocity (default: 0)
  accelFraction?: number; // Fraction of duration spent accelerating (default: 0.22)
  decelFraction?: number; // Fraction of duration spent decelerating (default: 0.32)
}

export interface SpeedProfileResult {
  progress: number; // Normalized distance progress along path [0, 1]
  normalizedVelocity: number; // Instantaneous velocity relative to average speed
  isAnticipating: boolean; // True during initial anticipation / ramp
  isDecelerating: boolean; // True during deceleration / landing
}

/**
 * Computes deterministic velocity at normalized time t in [0, 1].
 */
function sampleVelocityProfile(
  t: number,
  startingSpeed: number,
  cruiseSpeed: number,
  endingSpeed: number,
  accelFraction: number,
  decelFraction: number,
): number {
  if (t <= 0) return startingSpeed;
  if (t >= 1) return endingSpeed;

  const cruiseStart = Math.max(0.05, Math.min(0.45, accelFraction));
  const decelStart = Math.max(cruiseStart + 0.1, 1 - Math.max(0.1, Math.min(0.5, decelFraction)));

  if (t < cruiseStart) {
    // Smooth quintic ramp from startingSpeed to cruiseSpeed
    const subT = t / cruiseStart;
    const smoothT = smootherstep(subT);
    return startingSpeed + (cruiseSpeed - startingSpeed) * smoothT;
  }

  if (t < decelStart) {
    // Cruise phase (with very subtle gentle swell for physical breath)
    const cruiseSpan = decelStart - cruiseStart;
    const cruiseT = (t - cruiseStart) / cruiseSpan;
    const breath = Math.sin(cruiseT * Math.PI) * 0.04;
    return cruiseSpeed * (1 + breath);
  }

  // Deceleration phase: smooth descent from cruiseSpeed to endingSpeed
  const decelSpan = 1 - decelStart;
  const decelT = (t - decelStart) / decelSpan;
  const smoothDecel = smootherstep(decelT);
  return cruiseSpeed + (endingSpeed - cruiseSpeed) * smoothDecel;
}

/**
 * Numerically integrates the velocity profile up to the given frame to determine
 * exact arc-length progress with high sub-frame precision.
 */
export function getMotionDistanceProgress(options: SpeedProfileOptions): SpeedProfileResult {
  const {
    frame,
    startFrame,
    durationInFrames,
    startingSpeed = 0.05,
    cruiseSpeed = 1.0,
    endingSpeed = 0.0,
    accelFraction = 0.22,
    decelFraction = 0.32,
  } = options;

  if (durationInFrames <= 0) {
    return {
      progress: frame >= startFrame ? 1 : 0,
      normalizedVelocity: 0,
      isAnticipating: false,
      isDecelerating: false,
    };
  }

  if (frame <= startFrame) {
    return {
      progress: 0,
      normalizedVelocity: startingSpeed,
      isAnticipating: true,
      isDecelerating: false,
    };
  }

  if (frame >= startFrame + durationInFrames) {
    return {
      progress: 1,
      normalizedVelocity: endingSpeed,
      isAnticipating: false,
      isDecelerating: true,
    };
  }

  const rawT = (frame - startFrame) / durationInFrames;

  // Numerical trapezoidal integration with 100 sample intervals across duration
  const totalSamples = 120;
  let totalArea = 0;
  let currentArea = 0;

  const currentSampleIndex = Math.min(totalSamples, Math.floor(rawT * totalSamples));
  const subFrac = (rawT * totalSamples) - currentSampleIndex;

  let prevV = sampleVelocityProfile(0, startingSpeed, cruiseSpeed, endingSpeed, accelFraction, decelFraction);

  for (let i = 1; i <= totalSamples; i++) {
    const tVal = i / totalSamples;
    const v = sampleVelocityProfile(tVal, startingSpeed, cruiseSpeed, endingSpeed, accelFraction, decelFraction);
    const trapArea = (prevV + v) * 0.5 * (1 / totalSamples);

    if (i <= currentSampleIndex) {
      currentArea += trapArea;
    } else if (i === currentSampleIndex + 1 && subFrac > 0.0001) {
      currentArea += trapArea * subFrac;
    }

    totalArea += trapArea;
    prevV = v;
  }

  const progress = totalArea > 0 ? Math.max(0, Math.min(1, currentArea / totalArea)) : rawT;
  const curVelocity = sampleVelocityProfile(rawT, startingSpeed, cruiseSpeed, endingSpeed, accelFraction, decelFraction);

  return {
    progress,
    normalizedVelocity: curVelocity,
    isAnticipating: rawT < accelFraction,
    isDecelerating: rawT > (1 - decelFraction),
  };
}

// Personality-specific tuning parameters
export const PERSONALITY_SPEED_CONFIGS = {
  rolly: {
    startingSpeed: 0.08,
    cruiseSpeed: 1.05,
    endingSpeed: 0.0,
    accelFraction: 0.18,
    decelFraction: 0.30,
  },
  ghosty: {
    startingSpeed: 0.06,
    cruiseSpeed: 1.08,
    endingSpeed: 0.0,
    accelFraction: 0.16,
    decelFraction: 0.28,
  },
  rocky: {
    startingSpeed: 0.04,
    cruiseSpeed: 0.96,
    endingSpeed: 0.0,
    accelFraction: 0.26,
    decelFraction: 0.38,
  },
  boxy: {
    startingSpeed: 0.05,
    cruiseSpeed: 1.0,
    endingSpeed: 0.0,
    accelFraction: 0.24,
    decelFraction: 0.32,
  },
} as const;

export function getPersonalitySpeedProgress(
  identity: "rolly" | "ghosty" | "rocky" | "boxy",
  frame: number,
  startFrame: number,
  durationInFrames: number,
): SpeedProfileResult {
  const config = PERSONALITY_SPEED_CONFIGS[identity];
  return getMotionDistanceProgress({
    frame,
    startFrame,
    durationInFrames,
    ...config,
  });
}
