/**
 * Centralized Additive Timeline & Choreography Constants (V4 - 1560 Frames)
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
// PHASE 2: GENERATIVE FOCUS HEADLINE ENTRANCE ("Meet your")
// ============================================================================
export const TEXT_GENERATION_START = OPENING_BLANK_DURATION; // Frame 16
export const MEET_FOCUS_START = TEXT_GENERATION_START; // Frame 16
export const YOUR_FOCUS_START = MEET_FOCUS_START + 16; // Frame 32

export const CHAR_FOCUS_SPEED = 1.15;
export const CHAR_FOCUS_DURATION = Math.round((0.28 / CHAR_FOCUS_SPEED) * FPS); // 15 frames
export const ALL_WORDS_FOCUSED = YOUR_FOCUS_START + CHAR_FOCUS_DURATION + 4; // Frame 51

// ============================================================================
// PHASE 3: FULL PHRASE CRISP HOLD
// ============================================================================
export const FULL_PHRASE_HOLD_DURATION = 40; // ~0.67s
export const FULL_PHRASE_HOLD_END = ALL_WORDS_FOCUSED + FULL_PHRASE_HOLD_DURATION; // Frame 91

// ============================================================================
// PHASE 4: BLUE LOGO DELIVERY & BRAND TRANSFORMATION
// ============================================================================
// Blue enters carrying the orange Allies logo tile
export const BLUE_LOGO_ENTRANCE_START = 105;
export const BLUE_LOGO_ENTRANCE_DURATION = 75; // Arrives at slot at f180
export const LOGO_DOCK_START = 175;
export const LOGO_DOCK_SETTLE = 205; // Settles with 0.97 -> 1.0 compression

// "allies" text slides to make room and turns orange
export const BRAND_TRANSFORM_START = 115;
export const BRAND_TRANSFORM_DURATION = 35;

export const ZOOM_OUT_START = 150;
export const ZOOM_OUT_END = 190;

// ============================================================================
// PHASE 5: REMAINING ALLIES ENTRANCE & YELLOW'S DOUBLE-HOP
// ============================================================================
export const PINK_ENTRANCE_START = 180;
export const PINK_ENTRANCE_DURATION = 55;

export const GREEN_ENTRANCE_START = 190;
export const GREEN_ENTRANCE_DURATION = 58;

export const YELLOW_ENTRANCE_START = 205;
export const YELLOW_ENTRANCE_DURATION = 55;

// Yellow's unique signature double-hop
export const YELLOW_DOUBLE_HOP_START = 240;
export const YELLOW_DOUBLE_HOP_DURATION = 65; // f240 - f305

// ============================================================================
// PHASE 6: PHYSICAL WORD CARRIAGE BY GREEN & YELLOW & BRAND RECENTER
// ============================================================================
// Green carries "Meet" offscreen left
export const GREEN_MEET_PICKUP_START = 315;
export const GREEN_MEET_CARRY_DURATION = 95; // Exits past left boundary

// Yellow carries "your" offscreen lower-left on diverging path
export const YELLOW_YOUR_PICKUP_START = 335;
export const YELLOW_YOUR_CARRY_DURATION = 95; // Exits past boundary

// Central brand mark ("[LOGO] allies") smoothly recenters as one unit
export const BRAND_RECENTER_START = 340;
export const BRAND_RECENTER_DURATION = 70;
export const BRAND_RECENTER_END = BRAND_RECENTER_START + BRAND_RECENTER_DURATION; // Frame 410

// Return paths for Green and Yellow from canvas edges
export const GREEN_RETURN_START = 415;
export const GREEN_RETURN_DURATION = 65;

export const YELLOW_RETURN_START = 430;
export const YELLOW_RETURN_DURATION = 65;

// ============================================================================
// PHASE 7: INSPECTION, PINK TEXT BOOP, BLUE/PINK RACE & THE ONE SWIRL
// ============================================================================
// All allies gathered around centered brand
export const ALL_GATHERED_FRAME = 485;

// Pink accidentally bumps the "allies" text
export const PINK_BOOP_START = 490;
export const PINK_BOOP_DURATION = 40; // f490 - f530

// Blue notices, accelerates into race, Pink gives chase
export const RACE_START = 530;
export const RACE_DURATION = 55; // f530 - f585

// Pink catches Blue -> Contact Squash -> Tangential ONE SWIRL
export const SWIRL_START = 580;
export const SWIRL_DURATION = 50; // f580 - f630

// Post-swirl peel-away to new roaming coordinates
export const POST_SWIRL_ROAM_START = 625;

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
// Event 1: Pink Peeks Behind Blue + Blue Startle
export const PEEK_BEHIND_START = 980;
export const PEEK_BEHIND_DURATION = 75;

// Event 2: Yellow & Green Cozy Squeeze-In
export const SQUEEZE_START = 1060;
export const SQUEEZE_DURATION = 65;

// Event 3: Blue Threads Gap between Pink & Green
export const GAP_THREAD_START = 1130;
export const GAP_THREAD_DURATION = 70;

// Event 4: Follow-and-Peel (Yellow leads, Pink follows then peels)
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
  CHAR_FOCUS_SPEED,
  CHAR_FOCUS_DURATION,
  ALL_WORDS_FOCUSED,
  FULL_PHRASE_HOLD_DURATION,
  FULL_PHRASE_HOLD_END,
  BLUE_LOGO_ENTRANCE_START,
  BLUE_LOGO_ENTRANCE_DURATION,
  LOGO_DOCK_START,
  LOGO_DOCK_SETTLE,
  BRAND_TRANSFORM_START,
  BRAND_TRANSFORM_DURATION,
  ZOOM_OUT_START,
  ZOOM_OUT_END,
  PINK_ENTRANCE_START,
  PINK_ENTRANCE_DURATION,
  GREEN_ENTRANCE_START,
  GREEN_ENTRANCE_DURATION,
  YELLOW_ENTRANCE_START,
  YELLOW_ENTRANCE_DURATION,
  YELLOW_DOUBLE_HOP_START,
  YELLOW_DOUBLE_HOP_DURATION,
  GREEN_MEET_PICKUP_START,
  GREEN_MEET_CARRY_DURATION,
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
