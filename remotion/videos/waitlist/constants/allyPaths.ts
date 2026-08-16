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
  DEPARTURE_TARGETS,
  DOMAIN_DRAG_TARGETS,
  DOMAIN_EDGE_POSITIONS,
  DOMAIN_EXIT_POSITIONS,
  WORD_CARRIAGE_LAYOUT,
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

export const SHOW_MOTION_PATHS = false;
export const SHOW_TIMELINE_DEBUG = false;
export const SHOW_CURSOR_GEOMETRY = false;

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
  allBeziers: Record<string, CubicBezierPathData>;
  responsiveness: number;
  organicDeviation: number;
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
// 1. Blue (Rolly): Alert, crisp, decisive trajectories (No Logo Carriage on Entrance)
// -----------------------------------------------------------------------------
const blueEntrance = generateCurvedMotionPath(
  "rolly",
  { x: 1280, y: -220 },
  BRAND_GATHER_POSITIONS.blue,
  0,
  "entrance",
);
const blueDomainEdge = generateCurvedMotionPath(
  "rolly",
  BRAND_GATHER_POSITIONS.blue,
  DOMAIN_EDGE_POSITIONS.blue,
  1,
  "domainEdge",
);
const blueDomainDrag = generateCurvedMotionPath(
  "rolly",
  DOMAIN_EDGE_POSITIONS.blue,
  DOMAIN_DRAG_TARGETS.blue.actor,
  2,
  "domainDrag",
);
const blueDomainExit = generateCurvedMotionPath(
  "rolly",
  DOMAIN_DRAG_TARGETS.blue.actor,
  DOMAIN_EXIT_POSITIONS.blue,
  3,
  "domainExit",
);
const blueDeparture = generateCurvedMotionPath(
  "rolly",
  DOMAIN_EXIT_POSITIONS.blue,
  DEPARTURE_TARGETS.blue,
  4,
  "departure",
);

// -----------------------------------------------------------------------------
// 2. Green (Rocky): Soft, calm, relaxed, wide parabolic arcs
// -----------------------------------------------------------------------------
const greenEntrance = generateCurvedMotionPath(
  "rocky",
  { x: -220, y: 1980 },
  BRAND_GATHER_POSITIONS.green,
  0,
  "entrance",
);
const greenMeetApproach = generateCurvedMotionPath(
  "rocky",
  BRAND_GATHER_POSITIONS.green,
  WORD_CARRIAGE_LAYOUT.meetPickup.actorBody,
  1,
  "meetApproach",
);
const greenMeetCarry = generateCurvedMotionPath(
  "rocky",
  WORD_CARRIAGE_LAYOUT.meetPickup.actorBody,
  WORD_CARRIAGE_LAYOUT.greenMeetExit,
  2,
  "meetCarry",
);
const greenReturn = generateCurvedMotionPath(
  "rocky",
  WORD_CARRIAGE_LAYOUT.greenMeetExit,
  WORD_CARRIAGE_LAYOUT.greenReturnTarget,
  3,
  "greenReturn",
);
const greenDomainEdge = generateCurvedMotionPath(
  "rocky",
  WORD_CARRIAGE_LAYOUT.greenReturnTarget,
  DOMAIN_EDGE_POSITIONS.green,
  4,
  "domainEdge",
);
const greenDomainDrag = generateCurvedMotionPath(
  "rocky",
  DOMAIN_EDGE_POSITIONS.green,
  DOMAIN_DRAG_TARGETS.green.actor,
  5,
  "domainDrag",
);
const greenDomainExit = generateCurvedMotionPath(
  "rocky",
  DOMAIN_DRAG_TARGETS.green.actor,
  DOMAIN_EXIT_POSITIONS.green,
  6,
  "domainExit",
);
const greenDeparture = generateCurvedMotionPath(
  "rocky",
  DOMAIN_EXIT_POSITIONS.green,
  DEPARTURE_TARGETS.green,
  7,
  "departure",
);

