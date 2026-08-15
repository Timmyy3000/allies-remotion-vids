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

// ============================================================================
// PHASE 17: LINE 1 (PINK - "We’re personal helpers built around what matters to you.")
// ============================================================================
export const PINK_LINE1_SPIT_START = STAGE_READY_FRAME; // Frame 592
export const PINK_LINE1_APPROACH_START = PINK_LINE1_SPIT_START + 8; // Frame 600
export const PINK_LINE1_APPROACH_DURATION = 36;
export const PINK_LINE1_CLICK_FRAME = PINK_LINE1_APPROACH_START + PINK_LINE1_APPROACH_DURATION; // Frame 636
export const PINK_LINE1_WRITE_START = PINK_LINE1_CLICK_FRAME; // Frame 636
export const PINK_LINE1_WRITE_DURATION = 94; // ~1.57s for 9 words
export const PINK_LINE1_WRITE_END = PINK_LINE1_WRITE_START + PINK_LINE1_WRITE_DURATION; // Frame 730
export const PINK_LINE1_SWALLOW_START = PINK_LINE1_WRITE_END; // Frame 730
export const PINK_LINE1_SETTLE_END = PINK_LINE1_SWALLOW_START + 20; // Frame 750

// ============================================================================
// PHASE 18: LINE 2 (BLUE - "Our job is to give you back time")
// ============================================================================
export const BLUE_LINE2_SPIT_START = PINK_LINE1_SETTLE_END; // Frame 750
export const BLUE_LINE2_APPROACH_START = BLUE_LINE2_SPIT_START + 8; // Frame 758
export const BLUE_LINE2_APPROACH_DURATION = 34;
export const BLUE_LINE2_CLICK_FRAME = BLUE_LINE2_APPROACH_START + BLUE_LINE2_APPROACH_DURATION; // Frame 792
export const BLUE_LINE2_WRITE_START = BLUE_LINE2_CLICK_FRAME; // Frame 792
export const BLUE_LINE2_WRITE_DURATION = 76; // ~1.27s for 8 words
export const BLUE_LINE2_WRITE_END = BLUE_LINE2_WRITE_START + BLUE_LINE2_WRITE_DURATION; // Frame 868
export const BLUE_LINE2_SWALLOW_START = BLUE_LINE2_WRITE_END; // Frame 868
export const BLUE_LINE2_SETTLE_END = BLUE_LINE2_SWALLOW_START + 20; // Frame 888

// ============================================================================
// PHASE 19: LINE 3 (GREEN - "We track your finances, spot overspending, and keep you updated")
// ============================================================================
export const GREEN_LINE3_SPIT_START = BLUE_LINE2_SETTLE_END; // Frame 888
export const GREEN_LINE3_APPROACH_START = GREEN_LINE3_SPIT_START + 8; // Frame 896
export const GREEN_LINE3_APPROACH_DURATION = 38;
export const GREEN_LINE3_CLICK_FRAME = GREEN_LINE3_APPROACH_START + GREEN_LINE3_APPROACH_DURATION; // Frame 934
export const GREEN_LINE3_WRITE_START = GREEN_LINE3_CLICK_FRAME; // Frame 934
export const GREEN_LINE3_WRITE_DURATION = 106; // ~1.77s for 10 words
export const GREEN_LINE3_WRITE_END = GREEN_LINE3_WRITE_START + GREEN_LINE3_WRITE_DURATION; // Frame 1040
export const GREEN_LINE3_SWALLOW_START = GREEN_LINE3_WRITE_END; // Frame 1040
export const GREEN_LINE3_SETTLE_END = GREEN_LINE3_SWALLOW_START + 20; // Frame 1060

// ============================================================================
// PHASE 20: LINE 4 (YELLOW - "We remember what matters and keep you in control")
// ============================================================================
export const YELLOW_LINE4_SPIT_START = GREEN_LINE3_SETTLE_END; // Frame 1060
export const YELLOW_LINE4_APPROACH_START = YELLOW_LINE4_SPIT_START + 8; // Frame 1068
export const YELLOW_LINE4_APPROACH_DURATION = 36;
export const YELLOW_LINE4_CLICK_FRAME = YELLOW_LINE4_APPROACH_START + YELLOW_LINE4_APPROACH_DURATION; // Frame 1104
export const YELLOW_LINE4_WRITE_START = YELLOW_LINE4_CLICK_FRAME; // Frame 1104
export const YELLOW_LINE4_WRITE_DURATION = 92; // ~1.53s for 9 words
export const YELLOW_LINE4_WRITE_END = YELLOW_LINE4_WRITE_START + YELLOW_LINE4_WRITE_DURATION; // Frame 1196
export const YELLOW_LINE4_SWALLOW_START = YELLOW_LINE4_WRITE_END; // Frame 1196
export const YELLOW_LINE4_SETTLE_END = YELLOW_LINE4_SWALLOW_START + 20; // Frame 1216

