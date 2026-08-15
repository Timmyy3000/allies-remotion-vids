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
import {
  BRAND_GATHER_POSITIONS,
  DOMAIN_DRAG_TARGETS,
  DOMAIN_EDGE_POSITIONS,
  DOMAIN_EXIT_POSITIONS,
  WRITING_STAGE_POSITIONS,
} from "./layout";
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
    domainEdge: CubicBezierPathData;
    domainDrag: CubicBezierPathData;
    domainExit: CubicBezierPathData;
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
  "entrance",
);
const blueGather = generateCurvedMotionPath(
  "rolly",
  { x: 1720, y: 620 },
  BRAND_GATHER_POSITIONS.blue,
  1,
  "brandGather",
);
const blueSpread = generateCurvedMotionPath(
  "rolly",
  BRAND_GATHER_POSITIONS.blue,
  WRITING_STAGE_POSITIONS.blue,
  2,
  "writingStageSpread",
);

// -----------------------------------------------------------------------------
// 2. Green (Rocky): Soft, calm, relaxed, wide parabolic arcs
// -----------------------------------------------------------------------------
const greenEntrance = generateCurvedMotionPath(
  "rocky",
  { x: -320, y: 2280 },
  { x: 600, y: 1580 },
  0,
  "entrance",
);
const greenGather = generateCurvedMotionPath(
  "rocky",
  { x: 600, y: 1580 },
  BRAND_GATHER_POSITIONS.green,
  1,
  "brandGather",
);
const greenSpread = generateCurvedMotionPath(
  "rocky",
  BRAND_GATHER_POSITIONS.green,
  WRITING_STAGE_POSITIONS.green,
  2,
  "writingStageSpread",
);

// -----------------------------------------------------------------------------
// 3. Pink (Ghosty): Energetic, dynamic, sweeping swoops (settles poised to write)
// -----------------------------------------------------------------------------
const pinkEntrance = generateCurvedMotionPath(
  "ghosty",
  { x: 4180, y: 560 },
  { x: 3380, y: 940 },
  0,
  "entrance",
);
const pinkGather = generateCurvedMotionPath(
  "ghosty",
  { x: 3380, y: 940 },
  BRAND_GATHER_POSITIONS.pink,
  1,
  "brandGather",
);
const pinkSpread = generateCurvedMotionPath(
  "ghosty",
  BRAND_GATHER_POSITIONS.pink,
  WRITING_STAGE_POSITIONS.pink,
  2,
  "writingStageSpread",
);

// -----------------------------------------------------------------------------
// 4. Yellow (Boxy): Playful, leisurely, looping arcs
// -----------------------------------------------------------------------------
const yellowEntrance = generateCurvedMotionPath(
  "boxy",
  { x: 3120, y: 2480 },
  { x: 2520, y: 1680 },
  0,
  "entrance",
);
const yellowGather = generateCurvedMotionPath(
  "boxy",
  { x: 2520, y: 1680 },
  BRAND_GATHER_POSITIONS.yellow,
  1,
  "brandGather",
);

// -----------------------------------------------------------------------------
// 5. Domain assembly paths: gather -> directional edge -> dragged text slot -> roam
// -----------------------------------------------------------------------------
const blueDomainEdge = generateCurvedMotionPath(
  "rolly",
  BRAND_GATHER_POSITIONS.blue,
  DOMAIN_EDGE_POSITIONS.blue,
  2,
  "domainEdge",
);
const blueDomainDrag = generateCurvedMotionPath(
  "rolly",
  DOMAIN_EDGE_POSITIONS.blue,
  DOMAIN_DRAG_TARGETS.blue.actor,
  3,
  "domainDrag",
);
const blueDomainExit = generateCurvedMotionPath(
  "rolly",
  DOMAIN_DRAG_TARGETS.blue.actor,
  DOMAIN_EXIT_POSITIONS.blue,
  4,
  "domainExit",
);

const greenDomainEdge = generateCurvedMotionPath(
  "rocky",
  BRAND_GATHER_POSITIONS.green,
  DOMAIN_EDGE_POSITIONS.green,
  2,
  "domainEdge",
);
const greenDomainDrag = generateCurvedMotionPath(
  "rocky",
  DOMAIN_EDGE_POSITIONS.green,
  DOMAIN_DRAG_TARGETS.green.actor,
  3,
  "domainDrag",
);
const greenDomainExit = generateCurvedMotionPath(
  "rocky",
  DOMAIN_DRAG_TARGETS.green.actor,
  DOMAIN_EXIT_POSITIONS.green,
  4,
  "domainExit",
);

