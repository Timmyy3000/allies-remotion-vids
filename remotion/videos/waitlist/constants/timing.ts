/**
 * Centralized Additive Timeline & Choreography Constants (V6 - 1580 Frames)
 *
 * Master Composition Duration: 1580 frames (~26.33 seconds at 60fps)
 */

export const FPS = 60;
export const TOTAL_DURATION_FRAMES = 1580;

// ============================================================================
// PHASE 1: CLEAN OPENING BLANK CANVAS
// ============================================================================
export const OPENING_BLANK_DURATION = 16; // 0.27s (Pure empty white canvas)

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

// Official Allies SVG logo springs into reserved slot
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

// Yellow's unique signature double-hop
export const YELLOW_DOUBLE_HOP_START = 240;
export const YELLOW_DOUBLE_HOP_DURATION = 65; // f240 - f305

// ============================================================================
// PHASE 6: DIFFERENTIATED WORD PICKUPS (GREEN FROM ABOVE, YELLOW FROM BELOW)
// ============================================================================
// Green travels to "Meet" from ABOVE, attaches, tugs, and carries offscreen left
export const GREEN_MEET_APPROACH_START = 310;
export const GREEN_MEET_PICKUP_START = 345;
export const GREEN_MEET_CARRY_DURATION = 95; // Exits past left boundary around f440

// Yellow travels to "your" from UNDERNEATH, attaches, tugs, and carries offscreen bottom-left
export const YELLOW_YOUR_APPROACH_START = 325;
export const YELLOW_YOUR_PICKUP_START = 365;
export const YELLOW_YOUR_CARRY_DURATION = 95; // Exits past bottom-left boundary around f460

// 48-FRAME (~0.8s) INTENTIONAL HOLD AFTER BOTH WORDS ARE COMPLETELY OFFSCREEN
export const WORDS_EXITED_FRAME = 460;
export const POST_EXIT_HOLD_DURATION = 48; // Exactly 48 frames (0.8s) pure hold
export const BRAND_RECENTER_START = WORDS_EXITED_FRAME + POST_EXIT_HOLD_DURATION; // Frame 508
export const BRAND_RECENTER_DURATION = 70; // f508 - f578
export const BRAND_RECENTER_END = BRAND_RECENTER_START + BRAND_RECENTER_DURATION; // Frame 578

// Return paths for Green and Yellow from canvas edges to new local positions
export const GREEN_RETURN_START = 520;
export const GREEN_RETURN_DURATION = 65; // f520 - f585

export const YELLOW_RETURN_START = 535;
export const YELLOW_RETURN_DURATION = 65; // f535 - f600

// ============================================================================
// PHASE 7: INSPECTION, PINK TEXT BOOP & SOLO CURIOSITY BEATS
// ============================================================================
export const ALL_GATHERED_FRAME = 585;

// Pink accidentally bumps the rendered right edge of "allies" text
export const PINK_BOOP_START = 590;
export const PINK_BOOP_DURATION = 40; // f590 - f630 (impact at f600)

// Blue solo curiosity peek & Green calm curiosity lean
export const BLUE_SOLO_PEEK_START = 625;
export const BLUE_SOLO_PEEK_DURATION = 45;

export const GREEN_SOLO_LEAN_START = 630;
export const GREEN_SOLO_LEAN_DURATION = 45;

// ============================================================================
// PHASE 8: LOGO COLLAPSE & DOMAIN FETCH LAUNCHES
// ============================================================================
export const LOGO_COLLAPSE_START = 675;
export const LOGO_COLLAPSE_DURATION = 35;
export const LOGO_COLLAPSE_END = LOGO_COLLAPSE_START + LOGO_COLLAPSE_DURATION; // Frame 710

// Allies launch with speed-ramped acceleration to screen edges to fetch domain pieces
export const DOMAIN_EDGE_START = 710;
export const BLUE_DOMAIN_EDGE_START = DOMAIN_EDGE_START;
export const PINK_DOMAIN_EDGE_START = DOMAIN_EDGE_START + 6;
export const GREEN_DOMAIN_EDGE_START = DOMAIN_EDGE_START + 12;
export const YELLOW_DOMAIN_EDGE_START = DOMAIN_EDGE_START + 18;

export const BLUE_DOMAIN_EDGE_DURATION = 46;
export const PINK_DOMAIN_EDGE_DURATION = 50;
export const GREEN_DOMAIN_EDGE_DURATION = 52;
export const YELLOW_DOMAIN_EDGE_DURATION = 50;

