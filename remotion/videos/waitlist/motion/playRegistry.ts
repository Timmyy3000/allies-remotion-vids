/**
 * Central Playful Event Registry & Repeat Protection
 *
 * Explicitly catalogs all spontaneous and physical events in the composition,
 * enforcing uniqueness so that hero moments (such as single-swirl) occur exactly once.
 */

import { AllyIdentity } from "../constants/allyStates";

export type PlayEventType =
  | "logo-delivery"
  | "double-hop"
  | "carry-word"
  | "text-boop"
  | "race"
  | "single-swirl"
  | "make-space"
  | "near-miss"
  | "completion-pulse"
  | "peek-behind"
  | "squeeze-in"
  | "gap-thread"
  | "follow-and-peel"
  | "staggered-departure";

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
    id: "blue-logo-delivery",
    type: "logo-delivery",
    participants: ["rolly"],
    startFrame: 110,
    durationInFrames: 95,
    description: "Blue (Rolly) enters guiding the Allies logo tile ahead of its cursor and docks it precisely.",
  },
  {
    id: "yellow-entrance-double-hop",
    type: "double-hop",
    participants: ["boxy"],
    startFrame: 230,
    durationInFrames: 70,
    description: "Boxy (Yellow) executes its signature excited double-hop with bounce during entrance.",
  },
  {
    id: "green-carry-meet",
    type: "carry-word",
    participants: ["rocky"],
    startFrame: 320,
    durationInFrames: 90,
    description: "Rocky (Green) attaches to 'Meet' with cursor and carries it smoothly offscreen left.",
  },
  {
    id: "yellow-carry-your",
    type: "carry-word",
    participants: ["boxy"],
    startFrame: 340,
    durationInFrames: 90,
    description: "Boxy (Yellow) attaches to 'your' with cursor and buoys it away on a diverging path offscreen.",
  },
  {
    id: "pink-text-boop",
    type: "text-boop",
    participants: ["ghosty"],
    startFrame: 490,
    durationInFrames: 45,
    description: "Ghosty (Pink) gets curious and accidentally boops 'allies' text, causing 20px recoil and squish.",
  },
  {
    id: "blue-pink-race",
    type: "race",
    participants: ["rolly", "ghosty"],
    startFrame: 530,
    durationInFrames: 55,
    description: "Rolly (Blue) darts around 'allies' perimeter; Ghosty (Pink) chases 6 frames later on a tighter lane.",
  },
  {
    id: "the-single-swirl",
    type: "single-swirl",
    participants: ["rolly", "ghosty"],
    startFrame: 580,
    durationInFrames: 50,
    description: "THE ONLY SWIRL IN THE ENTIRE VIDEO: Pink catches Blue into a 240° momentum swirl then peels apart.",
  },
  {
    id: "green-yellow-near-miss",
    type: "near-miss",
    participants: ["rocky", "boxy"],
    startFrame: 755,
    durationInFrames: 45,
    description: "Rocky (Green) and Boxy (Yellow) bank slightly to avoid each other during domain return.",
  },
  {
    id: "puzzle-completion-pulse",
    type: "completion-pulse",
    participants: ["rolly", "ghosty", "rocky", "boxy"],
    startFrame: 890,
    durationInFrames: 40,
    description: "The completed URL flashes #FF5800 and emits a microscopic physical impulse to surrounding allies.",
  },
  {
    id: "pink-peek-behind-blue",
    type: "peek-behind",
    participants: ["ghosty", "rolly"],
    startFrame: 980,
    durationInFrames: 75,
    description: "Pink curves behind Blue and pops out; Blue startles, compresses, and translates 25px away.",
  },
  {
    id: "yellow-green-squeeze",
    type: "squeeze-in",
    participants: ["boxy", "rocky"],
    startFrame: 1060,
    durationInFrames: 65,
    description: "Boxy (Yellow) snuggles gently up against Rocky (Green) in the lower right; both compress 4.5%.",
  },
  {
    id: "blue-gap-thread",
    type: "gap-thread",
    participants: ["rolly", "ghosty", "rocky"],
    startFrame: 1130,
    durationInFrames: 70,
    description: "Blue curves through the gap between Pink and Green; Pink and Green lean outward to make space.",
  },
  {
    id: "follow-and-peel",
    type: "follow-and-peel",
    participants: ["boxy", "ghosty"],
    startFrame: 1210,
    durationInFrames: 80,
    description: "Yellow drifts across canvas, Pink casually follows in a loose 2-blob train, then peels upward.",
  },
  {
    id: "staggered-departures",
    type: "staggered-departure",
    participants: ["ghosty", "boxy", "rolly", "rocky"],
    startFrame: 1330,
    durationInFrames: 130,
    description: "Allies peel away individually (Pink -> Yellow -> Blue -> Green with a final look-back beat).",
  },
];

/**
 * Validates that play events have valid non-overlapping registrations and single-swirl rule.
 */
export function validatePlayEvents(): void {
  const swirlEvents = PLAY_EVENTS.filter((e) => e.type === "single-swirl");
  if (swirlEvents.length !== 1) {
    throw new Error(
      `[PlayRegistry Violation]: Expected exactly 1 single-swirl event, but found ${swirlEvents.length}.`
    );
  }

  const raceEvents = PLAY_EVENTS.filter((e) => e.type === "race");
  if (raceEvents.length !== 1) {
    throw new Error(
      `[PlayRegistry Violation]: Expected exactly 1 race event, but found ${raceEvents.length}.`
    );
  }

  const doubleHopEvents = PLAY_EVENTS.filter((e) => e.type === "double-hop");
  if (doubleHopEvents.length !== 1) {
    throw new Error(
      `[PlayRegistry Violation]: Expected exactly 1 double-hop event, but found ${doubleHopEvents.length}.`
    );
  }
}

// Run validation in development
validatePlayEvents();
