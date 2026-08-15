import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface FrameSyncedSvgProps {
  source: string;
  cycleSeconds: number;
  scopeId?: string;
  style?: React.CSSProperties;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sanitizeScopeId(scopeId?: string) {
  const safeScope = (scopeId ?? "").replace(/[^a-zA-Z0-9_-]/g, "-");
  return `remotion-${safeScope || "ally"}`;
}

/**
 * The authored SVGs intentionally reuse readable IDs such as `head`, `eyes`,
 * and `pupil-clip-1`. Inline SVGs live in the same Studio document, so those
 * IDs and their CSS keyframes must be isolated per avatar instance or one
 * character can steal another character's animation rules.
 */
function namespaceSvg(source: string, scopeId?: string) {
  const prefix = sanitizeScopeId(scopeId);
  const ids = Array.from(
    new Set(
      Array.from(source.matchAll(/\bid\s*=\s*(["'])([^"']+)\1/g)).map(
        (match) => match[2],
      ),
    ),
  );

  let namespaced = source.replace(
    /\bid\s*=\s*(["'])([^"']+)\1/g,
    (_match, quote: string, id: string) => `id=${quote}${prefix}-${id}${quote}`,
  );

  for (const id of ids) {
    const escapedId = escapeRegExp(id);
    const prefixedId = `${prefix}-${id}`;

    namespaced = namespaced.replace(
      new RegExp(`url\\(#${escapedId}\\)`, "g"),
      `url(#${prefixedId})`,
    );
    namespaced = namespaced.replace(
      new RegExp(`(["']#${escapedId})(["'])`, "g"),
      `$1${prefixedId}$2`,
    );
    namespaced = namespaced.replace(
      new RegExp(`#${escapedId}(?![A-Za-z0-9_.:-])`, "g"),
      `#${prefixedId}`,
    );
  }

  const keyframeNames = Array.from(
    new Set(
      Array.from(
        namespaced.matchAll(/@(?:-webkit-)?keyframes\s+([A-Za-z_][\w-]*)/g),
      ).map((match) => match[1]),
    ),
  );

  for (const keyframeName of keyframeNames) {
    const escapedName = escapeRegExp(keyframeName);
    namespaced = namespaced.replace(
      new RegExp(`\\b${escapedName}\\b`, "g"),
      `${prefix}-${keyframeName}`,
    );
  }

  return namespaced.replace(
    /<svg\b/i,
    `<svg data-remotion-svg-scope="${prefix}"`,
  );
}

function getCycleTime(frame: number, fps: number, cycleSeconds: number) {
  const elapsed = frame / fps;
  return ((elapsed % cycleSeconds) + cycleSeconds) % cycleSeconds;
}

/**
 * Renders an authored SVG inline and freezes its internal CSS animation at
 * the exact Remotion frame. External SVG images cannot be controlled by the
 * parent document's animation-delay or animation-play-state styles.
 */
export function FrameSyncedSvg({
  source,
  cycleSeconds,
  scopeId = "standalone",
  style,
}: FrameSyncedSvgProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scopedSource = useMemo(
    () => namespaceSvg(source, scopeId),
    [scopeId, source],
  );
  const svgMarkup = useMemo(() => {
    const cycleTime = getCycleTime(frame, fps, cycleSeconds);
    const animationDelay = `-${cycleTime.toFixed(6)}s`;
    const scope = sanitizeScopeId(scopeId);
    const syncStyle = `<style data-remotion-frame-sync>
[data-remotion-svg-scope="${scope}"], [data-remotion-svg-scope="${scope}"] * {
  animation-delay: ${animationDelay} !important;
  animation-play-state: paused !important;
}
[data-remotion-svg-scope="${scope}"] {
  width: 100%;
  height: 100%;
  display: block;
  overflow: visible;
}
</style>`;

    return scopedSource.replace(/<\/svg>\s*$/i, `${syncStyle}</svg>`);
  }, [cycleSeconds, fps, frame, scopeId, scopedSource]);

  return (
    <div
      aria-hidden="true"
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        ...style,
      }}
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
    />
  );
}
