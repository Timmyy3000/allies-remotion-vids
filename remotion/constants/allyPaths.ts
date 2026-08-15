import { motionEasing } from "./motionEasing";
import { ALLY_COLORS } from "./colors";
import { AllyIdentity } from "./allyStates";
import {
  Point2D,
  CubicBezierPathData,
  generateCurvedMotionPath,
  PERSONALITY_CONFIGS,
  createCubicBezierSvgPath,
} from "../motion/motionGenerator";
import { MotionSegment } from "../motion/useBezierTravel";
import { BRAND_GATHER_POSITIONS, WRITING_STAGE_POSITIONS } from "./layout";
import { TIMING } from "./timing";

export {
  type Point2D,
  type CubicBezierPathData,
  type MotionSegment,
  generateCurvedMotionPath,
  createCubicBezierSvgPath,
  PERSONALITY_CONFIGS,
};

export interface AllyMotionConfig {
  id: "blue" | "green" | "pink" | "yellow";
  identity: AllyIdentity;
  name: string;
  color: string;
  bezier: CubicBezierPathData;
  svgPath: string;
  startFrame: number;
  durationFrames: number;
  segments: MotionSegment[];
  allBeziers: {
    entrance: CubicBezierPathData;
    gather: CubicBezierPathData;
    spread: CubicBezierPathData;
  };
  responsiveness: number; // Follower physical inertia response (alpha: 0.20 - 0.34)
  organicDeviation: number; // Subtle micro-course variation (pixels: 1.5 - 2.0)
  timingEase: (t: number) => number;
  idle: {
    yRange: readonly [number, number];
    xRange: readonly [number, number];
    rotRange: readonly [number, number];
    periodFrames: number;
    phase: number;
  };
}

// -----------------------------------------------------------------------------
// 1. Blue (Rolly): Alert, crisp, decisive trajectories
// -----------------------------------------------------------------------------
const blueEntrance = generateCurvedMotionPath(
  "rolly",
  { x: 780, y: -300 },
  { x: 1720, y: 620 },
  0,
  "entrance"
);
const blueGather = generateCurvedMotionPath(
  "rolly",
  { x: 1720, y: 620 },
  BRAND_GATHER_POSITIONS.blue,
  1,
  "brandGather"
);
const blueSpread = generateCurvedMotionPath(
  "rolly",
  BRAND_GATHER_POSITIONS.blue,
  WRITING_STAGE_POSITIONS.blue,
  2,
  "writingStageSpread"
);

// -----------------------------------------------------------------------------
// 2. Green (Rocky): Soft, calm, relaxed, wide parabolic arcs
// -----------------------------------------------------------------------------
const greenEntrance = generateCurvedMotionPath(
  "rocky",
  { x: -320, y: 2280 },
  { x: 600, y: 1580 },
  0,
  "entrance"
);
const greenGather = generateCurvedMotionPath(
  "rocky",
  { x: 600, y: 1580 },
  BRAND_GATHER_POSITIONS.green,
  1,
  "brandGather"
);
const greenSpread = generateCurvedMotionPath(
  "rocky",
  BRAND_GATHER_POSITIONS.green,
  WRITING_STAGE_POSITIONS.green,
  2,
  "writingStageSpread"
);

// -----------------------------------------------------------------------------
// 3. Pink (Ghosty): Energetic, dynamic, sweeping swoops (settles poised to write)
// -----------------------------------------------------------------------------
const pinkEntrance = generateCurvedMotionPath(
  "ghosty",
  { x: 4180, y: 560 },
  { x: 3380, y: 940 },
  0,
  "entrance"
);
const pinkGather = generateCurvedMotionPath(
  "ghosty",
  { x: 3380, y: 940 },
  BRAND_GATHER_POSITIONS.pink,
  1,
  "brandGather"
);
const pinkSpread = generateCurvedMotionPath(
  "ghosty",
  BRAND_GATHER_POSITIONS.pink,
  WRITING_STAGE_POSITIONS.pink,
  2,
  "writingStageSpread"
);

