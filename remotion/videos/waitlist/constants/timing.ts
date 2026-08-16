/**
 * Centralized Additive Timeline & Choreography Constants (V8)
 *
 * Master Composition Duration: 1440 frames (24.0 seconds at 60fps)
 */

export const FPS = 60;
export const TOTAL_DURATION_FRAMES = 1325; // 22.08 seconds at 60fps

// ============================================================================
// PHASE 1: CLEAN OPENING BLANK CANVAS
// ============================================================================
export const OPENING_BLANK_DURATION = 30; // Frame 0..29 (Pure empty white canvas)

// ============================================================================
// PHASE 2: GENERATIVE FOCUS HEADLINE ENTRANCE ("Meet your allies")
// ============================================================================
export const TEXT_GENERATION_START = OPENING_BLANK_DURATION; // Frame 30
export const MEET_FOCUS_START = TEXT_GENERATION_START; // Frame 30
export const YOUR_FOCUS_START = MEET_FOCUS_START + 16; // Frame 46
export const ALLIES_FOCUS_START = YOUR_FOCUS_START + 16; // Frame 62

export const CHAR_FOCUS_SPEED = 1.15;
export const CHAR_FOCUS_DURATION = Math.round((0.28 / CHAR_FOCUS_SPEED) * FPS); // 15 frames
export const ALL_WORDS_FOCUSED = ALLIES_FOCUS_START + CHAR_FOCUS_DURATION + 4; // Frame 81

// ============================================================================
// PHASE 3: FULL PHRASE CRISP HOLD
// ============================================================================
export const FULL_PHRASE_HOLD_DURATION = 36; // 0.60s
export const FULL_PHRASE_HOLD_END = ALL_WORDS_FOCUSED + FULL_PHRASE_HOLD_DURATION; // Frame 117

// ============================================================================
// PHASE 4: BRAND TRANSFORMATION & LOGO SPRING ENTRANCE (Exact more-motion port)
// ============================================================================
// "allies" text slides to make room and turns orange
export const BRAND_TRANSFORM_START = FULL_PHRASE_HOLD_END; // Frame 117
export const BRAND_TRANSFORM_DURATION = 24; // 0.40s

// Official Allies SVG logo springs into reserved slot
export const LOGO_START = BRAND_TRANSFORM_START + 6; // Frame 123
export const LOGO_SETTLED = LOGO_START + 32; // Frame 155

// Full Branded Lockup Hold ("Meet your [LOGO] allies")
export const BRANDED_LOCKUP_HOLD_DURATION = 24; // 0.40s
export const BRANDED_LOCKUP_HOLD_END = LOGO_SETTLED + BRANDED_LOCKUP_HOLD_DURATION; // Frame 179

// Camera push zoom out (1.15x -> 1.0x master framing)
export const ZOOM_OUT_START = BRANDED_LOCKUP_HOLD_END - 5; // Frame 174
export const ZOOM_OUT_END = ZOOM_OUT_START + 30; // Frame 204

// ============================================================================
// PHASE 5: ALL ALLIES ENTER & YELLOW'S DOUBLE-HOP
// ============================================================================
export const ALLY_SEQUENCE_START = BRANDED_LOCKUP_HOLD_END + 5; // Frame 184

export const BLUE_ENTRANCE_START = ALLY_SEQUENCE_START; // Frame 184
export const BLUE_ENTRANCE_DURATION = 55;

export const GREEN_ENTRANCE_START = 194;
export const GREEN_ENTRANCE_DURATION = 55;

export const PINK_ENTRANCE_START = 199;
export const PINK_ENTRANCE_DURATION = 55;

export const YELLOW_ENTRANCE_START = 209;
export const YELLOW_ENTRANCE_DURATION = 55;

// Yellow's unique signature double-hop
export const YELLOW_DOUBLE_HOP_START = 254;
export const YELLOW_DOUBLE_HOP_DURATION = 65; // f254 - f319

