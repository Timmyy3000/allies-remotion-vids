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
  ALLY_PATHS,
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

// Camera push zoom out curve (soft start, gentle deceleration into 1.0)
const zoomEase = Easing.bezier(0.22, 1, 0.36, 1);

// Brand Recenter curve: [0.22, 1, 0.36, 1] (confident initial movement, long smooth deceleration to 0)
const brandRecenterEase = Easing.bezier(0.22, 1, 0.36, 1);

// Meet Your exit pull curve: [0.4, 0, 0.6, 1] (gentle start, accelerated pull into logo)
const meetYourExitEase = Easing.bezier(0.4, 0, 0.6, 1);

export function AlliesIntro() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- 1. SLIGHT PUSH ZOOM OUT RIGHT BEFORE ALLIES ENTER ---
  // Starts in intimate 1.15x framing, breathes out to 1.0x master canvas
  const cameraScale = interpolate(
    frame,
    [TIMING.ZOOM_OUT_START, TIMING.ZOOM_OUT_END],
    [1.15, 1.0],
    {
      easing: zoomEase,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // --- 2. BRAND TRANSFORMATION CALCULATIONS ---
  const isTransformStarted = frame >= TIMING.BRAND_TRANSFORM_START;
  const brandEntranceEase = Easing.bezier(0.22, 1, 0.36, 1);

  // Smooth jitter-free "allies" Translation (moves from -logoShiftDistance to 0 during entrance)
  const alliesShiftProgress = isTransformStarted
    ? interpolate(
        frame,
        [TIMING.BRAND_TRANSFORM_START, TIMING.BRAND_TRANSFORM_START + 24],
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
        [TIMING.BRAND_TRANSFORM_START, TIMING.BRAND_TRANSFORM_START + 18],
        [COLORS.headlineText, COLORS.brandOrange],
      )
    : COLORS.headlineText;

  // --- 3. LOGO SMOOTH JITTER-FREE ENTRANCE ---
  const isLogoStarted = frame >= TIMING.LOGO_START;
  const logoProgress = isLogoStarted
    ? interpolate(
        frame,
        [TIMING.LOGO_START, TIMING.LOGO_START + 28],
        [0, 1],
        {
          easing: brandEntranceEase,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        },
      )
    : 0;

  const logoOpacity = isLogoStarted
    ? interpolate(frame, [TIMING.LOGO_START, TIMING.LOGO_START + 8], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const logoScale = interpolate(logoProgress, [0, 1], [0.72, 1.0]);
  const logoY = interpolate(logoProgress, [0, 1], [24, 0]);

  // --- 4. BRAND CONDENSATION / "MEET YOUR" STAGGERED EXIT & RECENTER TRANSITION ---

  // A. Staggered "Meet" and "your" individual exit calculations
  const MEET_EXIT_START = TIMING.MEET_YOUR_EXIT_START;
  const YOUR_EXIT_START = TIMING.MEET_YOUR_EXIT_START + 6;
  const WORD_EXIT_DURATION = 48;

  const meetExitProgress = interpolate(
    frame,
    [MEET_EXIT_START, MEET_EXIT_START + WORD_EXIT_DURATION],
    [0, 1],
    {
      easing: meetYourExitEase,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const meetExitX = interpolate(
    meetExitProgress,
    [0, 1],
    [0, HEADLINE_LAYOUT.meetYourPullDistance * 1.06],
  );

  const meetOpacity = interpolate(
    meetExitProgress,
    [0, 0.72, 0.94, 1.0],
    [1, 0.88, 0.05, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const yourExitProgress = interpolate(
    frame,
    [YOUR_EXIT_START, YOUR_EXIT_START + WORD_EXIT_DURATION],
    [0, 1],
    {
      easing: meetYourExitEase,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const yourExitX = interpolate(
    yourExitProgress,
    [0, 1],
    [0, HEADLINE_LAYOUT.meetYourPullDistance * 0.94],
  );

  const yourOpacity = interpolate(
    yourExitProgress,
    [0, 0.72, 0.94, 1.0],
    [1, 0.88, 0.05, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // B. Brand Group ("[LOGO] allies") Recenter Glide
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

  // --- 5. BRAND LOCKUP CONTINUITY & LOGO INWARD COLLAPSE ---

  // The orange "allies" word is the persistent anchor for the rest of the
  // scene. Only the introductory logo collapses; the word stays crisp and
  // visible while the domain pieces arrive around it.
  const alliesExitProgress = 0;
  const alliesPullX = 0;
  const alliesOverallOpacity = 1;

  // B. Official Logo Inward Collapse (Sharp Graphic Mark Shrinkage)
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

      {/* 4K SCENE WORLD WITH SLIGHT PUSH ZOOM OUT */}
      <div
        className="scene-world"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transform: `scale(${cameraScale.toFixed(4)})`,
          transformOrigin: "center center",
        }}
      >
        {/* CENTRAL LARGE HEADLINE LOCKUP (Fixed Mathematically Centered Master Container) */}
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
            {/* GROUP 1: EXIT GROUP ("Meet your") - Staggered Per-Word Pull & Reverse Focus */}
            {/* ========================================================================= */}
            <div
              className="meet-your-exit-wrapper"
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
                  transform: `translateX(${meetExitX.toFixed(3)}px)`,
                  opacity: meetOpacity,
                  willChange: "transform, opacity",
                }}
              >
                <FocusWord
                  text="Meet"
                  startFrame={TIMING.MEET_FOCUS_START}
                  currentFrame={frame}
                  color={COLORS.headlineText}
                  exitProgress={meetExitProgress}
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
                  transform: `translateX(${yourExitX.toFixed(3)}px)`,
                  opacity: yourOpacity,
                  willChange: "transform, opacity",
                }}
              >
                <FocusWord
                  text="your"
                  startFrame={TIMING.YOUR_FOCUS_START}
                  currentFrame={frame}
                  color={COLORS.headlineText}
                  exitProgress={yourExitProgress}
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
              {/* RESERVED LOGO SLOT (Fixed geometric slot with stable dimensions) */}
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
                {/* LOGO ENTRANCE & ALIGNMENT WRAPPER */}
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

              {/* WORD 3: "allies" (Translates from -logoShiftDistance to 0 during entrance, pulls left on exit) */}
              <div
                style={{
                  height: "100%",
                  display: "inline-flex",
                  alignItems: "center",
                  position: "relative",
                  transform: `translateX(${(alliesX - alliesPullX).toFixed(3)}px)`,
                  opacity: alliesOverallOpacity,
                  transformOrigin: "left center",
                  willChange: "transform, opacity",
                }}
              >
                <FocusWord
                  text="allies"
                  startFrame={TIMING.ALLIES_FOCUS_START}
                  currentFrame={frame}
                  color={alliesColor}
                  exitProgress={alliesExitProgress}
                  wordIndex={2}
                />
              </div>
            </div>
          </div>
        )}

        {frame >= TIMING.LOGO_COLLAPSE_END && <DomainLockup frame={frame} />}

        {/* REUSABLE ALLY ACTORS (PERMANENT IDENTITIES: ROLLY, ROCKY, GHOSTY, BOXY) */}

        {/* 1. Blue Ally (Rolly): Descends smoothly along upper arc */}
        <AllyActor
          identity="rolly"
          config={ALLIES.blue}
          currentFrame={frame}
          size={153}
          pointerSize={110.5}
          clearance={ALLY_ACTORS.clearance}
          entryTiltDeg={-8}
          cargo={<DomainPieceText piece={DOMAIN_DRAG_TARGETS.blue.piece} />}
          cargoWidth={DOMAIN_LAYOUT.pieces.your.width}
          cargoTipPadding={DOMAIN_CARGO_TIP_PADDING}
        />

        {/* 2. Green Ally (Rocky): Rises gracefully along lower-left arc */}
        <AllyActor
          identity="rocky"
          config={ALLIES.green}
          currentFrame={frame}
          size={153}
          pointerSize={110.5}
          clearance={ALLY_ACTORS.clearance}
          entryTiltDeg={8}
          cargo={<DomainPieceText piece={DOMAIN_DRAG_TARGETS.green.piece} />}
          cargoWidth={DOMAIN_LAYOUT.pieces.i.width}
          cargoTipPadding={DOMAIN_CARGO_TIP_PADDING}
        />

        {/* 3. Pink Ally (Ghosty): Sweeps inward along right arc */}
        <AllyActor
          identity="ghosty"
          config={ALLIES.pink}
          currentFrame={frame}
          size={153}
          pointerSize={110.5}
          clearance={ALLY_ACTORS.clearance}
          entryTiltDeg={-10}
          cargo={<DomainPieceText piece={DOMAIN_DRAG_TARGETS.pink.piece} />}
          cargoWidth={DOMAIN_LAYOUT.pieces.dot.width}
          cargoTipPadding={DOMAIN_CARGO_TIP_PADDING}
        />

        {/* 4. Yellow Ally (Boxy): Glides upward along lower-right arc */}
        <AllyActor
          identity="boxy"
          config={ALLIES.yellow}
          currentFrame={frame}
          size={153}
          pointerSize={110.5}
          clearance={ALLY_ACTORS.clearance}
          entryTiltDeg={8}
          cargo={<DomainPieceText piece={DOMAIN_DRAG_TARGETS.yellow.piece} />}
          cargoWidth={DOMAIN_LAYOUT.pieces.o.width}
          cargoTipPadding={DOMAIN_CARGO_TIP_PADDING}
        />

        {/* Optional Visual Motion Path Debugger */}
        {SHOW_MOTION_PATHS && <MotionPathDebug />}

        {/* Optional Development Timeline Overlay */}
        {SHOW_TIMELINE_DEBUG && <TimelineDebugOverlay frame={frame} />}
      </div>
    </AbsoluteFill>
  );
}
