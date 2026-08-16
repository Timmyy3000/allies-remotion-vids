/**
 * Centralized Additive Timeline & Choreography Constants
 *
 * Architecture Invariant:
 * Every new animation sequence is added additively to the right of the timeline.
 * Previous sequences retain their approved pacing, holds, and durations.
 *
 * Target Composition Working Duration: 1360 frames (~22.7 seconds at 60fps)
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
export const FULL_PHRASE_HOLD_END =
  ALL_WORDS_FOCUSED + FULL_PHRASE_HOLD_DURATION; // Frame 103 (~1.72s)

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
export const BRANDED_LOCKUP_HOLD_END =
  LOGO_SETTLED + BRANDED_LOCKUP_HOLD_DURATION; // Frame 165 (~2.75s)

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
export const ALL_ALLIES_SETTLED =
  YELLOW_TRAVEL_START + YELLOW_TRAVEL_DURATION + 10; // Frame 268 (~4.47s)

// ============================================================================
// PHASE 7: ALLY ACTIVITY & BREATHING HOLD
// ============================================================================
// Allies living, hovering, and thinking in full scene context
export const ALLY_ACTIVITY_HOLD_DURATION = 52; // ~0.87s
export const ALLY_ACTIVITY_HOLD_END =
  ALL_ALLIES_SETTLED + ALLY_ACTIVITY_HOLD_DURATION; // Frame 320 (~5.33s)

// ============================================================================
// PHASE 8: BRAND CONDENSATION TRANSITION ("Meet your" -> logo dissolution)
// ============================================================================
// "Meet your" begins moving toward logo while reversing focus
export const MEET_YOUR_EXIT_START = ALLY_ACTIVITY_HOLD_END; // Frame 320 (~5.33s)
export const MEET_YOUR_EXIT_DURATION = 54; // 0.90s
export const MEET_YOUR_EXIT_END =
  MEET_YOUR_EXIT_START + MEET_YOUR_EXIT_DURATION; // Frame 374 (~6.23s)

// Brand group ("[LOGO] allies") smoothly recenters
export const BRAND_RECENTER_START = MEET_YOUR_EXIT_START + 8; // Frame 328 (~5.47s)
export const BRAND_RECENTER_DURATION = 64; // 1.07s
export const BRAND_RECENTER_END =
  BRAND_RECENTER_START + BRAND_RECENTER_DURATION; // Frame 392 (~6.53s)

// ============================================================================
// PHASE 9: CENTERED BRAND HOLD
// ============================================================================
// Settled stationary centered brand mark
export const BRAND_CENTERED_FRAME = BRAND_RECENTER_END; // Frame 392 (~6.53s)
export const BRAND_GATHER_HOLD_DURATION = 12; // 0.20s
export const BRAND_GATHER_HOLD_END =
  BRAND_CENTERED_FRAME + BRAND_GATHER_HOLD_DURATION; // Frame 404 (~6.73s)

// ============================================================================
// PHASE 10: ALL 4 ALLIES GATHER AROUND BRAND (Curved Bézier & Directional Cursors)
// ============================================================================
export const BRAND_GATHER_START = BRAND_GATHER_HOLD_END; // Frame 404 (~6.73s)

export const BLUE_GATHER_START = BRAND_GATHER_START; // Frame 404 (~6.73s)
export const PINK_GATHER_START = BRAND_GATHER_START + 2; // Frame 406 (~6.77s)
export const GREEN_GATHER_START = BRAND_GATHER_START + 4; // Frame 408 (~6.80s)
export const YELLOW_GATHER_START = BRAND_GATHER_START + 6; // Frame 410 (~6.83s)

// Give the center gather enough room to read as a deliberate arrival rather than
// a quick snap into the brand lockup.
export const BLUE_GATHER_DURATION = 72;
export const PINK_GATHER_DURATION = 76;
export const GREEN_GATHER_DURATION = 80;
export const YELLOW_GATHER_DURATION = 76;

// All 4 allies settled closely around the brand. Keep this derived from every
// gather segment so the hold never starts before the final ally arrives.
export const ALL_ALLIES_GATHERED = Math.max(
  BLUE_GATHER_START + BLUE_GATHER_DURATION,
  PINK_GATHER_START + PINK_GATHER_DURATION,
  GREEN_GATHER_START + GREEN_GATHER_DURATION,
  YELLOW_GATHER_START + YELLOW_GATHER_DURATION,
); // Frame 488 (~8.13s)

// ============================================================================
// PHASE 11: GATHERED MOMENT HOLD
// ============================================================================
export const GATHERED_HOLD_DURATION = 120; // 2.00s
export const GATHERED_HOLD_END = ALL_ALLIES_GATHERED + GATHERED_HOLD_DURATION; // Frame 608 (~10.13s)

// ============================================================================
// PHASE 12: "allies" WORD MOTION COLLAPSE (Reverse Focus & Leftward Pull)
// ============================================================================
export const ALLIES_WORD_COLLAPSE_START = GATHERED_HOLD_END; // Frame 608 (~10.13s)
export const ALLIES_WORD_COLLAPSE_DURATION = 48; // 0.80s
export const ALLIES_WORD_COLLAPSE_END =
  ALLIES_WORD_COLLAPSE_START + ALLIES_WORD_COLLAPSE_DURATION; // Frame 656 (~10.93s)

// ============================================================================
// PHASE 13: OFFICIAL LOGO INWARD COLLAPSE (Sharp graphic mark shrinkage)
// ============================================================================
export const LOGO_COLLAPSE_START = ALLIES_WORD_COLLAPSE_START + 26; // Frame 634 (~10.57s, slight overlap)
export const LOGO_COLLAPSE_DURATION = 30; // 0.50s
export const LOGO_COLLAPSE_END = LOGO_COLLAPSE_START + LOGO_COLLAPSE_DURATION; // Frame 664 (~11.07s)

// ============================================================================
// PHASE 14: EMPTY CENTER MICRO-PAUSE
// ============================================================================
export const EMPTY_CENTER_HOLD_DURATION = 8; // 0.13s
export const EMPTY_CENTER_HOLD_END =
  LOGO_COLLAPSE_END + EMPTY_CENTER_HOLD_DURATION; // Frame 672 (~11.20s)

// ============================================================================
// PHASE 15: ALL 4 ALLIES SPREAD OUT TO WRITING STAGE (Broad Lateral Curves)
// ============================================================================
export const STAGE_SPREAD_START = EMPTY_CENTER_HOLD_END; // Frame 672 (~11.20s)

export const BLUE_SPREAD_START = STAGE_SPREAD_START; // Frame 672 (~11.20s)
export const GREEN_SPREAD_START = STAGE_SPREAD_START + 2; // Frame 674 (~11.23s)
export const YELLOW_SPREAD_START = STAGE_SPREAD_START + 3; // Frame 675 (~11.25s)
export const PINK_SPREAD_START = STAGE_SPREAD_START + 4; // Frame 676 (~11.27s, settles last for subtle emphasis)

export const BLUE_SPREAD_DURATION = 58;
export const GREEN_SPREAD_DURATION = 62;
export const YELLOW_SPREAD_DURATION = 60;
export const PINK_SPREAD_DURATION = 66;

// All 4 allies fully settled into their perimeter writing stage positions
export const ALL_ALLIES_SPREAD_SETTLED =
  PINK_SPREAD_START + PINK_SPREAD_DURATION; // Frame 742 (~12.37s)

// ============================================================================
// PHASE 16: WRITING STAGE READY HOLD (Pink poised to initiate first line of text)
// ============================================================================
export const STAGE_READY_FRAME = ALL_ALLIES_SPREAD_SETTLED; // Frame 742 (~12.37s)

// ============================================================================
// PHASE 17: DOMAIN ASSEMBLY (Four directional allies drag in yourallies.io)
// ============================================================================
export const DOMAIN_SCENE_START = STAGE_READY_FRAME + 10; // Frame 752 (~12.53s)
export const DOMAIN_EDGE_START = DOMAIN_SCENE_START + 20; // Frame 772 (~12.87s)

// The edge arrivals intentionally use different start offsets and durations so
// the four characters do not read as a synchronized formation.
export const BLUE_DOMAIN_EDGE_START = DOMAIN_EDGE_START;
export const PINK_DOMAIN_EDGE_START = DOMAIN_EDGE_START + 8;
export const GREEN_DOMAIN_EDGE_START = DOMAIN_EDGE_START + 16;
export const YELLOW_DOMAIN_EDGE_START = DOMAIN_EDGE_START + 24;

export const BLUE_DOMAIN_EDGE_DURATION = 44;
export const PINK_DOMAIN_EDGE_DURATION = 48;
export const GREEN_DOMAIN_EDGE_DURATION = 52;
export const YELLOW_DOMAIN_EDGE_DURATION = 50;

export const BLUE_DOMAIN_DRAG_START =
  BLUE_DOMAIN_EDGE_START + BLUE_DOMAIN_EDGE_DURATION + 8;
export const PINK_DOMAIN_DRAG_START =
  PINK_DOMAIN_EDGE_START + PINK_DOMAIN_EDGE_DURATION + 8;
export const GREEN_DOMAIN_DRAG_START =
  GREEN_DOMAIN_EDGE_START + GREEN_DOMAIN_EDGE_DURATION + 8;
export const YELLOW_DOMAIN_DRAG_START =
  YELLOW_DOMAIN_EDGE_START + YELLOW_DOMAIN_EDGE_DURATION + 8;

export const BLUE_DOMAIN_DRAG_DURATION = 76;
export const PINK_DOMAIN_DRAG_DURATION = 82;
export const GREEN_DOMAIN_DRAG_DURATION = 88;
export const YELLOW_DOMAIN_DRAG_DURATION = 94;

export const DOMAIN_PIECES_SETTLED = Math.max(
  BLUE_DOMAIN_DRAG_START + BLUE_DOMAIN_DRAG_DURATION,
  PINK_DOMAIN_DRAG_START + PINK_DOMAIN_DRAG_DURATION,
  GREEN_DOMAIN_DRAG_START + GREEN_DOMAIN_DRAG_DURATION,
  YELLOW_DOMAIN_DRAG_START + YELLOW_DOMAIN_DRAG_DURATION,
); // Frame 948 (~15.80s)
export const DOMAIN_PIECE_SETTLE_DURATION = 12;
export const DOMAIN_LOCKUP_HOLD_DURATION = 150; // 2.5s of readable lockup hover
export const DOMAIN_LOCKUP_HOLD_END =
  DOMAIN_PIECES_SETTLED + DOMAIN_LOCKUP_HOLD_DURATION; // Frame 1098

// Leave the completed domain lockup, then retreat, swirl around it, and peel
// off through a different edge of the frame.
export const DOMAIN_EXIT_START = DOMAIN_LOCKUP_HOLD_END + 8; // Frame 1106

export const BLUE_DOMAIN_RETREAT_START = DOMAIN_EXIT_START;
export const GREEN_DOMAIN_RETREAT_START = DOMAIN_EXIT_START + 6;
export const PINK_DOMAIN_RETREAT_START = DOMAIN_EXIT_START + 12;
export const YELLOW_DOMAIN_RETREAT_START = DOMAIN_EXIT_START + 18;

export const BLUE_DOMAIN_RETREAT_DURATION = 32;
export const GREEN_DOMAIN_RETREAT_DURATION = 36;
export const PINK_DOMAIN_RETREAT_DURATION = 40;
export const YELLOW_DOMAIN_RETREAT_DURATION = 44;

export const BLUE_DOMAIN_SWIRL_START =
  BLUE_DOMAIN_RETREAT_START + BLUE_DOMAIN_RETREAT_DURATION + 4;
export const GREEN_DOMAIN_SWIRL_START =
  GREEN_DOMAIN_RETREAT_START + GREEN_DOMAIN_RETREAT_DURATION + 4;
export const PINK_DOMAIN_SWIRL_START =
  PINK_DOMAIN_RETREAT_START + PINK_DOMAIN_RETREAT_DURATION + 4;
export const YELLOW_DOMAIN_SWIRL_START =
  YELLOW_DOMAIN_RETREAT_START + YELLOW_DOMAIN_RETREAT_DURATION + 4;

// Different durations keep the four loops from looking mechanically cloned,
// while they still finish the shared swirl before the exits begin.
export const BLUE_DOMAIN_SWIRL_DURATION = 126;
export const GREEN_DOMAIN_SWIRL_DURATION = 116;
export const PINK_DOMAIN_SWIRL_DURATION = 106;
export const YELLOW_DOMAIN_SWIRL_DURATION = 96;

export const DOMAIN_SWIRL_SETTLED = Math.max(
  BLUE_DOMAIN_SWIRL_START + BLUE_DOMAIN_SWIRL_DURATION,
  GREEN_DOMAIN_SWIRL_START + GREEN_DOMAIN_SWIRL_DURATION,
  PINK_DOMAIN_SWIRL_START + PINK_DOMAIN_SWIRL_DURATION,
  YELLOW_DOMAIN_SWIRL_START + YELLOW_DOMAIN_SWIRL_DURATION,
); // Frame 1268 (~21.13s)

export const BLUE_DOMAIN_EXIT_START = DOMAIN_SWIRL_SETTLED;
export const GREEN_DOMAIN_EXIT_START = DOMAIN_SWIRL_SETTLED + 8;
export const PINK_DOMAIN_EXIT_START = DOMAIN_SWIRL_SETTLED + 16;
export const YELLOW_DOMAIN_EXIT_START = DOMAIN_SWIRL_SETTLED + 24;

export const BLUE_DOMAIN_EXIT_DURATION = 70;
export const GREEN_DOMAIN_EXIT_DURATION = 66;
export const PINK_DOMAIN_EXIT_DURATION = 62;
export const YELLOW_DOMAIN_EXIT_DURATION = 58;

export const DOMAIN_EXIT_SETTLED = Math.max(
  BLUE_DOMAIN_EXIT_START + BLUE_DOMAIN_EXIT_DURATION,
  GREEN_DOMAIN_EXIT_START + GREEN_DOMAIN_EXIT_DURATION,
  PINK_DOMAIN_EXIT_START + PINK_DOMAIN_EXIT_DURATION,
  YELLOW_DOMAIN_EXIT_START + YELLOW_DOMAIN_EXIT_DURATION,
); // Frame 1350 (~22.50s)

// Keep a short clean tail after the last ally clears the frame.
export const TOTAL_DURATION_FRAMES = 1360;

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

  // Phase 17
  DOMAIN_SCENE_START,
  DOMAIN_EDGE_START,
  BLUE_DOMAIN_EDGE_START,
  PINK_DOMAIN_EDGE_START,
  GREEN_DOMAIN_EDGE_START,
  YELLOW_DOMAIN_EDGE_START,
  BLUE_DOMAIN_EDGE_DURATION,
  PINK_DOMAIN_EDGE_DURATION,
  GREEN_DOMAIN_EDGE_DURATION,
  YELLOW_DOMAIN_EDGE_DURATION,
  BLUE_DOMAIN_DRAG_START,
  PINK_DOMAIN_DRAG_START,
  GREEN_DOMAIN_DRAG_START,
  YELLOW_DOMAIN_DRAG_START,
  BLUE_DOMAIN_DRAG_DURATION,
  PINK_DOMAIN_DRAG_DURATION,
  GREEN_DOMAIN_DRAG_DURATION,
  YELLOW_DOMAIN_DRAG_DURATION,
  DOMAIN_PIECES_SETTLED,
  DOMAIN_PIECE_SETTLE_DURATION,
  DOMAIN_LOCKUP_HOLD_DURATION,
  DOMAIN_LOCKUP_HOLD_END,
  DOMAIN_EXIT_START,
  BLUE_DOMAIN_RETREAT_START,
  GREEN_DOMAIN_RETREAT_START,
  PINK_DOMAIN_RETREAT_START,
  YELLOW_DOMAIN_RETREAT_START,
  BLUE_DOMAIN_RETREAT_DURATION,
  GREEN_DOMAIN_RETREAT_DURATION,
  PINK_DOMAIN_RETREAT_DURATION,
  YELLOW_DOMAIN_RETREAT_DURATION,
  BLUE_DOMAIN_SWIRL_START,
  GREEN_DOMAIN_SWIRL_START,
  PINK_DOMAIN_SWIRL_START,
  YELLOW_DOMAIN_SWIRL_START,
  BLUE_DOMAIN_SWIRL_DURATION,
  GREEN_DOMAIN_SWIRL_DURATION,
  PINK_DOMAIN_SWIRL_DURATION,
  YELLOW_DOMAIN_SWIRL_DURATION,
  DOMAIN_SWIRL_SETTLED,
  BLUE_DOMAIN_EXIT_START,
  GREEN_DOMAIN_EXIT_START,
  PINK_DOMAIN_EXIT_START,
  YELLOW_DOMAIN_EXIT_START,
  BLUE_DOMAIN_EXIT_DURATION,
  GREEN_DOMAIN_EXIT_DURATION,
  PINK_DOMAIN_EXIT_DURATION,
  YELLOW_DOMAIN_EXIT_DURATION,
  DOMAIN_EXIT_SETTLED,
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
  if (frame < DOMAIN_EDGE_START) return "WRITING_STAGE_READY";
  if (frame < DOMAIN_PIECES_SETTLED) return "DOMAIN_EDGE_AND_DRAG_MOTION";
  if (frame < DOMAIN_EXIT_START) return "DOMAIN_LOCKUP_HOLD";
  if (frame < DOMAIN_EXIT_SETTLED) return "DOMAIN_ALLIES_EXIT";
  return "DOMAIN_EXITED";
}
