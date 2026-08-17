import { FPS, TOTAL_DURATION_FRAMES } from "./timing";

export const CANVAS = {
  width: 3840,
  height: 2160,
  fps: FPS,
  durationInFrames: TOTAL_DURATION_FRAMES,
} as const;

export const TYPOGRAPHY = {
  fontFamily:
    'OpenRunde, "SF Pro Rounded", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: 278.4,
  fontWeight: 700,
  letterSpacing: -1.93,
  lineHeight: 1,
} as const;

export const HEADLINE_LAYOUT = {
  rowHeight: 332.53,
  centerX: 1920,
  centerY: 1080,
  wordGap: 72.38,
  logoWidth: 344.13,
  logoHeight: 332.53,
  logoShiftDistance: 389.76,

  // Exact Measured Geometry Metrics (OpenRunde-Bold at 278.4px / -1.93px tracking)
  meetWidth: 668.3125,
  yourWidth: 588.78125,
  alliesWidth: 648.671875,
  exitGroupWidth: 1329.47375, // meetWidth + wordGap + yourWidth
  brandGroupWidth: 1038.431875, // logoShiftDistance + alliesWidth
  totalContainerWidth: 2440.285625, // exitGroupWidth + wordGap + brandGroupWidth

  // Mathematical Centering Shift:
  // Container is centered at 1920; Brand Group center is at 1920 + (exitGroupWidth + wordGap) / 2
  // Shift = - (exitGroupWidth + wordGap) / 2 = -1401.85375 / 2 = -700.926875px
  brandShiftDistance: -700.926875,

  // Exit Pull Distance into Logo left aperture / center (from more-motion)
  meetYourPullDistance: 290.0,

  // Allies Word Exit Pull Distance toward logo
  alliesPullDistance: 120.0,
} as const;

export const BRAND_GATHER_PADDING = 80.0;

export const BRAND_GATHER_POSITIONS = {
  blue: { x: 1680, y: 720 },
  pink: { x: 2820, y: 700 },
  green: { x: 1220, y: 1360 },
  yellow: { x: 2060, y: 1440 },
} as const;

export const POST_ACTION_ANCHORS = {
  blue: { x: 1692, y: 712 },
  pink: { x: 2580, y: 970 },
  green: { x: 1220, y: 1360 },
  yellow: { x: 2085, y: 1425 },
} as const;

export const BRAND_PLAY_BOUNDS = {
  minX: 1350,
  maxX: 2480,
  minY: 820,
  maxY: 1340,
} as const;

export const DEPARTURE_TARGETS = {
  pink: { x: 4250, y: 380 },
  yellow: { x: 2650, y: 2480 },
  blue: { x: -450, y: 320 },
  green: { x: -420, y: 1180 },
} as const;

export const WRITING_STAGE_POSITIONS = {
  blue: { x: 640, y: 500 },
  green: { x: 560, y: 1720 },
  yellow: { x: 3260, y: 1740 },
  pink: { x: 3300, y: 840 },
} as const;

export const TEXT_STAGE_SAFE_RECT = {
  left: 760,
  right: 3080,
  top: 680,
  bottom: 1480,
} as const;

const DOMAIN_GAP = 16;
const DOMAIN_YOUR_ALLIES_GAP = 56;
const DOMAIN_PIECE_WIDTHS = {
  your: HEADLINE_LAYOUT.yourWidth,
  allies: HEADLINE_LAYOUT.alliesWidth,
  dot: 58,
  i: 70,
  o: 185,
} as const;
const DOMAIN_TOTAL_WIDTH =
  DOMAIN_PIECE_WIDTHS.your +
  DOMAIN_PIECE_WIDTHS.allies +
  DOMAIN_PIECE_WIDTHS.dot +
  DOMAIN_PIECE_WIDTHS.i +
  DOMAIN_PIECE_WIDTHS.o +
  DOMAIN_YOUR_ALLIES_GAP +
  DOMAIN_GAP * 3;
const DOMAIN_LEFT = 1920 - DOMAIN_TOTAL_WIDTH / 2;

