import { Easing } from "remotion";

/**
 * Centralized Motion Easing Library
 * Standardized easing curves for the Allies animation system.
 */
export const motionEasing = {
  /**
   * Primary Travel Curve:
   * Soft acceleration and deceleration with zero-velocity endpoints. This
   * avoids the sharp initial kick of the previous ease-out curve.
   */
  travelIn: Easing.bezier(0.42, 0, 0.58, 1),

  /**
   * Calmer Travel Curve:
   * A slightly more reserved version of the same smooth ease-in-out.
   */
  softTravelIn: Easing.bezier(0.48, 0.02, 0.52, 0.98),

  /**
   * Gentle Ease Out:
   * For subtle secondary settling and orientation adjustments.
   */
  gentleOut: Easing.bezier(0.33, 1, 0.68, 1),

  /**
   * Symmetric Soft In-Out:
   * For balanced non-travel transitions.
   */
  softInOut: Easing.bezier(0.65, 0, 0.35, 1),

  /**
   * Idle Float Weight Blend:
   * Smooth emergence of idle sinusoidal oscillation near arrival.
   */
  idleBlend: Easing.bezier(0.25, 1, 0.5, 1),
} as const;
