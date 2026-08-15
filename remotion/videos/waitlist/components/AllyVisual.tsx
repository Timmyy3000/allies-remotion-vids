import React from "react";

import {
  ALLY_ASSETS,
  ALLY_IDENTITY_ASSETS,
  AllyAvatar,
  COLOR_TO_IDENTITY_MAP,
  getAllyVisualAsset,
} from "./AllyAvatar";
import { AllyIdentity, AllyState } from "../constants/allyStates";

export {
  ALLY_ASSETS,
  ALLY_IDENTITY_ASSETS,
  COLOR_TO_IDENTITY_MAP,
  getAllyVisualAsset,
};

export interface AllyVisualProps {
  identity?: AllyIdentity;
  id?: "blue" | "green" | "pink" | "yellow";
  state?: AllyState;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}

/**
 * Backward-compatible adapter for callers that still use the old visual name.
 * New waitlist code should use AllyAvatar directly.
 */
export function AllyVisual({
  identity: identityProp,
  id,
  state = "idle",
  color,
  size = 153,
  style,
}: AllyVisualProps) {
  const shape = identityProp ?? (id ? COLOR_TO_IDENTITY_MAP[id] : "rolly");

  return (
    <AllyAvatar
      shape={shape}
      state={state}
      color={color}
      size={size}
      style={style}
    />
  );
}
