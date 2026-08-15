/**
 * Centralized Additive Timeline & Choreography Constants
 *
 * Architecture Invariant:
 * Every new animation sequence is added additively to the right of the timeline.
 * Previous sequences retain their approved pacing, holds, and durations.
 *
 * Target Composition Working Duration: 1200 frames (20.0 seconds at 60fps)
 */

export const FPS = 60;

// ============================================================================
// PHASE 1: CLEAN OPENING BLANK CANVAS
// ============================================================================
// Guaranteed completely blank white canvas before any text generation triggers
export const OPENING_BLANK_DURATION = 16; // ~0.27s

// ============================================================================
// PHASE 2: GENERATIVE FOCUS HEADLINE ENTRANCE ("Meet your allies")
// ============================================================================
export const TEXT_GENERATION_START = OPENING_BLANK_DURATION; // Frame 16 (~0.27s)

// Staggered word focus starts (natural organic overlap)
export const MEET_FOCUS_START = TEXT_GENERATION_START; // Frame 16 (~0.27s)
export const YOUR_FOCUS_START = MEET_FOCUS_START + 16; // Frame 32 (~0.53s)
export const ALLIES_FOCUS_START = YOUR_FOCUS_START + 16; // Frame 48 (~0.80s)

// Single character focus duration (~0.24s)
export const CHAR_FOCUS_SPEED = 1.15;
export const CHAR_FOCUS_DURATION = Math.round((0.28 / CHAR_FOCUS_SPEED) * FPS); // 15 frames

// All 3 words fully resolved into crisp #121212
export const ALL_WORDS_FOCUSED = ALLIES_FOCUS_START + CHAR_FOCUS_DURATION + 4; // Frame 67 (~1.12s)

// ============================================================================
// PHASE 3: FULL PHRASE CRISP HOLD
// ============================================================================
// Viewer registers complete sentence "Meet your allies" in #121212
export const FULL_PHRASE_HOLD_DURATION = 36; // 0.60s
export const FULL_PHRASE_HOLD_END = ALL_WORDS_FOCUSED + FULL_PHRASE_HOLD_DURATION; // Frame 103 (~1.72s)

// ============================================================================
// PHASE 4: BRAND TRANSFORMATION & LOGO SPRING ENTRANCE
// ============================================================================
// "allies" shifts to #FF5800 and slides right to create logo aperture
export const BRAND_TRANSFORM_START = FULL_PHRASE_HOLD_END; // Frame 103 (~1.72s)
export const BRAND_TRANSFORM_DURATION = 24; // 0.40s

// Official Allies SVG logo springs in
export const LOGO_START = BRAND_TRANSFORM_START + 6; // Frame 109 (~1.82s)
export const LOGO_SETTLED = LOGO_START + 32; // Frame 141 (~2.35s)

// ============================================================================
// PHASE 5: BRANDED LOCKUP HOLD ("Meet your [LOGO] allies")
// ============================================================================
// Viewer registers full branded lockup before character arrivals
export const BRANDED_LOCKUP_HOLD_DURATION = 24; // 0.40s
export const BRANDED_LOCKUP_HOLD_END = LOGO_SETTLED + BRANDED_LOCKUP_HOLD_DURATION; // Frame 165 (~2.75s)

// Camera push zoom out (1.15x -> 1.0x master framing)
export const ZOOM_OUT_START = BRANDED_LOCKUP_HOLD_END - 5; // Frame 160 (~2.67s)
export const ZOOM_OUT_END = ZOOM_OUT_START + 30; // Frame 190 (~3.17s)

// ============================================================================
// PHASE 6: ALLY CHARACTER ENTRANCES (Curved Bézier & Orbital Steering)
// ============================================================================
export const ALLY_SEQUENCE_START = BRANDED_LOCKUP_HOLD_END + 5; // Frame 170 (~2.83s)

export const BLUE_TRAVEL_START = ALLY_SEQUENCE_START; // Frame 170 (~2.83s)
export const GREEN_TRAVEL_START = BLUE_TRAVEL_START + 14; // Frame 184 (~3.07s)
export const PINK_TRAVEL_START = GREEN_TRAVEL_START + 14; // Frame 198 (~3.30s)
export const YELLOW_TRAVEL_START = PINK_TRAVEL_START + 14; // Frame 212 (~3.53s)

