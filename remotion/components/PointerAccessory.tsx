import React from "react";

interface PointerAccessoryProps {
  color: string;
  size?: number;
  rotation?: number; // 0deg = points strictly Right (+x) away from orb
  style?: React.CSSProperties;
}

/**
 * Official Ally Pointer / Cursor Accessory
 * 
 * Rules:
 * 1. 0deg rotation points strictly FORWARD (Right / +x) away from the ally orb.
 * 2. Rear notch and wings face backward (-x) towards the orb.
 * 3. NO drop shadow, NO glow, 100% clean flat vector graphics.
 */
export function PointerAccessory({
  color,
  size = 110.5,
  rotation = 0,
  style = {},
}: PointerAccessoryProps) {
  // In the raw SVG viewBox (28.035 x 28.035), the forward tip is at ~(0,0) (top-left, -135deg).
  // Rotating by +135deg aligns the forward tip with 0deg (pointing Right / +x).
  const svgCorrectionDeg = 135;
  const totalRotation = rotation + svgCorrectionDeg;

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        transform: `rotate(${totalRotation.toFixed(2)}deg)`,
        transformOrigin: "center center",
        flexShrink: 0,
        // ZERO SHADOW / ZERO GLOW / PURE FLAT VECTOR
        ...style,
      }}
    >
      <svg
        viewBox="0 0 28.035 28.035"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      >
        <path
          d="M25.8723 8.1633C28.7683 9.2356 28.7523 13.3397 25.8445 14.3857L17.6873 17.3219C17.5143 17.3847 17.3813 17.5195 17.3221 17.6847L14.3844 25.8445C13.3383 28.7519 9.2337 28.7685 8.1614 25.8727L0.2632 4.6066C0.225 4.5034 0.1859 4.4006 0.1532 4.2955C-0.639 1.755 1.7753-0.6558 4.3218 0.1625C4.4342 0.1986 4.5445 0.2414 4.6553 0.2824L25.8723 8.1633Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

