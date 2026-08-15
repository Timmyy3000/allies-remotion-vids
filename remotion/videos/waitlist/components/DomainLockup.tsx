import React from "react";
import { Easing, interpolate } from "remotion";

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
  const alliesPositionProgress = interpolate(
    frame,
    [TIMING.LOGO_COLLAPSE_END, TIMING.DOMAIN_SCENE_START],
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
        transform: "translate(-50%, -50%)",
        transformOrigin: "center center",
      }}
    >
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
        <DomainPieceText piece="allies" color={COLORS.brandOrange} />
      </div>

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
            <DomainPieceText piece={piece} />
          </div>
        );
      })}
    </div>
  );
}
