import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  useCurrentFrame,
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

// Brand Recenter curve: [0.22, 1, 0.36, 1] (confident initial movement, long smooth deceleration to 0)
const brandRecenterEase = Easing.bezier(0.22, 1, 0.36, 1);
const brandEntranceEase = Easing.bezier(0.22, 1, 0.36, 1);

export function AlliesIntro() {
  const frame = useCurrentFrame();

  // --- 1. UNIFIED DETERMINISTIC CAMERA SYSTEM ---
  const camera = getCameraState(frame);

  // --- 2. BRAND TRANSFORMATION CALCULATIONS ---
  const isTransformStarted = frame >= TIMING.BRAND_TRANSFORM_START;

  // Smooth jitter-free "allies" Translation (moves from -logoShiftDistance to 0 during entrance)
  const alliesShiftProgress = isTransformStarted
    ? interpolate(
        frame,
        [TIMING.BRAND_TRANSFORM_START, TIMING.BRAND_TRANSFORM_START + TIMING.BRAND_TRANSFORM_DURATION],
        [0, 1],
        {
          easing: brandEntranceEase,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        },
      )
    : 0;

  const alliesX = interpolate(
    alliesShiftProgress,
    [0, 1],
    [-HEADLINE_LAYOUT.logoShiftDistance, 0],
  );

  // "allies" Color Transition (#121212 -> #FF5800)
  const alliesColor = isTransformStarted
    ? interpolateColors(
        frame,
        [TIMING.BRAND_TRANSFORM_START, TIMING.BRAND_TRANSFORM_START + 20],
        [COLORS.headlineText, COLORS.brandOrange],
      )
    : COLORS.headlineText;

  // --- 3. LOGO DOCKING & SETTLE IN SLOT ---
  // Logo is placed in slot by Blue at LOGO_DOCK_START, settles smoothly with 0.97 -> 1.0 compression
  const isLogoDocked = frame >= TIMING.LOGO_DOCK_START;
  const logoDockProgress = isLogoDocked
    ? interpolate(
        frame,
        [TIMING.LOGO_DOCK_START, TIMING.LOGO_DOCK_SETTLE],
        [0, 1],
        {
          easing: brandEntranceEase,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        },
      )
    : 0;

  const logoScale = isLogoDocked
    ? interpolate(logoDockProgress, [0, 0.35, 1], [0.97, 1.02, 1.0])
    : 0;

  const logoOpacity = isLogoDocked ? 1 : 0;

  // Brand Group ("[LOGO] allies") Recenter Glide as Green and Yellow carry words away
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

  // --- 4. LOGO INWARD COLLAPSE (Leaves 'allies' standing) ---
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
  const isBrandGroupVisible = frame < TIMING.LOGO_COLLAPSE_END;

  // --- 5. PHYSICAL 'allies' TEXT REACTION (WHEN BOOPED BY PINK) ---
  const textBoop = getTextBoopReaction(frame);

  // Words remain rendered in the headline lockup until physically picked up by Green and Yellow
  const isMeetInHeadline = frame < TIMING.GREEN_MEET_PICKUP_START;
  const isYourInHeadline = frame < TIMING.YELLOW_YOUR_PICKUP_START;

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
            }}
          >
            {/* ========================================================================= */}
            {/* GROUP 1: INITIAL WORDS ("Meet your") */}
            {/* ========================================================================= */}
            <div
              className="meet-your-wrapper"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: "100%",
                pointerEvents: "none",
              }}
            >
              {/* WORD 1: "Meet" */}
              <div
                style={{
                  height: "100%",
                  display: "inline-flex",
                  alignItems: "center",
                  position: "relative",
                  visibility: isMeetInHeadline ? "visible" : "hidden",
                }}
              >
                <FocusWord
                  text="Meet"
                  startFrame={TIMING.MEET_FOCUS_START}
                  currentFrame={frame}
                  color={COLORS.headlineText}
                  exitProgress={0}
                  wordIndex={0}
                />
              </div>

              {/* Spacing between "Meet" and "your" */}
              <span
                style={{
                  display: "inline-block",
                  width: HEADLINE_LAYOUT.wordGap,
                  userSelect: "none",
                  visibility: isMeetInHeadline && isYourInHeadline ? "visible" : "hidden",
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
                  visibility: isYourInHeadline ? "visible" : "hidden",
                }}
              >
                <FocusWord
                  text="your"
                  startFrame={TIMING.YOUR_FOCUS_START}
                  currentFrame={frame}
                  color={COLORS.headlineText}
                  exitProgress={0}
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
                visibility: isYourInHeadline ? "visible" : "hidden",
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
              {/* RESERVED LOGO SLOT */}
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
                {/* LOGO DOCKED ALIGNMENT WRAPPER */}
                {isLogoDocked && (
                  <div
                    style={{
                      width: HEADLINE_LAYOUT.logoWidth,
                      height: HEADLINE_LAYOUT.logoHeight,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      pointerEvents: "none",
                      opacity: finalLogoOpacity,
                      transform: `scale(${finalLogoScale.toFixed(4)})`,
                      transformOrigin: "center center",
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

              {/* WORD 3: "allies" WITH PHYSICAL TEXT REACTION WRAPPER */}
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
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    height: "100%",
                    lineHeight: 1,
                    color: alliesColor,
                    userSelect: "none",
                  }}
                >
                  allies
                </span>
              </div>
            </div>
          </div>
        )}

        {/* DOMAIN LOCKUP & PUZZLE COMPLETION (From f680 onwards) */}
        {frame >= TIMING.LOGO_COLLAPSE_END && <DomainLockup frame={frame} />}

        {/* ========================================================================= */}
        {/* REUSABLE ALLY ACTORS (PERMANENT IDENTITIES: ROLLY, ROCKY, GHOSTY, BOXY) */}
        {/* ========================================================================= */}

        {/* 1. Blue Ally (Rolly): Guides logo in, races, swirls, fetches 'your', threads gap, departs */}
        <AllyActor
          identity="rolly"
          config={ALLIES.blue}
          currentFrame={frame}
          size={153}
          pointerSize={110.5}
          clearance={ALLY_ACTORS.clearance}
          entryTiltDeg={-8}
          cargoMap={{
            "logo-entrance": {
              node: (
                <div style={{ transform: "scale(1.0)", transformOrigin: "center center" }}>
                  <AlliesLogo width={HEADLINE_LAYOUT.logoWidth} height={HEADLINE_LAYOUT.logoHeight} />
                </div>
              ),
              width: HEADLINE_LAYOUT.logoWidth,
              tipPadding: 16,
            },
            "domain-drag": {
              node: <DomainPieceText piece={DOMAIN_DRAG_TARGETS.blue.piece} />,
              width: DOMAIN_LAYOUT.pieces.your.width,
              tipPadding: DOMAIN_CARGO_TIP_PADDING,
            },
          }}
        />

        {/* 2. Green Ally (Rocky): Enters, carries 'Meet' offscreen, returns, fetches 'i', snuggles Yellow, lingers & departs */}
        <AllyActor
          identity="rocky"
          config={ALLIES.green}
          currentFrame={frame}
          size={153}
          pointerSize={110.5}
          clearance={ALLY_ACTORS.clearance}
          entryTiltDeg={8}
          cargoMap={{
            "meet-carry": {
              node: (
                <span
                  style={{
                    fontFamily: TYPOGRAPHY.fontFamily,
                    fontSize: TYPOGRAPHY.fontSize,
                    fontWeight: TYPOGRAPHY.fontWeight,
                    letterSpacing: `${TYPOGRAPHY.letterSpacing}px`,
                    color: COLORS.headlineText,
                    userSelect: "none",
                  }}
                >
                  Meet
                </span>
              ),
              width: HEADLINE_LAYOUT.meetWidth,
              tipPadding: 20,
            },
            "domain-drag": {
              node: <DomainPieceText piece={DOMAIN_DRAG_TARGETS.green.piece} />,
              width: DOMAIN_LAYOUT.pieces.i.width,
              tipPadding: DOMAIN_CARGO_TIP_PADDING,
            },
          }}
        />

        {/* 3. Pink Ally (Ghosty): Enters, boops 'allies', chases Blue, swirls, fetches '.', peeks behind Blue, follows Yellow, departs */}
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

        {/* 4. Yellow Ally (Boxy): Double-hop, carries 'your' offscreen, returns, fetches 'o', snuggles Green, leads follow-and-peel, departs */}
        <AllyActor
          identity="boxy"
          config={ALLIES.yellow}
          currentFrame={frame}
          size={153}
          pointerSize={110.5}
          clearance={ALLY_ACTORS.clearance}
          entryTiltDeg={8}
          cargoMap={{
            "your-carry": {
              node: (
                <span
                  style={{
                    fontFamily: TYPOGRAPHY.fontFamily,
                    fontSize: TYPOGRAPHY.fontSize,
                    fontWeight: TYPOGRAPHY.fontWeight,
                    letterSpacing: `${TYPOGRAPHY.letterSpacing}px`,
                    color: COLORS.headlineText,
                    userSelect: "none",
                  }}
                >
                  your
                </span>
              ),
              width: HEADLINE_LAYOUT.yourWidth,
              tipPadding: 20,
            },
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
