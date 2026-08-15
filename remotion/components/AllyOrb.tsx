import React from "react";

interface AllyOrbProps {
  color: string;
  size?: number;
  innerContentPaddingRatio?: number; // 0.22 = 22% padding all around (56% inner content box)
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Reusable Ally Orb (Outer Colored Blob Container)
 * 
 * Rules:
 * 1. STRICT ZERO SHADOW: No box-shadow, no drop-shadow, no SVG shadow filters, no glow.
 * 2. Generous internal padding between the inner character entity and outer blob edge.
 * 3. Optical centering of the inner ally character.
 */
export function AllyOrb({
  color,
  size = 153,
  innerContentPaddingRatio = 0.22,
  children,
  style = {},
}: AllyOrbProps) {
  // Generous internal breathing room:
  // With 22% padding ratio, the inner entity wrapper occupies 56% of the orb diameter,
  // providing ~40px of comfortable margin around the character on all sides.
  const contentPercent = (1 - innerContentPaddingRatio * 2) * 100;

  return (
    <div
      className="ally-orb"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        // STRICT FLAT VECTOR: NO BOX-SHADOW / NO GLOW
        userSelect: "none",
        ...style,
      }}
    >
      {/* Dedicated Inner Content Wrapper with generous breathing room */}
      <div
        className="ally-inner-content-wrapper"
        style={{
          width: `${contentPercent.toFixed(1)}%`,
          height: `${contentPercent.toFixed(1)}%`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          pointerEvents: "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}
