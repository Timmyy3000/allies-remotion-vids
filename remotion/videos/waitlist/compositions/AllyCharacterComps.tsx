import React from "react";
import { Composition } from "remotion";

import idleRolly from "../assets/allies_idle/idle_rolly.svg?raw";
import thinkingRolly from "../assets/allies_thinking/thinking_rolly.svg?raw";
import idleRocky from "../assets/allies_idle/idle_rocky.svg?raw";
import thinkingRocky from "../assets/allies_thinking/thinking_rocky.svg?raw";
import idleGhosty from "../assets/allies_idle/idle_ghosty.svg?raw";
import thinkingGhosty from "../assets/allies_thinking/thinking_ghosty.svg?raw";
import idleBoxy from "../assets/allies_idle/idle_boxy.svg?raw";
import thinkingBoxy from "../assets/allies_thinking/thinking_boxy.svg?raw";
import { FrameSyncedSvg } from "../components/FrameSyncedSvg";

export interface SvgFrameProps {
  src: string;
  cycleSeconds?: number;
  scopeId?: string;
}

export function SvgFrameRenderer({
  src,
  cycleSeconds = 4,
  scopeId = "standalone",
}: SvgFrameProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
      }}
    >
      <FrameSyncedSvg
        source={src}
        cycleSeconds={cycleSeconds}
        scopeId={scopeId}
      />
    </div>
  );
}

const RollyIdleComp: React.FC = () => (
  <SvgFrameRenderer src={idleRolly} scopeId="rolly-idle" />
);
const RollyThinkingComp: React.FC = () => (
  <SvgFrameRenderer
    src={thinkingRolly}
    cycleSeconds={4.502083}
    scopeId="rolly-thinking"
  />
);
const RockyIdleComp: React.FC = () => (
  <SvgFrameRenderer src={idleRocky} scopeId="rocky-idle" />
);
const RockyThinkingComp: React.FC = () => (
  <SvgFrameRenderer
    src={thinkingRocky}
    cycleSeconds={4.502083}
    scopeId="rocky-thinking"
  />
);
const GhostyIdleComp: React.FC = () => (
  <SvgFrameRenderer src={idleGhosty} scopeId="ghosty-idle" />
);
const GhostyThinkingComp: React.FC = () => (
  <SvgFrameRenderer
    src={thinkingGhosty}
    cycleSeconds={4.502083}
    scopeId="ghosty-thinking"
  />
);
const BoxyIdleComp: React.FC = () => (
  <SvgFrameRenderer src={idleBoxy} scopeId="boxy-idle" />
);
const BoxyThinkingComp: React.FC = () => (
  <SvgFrameRenderer
    src={thinkingBoxy}
    cycleSeconds={4.502083}
    scopeId="boxy-thinking"
  />
);

export function AllyCharacterCompositions() {
  const compProps = {
    durationInFrames: 240,
    fps: 60,
    width: 405,
    height: 405,
  };

  return (
    <>
      <Composition
        id="Waitlist-GenRollyIdle"
        component={RollyIdleComp}
        {...compProps}
      />
      <Composition
        id="Waitlist-GenRollyThinking"
        component={RollyThinkingComp}
        {...compProps}
      />
      <Composition
        id="Waitlist-GenRockyIdle"
        component={RockyIdleComp}
        {...compProps}
      />
      <Composition
        id="Waitlist-GenRockyThinking"
        component={RockyThinkingComp}
        {...compProps}
      />
      <Composition
        id="Waitlist-GenGhostyIdle"
        component={GhostyIdleComp}
        {...compProps}
      />
      <Composition
        id="Waitlist-GenGhostyThinking"
        component={GhostyThinkingComp}
        {...compProps}
      />
      <Composition
        id="Waitlist-GenBoxyIdle"
        component={BoxyIdleComp}
        {...compProps}
      />
      <Composition
        id="Waitlist-GenBoxyThinking"
        component={BoxyThinkingComp}
        {...compProps}
      />
    </>
  );
}
