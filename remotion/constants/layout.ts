export const CANVAS = {
  width: 3840,
  height: 2160,
  fps: 60,
  durationInFrames: 1800,
} as const;

export const TYPOGRAPHY = {
  fontFamily: 'OpenRunde, "SF Pro Rounded", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
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

  // Exit Pull Distance into Logo left aperture / center
  meetYourPullDistance: 290.0,

  // Allies Word Exit Pull Distance toward logo
  alliesPullDistance: 120.0,
} as const;

export const BRAND_GATHER_PADDING = 80.0;

export const BRAND_GATHER_POSITIONS = {
  blue: { x: 1680, y: 720 },
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

// 4 Capability Lines Layout (OpenRunde-Semibold in 4K space)
export const CAPABILITY_LINES_LAYOUT = {
  fontSize: 66,
  fontWeight: 600,
  letterSpacing: -0.6,
  lineHeight: 1.25,
  line1: {
    x: 780,
    y: 620,
    endX: 2540,
    text: "We’re personal helpers built around what matters to you.",
    words: ["We’re", "personal", "helpers", "built", "around", "what", "matters", "to", "you."],
  },
  line2: {
    x: 780,
    y: 770,
    endX: 1940,
    text: "Our job is to give you back time",
    words: ["Our", "job", "is", "to", "give", "you", "back", "time"],
  },
  line3: {
    x: 780,
    y: 920,
    endX: 2980,
    text: "We track your finances, spot overspending, and keep you updated",
    words: ["We", "track", "your", "finances,", "spot", "overspending,", "and", "keep", "you", "updated"],
  },
  line4: {
    x: 780,
    y: 1070,
    endX: 2580,
    text: "We remember what matters and keep you in control",
    words: ["We", "remember", "what", "matters", "and", "keep", "you", "in", "control"],
  },
} as const;

// Snuggle Cluster Anchors (Bottom-Center friendly team huddle)
export const SNUGGLE_CLUSTER_POSITIONS = {
  blue: { x: 1720, y: 1820 },
  pink: { x: 1850, y: 1790 },
  green: { x: 1990, y: 1830 },
  yellow: { x: 2120, y: 1800 },
} as const;

// Collaborative Statement Layout
export const COLLABORATIVE_LAYOUT = {
  centerX: 1920,
  centerY: 1360,
  fontSize: 62,
  fontWeight: 600,
  letterSpacing: -0.6,
  text: "When a task needs more than one of us, we work together",
  words: ["When", "a", "task", "needs", "more", "than", "one", "of", "us,", "we", "work", "together"],
} as const;

// CTA Framing Positions & Layout
export const CTA_SURROUND_POSITIONS = {
  blue: { x: 1920, y: 680 },   // Top
  green: { x: 1060, y: 1080 },  // Left
  pink: { x: 2780, y: 1080 },   // Right
  yellow: { x: 1920, y: 1480 }, // Bottom
} as const;

export const CTA_LAYOUT = {
  centerX: 1920,
  mainTextY: 1010,
  mainFontSize: 88,
  mainFontWeight: 700,
  mainLetterSpacing: -1.0,
  mainText: "Come meet your ally",

  urlY: 1150,
  urlFontSize: 66,
  urlFontWeight: 600,
  urlLetterSpacing: -0.6,
  urlText: "yourallies.io",
  urlColor: "#FF5800",
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