// All 4 allies settled into their respective idle floating orbits
export const ALL_ALLIES_SETTLED = 282;

// ============================================================================
// PHASE 6: BRAND CONDENSATION & "MEET YOUR" REVERSE FOCUS EXIT (Exact more-motion port)
// ============================================================================
// "Meet your" begins moving toward logo while reversing focus and blurring
export const MEET_YOUR_EXIT_START = 334; // Frame 334
export const MEET_YOUR_EXIT_DURATION = 54; // Frame 334 - 388
export const MEET_YOUR_EXIT_END = MEET_YOUR_EXIT_START + MEET_YOUR_EXIT_DURATION; // Frame 388

// Brand group ("[LOGO] allies") smoothly recenters while "Meet your" is dissolving
export const BRAND_RECENTER_START = MEET_YOUR_EXIT_START + 8; // Frame 342
export const BRAND_RECENTER_DURATION = 64; // Frame 342 - 406
export const BRAND_RECENTER_END = BRAND_RECENTER_START + BRAND_RECENTER_DURATION; // Frame 406

// ============================================================================
// PHASE 7: CENTERED BRAND HOLD & STAGGERED AMBIENT SOLO ACTIONS
// ============================================================================
export const ALL_GATHERED_FRAME = 406;

// 1. Pink accidentally bumps the rendered right edge of "allies" text & recoils to new anchor
export const PINK_BOOP_START = 444;
export const PINK_BOOP_DURATION = 40; // f444 - f484 (impact at f454)

// 2. Blue energetic micro-jiggle / shimmy
export const BLUE_SOLO_JIGGLE_START = 484;
export const BLUE_SOLO_JIGGLE_DURATION = 32; // f484 - f516

// 3. Green organic 360-degree full body turn & double icon gesture
export const GREEN_SOLO_TURN_START = 519;
export const GREEN_SOLO_TURN_DURATION = 65; // f519 - f584

// ============================================================================
// PHASE 8: LOGO COLLAPSE & DOMAIN FETCH LAUNCHES
// ============================================================================
export const LOGO_COLLAPSE_START = 584;
export const LOGO_COLLAPSE_DURATION = 30;
export const LOGO_COLLAPSE_END = LOGO_COLLAPSE_START + LOGO_COLLAPSE_DURATION; // Frame 614

// Allies launch with speed-ramped acceleration to screen edges to fetch domain pieces
export const DOMAIN_EDGE_START = 614;
export const BLUE_DOMAIN_EDGE_START = DOMAIN_EDGE_START;
export const PINK_DOMAIN_EDGE_START = DOMAIN_EDGE_START + 6;
export const GREEN_DOMAIN_EDGE_START = DOMAIN_EDGE_START + 12;
export const YELLOW_DOMAIN_EDGE_START = DOMAIN_EDGE_START + 18;

export const BLUE_DOMAIN_EDGE_DURATION = 46;
export const PINK_DOMAIN_EDGE_DURATION = 50;
export const GREEN_DOMAIN_EDGE_DURATION = 52;
export const YELLOW_DOMAIN_EDGE_DURATION = 50;

// Dragging letters back to canvas center
export const BLUE_DOMAIN_DRAG_START = 664;
export const PINK_DOMAIN_DRAG_START = 674;
export const GREEN_DOMAIN_DRAG_START = 682;
export const YELLOW_DOMAIN_DRAG_START = 686;

export const BLUE_DOMAIN_DRAG_DURATION = 76;
export const PINK_DOMAIN_DRAG_DURATION = 82;
export const GREEN_DOMAIN_DRAG_DURATION = 88;
export const YELLOW_DOMAIN_DRAG_DURATION = 92;

// Green & Yellow Near-Miss during return
export const NEAR_MISS_START = 689;
export const NEAR_MISS_DURATION = 45;