// Dragging letters back to canvas center
export const BLUE_DOMAIN_DRAG_START = 760;
export const PINK_DOMAIN_DRAG_START = 770;
export const GREEN_DOMAIN_DRAG_START = 778;
export const YELLOW_DOMAIN_DRAG_START = 782;

export const BLUE_DOMAIN_DRAG_DURATION = 76;
export const PINK_DOMAIN_DRAG_DURATION = 82;
export const GREEN_DOMAIN_DRAG_DURATION = 88;
export const YELLOW_DOMAIN_DRAG_DURATION = 92;

// Green & Yellow Near-Miss during return
export const NEAR_MISS_START = 785;
export const NEAR_MISS_DURATION = 45;

export const DOMAIN_PIECES_SETTLED = 875; // Final 'o' docks
export const DOMAIN_PIECE_SETTLE_DURATION = 12;

// ============================================================================
// PHASE 9: SIMULTANEOUS URL COMPLETION ORANGE TRANSITION
// ============================================================================
// Entire 'yourallies.io' lockup transitions to orange AT THE SAME TIME
export const COMPLETION_ORANGE_START = 890;
export const COMPLETION_ORANGE_DURATION = 16; // Smooth simultaneous 16-frame fade to #FF5800

// Full orange lockup celebration hold (#FF5800)
export const COMPLETION_ORANGE_HOLD_START = COMPLETION_ORANGE_START + COMPLETION_ORANGE_DURATION; // Frame 906
export const COMPLETION_ORANGE_HOLD_DURATION = 20;

// Smooth transition to solid #121212 black URL
export const COMPLETION_BLACK_TRANSITION_START = COMPLETION_ORANGE_HOLD_START + COMPLETION_ORANGE_HOLD_DURATION; // Frame 926
export const COMPLETION_BLACK_TRANSITION_DURATION = 24;
export const COMPLETION_FULL_BLACK_FRAME = COMPLETION_BLACK_TRANSITION_START + COMPLETION_BLACK_TRANSITION_DURATION; // Frame 950

// ============================================================================
// PHASE 10: RACE AROUND COMPLETED 'yourallies.io' & THE ONE MOMENTUM SWIRL
// ============================================================================
// Blue initiates race around completed URL obstacle; Pink notices and gives chase
export const RACE_START = 960;
export const RACE_DURATION = 65; // f960 - f1025 (~1.1s)

// Pink catches Blue -> Soft Body Bump -> Tangential ONE SWIRL
export const SWIRL_START = 1020;
export const SWIRL_DURATION = 45; // f1020 - f1065 (Strictly ONE SWIRL in entire video)

// ============================================================================
// PHASE 11: POST-RACE SOCIAL PLAY INTERACTIONS (CURSOR-FREE)
// ============================================================================
// Event 1: Yellow & Green Cozy Squeeze-In under URL
export const SQUEEZE_START = 1080;
export const SQUEEZE_DURATION = 65;

// Event 2: Blue Threads Gap between Green & Yellow (Make-Space Shift)
export const GAP_THREAD_START = 1150;
export const GAP_THREAD_DURATION = 70;

// Event 3: Follow-and-Peel (Yellow leads, Pink follows then peels)
export const FOLLOW_PEEL_START = 1225;
export const FOLLOW_PEEL_DURATION = 75;

// ============================================================================
// PHASE 12: OVERLAPPING, ORGANIC ALLIES DEPARTURE
// ============================================================================
export const DEPARTURE_START = 1330;
export const PINK_DEPART_START = 1330; // Pink peels offscreen top-right
export const YELLOW_DEPART_START = 1355; // Yellow peels offscreen bottom-right (25f offset)
export const BLUE_DEPART_START = 1380; // Blue accelerates offscreen top-left (25f offset)
export const GREEN_DEPART_START = 1410; // Green lingers for final look-back and exits (30f offset)

export const ALL_ALLIES_DEPARTED = 1475;

// ============================================================================
// PHASE 13: FINAL CAMERA PUSH & PRISTINE URL HOLD
// ============================================================================
export const FINAL_CAMERA_PUSH_START = 1370;
export const FINAL_CAMERA_PUSH_DURATION = 100; // Pushes to 1.08x
export const FINAL_HOLD_START = 1470;
export const FINAL_HOLD_END = TOTAL_DURATION_FRAMES; // 1580 (110 frames / 1.83s pure hold)

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
  WORDS_EXITED_FRAME,
  POST_EXIT_HOLD_DURATION,
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
  BLUE_SOLO_PEEK_START,
  BLUE_SOLO_PEEK_DURATION,
  GREEN_SOLO_LEAN_START,
  GREEN_SOLO_LEAN_DURATION,
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