// ============================================================================
// PHASE 21: 4 CAPABILITY LINES FULL SETTLED HOLD
// ============================================================================
export const CAPABILITY_LINES_HOLD_END = YELLOW_LINE4_SETTLE_END + 24; // Frame 1240

// ============================================================================
// PHASE 22: CAPABILITY LINES EXIT & ALLIES MOVE TO BOTTOM SNUGGLE CLUSTER
// ============================================================================
export const CAPABILITY_LINES_EXIT_START = CAPABILITY_LINES_HOLD_END; // Frame 1240
export const CAPABILITY_LINES_EXIT_DURATION = 30;
export const CAPABILITY_LINES_EXIT_END = CAPABILITY_LINES_EXIT_START + CAPABILITY_LINES_EXIT_DURATION; // Frame 1270

export const SNUGGLE_SPIT_START = CAPABILITY_LINES_HOLD_END; // Frame 1240
export const SNUGGLE_MOVE_START = SNUGGLE_SPIT_START + 8; // Frame 1248
export const SNUGGLE_MOVE_DURATION = 52;
export const SNUGGLE_SETTLED_FRAME = SNUGGLE_MOVE_START + SNUGGLE_MOVE_DURATION; // Frame 1300

// ============================================================================
// PHASE 23: COLLABORATIVE STATEMENT ("When a task needs more than one of us, we work together")
// ============================================================================
export const COLLABORATIVE_START = SNUGGLE_SETTLED_FRAME + 4; // Frame 1304
export const COLLABORATIVE_DURATION = 76;
export const COLLABORATIVE_SETTLED = COLLABORATIVE_START + COLLABORATIVE_DURATION; // Frame 1380
export const COLLABORATIVE_HOLD_END = COLLABORATIVE_SETTLED + 44; // Frame 1424

// ============================================================================
// PHASE 24: COLLABORATIVE STATEMENT EXIT
// ============================================================================
export const COLLABORATIVE_EXIT_START = COLLABORATIVE_HOLD_END; // Frame 1424
export const COLLABORATIVE_EXIT_DURATION = 26;
export const COLLABORATIVE_EXIT_END = COLLABORATIVE_EXIT_START + COLLABORATIVE_EXIT_DURATION; // Frame 1450

// ============================================================================
// PHASE 25: ALLIES MOVE TO SURROUND CTA
// ============================================================================
export const CTA_SURROUND_SPIT_START = COLLABORATIVE_EXIT_START + 6; // Frame 1430
export const CTA_SURROUND_MOVE_START = CTA_SURROUND_SPIT_START + 8; // Frame 1438
export const CTA_SURROUND_MOVE_DURATION = 56;
export const CTA_SURROUND_SETTLED = CTA_SURROUND_MOVE_START + CTA_SURROUND_MOVE_DURATION; // Frame 1494

// ============================================================================
// PHASE 26: FINAL CTA REVEAL ("Come meet your ally" & "yourallies.io")
// ============================================================================
export const CTA_TEXT_START = CTA_SURROUND_SETTLED + 6; // Frame 1500
export const CTA_TEXT_DURATION = 36;
export const CTA_TEXT_SETTLED = CTA_TEXT_START + CTA_TEXT_DURATION; // Frame 1536

export const CTA_URL_START = CTA_TEXT_START + 26; // Frame 1526 (revealed shortly after main text)
export const CTA_URL_DURATION = 36;
export const CTA_URL_SETTLED = CTA_URL_START + CTA_URL_DURATION; // Frame 1562