// -----------------------------------------------------------------------------
// 4. Yellow (Boxy): Playful, leisurely, looping arcs
// -----------------------------------------------------------------------------
const yellowEntrance = generateCurvedMotionPath(
  "boxy",
  { x: 3120, y: 2480 },
  { x: 2520, y: 1680 },
  0,
  "entrance"
);
const yellowGather = generateCurvedMotionPath(
  "boxy",
  { x: 2520, y: 1680 },
  BRAND_GATHER_POSITIONS.yellow,
  1,
  "brandGather"
);
const yellowSpread = generateCurvedMotionPath(
  "boxy",
  BRAND_GATHER_POSITIONS.yellow,
  WRITING_STAGE_POSITIONS.yellow,
  2,
  "writingStageSpread"
);

export const ALLY_PATHS: Record<
  "blue" | "green" | "pink" | "yellow",
  AllyMotionConfig
> = {
  blue: {
    id: "blue",
    identity: "rolly",
    name: "Blue Ally (Rolly)",
    color: ALLY_COLORS.blue,
    bezier: blueEntrance,
    svgPath: blueEntrance.svgPath,
    startFrame: TIMING.BLUE_TRAVEL_START,
    durationFrames: TIMING.BLUE_TRAVEL_DURATION,
    segments: [
      {
        id: "entrance",
        path: blueEntrance.svgPath,
        startFrame: TIMING.BLUE_TRAVEL_START,
        durationInFrames: TIMING.BLUE_TRAVEL_DURATION,
        timingEase: motionEasing.travelIn,
      },
      {
        id: "gather",
        path: blueGather.svgPath,
        startFrame: TIMING.BLUE_GATHER_START,
        durationInFrames: TIMING.BLUE_GATHER_DURATION,
        timingEase: motionEasing.travelIn,
      },
      {
        id: "spread",
        path: blueSpread.svgPath,
        startFrame: TIMING.BLUE_SPREAD_START,
        durationInFrames: TIMING.BLUE_SPREAD_DURATION,
        timingEase: motionEasing.travelIn,
      },
    ],
    allBeziers: {
      entrance: blueEntrance,
      gather: blueGather,
      spread: blueSpread,
    },
    responsiveness: PERSONALITY_CONFIGS.rolly.responsiveness, // 0.32: Crisp, alert
    organicDeviation: PERSONALITY_CONFIGS.rolly.organicDeviation, // 1.5px
    timingEase: motionEasing.travelIn,
    idle: {
      yRange: [-18, 18] as const,
      xRange: [0, 7] as const,
      rotRange: [0, 2.5] as const,
      periodFrames: 222,
      phase: 0,
    },
  },
  green: {
    id: "green",
    identity: "rocky",
    name: "Green Ally (Rocky)",
    color: ALLY_COLORS.green,
    bezier: greenEntrance,
    svgPath: greenEntrance.svgPath,
    startFrame: TIMING.GREEN_TRAVEL_START,
    durationFrames: TIMING.GREEN_TRAVEL_DURATION,
    segments: [
      {
        id: "entrance",
        path: greenEntrance.svgPath,
        startFrame: TIMING.GREEN_TRAVEL_START,
        durationInFrames: TIMING.GREEN_TRAVEL_DURATION,
        timingEase: motionEasing.softTravelIn,
      },
      {
        id: "gather",
        path: greenGather.svgPath,
        startFrame: TIMING.GREEN_GATHER_START,
        durationInFrames: TIMING.GREEN_GATHER_DURATION,
        timingEase: motionEasing.softTravelIn,
      },
      {
        id: "spread",
        path: greenSpread.svgPath,
        startFrame: TIMING.GREEN_SPREAD_START,
        durationInFrames: TIMING.GREEN_SPREAD_DURATION,
        timingEase: motionEasing.softTravelIn,
      },
    ],
    allBeziers: {
      entrance: greenEntrance,
      gather: greenGather,
      spread: greenSpread,
    },
    responsiveness: PERSONALITY_CONFIGS.rocky.responsiveness, // 0.20: Soft, calm, gentle
    organicDeviation: PERSONALITY_CONFIGS.rocky.organicDeviation, // 2.0px
    timingEase: motionEasing.softTravelIn,
    idle: {
      yRange: [-15, 15] as const,
      xRange: [-7, 0] as const,
      rotRange: [-2, 2] as const,
      periodFrames: 264,
      phase: 1.2,
    },
  },
  pink: {
    id: "pink",
    identity: "ghosty",
    name: "Pink Ally (Ghosty)",
    color: ALLY_COLORS.pink,
    bezier: pinkEntrance,
    svgPath: pinkEntrance.svgPath,
    startFrame: TIMING.PINK_TRAVEL_START,
    durationFrames: TIMING.PINK_TRAVEL_DURATION,
    segments: [
      {
        id: "entrance",
        path: pinkEntrance.svgPath,
        startFrame: TIMING.PINK_TRAVEL_START,
        durationInFrames: TIMING.PINK_TRAVEL_DURATION,
        timingEase: motionEasing.travelIn,
      },
      {
        id: "gather",
        path: pinkGather.svgPath,
        startFrame: TIMING.PINK_GATHER_START,
        durationInFrames: TIMING.PINK_GATHER_DURATION,
        timingEase: motionEasing.travelIn,
      },
      {
        id: "spread",
        path: pinkSpread.svgPath,
        startFrame: TIMING.PINK_SPREAD_START,
        durationInFrames: TIMING.PINK_SPREAD_DURATION,
        timingEase: motionEasing.travelIn,
      },
    ],
    allBeziers: {
      entrance: pinkEntrance,
      gather: pinkGather,
      spread: pinkSpread,
    },
    responsiveness: PERSONALITY_CONFIGS.ghosty.responsiveness, // 0.30: Energetic, dynamic
    organicDeviation: PERSONALITY_CONFIGS.ghosty.organicDeviation, // 1.8px
    timingEase: motionEasing.travelIn,
    idle: {
      yRange: [-14, 14] as const,
      xRange: [0, 9] as const,
      rotRange: [-2.5, 2.5] as const,
      periodFrames: 246,
      phase: 2.4,
    },
  },
  yellow: {
    id: "yellow",
    identity: "boxy",
    name: "Yellow Ally (Boxy)",
    color: ALLY_COLORS.yellow,
    bezier: yellowEntrance,
    svgPath: yellowEntrance.svgPath,
    startFrame: TIMING.YELLOW_TRAVEL_START,
    durationFrames: TIMING.YELLOW_TRAVEL_DURATION,
    segments: [
      {
        id: "entrance",
        path: yellowEntrance.svgPath,
        startFrame: TIMING.YELLOW_TRAVEL_START,
        durationInFrames: TIMING.YELLOW_TRAVEL_DURATION,
        timingEase: motionEasing.travelIn,
      },
      {
        id: "gather",
        path: yellowGather.svgPath,
        startFrame: TIMING.YELLOW_GATHER_START,
        durationInFrames: TIMING.YELLOW_GATHER_DURATION,
        timingEase: motionEasing.travelIn,
      },
      {
        id: "spread",
        path: yellowSpread.svgPath,
        startFrame: TIMING.YELLOW_SPREAD_START,
        durationInFrames: TIMING.YELLOW_SPREAD_DURATION,
        timingEase: motionEasing.travelIn,
      },
    ],
    allBeziers: {
      entrance: yellowEntrance,
      gather: yellowGather,
      spread: yellowSpread,
    },
    responsiveness: PERSONALITY_CONFIGS.boxy.responsiveness, // 0.24: Playful, smooth
    organicDeviation: PERSONALITY_CONFIGS.boxy.organicDeviation, // 1.6px
    timingEase: motionEasing.travelIn,
    idle: {
      yRange: [-20, 20] as const,
      xRange: [-5, 5] as const,
      rotRange: [0, 2.5] as const,
      periodFrames: 198,
      phase: 3.6,
    },
  },
};

/**
 * Single Canonical Definition of All 4 Allies
 */
export const ALLIES = ALLY_PATHS;

/**
 * Set to true during development in Remotion Studio to render debug motion guides.
 * Default is false for production renders.
 */
export const SHOW_MOTION_PATHS = false;

/**
 * Set to true during development in Remotion Studio to render cursor orbit & clearance debug geometry.
 * Default is false for production renders.
 */
export const SHOW_CURSOR_GEOMETRY = false;

/**
 * Set to true during development to render a timeline phase & time overlay.
 * Default is false for production renders.
 */
export const SHOW_TIMELINE_DEBUG = false;