// -----------------------------------------------------------------------------
// 3. Pink (Ghosty): Energetic, dynamic, sweeping swoops
// -----------------------------------------------------------------------------
const pinkEntrance = generateCurvedMotionPath(
  "ghosty",
  { x: 4060, y: 720 },
  BRAND_GATHER_POSITIONS.pink,
  0,
  "entrance",
);
const pinkDomainEdge = generateCurvedMotionPath(
  "ghosty",
  BRAND_GATHER_POSITIONS.pink,
  DOMAIN_EDGE_POSITIONS.pink,
  1,
  "domainEdge",
);
const pinkDomainDrag = generateCurvedMotionPath(
  "ghosty",
  DOMAIN_EDGE_POSITIONS.pink,
  DOMAIN_DRAG_TARGETS.pink.actor,
  2,
  "domainDrag",
);
const pinkDomainExit = generateCurvedMotionPath(
  "ghosty",
  DOMAIN_DRAG_TARGETS.pink.actor,
  DOMAIN_EXIT_POSITIONS.pink,
  3,
  "domainExit",
);
const pinkDeparture = generateCurvedMotionPath(
  "ghosty",
  DOMAIN_EXIT_POSITIONS.pink,
  DEPARTURE_TARGETS.pink,
  4,
  "departure",
);

// -----------------------------------------------------------------------------
// 4. Yellow (Boxy): Playful, buoyant, looping arcs
// -----------------------------------------------------------------------------
const yellowEntrance = generateCurvedMotionPath(
  "boxy",
  { x: 2850, y: 2380 },
  BRAND_GATHER_POSITIONS.yellow,
  0,
  "entrance",
);
const yellowYourApproach = generateCurvedMotionPath(
  "boxy",
  BRAND_GATHER_POSITIONS.yellow,
  WORD_CARRIAGE_LAYOUT.yourPickup.actorBody,
  1,
  "yourApproach",
);
const yellowYourCarry = generateCurvedMotionPath(
  "boxy",
  WORD_CARRIAGE_LAYOUT.yourPickup.actorBody,
  WORD_CARRIAGE_LAYOUT.yellowYourExit,
  2,
  "yourCarry",
);
const yellowReturn = generateCurvedMotionPath(
  "boxy",
  WORD_CARRIAGE_LAYOUT.yellowYourExit,
  WORD_CARRIAGE_LAYOUT.yellowReturnTarget,
  3,
  "yellowReturn",
);
const yellowDomainEdge = generateCurvedMotionPath(
  "boxy",
  WORD_CARRIAGE_LAYOUT.yellowReturnTarget,
  DOMAIN_EDGE_POSITIONS.yellow,
  4,
  "domainEdge",
);
const yellowDomainDrag = generateCurvedMotionPath(
  "boxy",
  DOMAIN_EDGE_POSITIONS.yellow,
  DOMAIN_DRAG_TARGETS.yellow.actor,
  5,
  "domainDrag",
);
const yellowDomainExit = generateCurvedMotionPath(
  "boxy",
  DOMAIN_DRAG_TARGETS.yellow.actor,
  DOMAIN_EXIT_POSITIONS.yellow,
  6,
  "domainExit",
);
const yellowDeparture = generateCurvedMotionPath(
  "boxy",
  DOMAIN_EXIT_POSITIONS.yellow,
  DEPARTURE_TARGETS.yellow,
  7,
  "departure",
);