const pinkDomainEdge = generateCurvedMotionPath(
  "ghosty",
  BRAND_GATHER_POSITIONS.pink,
  DOMAIN_EDGE_POSITIONS.pink,
  2,
  "domainEdge",
);
const pinkDomainDrag = generateCurvedMotionPath(
  "ghosty",
  DOMAIN_EDGE_POSITIONS.pink,
  DOMAIN_DRAG_TARGETS.pink.actor,
  3,
  "domainDrag",
);
const pinkDomainExit = generateCurvedMotionPath(
  "ghosty",
  DOMAIN_DRAG_TARGETS.pink.actor,
  DOMAIN_EXIT_POSITIONS.pink,
  4,
  "domainExit",
);

const yellowDomainEdge = generateCurvedMotionPath(
  "boxy",
  BRAND_GATHER_POSITIONS.yellow,
  DOMAIN_EDGE_POSITIONS.yellow,
  2,
  "domainEdge",
);
const yellowDomainDrag = generateCurvedMotionPath(
  "boxy",
  DOMAIN_EDGE_POSITIONS.yellow,
  DOMAIN_DRAG_TARGETS.yellow.actor,
  3,
  "domainDrag",
);
const yellowDomainExit = generateCurvedMotionPath(
  "boxy",
  DOMAIN_DRAG_TARGETS.yellow.actor,
  DOMAIN_EXIT_POSITIONS.yellow,
  4,
  "domainExit",
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
        cursorEndDirectionDeg: 40,
      },
      {
        id: "domain-edge",
        path: blueDomainEdge.svgPath,
        startFrame: TIMING.BLUE_DOMAIN_EDGE_START,
        durationInFrames: TIMING.BLUE_DOMAIN_EDGE_DURATION,
        timingEase: motionEasing.travelIn,
      },
      {
        id: "domain-drag",
        path: blueDomainDrag.svgPath,
        startFrame: TIMING.BLUE_DOMAIN_DRAG_START,
        durationInFrames: TIMING.BLUE_DOMAIN_DRAG_DURATION,
        timingEase: motionEasing.travelIn,
        cursorEndDirectionDeg: 0,
      },
      {
        id: "domain-exit",
        path: blueDomainExit.svgPath,
        startFrame: TIMING.BLUE_DOMAIN_EXIT_START,
        durationInFrames: TIMING.BLUE_DOMAIN_EXIT_DURATION,
        timingEase: motionEasing.travelIn,
      },
    ],
    allBeziers: {
      entrance: blueEntrance,
      gather: blueGather,
      domainEdge: blueDomainEdge,
      domainDrag: blueDomainDrag,
      domainExit: blueDomainExit,
    },
    responsiveness: PERSONALITY_CONFIGS.rolly.responsiveness, // 0.32: Crisp, alert
    organicDeviation: PERSONALITY_CONFIGS.rolly.organicDeviation, // 2.8px
    timingEase: motionEasing.travelIn,
    idle: {
      yRange: [-24, 24] as const,
      xRange: [-16, 16] as const,
      rotRange: [-3.5, 3.5] as const,
      periodFrames: 180,
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
        cursorEndDirectionDeg: -17,
      },
      {
        id: "domain-edge",
        path: greenDomainEdge.svgPath,
        startFrame: TIMING.GREEN_DOMAIN_EDGE_START,
        durationInFrames: TIMING.GREEN_DOMAIN_EDGE_DURATION,
        timingEase: motionEasing.softTravelIn,
      },
      {
        id: "domain-drag",
        path: greenDomainDrag.svgPath,
        startFrame: TIMING.GREEN_DOMAIN_DRAG_START,
        durationInFrames: TIMING.GREEN_DOMAIN_DRAG_DURATION,
        timingEase: motionEasing.softTravelIn,
        cursorEndDirectionDeg: -90,
      },
      {
        id: "domain-exit",
        path: greenDomainExit.svgPath,
        startFrame: TIMING.GREEN_DOMAIN_EXIT_START,
        durationInFrames: TIMING.GREEN_DOMAIN_EXIT_DURATION,
        timingEase: motionEasing.softTravelIn,
      },
    ],
    allBeziers: {
      entrance: greenEntrance,
      gather: greenGather,
      domainEdge: greenDomainEdge,
      domainDrag: greenDomainDrag,
      domainExit: greenDomainExit,
    },
    responsiveness: PERSONALITY_CONFIGS.rocky.responsiveness, // 0.22: Soft, calm, gentle
    organicDeviation: PERSONALITY_CONFIGS.rocky.organicDeviation, // 3.2px
    timingEase: motionEasing.softTravelIn,
    idle: {
      yRange: [-22, 22] as const,
      xRange: [-18, 18] as const,
      rotRange: [-3, 3] as const,
      periodFrames: 210,
      phase: 1.5,
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
        cursorEndDirectionDeg: 174,
      },
      {
        id: "domain-edge",
        path: pinkDomainEdge.svgPath,
        startFrame: TIMING.PINK_DOMAIN_EDGE_START,
        durationInFrames: TIMING.PINK_DOMAIN_EDGE_DURATION,
        timingEase: motionEasing.travelIn,
      },
      {
        id: "domain-drag",
        path: pinkDomainDrag.svgPath,
        startFrame: TIMING.PINK_DOMAIN_DRAG_START,
        durationInFrames: TIMING.PINK_DOMAIN_DRAG_DURATION,
        timingEase: motionEasing.travelIn,
        cursorEndDirectionDeg: 90,
      },
      {
        id: "domain-exit",
        path: pinkDomainExit.svgPath,
        startFrame: TIMING.PINK_DOMAIN_EXIT_START,
        durationInFrames: TIMING.PINK_DOMAIN_EXIT_DURATION,
        timingEase: motionEasing.travelIn,
      },
    ],
    allBeziers: {
      entrance: pinkEntrance,
      gather: pinkGather,
      domainEdge: pinkDomainEdge,
      domainDrag: pinkDomainDrag,
      domainExit: pinkDomainExit,
    },
    responsiveness: PERSONALITY_CONFIGS.ghosty.responsiveness, // 0.30: Energetic, dynamic
    organicDeviation: PERSONALITY_CONFIGS.ghosty.organicDeviation, // 3.0px
    timingEase: motionEasing.travelIn,
    idle: {
      yRange: [-26, 26] as const,
      xRange: [-15, 15] as const,
      rotRange: [-4, 4] as const,
      periodFrames: 170,
      phase: 3.1,
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
        cursorEndDirectionDeg: -81,
      },
      {
        id: "domain-edge",
        path: yellowDomainEdge.svgPath,
        startFrame: TIMING.YELLOW_DOMAIN_EDGE_START,
        durationInFrames: TIMING.YELLOW_DOMAIN_EDGE_DURATION,
        timingEase: motionEasing.travelIn,
      },
      {
        id: "domain-drag",
        path: yellowDomainDrag.svgPath,
        startFrame: TIMING.YELLOW_DOMAIN_DRAG_START,
        durationInFrames: TIMING.YELLOW_DOMAIN_DRAG_DURATION,
        timingEase: motionEasing.travelIn,
        cursorEndDirectionDeg: 180,
      },
      {
        id: "domain-exit",
        path: yellowDomainExit.svgPath,
        startFrame: TIMING.YELLOW_DOMAIN_EXIT_START,
        durationInFrames: TIMING.YELLOW_DOMAIN_EXIT_DURATION,
        timingEase: motionEasing.travelIn,
      },
    ],
    allBeziers: {
      entrance: yellowEntrance,
      gather: yellowGather,
      domainEdge: yellowDomainEdge,
      domainDrag: yellowDomainDrag,
      domainExit: yellowDomainExit,
    },
    responsiveness: PERSONALITY_CONFIGS.boxy.responsiveness, // 0.26: Playful, smooth
    organicDeviation: PERSONALITY_CONFIGS.boxy.organicDeviation, // 2.8px
    timingEase: motionEasing.travelIn,
    idle: {
      yRange: [-20, 20] as const,
      xRange: [-20, 20] as const,
      rotRange: [-3, 3] as const,
      periodFrames: 195,
      phase: 4.8,
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
