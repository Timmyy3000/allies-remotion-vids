export type AllyIdentity = "rolly" | "boxy" | "ghosty" | "rocky";
export type AllyState = "idle" | "thinking";

// Backward-compatible alias
export type AllyVisualState = AllyState;

export interface ThinkingWindow {
  start: number;
  end: number;
}

/**
 * Deterministic Thinking State Schedule keyed permanently by AllyIdentity.
 *
 * Cast Members & Personalities:
 * - Rolly (Blue / Head): Thinks during final approach to upper anchor & mid-hover
 * - Rocky (Green): Thinks right after arrival settle & late in idle loop
 * - Ghosty (Pink): Thinks during right-side entry sweep & mid-idle hover
 * - Boxy (Yellow): Thinks upon arrival in lower-right anchor & late drift
 *
 * Rules:
 * 1. 100% deterministic (reproducible on every render).
 * 2. Brief, tasteful momentary states.
 * 3. Natural staggered timing across entrances, arrival settles, and idle hover.
 * 4. Never all allies thinking simultaneously.
 */
export const ALLY_THINKING_SCHEDULE: Record<
  AllyIdentity,
  readonly ThinkingWindow[]
> = {
  rolly: [
    { start: 205, end: 235 },
    { start: 285, end: 320 },
  ],
  rocky: [
    { start: 235, end: 268 },
    { start: 340, end: 375 },
  ],
  ghosty: [
    { start: 208, end: 232 },
    { start: 265, end: 300 },
  ],
  boxy: [
    { start: 225, end: 255 },
    { start: 310, end: 348 },
  ],
} as const;

/**
 * Evaluates the deterministic visual state of an ally identity at any given frame.
 */
export function getAllyVisualState(
  identity: AllyIdentity,
  frame: number
): AllyState {
  const windows = ALLY_THINKING_SCHEDULE[identity];
  if (!windows) return "idle";
  const isThinking = windows.some((w) => frame >= w.start && frame <= w.end);
  return isThinking ? "thinking" : "idle";
}
