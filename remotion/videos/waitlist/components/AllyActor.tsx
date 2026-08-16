import React from "react";
import { PointerAccessory } from "./PointerAccessory";
import { useBezierTravel } from "../motion/useBezierTravel";
import { AllyMotionConfig, SHOW_CURSOR_GEOMETRY } from "../constants/allyPaths";
import { CursorGeometryDebug } from "./CursorGeometryDebug";
import { AllyAvatar } from "./AllyAvatar";
import {
  AllyIdentity,
  AllyState,
  getAllyVisualState,
} from "../constants/allyStates";
import { getAllyPlayfulOffset } from "../motion/allyBehavior";

export interface AllyActorProps {
  config: AllyMotionConfig;
  currentFrame: number;
  identity?: AllyIdentity; // Permanent character identity (rolly | boxy | ghosty | rocky)
  color?: string;
  size?: number;
  pointerSize?: number;
  clearance?: number;
  entryTiltDeg?: number; // Subtle character personality body tilt (settles to 0 upon arrival)
  state?: AllyState; // Visual state override; defaults to deterministic schedule
  children?: React.ReactNode; // Optional child override; defaults to AllyAvatar
  cargo?: React.ReactNode;
  cargoSegmentId?: string;
  cargoWidth?: number;
  cargoTipPadding?: number;
}

/**
 * Reusable Ally Actor (State & Motion Engine V3)
 *
 * Geometric & State Rules:
 * - Rule 1: Permanent character identity (Rocky, Rolly, Ghosty, Boxy) NEVER changes.
 * - Rule 2: State changes ("idle" <-> "thinking") resolve strictly within that character's asset family.
 * - Rule 3: State changes NEVER affect orb size, center coordinates, or cursor orbit clearance.
 * - Rule 4: Cursor orbital position = ALWAYS on the forward / direction-of-travel side of the ally.
 * - Rule 5: Cursor rotation = ALWAYS points in the current direction of visible ally movement.
 * - Rule 6: Fixed visual clearance (default 35px) between circular ally orb boundary and cursor rear edge.
 * - Styling: ZERO drop shadows, ZERO glow, 100% clean flat vector graphics.
 */
