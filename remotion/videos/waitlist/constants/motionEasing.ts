import { Easing } from "remotion";

/**
 * Centralized Motion Easing Library
 * Standardized easing curves for the Allies animation system.
 */
export const motionEasing = {
  /**
   * Primary Travel Curve:
   * High energy initial departure, long smooth deceleration, zero-velocity settle.
   */
  travelIn: Easing.bezier(0.22, 1, 0.36, 1),

  /**
   * Calmer Travel Curve:
   * Slightly softer departure for gentler character personalities.
   */
  softTravelIn: Easing.bezier(0.16, 1, 0.3, 1),

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