// The cursor's center sits on this orbit around a 153px ally orb.
export const DOMAIN_CURSOR_ORBIT_RADIUS = 140.965;
export const DOMAIN_CARGO_TIP_PADDING = 18;
const DOMAIN_POINTER_HALF_SIZE = 110.5 / 2;

function domainActorLeadDistance(pieceWidth: number) {
  return (
    DOMAIN_CURSOR_ORBIT_RADIUS +
    DOMAIN_POINTER_HALF_SIZE +
    DOMAIN_CARGO_TIP_PADDING +
    pieceWidth / 2
  );
}

export const DOMAIN_LAYOUT = {
  centerX: 1920,
  centerY: 1080,
  rowHeight: HEADLINE_LAYOUT.rowHeight,
  gap: DOMAIN_GAP,
  yourAlliesGap: DOMAIN_YOUR_ALLIES_GAP,
  totalWidth: DOMAIN_TOTAL_WIDTH,
  // Inflated safe clearance boundary box around completed URL for race routing
  safeBounds: {
    left: DOMAIN_LEFT - 120,
    right: DOMAIN_LEFT + DOMAIN_TOTAL_WIDTH + 120,
    top: 1080 - HEADLINE_LAYOUT.rowHeight / 2 - 140,
    bottom: 1080 + HEADLINE_LAYOUT.rowHeight / 2 + 140,
  },
  pieces: {
    your: {
      text: "your",
      width: DOMAIN_PIECE_WIDTHS.your,
      centerX: DOMAIN_LEFT + DOMAIN_PIECE_WIDTHS.your / 2,
    },
    allies: {
      text: "allies",
      width: DOMAIN_PIECE_WIDTHS.allies,
      centerX:
        DOMAIN_LEFT +
        DOMAIN_PIECE_WIDTHS.your +
        DOMAIN_YOUR_ALLIES_GAP +
        DOMAIN_PIECE_WIDTHS.allies / 2,
    },
    dot: {
      text: ".",
      width: DOMAIN_PIECE_WIDTHS.dot,
      centerX:
        DOMAIN_LEFT +
        DOMAIN_PIECE_WIDTHS.your +
        DOMAIN_YOUR_ALLIES_GAP +
        DOMAIN_PIECE_WIDTHS.allies +
        DOMAIN_GAP +
        DOMAIN_PIECE_WIDTHS.dot / 2,
    },
    i: {
      text: "i",
      width: DOMAIN_PIECE_WIDTHS.i,
      centerX:
        DOMAIN_LEFT +
        DOMAIN_PIECE_WIDTHS.your +
        DOMAIN_YOUR_ALLIES_GAP +
        DOMAIN_PIECE_WIDTHS.allies +
        DOMAIN_GAP +
        DOMAIN_PIECE_WIDTHS.dot +
        DOMAIN_GAP +
        DOMAIN_PIECE_WIDTHS.i / 2,
    },
    o: {
      text: "o",
      width: DOMAIN_PIECE_WIDTHS.o,
      centerX:
        DOMAIN_LEFT +
        DOMAIN_PIECE_WIDTHS.your +
        DOMAIN_YOUR_ALLIES_GAP +
        DOMAIN_PIECE_WIDTHS.allies +
        DOMAIN_GAP +
        DOMAIN_PIECE_WIDTHS.dot +
        DOMAIN_GAP +
        DOMAIN_PIECE_WIDTHS.i +
        DOMAIN_GAP +
        DOMAIN_PIECE_WIDTHS.o / 2,
    },
  },
} as const;

export const DOMAIN_EDGE_POSITIONS = {
  blue: { x: -220, y: 1080 },
  pink: { x: 1920, y: -220 },
  green: { x: 1920, y: 2380 },
  yellow: { x: 4060, y: 1080 },
} as const;

