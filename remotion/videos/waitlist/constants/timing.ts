/**
 * Centralized Additive Timeline & Choreography Constants (V5 - 1560 Frames)
 *
 * Master Composition Working Duration: 1560 frames (~26.0 seconds at 60fps)
 */

export const FPS = 60;
export const TOTAL_DURATION_FRAMES = 1560;

// ============================================================================
// PHASE 1: CLEAN OPENING BLANK CANVAS
// ============================================================================
export const OPENING_BLANK_DURATION = 16; // ~0.27s

// ============================================================================
// PHASE 2: GENERATIVE FOCUS HEADLINE ENTRANCE ("Meet your allies")
// ============================================================================
export const TEXT_GENERATION_START = OPENING_BLANK_DURATION; // Frame 16
export const MEET_FOCUS_START = TEXT_GENERATION_START; // Frame 16
export const YOUR_FOCUS_START = MEET_FOCUS_START + 16; // Frame 32
export const ALLIES_FOCUS_START = YOUR_FOCUS_START + 16; // Frame 48

export const CHAR_FOCUS_SPEED = 1.15;
export const CHAR_FOCUS_DURATION = Math.round((0.28 / CHAR_FOCUS_SPEED) * FPS); // 15 frames
export const ALL_WORDS_FOCUSED = ALLIES_FOCUS_START + CHAR_FOCUS_DURATION + 4; // Frame 67

// ============================================================================
// PHASE 3: FULL PHRASE CRISP HOLD
// ============================================================================
export const FULL_PHRASE_HOLD_DURATION = 36; // 0.60s
export const FULL_PHRASE_HOLD_END = ALL_WORDS_FOCUSED + FULL_PHRASE_HOLD_DURATION; // Frame 103

// ============================================================================
// PHASE 4: BRAND TRANSFORMATION & LOGO SPRING ENTRANCE (Exact more-motion port)
// ============================================================================
// "allies" text slides to make room and turns orange
export const BRAND_TRANSFORM_START = FULL_PHRASE_HOLD_END; // Frame 103
export const BRAND_TRANSFORM_DURATION = 24; // 0.40s

// Official Allies SVG logo springs in (No Blue involvement)
export const LOGO_START = BRAND_TRANSFORM_START + 6; // Frame 109
export const LOGO_SETTLED = LOGO_START + 32; // Frame 141

// Full Branded Lockup Hold ("Meet your [LOGO] allies")
export const BRANDED_LOCKUP_HOLD_DURATION = 24; // 0.40s
export const BRANDED_LOCKUP_HOLD_END = LOGO_SETTLED + BRANDED_LOCKUP_HOLD_DURATION; // Frame 165

// Camera push zoom out (1.15x -> 1.0x master framing)
export const ZOOM_OUT_START = BRANDED_LOCKUP_HOLD_END - 5; // Frame 160
export const ZOOM_OUT_END = ZOOM_OUT_START + 30; // Frame 190

// ============================================================================
// PHASE 5: ALL ALLIES ENTER & YELLOW'S DOUBLE-HOP
// ============================================================================
export const ALLY_SEQUENCE_START = BRANDED_LOCKUP_HOLD_END + 5; // Frame 170

export const BLUE_ENTRANCE_START = ALLY_SEQUENCE_START; // Frame 170
export const BLUE_ENTRANCE_DURATION = 55;

export const GREEN_ENTRANCE_START = 180;
export const GREEN_ENTRANCE_DURATION = 55;

export const PINK_ENTRANCE_START = 185;
export const PINK_ENTRANCE_DURATION = 55;

export const YELLOW_ENTRANCE_START = 195;
export const YELLOW_ENTRANCE_DURATION = 55;

// Yellow's unique signature double-hop (approved)
export const YELLOW_DOUBLE_HOP_START = 240;
export const YELLOW_DOUBLE_HOP_DURATION = 65; // f240 - f305

// ============================================================================
// PHASE 6: PHYSICAL WORD PICKUP BY GREEN & YELLOW & BRAND RECENTER
// ============================================================================
// Green travels to "Meet", contacts, tugs, and carries offscreen left
export const GREEN_MEET_APPROACH_START = 310;
export const GREEN_MEET_PICKUP_START = 345;
export const GREEN_MEET_CARRY_DURATION = 80; // f345 - f425