export const BLUE_TRAVEL_DURATION = 44;
export const GREEN_TRAVEL_DURATION = 48;
export const PINK_TRAVEL_DURATION = 42;
export const YELLOW_TRAVEL_DURATION = 46;

// All 4 allies settled into their respective idle floating orbits
export const ALL_ALLIES_SETTLED = YELLOW_TRAVEL_START + YELLOW_TRAVEL_DURATION + 10; // Frame 268 (~4.47s)

// ============================================================================
// PHASE 7: ALLY ACTIVITY & BREATHING HOLD
// ============================================================================
// Allies living, hovering, and thinking in full scene context
export const ALLY_ACTIVITY_HOLD_DURATION = 52; // ~0.87s
export const ALLY_ACTIVITY_HOLD_END = ALL_ALLIES_SETTLED + ALLY_ACTIVITY_HOLD_DURATION; // Frame 320 (~5.33s)

// ============================================================================
// PHASE 8: BRAND CONDENSATION TRANSITION ("Meet your" -> logo dissolution)
// ============================================================================
// "Meet your" begins moving toward logo while reversing focus
export const MEET_YOUR_EXIT_START = ALLY_ACTIVITY_HOLD_END; // Frame 320 (~5.33s)
export const MEET_YOUR_EXIT_DURATION = 54; // 0.90s
export const MEET_YOUR_EXIT_END = MEET_YOUR_EXIT_START + MEET_YOUR_EXIT_DURATION; // Frame 374 (~6.23s)

// Brand group ("[LOGO] allies") smoothly recenters
export const BRAND_RECENTER_START = MEET_YOUR_EXIT_START + 8; // Frame 328 (~5.47s)
export const BRAND_RECENTER_DURATION = 64; // 1.07s
export const BRAND_RECENTER_END = BRAND_RECENTER_START + BRAND_RECENTER_DURATION; // Frame 392 (~6.53s)

// ============================================================================
// PHASE 9: CENTERED BRAND HOLD
// ============================================================================
// Settled stationary centered brand mark
export const BRAND_CENTERED_FRAME = BRAND_RECENTER_END; // Frame 392 (~6.53s)
export const BRAND_GATHER_HOLD_DURATION = 12; // 0.20s
export const BRAND_GATHER_HOLD_END = BRAND_CENTERED_FRAME + BRAND_GATHER_HOLD_DURATION; // Frame 404 (~6.73s)

// ============================================================================
// PHASE 10: ALL 4 ALLIES GATHER AROUND BRAND (Curved Bézier & Directional Cursors)
// ============================================================================
export const BRAND_GATHER_START = BRAND_GATHER_HOLD_END; // Frame 404 (~6.73s)

export const BLUE_GATHER_START = BRAND_GATHER_START; // Frame 404 (~6.73s)
export const PINK_GATHER_START = BRAND_GATHER_START + 2; // Frame 406 (~6.77s)
export const GREEN_GATHER_START = BRAND_GATHER_START + 4; // Frame 408 (~6.80s)
export const YELLOW_GATHER_START = BRAND_GATHER_START + 6; // Frame 410 (~6.83s)

export const BLUE_GATHER_DURATION = 46;
export const PINK_GATHER_DURATION = 48;
export const GREEN_GATHER_DURATION = 52;
export const YELLOW_GATHER_DURATION = 48;

// All 4 allies settled closely around brand with cursors completely faded
export const ALL_ALLIES_GATHERED = GREEN_GATHER_START + GREEN_GATHER_DURATION; // Frame 460 (~7.67s)

// ============================================================================
// PHASE 11: GATHERED MOMENT HOLD
// ============================================================================
export const GATHERED_HOLD_DURATION = 6; // 0.10s
export const GATHERED_HOLD_END = ALL_ALLIES_GATHERED + GATHERED_HOLD_DURATION; // Frame 466 (~7.77s)