export function AllyActor({
  config,
  currentFrame,
  identity: identityProp,
  color: colorProp,
  size = 153,
  pointerSize = 110.5,
  clearance = 35.0,
  entryTiltDeg = 0,
  state: stateProp,
  children,
  cargo,
  cargoSegmentId = "domain-drag",
  cargoWidth,
  cargoTipPadding = 18,
}: AllyActorProps) {
  // 1. Permanent Character Identity & Color Resolution
  const identity: AllyIdentity = identityProp ?? config.identity;
  const activeColor = colorProp ?? config.color;

  // Pre-anticipation guard: 100% absence from DOM before anticipation window begins
  const firstStartFrame = config.segments?.[0]?.startFrame ?? config.startFrame;
  if (currentFrame < firstStartFrame - 8) {
    return null;
  }

  // 2. Deterministic Visual State Resolution ("idle" | "thinking") for this specific identity
  const activeState: AllyState =
    stateProp ?? getAllyVisualState(identity, currentFrame);

  // 3. Frame-driven Bézier travel with Target+Follower lag & dynamic cursor orbit calculations
  const travel = useBezierTravel({
    path: config.svgPath,
    segments: config.segments,
    frame: currentFrame,
    startFrame: config.startFrame,
    durationInFrames: config.durationFrames,
    identity,
    timingEase: config.timingEase,
    responsiveness: config.responsiveness,
    organicDeviation: config.organicDeviation,
    orbSize: size,
    pointerSize,
    clearance,
    idle: config.idle,
  });

  // 4. Character personality tilt & dynamic banking lean into turns
  const turnDiff = travel.targetDirectionDeg - travel.directionDeg;
  const wrappedTurnDiff = ((turnDiff + 540) % 360) - 180;
  const bankingTilt = travel.isTraveling
    ? Math.max(-16, Math.min(16, wrappedTurnDiff * 0.22)) *
      Math.min(1, travel.velocity / 3)
    : 0;
  const characterTilt = entryTiltDeg * (1 - travel.progress) + bankingTilt;

  // 5. Ambient Idle Floating & Spontaneous Playful Actions
  const playful = getAllyPlayfulOffset(identity, currentFrame, travel.x, travel.y);

  const idle = config.idle;
  const t = (currentFrame / idle.periodFrames) * 2 * Math.PI + idle.phase;
  const rawFloatY =
    Math.sin(t) * ((idle.yRange[1] - idle.yRange[0]) / 2) +
    Math.sin(t * 2.15 + 0.4) * 4.5;
  const rawFloatX =
    Math.cos(t * 1.15) * ((idle.xRange[1] - idle.xRange[0]) / 2) +
    Math.sin(t * 0.65 + 1.2) * 3.5;
  const rawFloatRot =
    Math.sin(t * 0.95) * ((idle.rotRange[1] - idle.rotRange[0]) / 2) +
    Math.cos(t * 1.8 + 0.9) * 0.8;

  // Smoothly blend idle floating & playful offset into total translation
  const floatX = rawFloatX * travel.idleWeight + playful.x;
  const floatY = rawFloatY * travel.idleWeight + playful.y;
  const floatRot = rawFloatRot * travel.idleWeight + playful.rotDeg;
  const totalSquashX = travel.blobSquashX * playful.squashX;
  const totalSquashY = travel.blobSquashY * playful.squashY;
  const cursorX = travel.cursorX;
  const cursorY = travel.cursorY;
  const cargoAngleRad = (travel.directionDeg * Math.PI) / 180;
  const cargoLeadDistance =
    cargoWidth == null ? 0 : pointerSize / 2 + cargoTipPadding + cargoWidth / 2;
  const cargoX = cursorX + Math.cos(cargoAngleRad) * cargoLeadDistance;
  const cargoY = cursorY + Math.sin(cargoAngleRad) * cargoLeadDistance;

  // 6. Handle optional playful cursor override (such as Pink's character-driven sweep)
  const isCursorOverridden = playful.cursorOverride?.active;
  const activeCursorOpacity = isCursorOverridden ? 1 : travel.cursorOpacity;
  const activeCursorScale = isCursorOverridden ? 1 : travel.cursorScale;
  const activePointerRotation = isCursorOverridden
    ? playful.cursorOverride!.angleDeg
    : travel.directionDeg;

  // Calculate overridden cursor position on the orbital track if overridden
  let activeCursorX = travel.cursorX;
  let activeCursorY = travel.cursorY;
  if (isCursorOverridden) {
    const rad = (activePointerRotation * Math.PI) / 180;
    activeCursorX = Math.cos(rad) * travel.cursorOrbitRadius;
    activeCursorY = Math.sin(rad) * travel.cursorOrbitRadius;
  }

  return (
    // Layer 1: Hardware-Accelerated Travel Transform (Subpixel Precision)
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translate3d(${travel.x.toFixed(3)}px, ${travel.y.toFixed(
          3,
        )}px, 0px) translate(-50%, -50%)`,
        pointerEvents: "none",
        zIndex: 10,
        willChange: "transform",
      }}
    >
      {/* Layer 2: Subtle Character Personality Body Tilt */}
      <div
        style={{
          transform: `rotate(${characterTilt.toFixed(3)}deg)`,
          transformOrigin: "center center",
        }}
      >
        {/* Layer 3: Ambient Idle Floating Layer */}
        <div
          style={{
            transform: `translate3d(${floatX.toFixed(3)}px, ${floatY.toFixed(
              3,
            )}px, 0px) rotate(${floatRot.toFixed(3)}deg)`,
            transformOrigin: "center center",
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Layer 4: Dynamic Direction-of-Travel Cursor Accessory (pop-in + inward suction) */}
          {activeCursorOpacity > 0 && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate3d(${activeCursorX.toFixed(
                  3,
                )}px, ${activeCursorY.toFixed(3)}px, 0px) translate(-50%, -50%)`,
                zIndex: 2,
                pointerEvents: "none",
                opacity: activeCursorOpacity,
                willChange: "transform, opacity",
              }}
            >
              <div
                style={{
                  transform: `scale(${activeCursorScale.toFixed(4)})`,
                  transformOrigin: "center center",
                }}
              >
                <PointerAccessory
                  color={activeColor}
                  size={pointerSize}
                  rotation={activePointerRotation}
                />
              </div>
            </div>
          )}

          {cargo && travel.activeSegmentId === cargoSegmentId && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate3d(${cargoX.toFixed(
                  3,
                )}px, ${cargoY.toFixed(3)}px, 0px) translate(-50%, -50%)`,
                zIndex: 3,
                pointerEvents: "none",
                whiteSpace: "nowrap",
              }}
            >
              {cargo}
            </div>
          )}

          {/* Layer 5: Ally Orb & Permanent Character Identity (State Switcher with Squash & Stretch) */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              transform: `scale(${totalSquashX.toFixed(3)}, ${totalSquashY.toFixed(3)})`,
              transformOrigin: "center center",
              willChange: "transform",
            }}
          >
            {children ?? (
              <AllyAvatar
                shape={identity}
                state={activeState}
                color={activeColor}
                size={size}
              />
            )}
          </div>

          {/* Optional Visual Geometry Debugger (Orb boundary, clearance ring, orbit path) */}
          {SHOW_CURSOR_GEOMETRY && (
            <CursorGeometryDebug
              orbSize={size}
              orbitRadius={travel.cursorOrbitRadius}
              clearance={clearance}
              cursorX={travel.cursorX}
              cursorY={travel.cursorY}
              rawTargetCursorX={travel.rawTargetCursorX}
              rawTargetCursorY={travel.rawTargetCursorY}
              pointerRotation={travel.directionDeg}
              targetRotation={travel.targetDirectionDeg}
              color={activeColor}
            />
          )}
        </div>
      </div>
    </div>
  );
}