export const DOMAIN_DRAG_TARGETS = {
  blue: {
    piece: "your",
    actor: {
      x:
        DOMAIN_LAYOUT.pieces.your.centerX -
        domainActorLeadDistance(DOMAIN_PIECE_WIDTHS.your),
      y: DOMAIN_LAYOUT.centerY,
    },
  },
  pink: {
    piece: "dot",
    actor: {
      x: DOMAIN_LAYOUT.pieces.dot.centerX,
      y:
        DOMAIN_LAYOUT.centerY -
        domainActorLeadDistance(DOMAIN_PIECE_WIDTHS.dot),
    },
  },
  green: {
    piece: "i",
    actor: {
      x: DOMAIN_LAYOUT.pieces.i.centerX,
      y: DOMAIN_LAYOUT.centerY + domainActorLeadDistance(DOMAIN_PIECE_WIDTHS.i),
    },
  },
  yellow: {
    piece: "o",
    actor: {
      x:
        DOMAIN_LAYOUT.pieces.o.centerX +
        domainActorLeadDistance(DOMAIN_PIECE_WIDTHS.o),
      y: DOMAIN_LAYOUT.centerY,
    },
  },
} as const;

export const DOMAIN_EXIT_POSITIONS = {
  blue: {
    x: DOMAIN_LAYOUT.pieces.your.centerX - 300,
    y: DOMAIN_LAYOUT.centerY - 300,
  },
  pink: {
    x: DOMAIN_LAYOUT.pieces.dot.centerX + 260,
    y: DOMAIN_LAYOUT.centerY - 300,
  },
  green: {
    x: DOMAIN_LAYOUT.pieces.i.centerX + 260,
    y: DOMAIN_LAYOUT.centerY + 300,
  },
  yellow: {
    x: DOMAIN_LAYOUT.pieces.o.centerX + 300,
    y: DOMAIN_LAYOUT.centerY + 300,
  },
} as const;

export const POST_SWIRL_POSITIONS = {
  blue: { x: 1250, y: 720 },
  pink: { x: 2450, y: 720 },
} as const;


export const ALLY_ACTORS = {
  size: 153,
  pointerSize: 110.5,
  clearance: 35,
  blue: {
    entry: { x: 1280, y: -220 },
    final: { x: 1680, y: 720 },
    arc: { x: 90, y: -45 },
    entryRotation: -14,
    pointer: { offsetX: 68, offsetY: -34, baseRotation: -15, flipX: false },
    idle: {
      yRange: [-18, 18] as [number, number],
      xRange: [0, 7] as [number, number],
      rotRange: [0, 2.5] as [number, number],
      periodFrames: 222,
      phase: 0,
    },
  },
  green: {
    entry: { x: -220, y: 1980 },
    final: { x: 1220, y: 1360 },
    arc: { x: -50, y: 60 },
    entryRotation: 16,
    pointer: { offsetX: 68, offsetY: -34, baseRotation: -15, flipX: false },
    idle: {
      yRange: [-15, 15] as [number, number],
      xRange: [-7, 0] as [number, number],
      rotRange: [-2, 2] as [number, number],
      periodFrames: 264,
      phase: 1.2,
    },
  },
  pink: {
    entry: { x: 4060, y: 720 },
    final: { x: 2660, y: 1020 },
    arc: { x: 60, y: -50 },
    entryRotation: -16,
    pointer: { offsetX: 68, offsetY: -34, baseRotation: -20, flipX: false },
    idle: {
      yRange: [-14, 14] as [number, number],
      xRange: [0, 9] as [number, number],
      rotRange: [-2.5, 2.5] as [number, number],
      periodFrames: 246,
      phase: 2.4,
    },
  },
  yellow: {
    entry: { x: 2850, y: 2380 },
    final: { x: 2060, y: 1440 },
    arc: { x: -60, y: 40 },
    entryRotation: 14,
    pointer: { offsetX: 68, offsetY: -34, baseRotation: -15, flipX: false },
    idle: {
      yRange: [-20, 20] as [number, number],
      xRange: [-5, 5] as [number, number],
      rotRange: [0, 2.5] as [number, number],
      periodFrames: 198,
      phase: 3.6,
    },
  },
} as const;
