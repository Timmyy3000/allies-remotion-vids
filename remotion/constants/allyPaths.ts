import { motionEasing } from "./motionEasing";
import { ALLY_COLORS } from "./colors";
import { AllyIdentity } from "./allyStates";
import {
  Point2D,
  CubicBezierPathData,
  generateCurvedMotionPath,
  createEscortMotionPath,
  PERSONALITY_CONFIGS,
  createCubicBezierSvgPath,
} from "../motion/motionGenerator";
import { MotionSegment } from "../motion/useBezierTravel";
import {
  BRAND_GATHER_POSITIONS,
  WRITING_STAGE_POSITIONS,
  CAPABILITY_LINES_LAYOUT,
  SNUGGLE_CLUSTER_POSITIONS,
  CTA_SURROUND_POSITIONS,
} from "./layout";
import { TIMING } from "./timing";

export {
  type Point2D,
  type CubicBezierPathData,
  type MotionSegment,
  generateCurvedMotionPath,
  createEscortMotionPath,
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
    approach?: CubicBezierPathData;
    escort?: CubicBezierPathData;
    snuggle?: CubicBezierPathData;
    ctaSurround?: CubicBezierPathData;
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
// 1. Blue (Rolly): Alert, crisp, decisive trajectories (Writes Line 2)
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
const blueApproach = generateCurvedMotionPath(
  "rolly",
  WRITING_STAGE_POSITIONS.blue,
  { x: CAPABILITY_LINES_LAYOUT.line2.x - 40, y: CAPABILITY_LINES_LAYOUT.line2.y - 70 },
  3,
  "approach"
);
const blueEscort = createEscortMotionPath(
  { x: CAPABILITY_LINES_LAYOUT.line2.x - 40, y: CAPABILITY_LINES_LAYOUT.line2.y - 70 },
  { x: CAPABILITY_LINES_LAYOUT.line2.endX + 80, y: CAPABILITY_LINES_LAYOUT.line2.y - 30 },
  8
);
const blueSnuggle = generateCurvedMotionPath(
  "rolly",
  { x: CAPABILITY_LINES_LAYOUT.line2.endX + 80, y: CAPABILITY_LINES_LAYOUT.line2.y - 30 },
  SNUGGLE_CLUSTER_POSITIONS.blue,
  5,
  "snuggle"
);
const blueCtaSurround = generateCurvedMotionPath(
  "rolly",
  SNUGGLE_CLUSTER_POSITIONS.blue,
  CTA_SURROUND_POSITIONS.blue,
  6,
  "ctaSurround"
);

// -----------------------------------------------------------------------------
// 2. Green (Rocky): Soft, calm, relaxed, wide parabolic arcs (Writes Line 3)
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
const greenApproach = generateCurvedMotionPath(
  "rocky",
  WRITING_STAGE_POSITIONS.green,
  { x: CAPABILITY_LINES_LAYOUT.line3.x - 40, y: CAPABILITY_LINES_LAYOUT.line3.y - 70 },
  3,
  "approach"
);
const greenEscort = createEscortMotionPath(
  { x: CAPABILITY_LINES_LAYOUT.line3.x - 40, y: CAPABILITY_LINES_LAYOUT.line3.y - 70 },
  { x: CAPABILITY_LINES_LAYOUT.line3.endX + 30, y: CAPABILITY_LINES_LAYOUT.line3.y - 70 },
  8
);
const greenSnuggle = generateCurvedMotionPath(
  "rocky",
  { x: CAPABILITY_LINES_LAYOUT.line3.endX + 30, y: CAPABILITY_LINES_LAYOUT.line3.y - 70 },
  SNUGGLE_CLUSTER_POSITIONS.green,
  5,
  "snuggle"
);
const greenCtaSurround = generateCurvedMotionPath(
  "rocky",
  SNUGGLE_CLUSTER_POSITIONS.green,
  CTA_SURROUND_POSITIONS.green,
  6,
  "ctaSurround"
);

// -----------------------------------------------------------------------------
// 3. Pink (Ghosty): Energetic, dynamic, sweeping swoops (Writes Line 1)
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
const pinkApproach = generateCurvedMotionPath(
  "ghosty",
  WRITING_STAGE_POSITIONS.pink,
  { x: CAPABILITY_LINES_LAYOUT.line1.x - 40, y: CAPABILITY_LINES_LAYOUT.line1.y - 70 },
  3,
  "approach"
);
const pinkEscort = createEscortMotionPath(
  { x: CAPABILITY_LINES_LAYOUT.line1.x - 40, y: CAPABILITY_LINES_LAYOUT.line1.y - 70 },
  { x: CAPABILITY_LINES_LAYOUT.line1.endX + 30, y: CAPABILITY_LINES_LAYOUT.line1.y - 70 },
  8
);
const pinkSnuggle = generateCurvedMotionPath(
  "ghosty",
  { x: CAPABILITY_LINES_LAYOUT.line1.endX + 30, y: CAPABILITY_LINES_LAYOUT.line1.y - 70 },
  SNUGGLE_CLUSTER_POSITIONS.pink,
  5,
  "snuggle"
);
const pinkCtaSurround = generateCurvedMotionPath(
  "ghosty",
  SNUGGLE_CLUSTER_POSITIONS.pink,
  CTA_SURROUND_POSITIONS.pink,
  6,
  "ctaSurround"
);

// -----------------------------------------------------------------------------
// 4. Yellow (Boxy): Playful, leisurely, looping arcs (Writes Line 4)
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
const yellowApproach = generateCurvedMotionPath(
  "boxy",
  WRITING_STAGE_POSITIONS.yellow,
  { x: CAPABILITY_LINES_LAYOUT.line4.x - 40, y: CAPABILITY_LINES_LAYOUT.line4.y - 70 },
  3,
  "approach"
);
const yellowEscort = createEscortMotionPath(
  { x: CAPABILITY_LINES_LAYOUT.line4.x - 40, y: CAPABILITY_LINES_LAYOUT.line4.y - 70 },
  { x: CAPABILITY_LINES_LAYOUT.line4.endX + 30, y: CAPABILITY_LINES_LAYOUT.line4.y - 70 },
  8
);
const yellowSnuggle = generateCurvedMotionPath(
  "boxy",
  { x: CAPABILITY_LINES_LAYOUT.line4.endX + 30, y: CAPABILITY_LINES_LAYOUT.line4.y - 70 },
  SNUGGLE_CLUSTER_POSITIONS.yellow,
  5,
  "snuggle"
);
const yellowCtaSurround = generateCurvedMotionPath(
  "boxy",
  SNUGGLE_CLUSTER_POSITIONS.yellow,
  CTA_SURROUND_POSITIONS.yellow,
  6,
  "ctaSurround"
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
      {
        id: "line2_approach",
        path: blueApproach.svgPath,
        startFrame: TIMING.BLUE_LINE2_APPROACH_START,
        durationInFrames: TIMING.BLUE_LINE2_APPROACH_DURATION,
        timingEase: motionEasing.travelIn,
      },
      {
        id: "line2_escort",
        path: blueEscort.svgPath,
        startFrame: TIMING.BLUE_LINE2_WRITE_START,
        durationInFrames: TIMING.BLUE_LINE2_WRITE_DURATION,
        timingEase: (t) => t, // Uniform line tracking
      },
      {
        id: "snuggle",
        path: blueSnuggle.svgPath,
        startFrame: TIMING.SNUGGLE_MOVE_START,
        durationInFrames: TIMING.SNUGGLE_MOVE_DURATION,
        timingEase: motionEasing.softTravelIn,
      },
      {
        id: "cta_surround",
        path: blueCtaSurround.svgPath,
        startFrame: TIMING.CTA_SURROUND_MOVE_START,
        durationInFrames: TIMING.CTA_SURROUND_MOVE_DURATION,
        timingEase: motionEasing.travelIn,
      },
    ],
    allBeziers: {
      entrance: blueEntrance,
      gather: blueGather,
      spread: blueSpread,
      approach: blueApproach,
      escort: blueEscort,
      snuggle: blueSnuggle,
      ctaSurround: blueCtaSurround,
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
      {
        id: "line3_approach",
        path: greenApproach.svgPath,
        startFrame: TIMING.GREEN_LINE3_APPROACH_START,
        durationInFrames: TIMING.GREEN_LINE3_APPROACH_DURATION,
        timingEase: motionEasing.softTravelIn,
      },
      {
        id: "line3_escort",
        path: greenEscort.svgPath,
        startFrame: TIMING.GREEN_LINE3_WRITE_START,
        durationInFrames: TIMING.GREEN_LINE3_WRITE_DURATION,
        timingEase: (t) => t,
      },
      {
        id: "snuggle",
        path: greenSnuggle.svgPath,
        startFrame: TIMING.SNUGGLE_MOVE_START + 2,
        durationInFrames: TIMING.SNUGGLE_MOVE_DURATION,
        timingEase: motionEasing.softTravelIn,
      },
      {
        id: "cta_surround",
        path: greenCtaSurround.svgPath,
        startFrame: TIMING.CTA_SURROUND_MOVE_START + 2,
        durationInFrames: TIMING.CTA_SURROUND_MOVE_DURATION,
        timingEase: motionEasing.softTravelIn,
      },
    ],
    allBeziers: {
      entrance: greenEntrance,
      gather: greenGather,
      spread: greenSpread,
      approach: greenApproach,
      escort: greenEscort,
      snuggle: greenSnuggle,
      ctaSurround: greenCtaSurround,
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
      {
        id: "line1_approach",
        path: pinkApproach.svgPath,
        startFrame: TIMING.PINK_LINE1_APPROACH_START,
        durationInFrames: TIMING.PINK_LINE1_APPROACH_DURATION,
        timingEase: motionEasing.travelIn,
      },
      {
        id: "line1_escort",
        path: pinkEscort.svgPath,
        startFrame: TIMING.PINK_LINE1_WRITE_START,
        durationInFrames: TIMING.PINK_LINE1_WRITE_DURATION,
        timingEase: (t) => t,
      },
      {
        id: "snuggle",
        path: pinkSnuggle.svgPath,
        startFrame: TIMING.SNUGGLE_MOVE_START + 1,
        durationInFrames: TIMING.SNUGGLE_MOVE_DURATION,
        timingEase: motionEasing.travelIn,
      },
      {
        id: "cta_surround",
        path: pinkCtaSurround.svgPath,
        startFrame: TIMING.CTA_SURROUND_MOVE_START + 1,
        durationInFrames: TIMING.CTA_SURROUND_MOVE_DURATION,
        timingEase: motionEasing.travelIn,
      },
    ],
    allBeziers: {
      entrance: pinkEntrance,
      gather: pinkGather,
      spread: pinkSpread,
      approach: pinkApproach,
      escort: pinkEscort,
      snuggle: pinkSnuggle,
      ctaSurround: pinkCtaSurround,
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
      {
        id: "line4_approach",
        path: yellowApproach.svgPath,
        startFrame: TIMING.YELLOW_LINE4_APPROACH_START,
        durationInFrames: TIMING.YELLOW_LINE4_APPROACH_DURATION,
        timingEase: motionEasing.travelIn,
      },
      {
        id: "line4_escort",
        path: yellowEscort.svgPath,
        startFrame: TIMING.YELLOW_LINE4_WRITE_START,
        durationInFrames: TIMING.YELLOW_LINE4_WRITE_DURATION,
        timingEase: (t) => t,
      },
      {
        id: "snuggle",
        path: yellowSnuggle.svgPath,
        startFrame: TIMING.SNUGGLE_MOVE_START + 3,
        durationInFrames: TIMING.SNUGGLE_MOVE_DURATION,
        timingEase: motionEasing.travelIn,
      },
      {
        id: "cta_surround",
        path: yellowCtaSurround.svgPath,
        startFrame: TIMING.CTA_SURROUND_MOVE_START + 3,
        durationInFrames: TIMING.CTA_SURROUND_MOVE_DURATION,
        timingEase: motionEasing.travelIn,
      },
    ],
    allBeziers: {
      entrance: yellowEntrance,
      gather: yellowGather,
      spread: yellowSpread,
      approach: yellowApproach,
      escort: yellowEscort,
      snuggle: yellowSnuggle,
      ctaSurround: yellowCtaSurround,
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
