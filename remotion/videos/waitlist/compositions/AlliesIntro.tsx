import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../constants/colors";
import { TIMING } from "../constants/timing";
import {
  ALLY_ACTORS,
  DOMAIN_CARGO_TIP_PADDING,
  DOMAIN_DRAG_TARGETS,
  DOMAIN_LAYOUT,
  HEADLINE_LAYOUT,
  TYPOGRAPHY,
} from "../constants/layout";
import {
  ALLIES,
  SHOW_MOTION_PATHS,
  SHOW_TIMELINE_DEBUG,
} from "../constants/allyPaths";
import { FocusWord } from "../components/FocusWord";
import { AlliesLogo } from "../components/AlliesLogo";
import { AllyActor } from "../components/AllyActor";
import { DomainLockup, DomainPieceText } from "../components/DomainLockup";
import { MotionPathDebug } from "../components/MotionPathDebug";
import { TimelineDebugOverlay } from "../components/TimelineDebugOverlay";
import { FONT_STYLE } from "../styles/font";
import { getCameraState } from "../motion/cameraSystem";
import { getTextBoopReaction } from "../motion/allyBehavior";

// Exact exit curve from more-motion: [0.22, 1, 0.36, 1]
const meetYourExitEase = Easing.bezier(0.22, 1, 0.36, 1);
const brandRecenterEase = Easing.bezier(0.22, 1, 0.36, 1);

