/**
 * Central Playful Event Registry & Repeat Protection
 *
 * Explicitly catalogs all spontaneous and physical events in the composition,
 * enforcing uniqueness so that hero moments (such as single-swirl) occur exactly once.
 */

import { AllyIdentity } from "../constants/allyStates";

export type PlayEventType =
  | "double-hop"
  | "sweep-meet-your"
  | "text-boop"
  | "race"
  | "single-swirl"
  | "make-space"
  | "near-miss"
  | "squeeze-in"
  | "copycat-bob"
  | "victory-arc";

export interface PlayEvent {
  id: string;
  type: PlayEventType;
  participants: AllyIdentity[];
  startFrame: number;
  durationInFrames: number;
  description: string;
}

export const PLAY_EVENTS: PlayEvent[] = [
  {
    id: "entrance-boxy-hop",
    type: "double-hop",
    participants: ["boxy"],
    startFrame: 270,
    durationInFrames: 65,
    description: "Boxy (Yellow) executes an excited double-hop with bounce during entrance life.",
  },
  {
    id: "sweep-meet-your",
    type: "sweep-meet-your",
    participants: ["ghosty"],
    startFrame: 320,
    durationInFrames: 56,
    description: "Ghosty (Pink) sweeps across 'Meet your' creating a traveling optical focus dissolution wake.",
  },
  {
    id: "gather-rocky-make-space",
    type: "make-space",
    participants: ["rocky"],
    startFrame: 465,
    durationInFrames: 50,
    description: "Rocky (Green) yields 38px left as Boxy (Yellow) gathers below the brand mark.",
  },
  {
    id: "gather-pink-text-boop",
    type: "text-boop",
    participants: ["ghosty"],
    startFrame: 495,
    durationInFrames: 45,
    description: "Ghosty (Pink) gets curious and accidentally boops 'allies' text, causing 20px recoil and squish.",
  },
  {
    id: "gather-blue-pink-race",
    type: "race",
    participants: ["rolly", "ghosty"],
    startFrame: 530,
    durationInFrames: 55,
    description: "Rolly (Blue) darts around 'allies' text perimeter and Ghosty (Pink) chases on a tighter lane.",
  },
  {
    id: "the-single-swirl",
    type: "single-swirl",
    participants: ["rolly", "ghosty"],
    startFrame: 580,
    durationInFrames: 45,
    description: "THE ONLY SWIRL IN THE VIDEO: Rolly and Ghosty converge from the race into a 220° momentum spiral.",
  },
  {
    id: "domain-green-yellow-near-miss",
    type: "near-miss",
    participants: ["rocky", "boxy"],
    startFrame: 755,
    durationInFrames: 40,
    description: "Rocky (Green) and Boxy (Yellow) bank slightly to avoid each other during domain return.",
  },
  {
    id: "post-dock-yellow-green-squeeze",
    type: "squeeze-in",
    participants: ["boxy", "rocky"],
    startFrame: 890,
    durationInFrames: 60,
    description: "Boxy (Yellow) gently squeezes in next to Rocky (Green) in the lower right, snuggling cozily.",
  },
  {
    id: "post-dock-victory-arc",
    type: "victory-arc",
    participants: ["rolly", "ghosty"],
    startFrame: 1080,
    durationInFrames: 85,
    description: "Rolly and Ghosty glide in an elevated arching hover high above 'your' with 130px clearance.",
  },
];

/**
 * Validates that hero moments (such as single-swirl) are uniquely defined.
 */
export function validatePlayEvents(): void {
  const swirlEvents = PLAY_EVENTS.filter((e) => e.type === "single-swirl");
  if (swirlEvents.length !== 1) {
    console.warn(
      `[PlayRegistry Violation]: Expected exactly 1 single-swirl event, but found ${swirlEvents.length}.`
    );
  }
}

// Run validation in development
validatePlayEvents();