export const ALLIES = {
  blue: {
    id: "blue" as const,
    identity: "rolly" as const,
    name: "Blue Ally (Rolly)",
    color: ALLY_COLORS.blue,
    bezier: blueEntrance,
    svgPath: blueEntrance.svgPath,
    startFrame: TIMING.BLUE_ENTRANCE_START,
    durationFrames: TIMING.BLUE_ENTRANCE_DURATION,
    segments: [
      {
        id: "entrance",
        path: blueEntrance.svgPath,
        startFrame: TIMING.BLUE_ENTRANCE_START,
        durationInFrames: TIMING.BLUE_ENTRANCE_DURATION,
        timingEase: motionEasing.travelIn,
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
        startFrame: 845,
        durationInFrames: 50,
        timingEase: motionEasing.travelIn,
      },
      {
        id: "departure",
        path: blueDeparture.svgPath,
        startFrame: TIMING.BLUE_DEPART_START,
        durationInFrames: 60,
        timingEase: motionEasing.travelIn,
      },
    ],
    allBeziers: {
      entrance: blueEntrance,
      domainEdge: blueDomainEdge,
      domainDrag: blueDomainDrag,
      domainExit: blueDomainExit,
      departure: blueDeparture,
    },
    responsiveness: PERSONALITY_CONFIGS.rolly.responsiveness,
    organicDeviation: PERSONALITY_CONFIGS.rolly.organicDeviation,
    timingEase: motionEasing.travelIn,
    idle: {
      yRange: [-20, 20] as const,
      xRange: [-14, 14] as const,
      rotRange: [-3, 3] as const,
      periodFrames: 180,
      phase: 0,
    },
  },

  green: {
    id: "green" as const,
    identity: "rocky" as const,
    name: "Green Ally (Rocky)",
    color: ALLY_COLORS.green,
    bezier: greenEntrance,
    svgPath: greenEntrance.svgPath,
    startFrame: TIMING.GREEN_ENTRANCE_START,
    durationFrames: TIMING.GREEN_ENTRANCE_DURATION,
    segments: [
      {
        id: "entrance",
        path: greenEntrance.svgPath,
        startFrame: TIMING.GREEN_ENTRANCE_START,
        durationInFrames: TIMING.GREEN_ENTRANCE_DURATION,
        timingEase: motionEasing.softTravelIn,
      },
      {
        id: "meet-approach",
        path: greenMeetApproach.svgPath,
        startFrame: TIMING.GREEN_MEET_APPROACH_START,
        durationInFrames: TIMING.GREEN_MEET_PICKUP_START - TIMING.GREEN_MEET_APPROACH_START,
        timingEase: motionEasing.softTravelIn,
        cursorEndDirectionDeg: 90,
      },
      {
        id: "meet-carry",
        path: greenMeetCarry.svgPath,
        startFrame: TIMING.GREEN_MEET_PICKUP_START,
        durationInFrames: TIMING.GREEN_MEET_CARRY_DURATION,
        timingEase: motionEasing.softTravelIn,
        cursorEndDirectionDeg: -180,
      },
      {
        id: "green-return",
        path: greenReturn.svgPath,
        startFrame: TIMING.GREEN_RETURN_START,
        durationInFrames: TIMING.GREEN_RETURN_DURATION,
        timingEase: motionEasing.softTravelIn,
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
        startFrame: 845,
        durationInFrames: 50,
        timingEase: motionEasing.softTravelIn,
      },
      {
        id: "departure",
        path: greenDeparture.svgPath,
        startFrame: TIMING.GREEN_DEPART_START,
        durationInFrames: 65,
        timingEase: motionEasing.softTravelIn,
      },
    ],
    allBeziers: {
      entrance: greenEntrance,
      meetApproach: greenMeetApproach,
      meetCarry: greenMeetCarry,
      greenReturn: greenReturn,
      domainEdge: greenDomainEdge,
      domainDrag: greenDomainDrag,
      domainExit: greenDomainExit,
      departure: greenDeparture,
    },
    responsiveness: PERSONALITY_CONFIGS.rocky.responsiveness,
    organicDeviation: PERSONALITY_CONFIGS.rocky.organicDeviation,
    timingEase: motionEasing.softTravelIn,
    idle: {
      yRange: [-18, 18] as const,
      xRange: [-15, 15] as const,
      rotRange: [-2.5, 2.5] as const,
      periodFrames: 210,
      phase: 1.5,
    },
  },

  pink: {
    id: "pink" as const,
    identity: "ghosty" as const,
    name: "Pink Ally (Ghosty)",
    color: ALLY_COLORS.pink,
    bezier: pinkEntrance,
    svgPath: pinkEntrance.svgPath,
    startFrame: TIMING.PINK_ENTRANCE_START,
    durationFrames: TIMING.PINK_ENTRANCE_DURATION,
    segments: [
      {
        id: "entrance",
        path: pinkEntrance.svgPath,
        startFrame: TIMING.PINK_ENTRANCE_START,
        durationInFrames: TIMING.PINK_ENTRANCE_DURATION,
        timingEase: motionEasing.travelIn,
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
        startFrame: 845,
        durationInFrames: 50,
        timingEase: motionEasing.travelIn,
      },
      {
        id: "departure",
        path: pinkDeparture.svgPath,
        startFrame: TIMING.PINK_DEPART_START,
        durationInFrames: 60,
        timingEase: motionEasing.travelIn,
      },
    ],
    allBeziers: {
      entrance: pinkEntrance,
      domainEdge: pinkDomainEdge,
      domainDrag: pinkDomainDrag,
      domainExit: pinkDomainExit,
      departure: pinkDeparture,
    },
    responsiveness: PERSONALITY_CONFIGS.ghosty.responsiveness,
    organicDeviation: PERSONALITY_CONFIGS.ghosty.organicDeviation,
    timingEase: motionEasing.travelIn,
    idle: {
      yRange: [-22, 22] as const,
      xRange: [-14, 14] as const,
      rotRange: [-3.5, 3.5] as const,
      periodFrames: 170,
      phase: 3.1,
    },
  },

  yellow: {
    id: "yellow" as const,
    identity: "boxy" as const,
    name: "Yellow Ally (Boxy)",
    color: ALLY_COLORS.yellow,
    bezier: yellowEntrance,
    svgPath: yellowEntrance.svgPath,
    startFrame: TIMING.YELLOW_ENTRANCE_START,
    durationFrames: TIMING.YELLOW_ENTRANCE_DURATION,
    segments: [
      {
        id: "entrance",
        path: yellowEntrance.svgPath,
        startFrame: TIMING.YELLOW_ENTRANCE_START,
        durationInFrames: TIMING.YELLOW_ENTRANCE_DURATION,
        timingEase: motionEasing.travelIn,
      },
      {
        id: "your-approach",
        path: yellowYourApproach.svgPath,
        startFrame: TIMING.YELLOW_YOUR_APPROACH_START,
        durationInFrames: TIMING.YELLOW_YOUR_PICKUP_START - TIMING.YELLOW_YOUR_APPROACH_START,
        timingEase: motionEasing.travelIn,
        cursorEndDirectionDeg: 90,
      },
      {
        id: "your-carry",
        path: yellowYourCarry.svgPath,
        startFrame: TIMING.YELLOW_YOUR_PICKUP_START,
        durationInFrames: TIMING.YELLOW_YOUR_CARRY_DURATION,
        timingEase: motionEasing.travelIn,
        cursorEndDirectionDeg: -160,
      },
      {
        id: "yellow-return",
        path: yellowReturn.svgPath,
        startFrame: TIMING.YELLOW_RETURN_START,
        durationInFrames: TIMING.YELLOW_RETURN_DURATION,
        timingEase: motionEasing.travelIn,
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
        startFrame: 845,
        durationInFrames: 50,
        timingEase: motionEasing.travelIn,
      },
      {
        id: "departure",
        path: yellowDeparture.svgPath,
        startFrame: TIMING.YELLOW_DEPART_START,
        durationInFrames: 60,
        timingEase: motionEasing.travelIn,
      },
    ],
    allBeziers: {
      entrance: yellowEntrance,
      yourApproach: yellowYourApproach,
      yourCarry: yellowYourCarry,
      yellowReturn: yellowReturn,
      domainEdge: yellowDomainEdge,
      domainDrag: yellowDomainDrag,
      domainExit: yellowDomainExit,
      departure: yellowDeparture,
    },
    responsiveness: PERSONALITY_CONFIGS.boxy.responsiveness,
    organicDeviation: PERSONALITY_CONFIGS.boxy.organicDeviation,
    timingEase: motionEasing.travelIn,
    idle: {
      yRange: [-18, 18] as const,
      xRange: [-16, 16] as const,
      rotRange: [-2.5, 2.5] as const,
      periodFrames: 195,
      phase: 4.5,
    },
  },
};

export const ALLY_PATHS = ALLIES;