// ============================================================================
// PHASE 12: "allies" WORD MOTION COLLAPSE (Reverse Focus & Leftward Pull)
// ============================================================================
export const ALLIES_WORD_COLLAPSE_START = GATHERED_HOLD_END; // Frame 466 (~7.77s)
export const ALLIES_WORD_COLLAPSE_DURATION = 36; // 0.60s
export const ALLIES_WORD_COLLAPSE_END = ALLIES_WORD_COLLAPSE_START + ALLIES_WORD_COLLAPSE_DURATION; // Frame 502 (~8.37s)

// ============================================================================
// PHASE 13: OFFICIAL LOGO INWARD COLLAPSE (Sharp graphic mark shrinkage)
// ============================================================================
export const LOGO_COLLAPSE_START = ALLIES_WORD_COLLAPSE_START + 26; // Frame 492 (~8.20s, slight overlap)
export const LOGO_COLLAPSE_DURATION = 22; // 0.37s
export const LOGO_COLLAPSE_END = LOGO_COLLAPSE_START + LOGO_COLLAPSE_DURATION; // Frame 514 (~8.57s)

// ============================================================================
// PHASE 14: EMPTY CENTER MICRO-PAUSE
// ============================================================================
export const EMPTY_CENTER_HOLD_DURATION = 8; // 0.13s
export const EMPTY_CENTER_HOLD_END = LOGO_COLLAPSE_END + EMPTY_CENTER_HOLD_DURATION; // Frame 522 (~8.70s)

// ============================================================================
// PHASE 15: ALL 4 ALLIES SPREAD OUT TO WRITING STAGE (Broad Lateral Curves)
// ============================================================================
export const STAGE_SPREAD_START = EMPTY_CENTER_HOLD_END; // Frame 522 (~8.70s)

export const BLUE_SPREAD_START = STAGE_SPREAD_START; // Frame 522 (~8.70s)
export const GREEN_SPREAD_START = STAGE_SPREAD_START + 2; // Frame 524 (~8.73s)
export const YELLOW_SPREAD_START = STAGE_SPREAD_START + 3; // Frame 525 (~8.75s)
export const PINK_SPREAD_START = STAGE_SPREAD_START + 4; // Frame 526 (~8.77s, settles last for subtle emphasis)

export const BLUE_SPREAD_DURATION = 58;
export const GREEN_SPREAD_DURATION = 62;
export const YELLOW_SPREAD_DURATION = 60;
export const PINK_SPREAD_DURATION = 66;

// All 4 allies fully settled into their perimeter writing stage positions
export const ALL_ALLIES_SPREAD_SETTLED = PINK_SPREAD_START + PINK_SPREAD_DURATION; // Frame 592 (~9.87s)

// ============================================================================
// PHASE 16: WRITING STAGE READY HOLD (Pink poised to initiate first line of text)
// ============================================================================
export const STAGE_READY_FRAME = ALL_ALLIES_SPREAD_SETTLED; // Frame 592 (~9.87s)

// Total Composition Capacity (20 seconds = 1200 frames)
export const TOTAL_DURATION_FRAMES = 1200;