export function AlliesIntro() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- 1. UNIFIED DETERMINISTIC CAMERA SYSTEM ---
  const camera = getCameraState(frame);

  // --- 2. BRAND TRANSFORMATION & LOGO SPRING ENTRANCE (Exact more-motion port) ---
  const isTransformStarted = frame >= TIMING.BRAND_TRANSFORM_START;

  // "allies" Translation Spring (moves from -logoShiftDistance to 0 during entrance)
  const alliesShiftSpring = isTransformStarted
    ? spring({
        frame: frame - TIMING.BRAND_TRANSFORM_START,
        fps,
        config: {
          damping: 20,
          stiffness: 200,
          mass: 0.8,
        },
      })
    : 0;

  const alliesX = interpolate(
    alliesShiftSpring,
    [0, 1],
    [-HEADLINE_LAYOUT.logoShiftDistance, 0],
  );

  // "allies" Color Transition (#121212 -> #FF5800)
  const alliesColor = isTransformStarted
    ? interpolateColors(
        frame,
        [TIMING.BRAND_TRANSFORM_START, TIMING.BRAND_TRANSFORM_START + 18],
        [COLORS.headlineText, COLORS.brandOrange],
      )
    : COLORS.headlineText;

  // Official Allies SVG Logo Spring Entrance (No Blue involvement)
  const isLogoStarted = frame >= TIMING.LOGO_START;
  const logoFrameOffset = Math.max(0, frame - TIMING.LOGO_START);
  const logoSpring = isLogoStarted
    ? spring({
        frame: logoFrameOffset,
        fps,
        config: {
          damping: 17,
          stiffness: 220,
          mass: 0.8,
        },
      })
    : 0;

  const logoOpacity = isLogoStarted
    ? interpolate(logoFrameOffset, [0, 8], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const logoScale = isLogoStarted
    ? interpolate(logoSpring, [0, 1], [0.72, 1])
    : 0.72;

  const logoY = isLogoStarted
    ? interpolate(logoSpring, [0, 1], [30.93, 0])
    : 30.93;

  // --- 3. BRAND CONDENSATION / "MEET YOUR" EXIT & RECENTER TRANSITION (Exact more-motion port) ---

  // A. "Meet your" Reverse Focus Exit Progress & Pull Translation
  const meetYourExitProgress = interpolate(
    frame,
    [TIMING.MEET_YOUR_EXIT_START, TIMING.MEET_YOUR_EXIT_END],
    [0, 1],
    {
      easing: meetYourExitEase,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const meetYourExitX = interpolate(
    meetYourExitProgress,
    [0, 1],
    [0, HEADLINE_LAYOUT.meetYourPullDistance],
  );

  const meetYourOverallOpacity = interpolate(
    meetYourExitProgress,
    [0, 0.72, 0.94, 1.0],
    [1, 0.88, 0.05, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // B. Brand Group ("[LOGO] allies") Recenter Glide (begins at f328 while Meet your dissolves)
  const brandRecenterProgress = interpolate(
    frame,
    [TIMING.BRAND_RECENTER_START, TIMING.BRAND_RECENTER_END],
    [0, 1],
    {
      easing: brandRecenterEase,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const brandRecenterX = interpolate(
    brandRecenterProgress,
    [0, 1],
    [0, HEADLINE_LAYOUT.brandShiftDistance],
  );

  // --- 4. LOGO INWARD COLLAPSE (Leaves 'allies' standing for domain puzzle) ---
  const isLogoCollapseStarted = frame >= TIMING.LOGO_COLLAPSE_START;
  const logoCollapseProgress = isLogoCollapseStarted
    ? interpolate(
        frame,
        [TIMING.LOGO_COLLAPSE_START, TIMING.LOGO_COLLAPSE_END],
        [0, 1],
        {
          easing: Easing.bezier(0.32, 0, 0.67, 0),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        },
      )
    : 0;

  const logoCollapseScale = interpolate(
    logoCollapseProgress,
    [0, 0.4, 0.75, 1.0],
    [1.0, 0.92, 0.75, 0.0],
  );

  const logoCollapseOpacity = interpolate(
    logoCollapseProgress,
    [0, 0.65, 0.92, 1.0],
    [1.0, 1.0, 0.2, 0.0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const finalLogoScale = logoScale * logoCollapseScale;
  const finalLogoOpacity = logoOpacity * logoCollapseOpacity;
  const isLogoVisible = isLogoStarted && frame < TIMING.LOGO_COLLAPSE_END;
  const isBrandGroupVisible = frame < TIMING.LOGO_COLLAPSE_END;

  // --- 5. PHYSICAL 'allies' TEXT REACTION (WHEN BOOPED BY PINK) ---
  const textBoop = getTextBoopReaction(frame);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        overflow: "hidden",
        fontFamily: TYPOGRAPHY.fontFamily,
      }}
    >
      {/* Self-contained OpenRunde & SF Pro Rounded Fonts */}
      <style>{FONT_STYLE}</style>

      {/* 4K SCENE WORLD WITH UNIFIED DETERMINISTIC CAMERA SYSTEM */}
      <div
        className="scene-world"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transform: `translate(${camera.x.toFixed(3)}px, ${camera.y.toFixed(
            3,
          )}px) scale(${camera.scale.toFixed(4)})`,
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        {/* CENTRAL LARGE HEADLINE LOCKUP */}
        {isBrandGroupVisible && (
          <div
            className="headline-lockup-container"
            style={{
              position: "absolute",
              left: HEADLINE_LAYOUT.centerX,
              top: HEADLINE_LAYOUT.centerY,
              transform: "translate(-50%, -50%)",
              display: "inline-flex",
              alignItems: "center",
              whiteSpace: "nowrap",
              flexWrap: "nowrap",
              height: HEADLINE_LAYOUT.rowHeight,
              fontFamily: TYPOGRAPHY.fontFamily,
              fontSize: TYPOGRAPHY.fontSize,
              fontWeight: TYPOGRAPHY.fontWeight,
              letterSpacing: `${TYPOGRAPHY.letterSpacing}px`,
              lineHeight: TYPOGRAPHY.lineHeight,
              color: COLORS.headlineText,
              userSelect: "none",
              opacity: frame < TIMING.TEXT_GENERATION_START ? 0 : 1,
            }}
          >
            {/* ========================================================================= */}
            {/* GROUP 1: EXIT GROUP ("Meet your" - Dissolves toward logo with reverse focus) */}
            {/* ========================================================================= */}
            <div
              className="meet-your-exit-wrapper"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: "100%",
                transform: `translateX(${meetYourExitX.toFixed(3)}px)`,
                opacity: meetYourOverallOpacity,
                pointerEvents: "none",
                willChange: "transform, opacity",
              }}
            >
              {/* WORD 1: "Meet" */}
              <div
                style={{
                  height: "100%",
                  display: "inline-flex",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <FocusWord
                  text="Meet"
                  startFrame={TIMING.MEET_FOCUS_START}
                  currentFrame={frame}
                  color={COLORS.headlineText}
                  exitProgress={meetYourExitProgress}
                  wordIndex={0}
                />
              </div>

              {/* Spacing between "Meet" and "your" */}
              <span
                style={{
                  display: "inline-block",
                  width: HEADLINE_LAYOUT.wordGap,
                  userSelect: "none",
                }}
              >
                &nbsp;
              </span>

              {/* WORD 2: "your" */}
              <div
                style={{
                  height: "100%",
                  display: "inline-flex",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <FocusWord
                  text="your"
                  startFrame={TIMING.YOUR_FOCUS_START}
                  currentFrame={frame}
                  color={COLORS.headlineText}
                  exitProgress={meetYourExitProgress}
                  wordIndex={1}
                />
              </div>
            </div>

            {/* Spacing between "your" and Brand Group */}
            <span
              style={{
                display: "inline-block",
                width: HEADLINE_LAYOUT.wordGap,
                userSelect: "none",
                opacity: meetYourOverallOpacity,
              }}
            >
              &nbsp;
            </span>

            {/* ========================================================================= */}
            {/* GROUP 2: BRAND GROUP ("[LOGO] allies") - Glides smoothly into exact center */}
            {/* ========================================================================= */}
            <div
              className="brand-recenter-wrapper"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: "100%",
                transform: `translateX(${brandRecenterX.toFixed(3)}px)`,
                willChange: "transform",
              }}
            >
              {/* RESERVED LOGO SLOT (Strict Width Reservation to eliminate any layout reflow) */}
              <div
                className="logo-slot"
                style={{
                  width: HEADLINE_LAYOUT.logoShiftDistance,
                  height: HEADLINE_LAYOUT.rowHeight,
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: HEADLINE_LAYOUT.logoWidth,
                    height: HEADLINE_LAYOUT.logoHeight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                  }}
                >
                  {isLogoVisible && (
                    <div
                      style={{
                        opacity: finalLogoOpacity,
                        transform: `translate(0px, ${logoY.toFixed(
                          3,
                        )}px) scale(${finalLogoScale.toFixed(4)})`,
                        transformOrigin: "center center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        willChange: "transform, opacity",
                      }}
                    >
                      <AlliesLogo
                        width={HEADLINE_LAYOUT.logoWidth}
                        height={HEADLINE_LAYOUT.logoHeight}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* WORD 3: "allies" WITH PHYSICAL TEXT REACTION WRAPPER & FOCUSWORD GATING */}
              <div
                className="physical-allies-wrapper"
                style={{
                  height: "100%",
                  display: "inline-flex",
                  alignItems: "center",
                  position: "relative",
                  transform: `translate3d(${(alliesX + textBoop.x).toFixed(
                    3,
                  )}px, ${textBoop.y.toFixed(3)}px, 0px) rotate(${textBoop.rotDeg.toFixed(
                    2,
                  )}deg) scale(${textBoop.scaleX.toFixed(
                    4,
                  )}, ${textBoop.scaleY.toFixed(4)})`,
                  transformOrigin: "center center",
                  willChange: "transform",
                }}
              >
                <FocusWord
                  text="allies"
                  startFrame={TIMING.ALLIES_FOCUS_START}
                  currentFrame={frame}
                  color={alliesColor}
                  exitProgress={0}
                  wordIndex={2}
                />
              </div>
            </div>
          </div>
        )}

        {/* DOMAIN LOCKUP & PUZZLE COMPLETION (From f580 onwards) */}
        {frame >= TIMING.LOGO_COLLAPSE_END && <DomainLockup frame={frame} />}

        {/* ========================================================================= */}
        {/* REUSABLE ALLY ACTORS (PERMANENT IDENTITIES: ROLLY, ROCKY, GHOSTY, BOXY) */}
        {/* ========================================================================= */}

        {/* 1. Blue Ally (Rolly): Enters, jiggles during inspection, fetches 'your', races, swirls, departs */}
        <AllyActor
          identity="rolly"
          config={ALLIES.blue}
          currentFrame={frame}
          size={153}
          pointerSize={110.5}
          clearance={ALLY_ACTORS.clearance}
          entryTiltDeg={-8}
          cargoMap={{
            "domain-drag": {
              node: <DomainPieceText piece={DOMAIN_DRAG_TARGETS.blue.piece} />,
              width: DOMAIN_LAYOUT.pieces.your.width,
              tipPadding: DOMAIN_CARGO_TIP_PADDING,
            },
          }}
        />

        {/* 2. Green Ally (Rocky): Enters, 360-turn during inspection, fetches 'i', near-miss, snuggles Yellow, departs */}
        <AllyActor
          identity="rocky"
          config={ALLIES.green}
          currentFrame={frame}
          size={153}
          pointerSize={110.5}
          clearance={ALLY_ACTORS.clearance}
          entryTiltDeg={8}
          cargoMap={{
            "domain-drag": {
              node: <DomainPieceText piece={DOMAIN_DRAG_TARGETS.green.piece} />,
              width: DOMAIN_LAYOUT.pieces.i.width,
              tipPadding: DOMAIN_CARGO_TIP_PADDING,
            },
          }}
        />

        {/* 3. Pink Ally (Ghosty): Enters, boops 'allies' & recoils to new anchor, fetches '.', chases Blue, swirls, departs */}
        <AllyActor
          identity="ghosty"
          config={ALLIES.pink}
          currentFrame={frame}
          size={153}
          pointerSize={110.5}
          clearance={ALLY_ACTORS.clearance}
          entryTiltDeg={-10}
          cargoMap={{
            "domain-drag": {
              node: <DomainPieceText piece={DOMAIN_DRAG_TARGETS.pink.piece} />,
              width: DOMAIN_LAYOUT.pieces.dot.width,
              tipPadding: DOMAIN_CARGO_TIP_PADDING,
            },
          }}
        />

        {/* 4. Yellow Ally (Boxy): Enters, double-hops, fetches 'o', near-miss, snuggles Green, departs */}
        <AllyActor
          identity="boxy"
          config={ALLIES.yellow}
          currentFrame={frame}
          size={153}
          pointerSize={110.5}
          clearance={ALLY_ACTORS.clearance}
          entryTiltDeg={8}
          cargoMap={{
            "domain-drag": {
              node: <DomainPieceText piece={DOMAIN_DRAG_TARGETS.yellow.piece} />,
              width: DOMAIN_LAYOUT.pieces.o.width,
              tipPadding: DOMAIN_CARGO_TIP_PADDING,
            },
          }}
        />

        {/* Optional Visual Motion Path Debugger */}
        {SHOW_MOTION_PATHS && <MotionPathDebug />}

        {/* Optional Development Timeline Overlay */}
        {SHOW_TIMELINE_DEBUG && <TimelineDebugOverlay frame={frame} />}
      </div>
    </AbsoluteFill>
  );
}
