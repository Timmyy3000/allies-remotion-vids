import React from "react";
import { Composition } from "remotion";
import { Img, useCurrentFrame, useVideoConfig } from "remotion";

import idleRolly from "../allies_idle/idle_rolly.svg";
import thinkingRolly from "../allies_thinking/thinking_rolly.svg";
import idleRocky from "../allies_idle/idle_rocky.svg";
import thinkingRocky from "../allies_thinking/thinking_rocky.svg";
import idleGhosty from "../allies_idle/idle_ghosty.svg";
import thinkingGhosty from "../allies_thinking/thinking_ghosty.svg";
import idleBoxy from "../allies_idle/idle_boxy.svg";
import thinkingBoxy from "../allies_thinking/thinking_boxy.svg";

export interface SvgFrameProps {
  src: string;
}

export function SvgFrameRenderer({ src }: SvgFrameProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeInSeconds = (frame / fps) % 4.0; // 4 second loop

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
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          animationDelay: `-${timeInSeconds.toFixed(4)}s`,
          animationPlayState: "paused",
        }}
      />
    </div>
  );
}

const RollyIdleComp: React.FC = () => <SvgFrameRenderer src={idleRolly} />;
const RollyThinkingComp: React.FC = () => <SvgFrameRenderer src={thinkingRolly} />;
const RockyIdleComp: React.FC = () => <SvgFrameRenderer src={idleRocky} />;
const RockyThinkingComp: React.FC = () => <SvgFrameRenderer src={thinkingRocky} />;
const GhostyIdleComp: React.FC = () => <SvgFrameRenderer src={idleGhosty} />;
const GhostyThinkingComp: React.FC = () => <SvgFrameRenderer src={thinkingGhosty} />;
const BoxyIdleComp: React.FC = () => <SvgFrameRenderer src={idleBoxy} />;
const BoxyThinkingComp: React.FC = () => <SvgFrameRenderer src={thinkingBoxy} />;

export function AllyCharacterCompositions() {
  const compProps = {
    durationInFrames: 240,
    fps: 60,
    width: 405,
    height: 405,
  };

  return (
    <>
      <Composition id="GenRollyIdle" component={RollyIdleComp} {...compProps} />
      <Composition id="GenRollyThinking" component={RollyThinkingComp} {...compProps} />
      <Composition id="GenRockyIdle" component={RockyIdleComp} {...compProps} />
      <Composition id="GenRockyThinking" component={RockyThinkingComp} {...compProps} />
      <Composition id="GenGhostyIdle" component={GhostyIdleComp} {...compProps} />
      <Composition id="GenGhostyThinking" component={GhostyThinkingComp} {...compProps} />
      <Composition id="GenBoxyIdle" component={BoxyIdleComp} {...compProps} />
      <Composition id="GenBoxyThinking" component={BoxyThinkingComp} {...compProps} />
    </>
  );
}