// Export structured object for clean access across components
export const TIMING = {
  FPS,
  TOTAL_DURATION_FRAMES,

  // Phase 1
  OPENING_BLANK_DURATION,

  // Phase 2
  TEXT_GENERATION_START,
  MEET_FOCUS_START,
  YOUR_FOCUS_START,
  ALLIES_FOCUS_START,
  CHAR_FOCUS_SPEED,
  CHAR_FOCUS_DURATION,
  ALL_WORDS_FOCUSED,

  // Phase 3
  FULL_PHRASE_HOLD_DURATION,
  FULL_PHRASE_HOLD_END,

  // Phase 4
  BRAND_TRANSFORM_START,
  BRAND_TRANSFORM_DURATION,
  LOGO_START,
  LOGO_SETTLED,

  // Phase 5
  BRANDED_LOCKUP_HOLD_DURATION,
  BRANDED_LOCKUP_HOLD_END,
  ZOOM_OUT_START,
  ZOOM_OUT_END,

  // Phase 6
  ALLY_SEQUENCE_START,
  BLUE_TRAVEL_START,
  GREEN_TRAVEL_START,
  PINK_TRAVEL_START,
  YELLOW_TRAVEL_START,
  BLUE_TRAVEL_DURATION,
  GREEN_TRAVEL_DURATION,
  PINK_TRAVEL_DURATION,
  YELLOW_TRAVEL_DURATION,
  ALL_ALLIES_SETTLED,

  // Phase 7
  ALLY_ACTIVITY_HOLD_DURATION,
  ALLY_ACTIVITY_HOLD_END,

  // Phase 8
  MEET_YOUR_EXIT_START,
  MEET_YOUR_EXIT_DURATION,
  MEET_YOUR_EXIT_END,
  BRAND_RECENTER_START,
  BRAND_RECENTER_DURATION,
  BRAND_RECENTER_END,

  // Phase 9
  BRAND_CENTERED_FRAME,
  BRAND_GATHER_HOLD_DURATION,
  BRAND_GATHER_HOLD_END,

  // Phase 10
  BRAND_GATHER_START,
  BLUE_GATHER_START,
  PINK_GATHER_START,
  GREEN_GATHER_START,
  YELLOW_GATHER_START,
  BLUE_GATHER_DURATION,
  PINK_GATHER_DURATION,
  GREEN_GATHER_DURATION,
  YELLOW_GATHER_DURATION,
  ALL_ALLIES_GATHERED,

  // Phase 11
  GATHERED_HOLD_DURATION,
  GATHERED_HOLD_END,

  // Phase 12
  ALLIES_WORD_COLLAPSE_START,
  ALLIES_WORD_COLLAPSE_DURATION,
  ALLIES_WORD_COLLAPSE_END,

  // Phase 13
  LOGO_COLLAPSE_START,
  LOGO_COLLAPSE_DURATION,
  LOGO_COLLAPSE_END,

  // Phase 14
  EMPTY_CENTER_HOLD_DURATION,
  EMPTY_CENTER_HOLD_END,

  // Phase 15
  STAGE_SPREAD_START,
  BLUE_SPREAD_START,
  GREEN_SPREAD_START,
  YELLOW_SPREAD_START,
  PINK_SPREAD_START,
  BLUE_SPREAD_DURATION,
  GREEN_SPREAD_DURATION,
  YELLOW_SPREAD_DURATION,
  PINK_SPREAD_DURATION,
  ALL_ALLIES_SPREAD_SETTLED,

  // Phase 16
  STAGE_READY_FRAME,
} as const;

/**
 * Returns human-readable phase name for development timeline overlay.
 */
export function getTimelinePhase(frame: number): string {
  if (frame < OPENING_BLANK_DURATION) return "OPENING_BLANK";
  if (frame < ALL_WORDS_FOCUSED) return "TEXT_GENERATION";
  if (frame < FULL_PHRASE_HOLD_END) return "FULL_PHRASE_HOLD";
  if (frame < LOGO_SETTLED) return "BRAND_TRANSFORMATION";
  if (frame < ALLY_SEQUENCE_START) return "BRANDED_LOCKUP_HOLD";
  if (frame < ALL_ALLIES_SETTLED) return "ALLY_ENTRANCES";
  if (frame < MEET_YOUR_EXIT_START) return "ALLY_ACTIVITY_HOLD";
  if (frame < BRAND_RECENTER_END) return "BRAND_CONDENSATION";
  if (frame < BRAND_GATHER_START) return "CENTERED_BRAND_HOLD";
  if (frame < ALL_ALLIES_GATHERED) return "BRAND_GATHER_MOTION";
  if (frame < ALLIES_WORD_COLLAPSE_START) return "BRAND_GATHERED_HOLD";
  if (frame < LOGO_COLLAPSE_END) return "BRAND_COLLAPSE";
  if (frame < STAGE_SPREAD_START) return "EMPTY_CENTER_HOLD";
  if (frame < ALL_ALLIES_SPREAD_SETTLED) return "STAGE_SPREAD_MOTION";
  return "WRITING_STAGE_READY";
}