export const DOMAIN_PIECES_SETTLED = 778; // Final 'o' docks
export const DOMAIN_PIECE_SETTLE_DURATION = 12;

// ============================================================================
// PHASE 9: CELEBRATORY URL COMPLETION BEAT WITH EXTENDED ORANGE HOLD (+0.5s / 30f)
// ============================================================================
// Prompt simultaneous celebration fade to orange upon docking
export const COMPLETION_ORANGE_START = 781;
export const COMPLETION_ORANGE_DURATION = 12; // Smooth fade to #FF5800

// Full orange lockup celebration hold (#FF5800) - Extended by 30 frames (40f total)
export const COMPLETION_ORANGE_HOLD_START = 793;
export const COMPLETION_ORANGE_HOLD_DURATION = 40; // 40 frames hold (~0.67s)

// Smooth transition to solid #121212 black URL
export const COMPLETION_BLACK_TRANSITION_START = 833;
export const COMPLETION_BLACK_TRANSITION_DURATION = 14;
export const COMPLETION_FULL_BLACK_FRAME = 847; // Frame 847 (URL is crisp black)

// ============================================================================
// PHASE 10: BLUE & PINK PLAYFUL MEETING, SWIRL, CLEAN BUMP & NATURAL DRIFT
// ============================================================================
// Starts right after URL completes at frame 851!
export const BLUE_PINK_SWIRL_START = 851;
export const BLUE_PINK_SWIRL_DURATION = 138; // f851 - f989 (includes broad natural outward drift)

// Backwards-compatibility aliases
export const RACE_START = BLUE_PINK_SWIRL_START;
export const RACE_DURATION = BLUE_PINK_SWIRL_DURATION;
export const SWIRL_START = 883;
export const SWIRL_DURATION = 42;

// ============================================================================
// PHASE 11: YELLOW & GREEN COZY SNUGGLE (UNDER RIGHT SIDE OF URL)
// ============================================================================
export const SQUEEZE_START = 989;
export const SQUEEZE_DURATION = 50; // f989 - f1039

// Backwards-compatibility aliases
export const GAP_THREAD_START = SQUEEZE_START;
export const GAP_THREAD_DURATION = SQUEEZE_DURATION;
export const FOLLOW_PEEL_START = SQUEEZE_START;
export const FOLLOW_PEEL_DURATION = SQUEEZE_DURATION;
export const PINK_SOLO_SWOOP_START = SQUEEZE_START;
export const PINK_SOLO_SWOOP_DURATION = SQUEEZE_DURATION;

// ============================================================================
// PHASE 12: OVERLAPPING, ORGANIC ALLIES DEPARTURE & CAMERA FOCUS TRANSFER
// ============================================================================
// Departures launch smoothly at f1045!
export const DEPARTURE_START = 1045;
export const PINK_DEPART_START = 1045;   // Pink peels offscreen top-right
export const YELLOW_DEPART_START = 1057; // Yellow peels offscreen bottom-right (12f stagger)
export const BLUE_DEPART_START = 1069;   // Blue sweeps offscreen top-left (12f stagger)
export const GREEN_DEPART_START = 1085;  // Green finishes lingering look-back and exits (16f stagger)

export const ALL_ALLIES_DEPARTED = 1160;

// ============================================================================
// PHASE 13: FINAL CAMERA PUSH, SHINY TEXT SHEEN & PRISTINE URL HERO HOLD
// ============================================================================
export const FINAL_CAMERA_PUSH_START = 1045; // Camera begins pushing in as allies peel away
export const FINAL_CAMERA_PUSH_DURATION = 120; // Smooth push to ~1.294x apparent scale (S0 * 1.25)
export const SHEEN_START = 1160; // Elegant single diagonal sheen pass across black yourallies.io
export const SHEEN_DURATION = 55; // f1160 - f1215
export const SHEEN_END = SHEEN_START + SHEEN_DURATION; // Frame 1215
export const FINAL_HOLD_START = 1215;
export const FINAL_HOLD_END = TOTAL_DURATION_FRAMES; // 1325 (110 frames / 1.83s pure hold)