// ============================================================================
// PHASE 27: FINAL CTA HOLD & LIVING FINALE
// ============================================================================
export const FINAL_CTA_HOLD_START = CTA_URL_SETTLED; // Frame 1562
export const TOTAL_DURATION_FRAMES = 1800; // 30.0 seconds at 60fps

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

  // Phase 17 (Pink Line 1)
  PINK_LINE1_SPIT_START,
  PINK_LINE1_APPROACH_START,
  PINK_LINE1_APPROACH_DURATION,
  PINK_LINE1_CLICK_FRAME,
  PINK_LINE1_WRITE_START,
  PINK_LINE1_WRITE_DURATION,
  PINK_LINE1_WRITE_END,
  PINK_LINE1_SWALLOW_START,
  PINK_LINE1_SETTLE_END,

  // Phase 18 (Blue Line 2)
  BLUE_LINE2_SPIT_START,
  BLUE_LINE2_APPROACH_START,
  BLUE_LINE2_APPROACH_DURATION,
  BLUE_LINE2_CLICK_FRAME,
  BLUE_LINE2_WRITE_START,
  BLUE_LINE2_WRITE_DURATION,
  BLUE_LINE2_WRITE_END,
  BLUE_LINE2_SWALLOW_START,
  BLUE_LINE2_SETTLE_END,

  // Phase 19 (Green Line 3)
  GREEN_LINE3_SPIT_START,
  GREEN_LINE3_APPROACH_START,
  GREEN_LINE3_APPROACH_DURATION,
  GREEN_LINE3_CLICK_FRAME,
  GREEN_LINE3_WRITE_START,
  GREEN_LINE3_WRITE_DURATION,
  GREEN_LINE3_WRITE_END,
  GREEN_LINE3_SWALLOW_START,
  GREEN_LINE3_SETTLE_END,

  // Phase 20 (Yellow Line 4)
  YELLOW_LINE4_SPIT_START,
  YELLOW_LINE4_APPROACH_START,
  YELLOW_LINE4_APPROACH_DURATION,
  YELLOW_LINE4_CLICK_FRAME,
  YELLOW_LINE4_WRITE_START,
  YELLOW_LINE4_WRITE_DURATION,
  YELLOW_LINE4_WRITE_END,
  YELLOW_LINE4_SWALLOW_START,
  YELLOW_LINE4_SETTLE_END,

  // Phase 21 & 22 (Capability Lines Exit & Snuggle Move)
  CAPABILITY_LINES_HOLD_END,
  CAPABILITY_LINES_EXIT_START,
  CAPABILITY_LINES_EXIT_DURATION,
  CAPABILITY_LINES_EXIT_END,
  SNUGGLE_SPIT_START,
  SNUGGLE_MOVE_START,
  SNUGGLE_MOVE_DURATION,
  SNUGGLE_SETTLED_FRAME,

  // Phase 23 & 24 (Collaborative Statement)
  COLLABORATIVE_START,
  COLLABORATIVE_DURATION,
  COLLABORATIVE_SETTLED,
  COLLABORATIVE_HOLD_END,
  COLLABORATIVE_EXIT_START,
  COLLABORATIVE_EXIT_DURATION,
  COLLABORATIVE_EXIT_END,

  // Phase 25 (CTA Surround Move)
  CTA_SURROUND_SPIT_START,
  CTA_SURROUND_MOVE_START,
  CTA_SURROUND_MOVE_DURATION,
  CTA_SURROUND_SETTLED,

  // Phase 26 & 27 (CTA Reveal & Final Hold)
  CTA_TEXT_START,
  CTA_TEXT_DURATION,
  CTA_TEXT_SETTLED,
  CTA_URL_START,
  CTA_URL_DURATION,
  CTA_URL_SETTLED,
  FINAL_CTA_HOLD_START,
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
  if (frame < PINK_LINE1_CLICK_FRAME) return "PINK_APPROACH";
  if (frame < PINK_LINE1_WRITE_END) return "PINK_LINE1_WRITING";
  if (frame < BLUE_LINE2_CLICK_FRAME) return "BLUE_APPROACH";
  if (frame < BLUE_LINE2_WRITE_END) return "BLUE_LINE2_WRITING";
  if (frame < GREEN_LINE3_CLICK_FRAME) return "GREEN_APPROACH";
  if (frame < GREEN_LINE3_WRITE_END) return "GREEN_LINE3_WRITING";
  if (frame < YELLOW_LINE4_CLICK_FRAME) return "YELLOW_APPROACH";
  if (frame < YELLOW_LINE4_WRITE_END) return "YELLOW_LINE4_WRITING";
  if (frame < CAPABILITY_LINES_EXIT_START) return "CAPABILITY_LINES_HOLD";
  if (frame < SNUGGLE_SETTLED_FRAME) return "SNUGGLE_GATHER_MOTION";
  if (frame < COLLABORATIVE_EXIT_START) return "COLLABORATIVE_STATEMENT";
  if (frame < CTA_SURROUND_SETTLED) return "CTA_SURROUND_MOTION";
  if (frame < CTA_URL_SETTLED) return "CTA_REVEAL";
  return "FINAL_CTA_HOLD";
}