// Yellow travels to "your", contacts, tugs, and carries offscreen bottom-left
export const YELLOW_YOUR_APPROACH_START = 325;
export const YELLOW_YOUR_PICKUP_START = 360;
export const YELLOW_YOUR_CARRY_DURATION = 80; // f360 - f440

// Central brand mark ("[LOGO] allies") smoothly recenters as one unit
export const BRAND_RECENTER_START = 345;
export const BRAND_RECENTER_DURATION = 70;
export const BRAND_RECENTER_END = BRAND_RECENTER_START + BRAND_RECENTER_DURATION; // Frame 415

// Return paths for Green and Yellow from canvas edges
export const GREEN_RETURN_START = 425;
export const GREEN_RETURN_DURATION = 60; // f425 - f485

export const YELLOW_RETURN_START = 440;
export const YELLOW_RETURN_DURATION = 55; // f440 - f495

// ============================================================================
// PHASE 7: INSPECTION, PINK TEXT BOOP, BLUE/PINK RACE & THE ONE SWIRL
// ============================================================================
export const ALL_GATHERED_FRAME = 485;

// Pink accidentally bumps the rendered right edge of "allies" text
export const PINK_BOOP_START = 490;
export const PINK_BOOP_DURATION = 40; // f490 - f530 (impact at f500)

// Blue notices collision (f515-f535), darts off, Pink gives chase
export const RACE_START = 535;
export const RACE_DURATION = 60; // f535 - f595

// Pink catches Blue -> Contact Squash -> Tangential ONE SWIRL
export const SWIRL_START = 595;
export const SWIRL_DURATION = 45; // f595 - f640 (ONE SWIRL ONLY)

// Post-swirl peel-away to new staging coordinates
export const POST_SWIRL_ROAM_START = 635;

// ============================================================================
// PHASE 8: LOGO COLLAPSE & DOMAIN FETCH LAUNCHES
// ============================================================================
export const LOGO_COLLAPSE_START = 645;
export const LOGO_COLLAPSE_DURATION = 35;
export const LOGO_COLLAPSE_END = LOGO_COLLAPSE_START + LOGO_COLLAPSE_DURATION; // Frame 680

// Allies launch with quintic acceleration to screen edges to fetch domain pieces
export const DOMAIN_EDGE_START = 680;
export const BLUE_DOMAIN_EDGE_START = DOMAIN_EDGE_START;
export const PINK_DOMAIN_EDGE_START = DOMAIN_EDGE_START + 6;
export const GREEN_DOMAIN_EDGE_START = DOMAIN_EDGE_START + 12;
export const YELLOW_DOMAIN_EDGE_START = DOMAIN_EDGE_START + 18;

export const BLUE_DOMAIN_EDGE_DURATION = 46;
export const PINK_DOMAIN_EDGE_DURATION = 50;
export const GREEN_DOMAIN_EDGE_DURATION = 52;
export const YELLOW_DOMAIN_EDGE_DURATION = 50;

// Dragging letters back to canvas center
export const BLUE_DOMAIN_DRAG_START = 730;
export const PINK_DOMAIN_DRAG_START = 740;
export const GREEN_DOMAIN_DRAG_START = 748;
export const YELLOW_DOMAIN_DRAG_START = 752;

export const BLUE_DOMAIN_DRAG_DURATION = 76;
export const PINK_DOMAIN_DRAG_DURATION = 82;
export const GREEN_DOMAIN_DRAG_DURATION = 88;
export const YELLOW_DOMAIN_DRAG_DURATION = 92;

// Green & Yellow Near-Miss during return
export const NEAR_MISS_START = 755;
export const NEAR_MISS_DURATION = 45;

export const DOMAIN_PIECES_SETTLED = 845; // Final 'o' docks
export const DOMAIN_PIECE_SETTLE_DURATION = 12;

// ============================================================================
// PHASE 9: PUZZLE COMPLETION WAVE & COLOR REACTION
// ============================================================================
// Orange completion wave propagates right-to-left (o -> i -> . -> allies -> your)
export const COMPLETION_WAVE_START = 855;
export const COMPLETION_WAVE_DURATION = 20;

