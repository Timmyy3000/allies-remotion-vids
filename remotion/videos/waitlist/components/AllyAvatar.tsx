import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

import idleBoxy from "../assets/ally/idle/idle_boxy.svg?raw";
import idleGhosty from "../assets/ally/idle/idle_ghosty.svg?raw";
import idleRocky from "../assets/ally/idle/idle_rocky.svg?raw";
import idleRolly from "../assets/ally/idle/idle_rolly.svg?raw";
import thinkingBoxy from "../assets/ally/thinking/thinking_boxy.svg?raw";
import thinkingGhosty from "../assets/ally/thinking/thinking_ghosty.svg?raw";
import thinkingRocky from "../assets/ally/thinking/thinking_rocky.svg?raw";
import thinkingRolly from "../assets/ally/thinking/thinking_rolly.svg?raw";

import { AllyOrb } from "./AllyOrb";
import { AllyIdentity, AllyState } from "../constants/allyStates";
import { FrameSyncedSvg } from "./FrameSyncedSvg";

export const ALLY_SHAPES = ["boxy", "ghosty", "rocky", "rolly"] as const;

export const DEFAULT_ALLY_COLOR = "#FF5800";

/**
 * Keep the authored idle/thinking SVG animation from the web avatar. The
 * wrapper motion below remains frame-driven so the shell still participates
 * in the Remotion timeline.
 */
export const ALLY_IDENTITY_ASSETS: Record<
  AllyIdentity,
  Record<AllyState, string>
> = {
  rolly: { idle: idleRolly, thinking: thinkingRolly },
  boxy: { idle: idleBoxy, thinking: thinkingBoxy },
  ghosty: { idle: idleGhosty, thinking: thinkingGhosty },
  rocky: { idle: idleRocky, thinking: thinkingRocky },
} as const;

const ARTWORK_LAYOUT: Record<
  AllyIdentity,
  { height: `${number}%`; width: `${number}%` }
> = {
  boxy: { width: "72%", height: "72%" },
  ghosty: { width: "72%", height: "76%" },
  rocky: { width: "82%", height: "74%" },
  rolly: { width: "76%", height: "76%" },
};

const ANIMATION_CYCLE_SECONDS: Record<AllyState, number> = {
  idle: 4,
  thinking: 4.502083,
};

const HEX_COLOR = /^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i;

export function normalizeAllyShape(value: unknown): AllyIdentity | null {
  return typeof value === "string" &&
    (ALLY_SHAPES as readonly string[]).includes(value)
    ? (value as AllyIdentity)
    : null;
}

export function normalizeAllyColor(value: unknown): string {
  if (typeof value !== "string") return DEFAULT_ALLY_COLOR;
  const color = value.trim();
  return HEX_COLOR.test(color) ? color : DEFAULT_ALLY_COLOR;
}

export function getAllyVisualAsset(
  identity: AllyIdentity,
  state: AllyState = "idle",
): string {
  return ALLY_IDENTITY_ASSETS[identity][state];
}

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

export interface AllyAvatarProps {
  shape: AllyIdentity;
  state?: AllyState;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}

function getAvatarMotion(frame: number, fps: number) {
  // Keep the wrapper on one continuous phase. The authored SVG can switch
  // between idle and thinking assets without making the whole avatar jump.
  const cycleFrames = 4 * fps;
  const phase = (frame % cycleFrames) / cycleFrames;
  const wave = Math.sin(phase * Math.PI * 2);
  const secondaryWave = Math.sin(phase * Math.PI * 4 + Math.PI / 3);

  return {
    x: secondaryWave * 1.2,
    y: wave * 1.7,
    rotation: secondaryWave * 1.1,
    scale: interpolate(wave, [-1, 1], [0.985, 1.015], {
      easing: Easing.inOut(Easing.ease),
    }),
  };
}

export function AllyAvatar({
  shape,
  state = "idle",
  color,
  size = 153,
  style = {},
}: AllyAvatarProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const motion = getAvatarMotion(frame, fps);
  const artworkLayout = ARTWORK_LAYOUT[shape];

  return (
    <AllyOrb
      color={normalizeAllyColor(color)}
      size={size}
      innerContentPaddingRatio={0}
      style={style}
    >
      <div
        data-ally-avatar
        data-ally-shape={shape}
        data-ally-state={state}
        style={{
          width: artworkLayout.width,
          height: artworkLayout.height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transform: `translate3d(${motion.x.toFixed(3)}px, ${motion.y.toFixed(
            3,
          )}px, 0) rotate(${motion.rotation.toFixed(3)}deg) scale(${motion.scale.toFixed(
            4,
          )})`,
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        <FrameSyncedSvg
          source={getAllyVisualAsset(shape, state)}
          cycleSeconds={ANIMATION_CYCLE_SECONDS[state]}
          scopeId={`ally-${shape}-${state}`}
          style={{
            width: "100%",
            height: "100%",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      </div>
    </AllyOrb>
  );
}
