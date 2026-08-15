import React from "react";
import { AnimatedImage, staticFile } from "remotion";
import { AllyIdentity, AllyState } from "../constants/allyStates";

/**
 * Strict, canonical asset resolution mapping keyed by permanent AllyIdentity.
 *
 * Cast Members:
 * - Rolly  -> idle_rolly.gif / thinking_rolly.gif
 * - Rocky  -> idle_rocky.gif / thinking_rocky.gif
 * - Ghosty -> idle_ghosty.gif / thinking_ghosty.gif
 * - Boxy   -> idle_boxy.gif / thinking_boxy.gif
 *
 * This structure guarantees that cross-character contamination is impossible.
 */
export const ALLY_IDENTITY_ASSETS: Record<
  AllyIdentity,
  Record<AllyState, string>
> = {
  rolly: {
    idle: "allies_idle/idle_rolly.gif",
    thinking: "allies_thinking/thinking_rolly.gif",
  },
  boxy: {
    idle: "allies_idle/idle_boxy.gif",
    thinking: "allies_thinking/thinking_boxy.gif",
  },
  ghosty: {
    idle: "allies_idle/idle_ghosty.gif",
    thinking: "allies_thinking/thinking_ghosty.gif",
  },
  rocky: {
    idle: "allies_idle/idle_rocky.gif",
    thinking: "allies_thinking/thinking_rocky.gif",
  },
} as const;

/**
 * Retrieves the official asset path for a permanent ally identity and current state.
 */
export function getAllyVisualAsset(
  identity: AllyIdentity,
  state: AllyState = "idle"
): string {
  const identityRecord = ALLY_IDENTITY_ASSETS[identity];
  if (!identityRecord) {
    throw new Error(`[AllyVisual] Unknown ally identity: "${identity}"`);
  }
  const asset = identityRecord[state];
  if (!asset) {
    throw new Error(
      `[AllyVisual] Missing asset for identity "${identity}" in state "${state}"`
    );
  }
  return asset;
}

// Backward compatibility map for legacy color IDs
export const COLOR_TO_IDENTITY_MAP: Record<
  "blue" | "green" | "pink" | "yellow",
  AllyIdentity
> = {
  blue: "rolly",
  green: "rocky",
  pink: "ghosty",
  yellow: "boxy",
} as const;

export const ALLY_ASSETS = {
  blue: ALLY_IDENTITY_ASSETS.rolly,
  green: ALLY_IDENTITY_ASSETS.rocky,
  pink: ALLY_IDENTITY_ASSETS.ghosty,
  yellow: ALLY_IDENTITY_ASSETS.boxy,
};

export interface AllyVisualProps {
  identity?: AllyIdentity;
  id?: "blue" | "green" | "pink" | "yellow";
  state?: AllyState;
  style?: React.CSSProperties;
}

/**
 * AllyVisual Component (Remotion-Synchronized AnimatedMedia Engine)
 *
 * Architecture & Stability Rules:
 * 1. ZERO DOM Remounting: Both idle and thinking animated media streams remain mounted
 *    in stable internal containers for the lifetime of the composition.
 * 2. Remotion Frame Synchronization: <AnimatedImage /> decodes GIF frames in lockstep
 *    with Remotion's frame clock via WebCodecs, eliminating browser wall-clock drift.
 * 3. Pre-Decoding / Premounting: Because both layers are stably present, upcoming state
 *    transitions decode seamlessly without decoder initialization flashes or blank frames.
 * 4. Structural Isolation: The animated visual container is isolated from outer actor
 *    translation/rotation/cursor dynamics.
 * 5. Strict Box Bounds: Explicit 100% dimensions, fit="contain", centered content, no cropping.
 */
export function AllyVisual({
  identity: identityProp,
  id,
  state = "idle",
  style = {},
}: AllyVisualProps) {
  // Resolve permanent character identity
  const identity: AllyIdentity =
    identityProp ?? (id ? COLOR_TO_IDENTITY_MAP[id] : "rolly");

  const idleAsset = ALLY_IDENTITY_ASSETS[identity].idle;
  const thinkingAsset = ALLY_IDENTITY_ASSETS[identity].thinking;
  const isThinking = state === "thinking";

  return (
    <div
      className="ally-visual-stable-viewport"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        ...style,
      }}
    >
      {/* 1. Stably Mounted Idle Stream */}
      <div
        className="ally-state-layer ally-state-idle"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: isThinking ? 0 : 1,
          visibility: isThinking ? "hidden" : "visible",
          pointerEvents: "none",
        }}
      >

      </div>
      {/* 2. Stably Mounted Thinking Stream */}
      <div
        className="ally-state-layer ally-state-thinking"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: isThinking ? 1 : 0,
          visibility: isThinking ? "visible" : "hidden",
          pointerEvents: "none",
        }}
      >

      </div>
    </div>
  );
}
