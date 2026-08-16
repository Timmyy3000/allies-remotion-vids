import { Easing } from "remotion";

/**
 * Centralized Motion Easing Library
 * Standardized easing curves for the Allies animation system.
 */
export const motionEasing = {
  /**
   * Primary Travel Curve:
   * Confident initial departure, long smooth deceleration, zero-velocity settle.
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

  /**
   * Word Carriage Physical Weight & Speed Ramp (Green - Rocky):
   * 4-frame tug/resistance, smooth 18-frame acceleration ramp, continuous cruising exit.
   */
  wordCarryHeavy: (t: number): number => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    // 4-frame tug resistance (t in [0, 0.045])
    if (t < 0.045) {
      const tugP = t / 0.045;
      return 0.003 * (tugP * tugP);
    }
    const normT = (t - 0.045) / 0.955;
    return 0.003 + 0.997 * Math.pow(normT, 1.75);
  },

  /**
   * Word Carriage Physical Weight & Speed Ramp (Yellow - Boxy):
   * 4-frame tug/resistance, slightly more buoyant 15-frame acceleration ramp, continuous cruising exit.
   */
  wordCarryBuoyant: (t: number): number => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    // 4-frame tug resistance (t in [0, 0.042])
    if (t < 0.042) {
      const tugP = t / 0.042;
      return 0.004 * (tugP * tugP);
    }
    const normT = (t - 0.042) / 0.958;
    return 0.004 + 0.996 * Math.pow(normT, 1.55);
  },
} as const;
