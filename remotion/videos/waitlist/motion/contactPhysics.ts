/**
 * Contact Physics & 2D Soft-Body Collision Engine
 *
 * Implements physically consistent, deterministic collision responses:
 * - Computes contact normal between two actors or actor and static boundary
 * - Applies directional compression along the collision normal
 * - Applies perpendicular expansion (approximate area preservation s_perp ≈ 1 / s_parallel)
 * - Single-overshoot elastic recovery with exponential decay (no excessive wobble)
 */

export interface Vector2D {
  x: number;
  y: number;
}

export interface ContactSquash {
  squashX: number;
  squashY: number;
  recoilX: number;
  recoilY: number;
  rotationDeg: number;
}

export interface ContactEventConfig {
  startFrame: number;
  durationFrames: number;
  impactAngleRad: number; // Angle of incoming velocity or normal
  maxCompression: number; // e.g. 0.05 for 5% compression
  maxRecoil: number; // Max recoil translation in pixels (4K scale)
  recoilDirection?: Vector2D; // Direction of bounce back
}

/**
 * Calculates directional soft-body deformation for a contact collision.
 */
export function evaluateContactResponse(
  currentFrame: number,
  config: ContactEventConfig,
): ContactSquash {
  const { startFrame, durationFrames, impactAngleRad, maxCompression, maxRecoil } = config;

  if (currentFrame < startFrame || currentFrame >= startFrame + durationFrames) {
    return { squashX: 1, squashY: 1, recoilX: 0, recoilY: 0, rotationDeg: 0 };
  }

  const p = (currentFrame - startFrame) / durationFrames;

  // 1. Compression phase (first 25% of duration) -> Recovery & single overshoot (remaining 75%)
  let compressionFactor = 0;
  let recoilFactor = 0;

  if (p < 0.25) {
    // Quick compression ramp
    const compProgress = p / 0.25;
    compressionFactor = Math.sin(compProgress * Math.PI * 0.5);
    recoilFactor = compProgress * 0.4;
  } else {
    // Elastic rebound with single small overshoot
    const recoveryProgress = (p - 0.25) / 0.75;
    const decay = Math.exp(-recoveryProgress * 3.8);
    const oscillation = Math.cos(recoveryProgress * Math.PI * 2.2);
    compressionFactor = decay * oscillation;

    // Recoil translation decays smoothly to 0
    recoilFactor = decay * (1 - recoveryProgress * 0.2);
  }

  // 2. Compute directional squash tensor rotated to impact angle
  const compAlongNormal = 1 - compressionFactor * maxCompression;
  const expPerpendicular = 1 + compressionFactor * maxCompression * 0.85;

  const cosA = Math.cos(impactAngleRad);
  const sinA = Math.sin(impactAngleRad);

  // Approximate tensor projection onto X and Y axes
  const squashX = cosA * cosA * compAlongNormal + sinA * sinA * expPerpendicular;
  const squashY = sinA * sinA * compAlongNormal + cosA * cosA * expPerpendicular;

  // 3. Recoil translation opposite to impact direction
  const recoilDirX = config.recoilDirection?.x ?? -cosA;
  const recoilDirY = config.recoilDirection?.y ?? -sinA;
  const recoilX = recoilDirX * recoilFactor * maxRecoil;
  const recoilY = recoilDirY * recoilFactor * maxRecoil;

  // Subtle impact tilt
  const rotationDeg = -sinA * compressionFactor * 4.5;

  return {
    squashX,
    squashY,
    recoilX,
    recoilY,
    rotationDeg,
  };
}
