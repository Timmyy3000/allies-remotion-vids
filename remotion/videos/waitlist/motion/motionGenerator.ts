import { getPointAtLength, getLength } from "@remotion/paths";
import { AllyIdentity } from "../constants/allyStates";

export interface Point2D {
  x: number;
  y: number;
}

export interface CubicBezierPathData {
  start: Point2D;
  c1: Point2D;
  c2: Point2D;
  end: Point2D;
  svgPath: string;
  chordLength: number;
  totalLength: number;
  initialTangentDeg: number;
  finalTangentDeg: number;
}

/**
 * Deterministic pseudo-random number generator (Mulberry32)
 */
export function createRNG(seed: number) {
  let s = seed >>> 0;
  return function next(): number {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministic 32-bit FNV-1a hash combining string and numbers
 */
export function hashSeed(str: string, index: number = 0, extra: number = 0): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  hash ^= index;
  hash = Math.imul(hash, 0x01000193);
  hash ^= extra;
  hash = Math.imul(hash, 0x01000193);
  return hash >>> 0;
}

export interface CurvePersonality {
  bendBias: "left" | "right" | "outward" | "auto";
  curvatureIntensity: number; // 0.35 to 0.70 (broad, pronounced arc)
  asymmetry: number; // -0.3 to +0.3 (longitudinal displacement of apex)
  sCurveChance: number; // 0 to 1
  responsiveness: number; // Follower physical inertia alpha (0.20 - 0.34)
  organicDeviation: number; // Subtle course trim in px (1.5 - 2.0)
}

/**
 * Character Personality Matrix:
 * - Blue (Rolly): Alert, confident, crisp, decisive trajectory
 * - Green (Rocky): Soft, calm, relaxed, wide parabolic belly curve
 * - Pink (Ghosty): Energetic, expressive, dynamic sweeping swoop
 * - Yellow (Boxy): Playful, smooth, leisurely looping arc
 */
export const PERSONALITY_CONFIGS: Record<AllyIdentity, CurvePersonality> = {
  rolly: {
    bendBias: "auto",
    curvatureIntensity: 0.58,
    asymmetry: 0.15,
    sCurveChance: 0.7,
    responsiveness: 0.32,
    organicDeviation: 2.8,
  },
  rocky: {
    bendBias: "auto",
    curvatureIntensity: 0.65,
    asymmetry: -0.1,
    sCurveChance: 0.65,
    responsiveness: 0.22,
    organicDeviation: 3.2,
  },
  ghosty: {
    bendBias: "auto",
    curvatureIntensity: 0.62,
    asymmetry: 0.25,
    sCurveChance: 0.85,
    responsiveness: 0.3,
    organicDeviation: 3.0,
  },
  boxy: {
    bendBias: "auto",
    curvatureIntensity: 0.6,
    asymmetry: 0.05,
    sCurveChance: 0.75,
    responsiveness: 0.26,
    organicDeviation: 2.8,
  },
};

/**
 * Constructs an exact SVG cubic Bézier path string
 */
export function createCubicBezierSvgPath(b: {
  start: Point2D;
  c1: Point2D;
  c2: Point2D;
  end: Point2D;
}): string {
  return `M ${b.start.x} ${b.start.y} C ${b.c1.x} ${b.c1.y}, ${b.c2.x} ${b.c2.y}, ${b.end.x} ${b.end.y}`;
}

/**
 * Generates a fresh, art-directed, broad cubic Bézier curve for any movement event.
 * Every intentional movement receives its own unique, deterministic path.
 */
export function generateCurvedMotionPath(
  identity: AllyIdentity,
  start: Point2D,
  end: Point2D,
  moveIndex: number = 0,
  phaseTag: string = "move",
  options?: Partial<CurvePersonality>
): CubicBezierPathData {
  const personality = { ...PERSONALITY_CONFIGS[identity], ...options };
  const seed = hashSeed(identity + "_" + phaseTag, moveIndex);
  const rng = createRNG(seed);

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const chordLength = Math.hypot(dx, dy) || 1;
  const ux = dx / chordLength;
  const uy = dy / chordLength;

  // Normal vector perpendicular to chord (left-hand normal)
  const nx = -uy;
  const ny = ux;

  // Decide bend direction
  let bendDir = 1;
  if (personality.bendBias === "auto") {
    // Bend outward relative to canvas center (1920, 1080) for elegant cinematic staging
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const toCenterDx = 1920 - midX;
    const toCenterDy = 1080 - midY;
    const dotNormal = nx * toCenterDx + ny * toCenterDy;
    bendDir = dotNormal > 0 ? -1 : 1;
  } else if (personality.bendBias === "left") {
    bendDir = 1;
  } else if (personality.bendBias === "right") {
    bendDir = -1;
  }

  // Distance-scaled curvature with minimum and maximum bend guarantees:
  const MIN_BEND_PX = 60;
  const MAX_BEND_PX = 560;
  const rawBend = chordLength * (personality.curvatureIntensity + (rng() - 0.5) * 0.15);
  const clampedBend = Math.max(MIN_BEND_PX, Math.min(MAX_BEND_PX, rawBend));
  const curveHeight = clampedBend * bendDir;

  // Control points along chord
  const t1 = Math.max(
    0.18,
    Math.min(0.46, 0.30 + personality.asymmetry * 0.1 + (rng() - 0.5) * 0.08)
  );
  const t2 = Math.max(
    0.54,
    Math.min(0.86, 0.70 + personality.asymmetry * 0.1 + (rng() - 0.5) * 0.08)
  );

  const isSCurve = rng() < personality.sCurveChance && chordLength > 250;
  const h1 = curveHeight * (0.95 + rng() * 0.35);
  const h2 = isSCurve
    ? -curveHeight * (0.85 + rng() * 0.35)
    : curveHeight * (0.90 + rng() * 0.30);

  const c1: Point2D = {
    x: Math.round(start.x + ux * chordLength * t1 + nx * h1),
    y: Math.round(start.y + uy * chordLength * t1 + ny * h1),
  };

  const c2: Point2D = {
    x: Math.round(start.x + ux * chordLength * t2 + nx * h2),
    y: Math.round(start.y + uy * chordLength * t2 + ny * h2),
  };

  const svgPath = createCubicBezierSvgPath({ start, c1, c2, end });
  const totalLength = getLength(svgPath);

  // Derive initial and final path tangents
  const p0 = getPointAtLength(svgPath, 0)!;
  const p1 = getPointAtLength(svgPath, Math.min(totalLength, 1.0))!;
  const initialTangentDeg = (Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180) / Math.PI;

  const pEnd = getPointAtLength(svgPath, totalLength)!;
  const pPreEnd = getPointAtLength(svgPath, Math.max(0, totalLength - 1.0))!;
  const finalTangentDeg =
    (Math.atan2(pEnd.y - pPreEnd.y, pEnd.x - pPreEnd.x) * 180) / Math.PI;

  return {
    start,
    c1,
    c2,
    end,
    svgPath,
    chordLength,
    totalLength,
    initialTangentDeg,
    finalTangentDeg,
  };
}