export const TIMING = {
  FPS,
  TOTAL_DURATION_FRAMES,
  OPENING_BLANK_DURATION,
  TEXT_GENERATION_START,
  MEET_FOCUS_START,
  YOUR_FOCUS_START,
  ALLIES_FOCUS_START,
  CHAR_FOCUS_SPEED,
  CHAR_FOCUS_DURATION,
  ALL_WORDS_FOCUSED,
  FULL_PHRASE_HOLD_DURATION,
  FULL_PHRASE_HOLD_END,
  BRAND_TRANSFORM_START,
  BRAND_TRANSFORM_DURATION,
  LOGO_START,
  LOGO_SETTLED,
  BRANDED_LOCKUP_HOLD_DURATION,
  BRANDED_LOCKUP_HOLD_END,
  ZOOM_OUT_START,
  ZOOM_OUT_END,
  ALLY_SEQUENCE_START,
  BLUE_ENTRANCE_START,
  BLUE_ENTRANCE_DURATION,
  GREEN_ENTRANCE_START,
  GREEN_ENTRANCE_DURATION,
  PINK_ENTRANCE_START,
  PINK_ENTRANCE_DURATION,
  YELLOW_ENTRANCE_START,
  YELLOW_ENTRANCE_DURATION,
  YELLOW_DOUBLE_HOP_START,
  YELLOW_DOUBLE_HOP_DURATION,
  ALL_ALLIES_SETTLED,
  MEET_YOUR_EXIT_START,
  MEET_YOUR_EXIT_DURATION,
  MEET_YOUR_EXIT_END,
  BRAND_RECENTER_START,
  BRAND_RECENTER_DURATION,
  BRAND_RECENTER_END,
  ALL_GATHERED_FRAME,
  PINK_BOOP_START,
  PINK_BOOP_DURATION,
  BLUE_SOLO_JIGGLE_START,
  BLUE_SOLO_JIGGLE_DURATION,
  GREEN_SOLO_TURN_START,
  GREEN_SOLO_TURN_DURATION,
  LOGO_COLLAPSE_START,
  LOGO_COLLAPSE_DURATION,
  LOGO_COLLAPSE_END,
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
  NEAR_MISS_START,
  NEAR_MISS_DURATION,
  DOMAIN_PIECES_SETTLED,
  DOMAIN_PIECE_SETTLE_DURATION,
  COMPLETION_ORANGE_START,
  COMPLETION_ORANGE_DURATION,
  COMPLETION_ORANGE_HOLD_START,
  COMPLETION_ORANGE_HOLD_DURATION,
  COMPLETION_BLACK_TRANSITION_START,
  COMPLETION_BLACK_TRANSITION_DURATION,
  COMPLETION_FULL_BLACK_FRAME,
  BLUE_PINK_SWIRL_START,
  BLUE_PINK_SWIRL_DURATION,
  RACE_START,
  RACE_DURATION,
  SWIRL_START,
  SWIRL_DURATION,
  SQUEEZE_START,
  SQUEEZE_DURATION,
  GAP_THREAD_START,
  GAP_THREAD_DURATION,
  FOLLOW_PEEL_START,
  FOLLOW_PEEL_DURATION,
  PINK_SOLO_SWOOP_START,
  PINK_SOLO_SWOOP_DURATION,
  DEPARTURE_START,
  PINK_DEPART_START,
  YELLOW_DEPART_START,
  BLUE_DEPART_START,
  GREEN_DEPART_START,
  ALL_ALLIES_DEPARTED,
  FINAL_CAMERA_PUSH_START,
  FINAL_CAMERA_PUSH_DURATION,
  SHEEN_START,
  SHEEN_DURATION,
  SHEEN_END,
  FINAL_HOLD_START,
  FINAL_HOLD_END,
} as const;