// Full orange lockup celebration hold (#FF5800)
export const COMPLETION_ORANGE_HOLD_START = 875;
export const COMPLETION_ORANGE_HOLD_DURATION = 20;

// Smooth transition to solid #121212 black URL
export const COMPLETION_BLACK_TRANSITION_START = 895;
export const COMPLETION_BLACK_TRANSITION_DURATION = 25;
export const COMPLETION_FULL_BLACK_FRAME = 920;

// ============================================================================
// PHASE 10: EXTENDED POST-COMPLETION PLAY WINDOW
// ============================================================================
// Event 1: Pink Peeks Behind Blue + Blue Startle (z-index peek, no cursor)
export const PEEK_BEHIND_START = 980;
export const PEEK_BEHIND_DURATION = 75;

// Event 2: Yellow & Green Cozy Squeeze-In (body compression + yield, no cursor)
export const SQUEEZE_START = 1060;
export const SQUEEZE_DURATION = 65;

// Event 3: Blue Threads Gap between Pink & Green (make-space shift, no cursor)
export const GAP_THREAD_START = 1130;
export const GAP_THREAD_DURATION = 70;

// Event 4: Follow-and-Peel (Yellow leads, Pink follows then peels, no cursor)
export const FOLLOW_PEEL_START = 1210;
export const FOLLOW_PEEL_DURATION = 80;

// ============================================================================
// PHASE 11: STAGGERED ALLIES DEPARTURE
// ============================================================================
export const DEPARTURE_START = 1330;
export const PINK_DEPART_START = 1330;
export const YELLOW_DEPART_START = 1355;
export const BLUE_DEPART_START = 1385;
export const GREEN_DEPART_START = 1415; // Green lingers for final look-back beat

export const ALL_ALLIES_DEPARTED = 1475;

// ============================================================================
// PHASE 12: FINAL CAMERA PUSH & PRISTINE URL HOLD
// ============================================================================
export const FINAL_CAMERA_PUSH_START = 1360;
export const FINAL_CAMERA_PUSH_DURATION = 100; // Pushes to 1.08x
export const FINAL_HOLD_START = 1460;
export const FINAL_HOLD_END = TOTAL_DURATION_FRAMES; // 1560 (100 frames hold)

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
  GREEN_MEET_APPROACH_START,
  GREEN_MEET_PICKUP_START,
  GREEN_MEET_CARRY_DURATION,
  YELLOW_YOUR_APPROACH_START,
  YELLOW_YOUR_PICKUP_START,
  YELLOW_YOUR_CARRY_DURATION,
  BRAND_RECENTER_START,
  BRAND_RECENTER_DURATION,
  BRAND_RECENTER_END,
  GREEN_RETURN_START,
  GREEN_RETURN_DURATION,
  YELLOW_RETURN_START,
  YELLOW_RETURN_DURATION,
  ALL_GATHERED_FRAME,
  PINK_BOOP_START,
  PINK_BOOP_DURATION,
  RACE_START,
  RACE_DURATION,
  SWIRL_START,
  SWIRL_DURATION,
  POST_SWIRL_ROAM_START,
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
  COMPLETION_WAVE_START,
  COMPLETION_WAVE_DURATION,
  COMPLETION_ORANGE_HOLD_START,
  COMPLETION_ORANGE_HOLD_DURATION,
  COMPLETION_BLACK_TRANSITION_START,
  COMPLETION_BLACK_TRANSITION_DURATION,
  COMPLETION_FULL_BLACK_FRAME,
  PEEK_BEHIND_START,
  PEEK_BEHIND_DURATION,
  SQUEEZE_START,
  SQUEEZE_DURATION,
  GAP_THREAD_START,
  GAP_THREAD_DURATION,
  FOLLOW_PEEL_START,
  FOLLOW_PEEL_DURATION,
  DEPARTURE_START,
  PINK_DEPART_START,
  YELLOW_DEPART_START,
  BLUE_DEPART_START,
  GREEN_DEPART_START,
  ALL_ALLIES_DEPARTED,
  FINAL_CAMERA_PUSH_START,
  FINAL_CAMERA_PUSH_DURATION,
  FINAL_HOLD_START,
  FINAL_HOLD_END,
} as const;
