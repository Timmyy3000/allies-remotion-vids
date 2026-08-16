import React from "react";
import { Easing, interpolate, interpolateColors } from "remotion";

import { DOMAIN_LAYOUT, HEADLINE_LAYOUT } from "../constants/layout";
import { TIMING } from "../constants/timing";
import { COLORS } from "../constants/colors";
import { TYPOGRAPHY } from "../constants/layout";

export type DomainPiece = "your" | "allies" | "dot" | "i" | "o";
export type DraggedDomainPiece = Exclude<DomainPiece, "allies">;

const DRAGGED_PIECES: readonly DraggedDomainPiece[] = ["your", "dot", "i", "o"];

const PIECE_END_FRAMES: Record<DraggedDomainPiece, number> = {
  your: TIMING.BLUE_DOMAIN_DRAG_START + TIMING.BLUE_DOMAIN_DRAG_DURATION,
  dot: TIMING.PINK_DOMAIN_DRAG_START + TIMING.PINK_DOMAIN_DRAG_DURATION,
  i: TIMING.GREEN_DOMAIN_DRAG_START + TIMING.GREEN_DOMAIN_DRAG_DURATION,
  o: TIMING.YELLOW_DOMAIN_DRAG_START + TIMING.YELLOW_DOMAIN_DRAG_DURATION,
};

const pieceSettleEase = Easing.bezier(0.22, 1, 0.36, 1);

function getPieceStyle(piece: DomainPiece, color: string): React.CSSProperties {
  const slot = DOMAIN_LAYOUT.pieces[piece];

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: slot.width,
    height: "100%",
    color,
    fontFamily: TYPOGRAPHY.fontFamily,
    fontSize: TYPOGRAPHY.fontSize,
    fontWeight: TYPOGRAPHY.fontWeight,
    letterSpacing: `${TYPOGRAPHY.letterSpacing}px`,
    lineHeight: TYPOGRAPHY.lineHeight,
    whiteSpace: "nowrap",
    userSelect: "none",
  };
}

export function DomainPieceText({
  piece,
  color = COLORS.headlineText,
}: {
  piece: DomainPiece;
  color?: string;
}) {
  return (
    <span style={getPieceStyle(piece, color)}>
      {DOMAIN_LAYOUT.pieces[piece].text}
    </span>
  );
}

export function DomainLockup({ frame }: { frame: number }) {
  // Persistent 'allies' word shifts from brand center into domain center slot
  const alliesPositionProgress = interpolate(
    frame,
    [TIMING.LOGO_COLLAPSE_END, TIMING.DOMAIN_EDGE_START + 12],
    [0, 1],
    {
      easing: pieceSettleEase,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const persistentAlliesCenterX = interpolate(
    alliesPositionProgress,
    [0, 1],
    [
      HEADLINE_LAYOUT.centerX + HEADLINE_LAYOUT.logoShiftDistance / 2,
      DOMAIN_LAYOUT.pieces.allies.centerX,
    ],
  );

  // =========================================================================
  // SIMULTANEOUS URL COMPLETION ORANGE TRANSITION
  // All glyphs share urlCompletionColorProgress and transition together
  // =========================================================================
  const isCompletionStarted = frame >= TIMING.COMPLETION_ORANGE_START;
  const isFullOrangeHold =
    frame >= TIMING.COMPLETION_ORANGE_HOLD_START &&
    frame < TIMING.COMPLETION_BLACK_TRANSITION_START;
  const isTransitioningToBlack =
    frame >= TIMING.COMPLETION_BLACK_TRANSITION_START;

  // Unified color progress across the entire 'yourallies.io' lockup (0 -> 1 simultaneously)
  const urlCompletionColorProgress = interpolate(
    frame,
    [
      TIMING.COMPLETION_ORANGE_START,
      TIMING.COMPLETION_ORANGE_START + TIMING.COMPLETION_ORANGE_DURATION,
    ],
    [0, 1],
    {
      easing: Easing.bezier(0.25, 1, 0.5, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // Helper to compute color for a specific piece
  const getPieceColor = (piece: DomainPiece): string => {
    // 1. Final Hero State: Transitioning to solid all-black #121212
    if (isTransitioningToBlack) {
      return interpolateColors(
        frame,
        [
          TIMING.COMPLETION_BLACK_TRANSITION_START,
          TIMING.COMPLETION_FULL_BLACK_FRAME,
        ],
        [COLORS.brandOrange, COLORS.headlineText],
      );
    }

    // 2. Full Orange Celebration Hold (#FF5800)
    if (isFullOrangeHold) {
      return COLORS.brandOrange;
    }

    // 3. Simultaneous Orange Fade Phase (all pieces fade to #FF5800 simultaneously)
    if (isCompletionStarted) {
      if (piece === "allies") {
        return COLORS.brandOrange;
      }
      return interpolateColors(
        urlCompletionColorProgress,
        [0, 1],
        [COLORS.headlineText, COLORS.brandOrange],
      );
    }

    // 4. Pre-completion: 'allies' is orange, incoming dragged pieces are black
    return piece === "allies" ? COLORS.brandOrange : COLORS.headlineText;
  };

  // Micro-scale completion celebration pulse
  let completionScale = 1.0;
  if (
    frame >= TIMING.COMPLETION_ORANGE_HOLD_START &&
    frame < TIMING.COMPLETION_BLACK_TRANSITION_START + 15
  ) {
    const pulseProgress =
      (frame - TIMING.COMPLETION_ORANGE_HOLD_START) / 35;
    const pulseEnv = Math.sin(Math.min(1, pulseProgress) * Math.PI);
    completionScale = 1.0 + pulseEnv * 0.015;
  }

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: DOMAIN_LAYOUT.centerX,
        top: DOMAIN_LAYOUT.centerY,
        width: 0,
        height: 0,
        zIndex: 2,
        pointerEvents: "none",
        opacity: 1,
        transform: `translate(-50%, -50%) scale(${completionScale.toFixed(4)})`,
        transformOrigin: "center center",
      }}
    >
      {/* 1. Persistent 'allies' piece */}
      <div
        style={{
          position: "absolute",
          left: persistentAlliesCenterX - DOMAIN_LAYOUT.centerX,
          top: -DOMAIN_LAYOUT.rowHeight / 2,
          width: DOMAIN_LAYOUT.pieces.allies.width,
          height: DOMAIN_LAYOUT.rowHeight,
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DomainPieceText piece="allies" color={getPieceColor("allies")} />
      </div>

      {/* 2. Dragged domain pieces (your, ., i, o) */}
      {DRAGGED_PIECES.map((piece) => {
        const settleStart = PIECE_END_FRAMES[piece] + 1;
        const settleEnd = settleStart + TIMING.DOMAIN_PIECE_SETTLE_DURATION;
        const progress = interpolate(frame, [settleStart, settleEnd], [0, 1], {
          easing: pieceSettleEase,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const slot = DOMAIN_LAYOUT.pieces[piece];

        return (
          <div
            key={piece}
            style={{
              position: "absolute",
              left: slot.centerX - DOMAIN_LAYOUT.centerX,
              top: -DOMAIN_LAYOUT.rowHeight / 2,
              width: slot.width,
              height: DOMAIN_LAYOUT.rowHeight,
              transform: `translateX(-50%) scale(${interpolate(
                progress,
                [0, 1],
                [0.86, 1],
              ).toFixed(4)})`,
              transformOrigin: "center center",
              opacity: progress,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DomainPieceText piece={piece} color={getPieceColor(piece)} />
          </div>
        );
      })}
    </div>
  );
}
