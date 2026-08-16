export const CANVAS = {
  width: 3840,
  height: 2160,
  fps: 60,
  durationInFrames: 1360,
} as const;

export const TYPOGRAPHY = {
  fontFamily:
    'OpenRunde, "SF Pro Rounded", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: 278.4,
  fontWeight: 700,
  letterSpacing: -7,
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

  // Exact Measured Geometry Metrics (OpenRunde-Bold at 278.4px / -7px tracking)
  meetWidth: 653.1025,
  yourWidth: 573.57125,
  alliesWidth: 623.321875,
  exitGroupWidth: 1299.05375, // meetWidth + wordGap + yourWidth
  brandGroupWidth: 1013.081875, // logoShiftDistance + alliesWidth
  totalContainerWidth: 2384.515625, // exitGroupWidth + wordGap + brandGroupWidth

  // Mathematical Centering Shift:
  // Container is centered at 1920; Brand Group center is at 1920 + (exitGroupWidth + wordGap) / 2
  // Shift = - (exitGroupWidth + wordGap) / 2 = -1371.43375 / 2 = -685.716875px
  brandShiftDistance: -685.716875,

  // Exit Pull Distance into Logo left aperture / center
  meetYourPullDistance: 290.0,

  // Allies Word Exit Pull Distance toward logo
  alliesPullDistance: 120.0,
} as const;

export const BRAND_GATHER_PADDING = 80.0;

export const BRAND_GATHER_POSITIONS = {
  // Keep blue above-left of the logo so its orb and cursor have clear air
  // while the authored heading still points into the allies word.
  blue: { x: 1600, y: 640 },
  pink: { x: 2660, y: 1020 },
  green: { x: 1220, y: 1360 },
  yellow: { x: 2060, y: 1440 },
} as const;

export const WRITING_STAGE_POSITIONS = {
  blue: { x: 640, y: 500 },
  green: { x: 560, y: 1720 },
  yellow: { x: 3260, y: 1740 },
  pink: { x: 3300, y: 840 }, // Active staging anchor ready to initiate first line
} as const;

export const TEXT_STAGE_SAFE_RECT = {
  left: 760,
  right: 3080,
  top: 680,
  bottom: 1480,
} as const;

const DOMAIN_GAP = 16;
const DOMAIN_SUFFIX_GAP = 0;
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
  DOMAIN_GAP +
  DOMAIN_SUFFIX_GAP * 2;
const DOMAIN_LEFT = 1920 - DOMAIN_TOTAL_WIDTH / 2;

// The cursor's center sits on this orbit around a 153px ally orb. The extra
// pointer half-size and padding below keep a carried word attached to the
// cursor tip instead of letting the ally body cover its first letters.
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

/**
 * The second lockup uses the same headline metrics as the opening title, but
 * keeps each arriving domain piece in a measured slot so the ally can land it
 * without shifting the already-settled "allies" word.
 */
export const DOMAIN_LAYOUT = {
  centerX: 1920,
  centerY: 1080,
  rowHeight: HEADLINE_LAYOUT.rowHeight,
  gap: DOMAIN_GAP,
  suffixGap: DOMAIN_SUFFIX_GAP,
  yourAlliesGap: DOMAIN_YOUR_ALLIES_GAP,
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
        DOMAIN_SUFFIX_GAP +
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
        DOMAIN_SUFFIX_GAP +
        DOMAIN_PIECE_WIDTHS.i +
        DOMAIN_SUFFIX_GAP +
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

export const DOMAIN_SWIRL_CENTER = {
  x: DOMAIN_LAYOUT.centerX,
  y: DOMAIN_LAYOUT.centerY,
} as const;

export const DOMAIN_SWIRL_RADII = {
  x: 900,
  y: 650,
} as const;

// A little more than one full loop keeps the motion feeling like a swirl
// instead of returning to the exact point where each ally started.
export const DOMAIN_SWIRL_TURNS = 1.08;

export const DOMAIN_SWIRL_START_ANGLES = {
  blue: 220,
  pink: 310,
  green: 120,
  yellow: 35,
} as const;

function domainSwirlPoint(angleDegrees: number) {
  const angle = (angleDegrees * Math.PI) / 180;
  return {
    x: DOMAIN_SWIRL_CENTER.x + DOMAIN_SWIRL_RADII.x * Math.cos(angle),
    y: DOMAIN_SWIRL_CENTER.y + DOMAIN_SWIRL_RADII.y * Math.sin(angle),
  };
}

export const DOMAIN_SWIRL_POSITIONS = {
  blue: domainSwirlPoint(DOMAIN_SWIRL_START_ANGLES.blue),
  pink: domainSwirlPoint(DOMAIN_SWIRL_START_ANGLES.pink),
  green: domainSwirlPoint(DOMAIN_SWIRL_START_ANGLES.green),
  yellow: domainSwirlPoint(DOMAIN_SWIRL_START_ANGLES.yellow),
} as const;

export const ALLY_ACTORS = {
  size: 153,
  pointerSize: 110.5,
  clearance: 35,
  blue: {
    entry: { x: 1280, y: -220 },
    final: { x: 1720, y: 620 },
    arc: { x: 90, y: -45 },
    entryRotation: -14,
    pointer: { offsetX: 68, offsetY: -34, baseRotation: -15, flipX: false },
    idle: {
      yRange: [-18, 18] as [number, number],
      xRange: [0, 7] as [number, number],
      rotRange: [0, 2.5] as [number, number],
      periodFrames: 222, // 3.7s * 60
      phase: 0,
    },
  },
  green: {
    entry: { x: -220, y: 1980 },
    final: { x: 620, y: 1540 },
    arc: { x: -50, y: 60 },
    entryRotation: 16,
    pointer: { offsetX: 68, offsetY: -34, baseRotation: -15, flipX: false },
    idle: {
      yRange: [-15, 15] as [number, number],
      xRange: [-7, 0] as [number, number],
      rotRange: [-2, 2] as [number, number],
      periodFrames: 264, // 4.4s * 60
      phase: 1.2,
    },
  },
  pink: {
    entry: { x: 4060, y: 720 },
    final: { x: 3360, y: 940 },
    arc: { x: 60, y: -50 },
    entryRotation: -16,
    pointer: { offsetX: 68, offsetY: -34, baseRotation: -20, flipX: false },
    idle: {
      yRange: [-14, 14] as [number, number],
      xRange: [0, 9] as [number, number],
      rotRange: [-2.5, 2.5] as [number, number],
      periodFrames: 246, // 4.1s * 60
      phase: 2.4,
    },
  },
  yellow: {
    entry: { x: 2850, y: 2380 },
    final: { x: 2520, y: 1540 },
    arc: { x: -60, y: 40 },
    entryRotation: 14,
    pointer: { offsetX: 68, offsetY: -34, baseRotation: -15, flipX: false },
    idle: {
      yRange: [-20, 20] as [number, number],
      xRange: [-5, 5] as [number, number],
      rotRange: [0, 2.5] as [number, number],
      periodFrames: 198, // 3.3s * 60
      phase: 3.6,
    },
  },
} as const;
