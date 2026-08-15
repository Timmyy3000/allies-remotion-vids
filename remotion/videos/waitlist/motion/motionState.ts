import { getTangentAtLength, getLength } from '@remotion/paths';

export function computeAllyMotionState({
  svgPath,
  startFrame,
  durationFrames,
  timingEase,
  idle,
  currentFrame,
}: {
  svgPath: string;
  startFrame: number;
  durationFrames: number;
  timingEase: (t: number) => number;
  idle: {
    yRange: readonly [number, number];
    xRange: readonly [number, number];
    rotRange: readonly [number, number];
    periodFrames: number;
    phase: number;
  };
  currentFrame: number;
}) {
  const totalLength = getLength(svgPath);

  function getProgressAt(f: number) {
    if (f <= startFrame) return 0;
    if (f >= startFrame + durationFrames) return 1;
    const t = (f - startFrame) / durationFrames;
    return timingEase(t);
  }

  function getIdleWeightAt(f: number) {
    const prog = getProgressAt(f);
    if (prog < 0.75) return 0;
    return (prog - 0.75) / 0.25;
  }

  function getVelocityAt(f: number) {
    const prog = getProgressAt(f);
    const dist = prog * totalLength;
    const sampleDist = Math.max(0.001, Math.min(totalLength - 0.001, dist));
    const tan = getTangentAtLength(svgPath, sampleDist) ?? { x: 1, y: 0 };
    const tanMag = Math.hypot(tan.x, tan.y) || 1;
    const unitTan = { x: tan.x / tanMag, y: tan.y / tanMag };

    const delta = 0.5;
    const p1 = getProgressAt(f - delta);
    const p2 = getProgressAt(f + delta);
    const travelSpeed = Math.max(0, (p2 - p1) * totalLength);

    const vTravel = {
      x: unitTan.x * travelSpeed,
      y: unitTan.y * travelSpeed,
    };

    const idleWeight = getIdleWeightAt(f);
    const omega = (2 * Math.PI) / idle.periodFrames;
    const t = (f / idle.periodFrames) * 2 * Math.PI + idle.phase;
    const Ay = (idle.yRange[1] - idle.yRange[0]) / 2;
    const Ax = (idle.xRange[1] - idle.xRange[0]) / 2;

    const vIdleX = -Math.sin(t * 1.15) * 1.15 * Ax * omega * idleWeight;
    const vIdleY = Math.cos(t) * Ay * omega * idleWeight;

    return {
      x: vTravel.x + vIdleX,
      y: vTravel.y + vIdleY,
      unitTan,
      travelSpeed,
    };
  }

  // Determine continuous unrolled angle up to currentFrame
  const initTan = getTangentAtLength(svgPath, 0.001) ?? { x: 1, y: 0 };
  let currentAngle = Math.atan2(initTan.y, initTan.x) * (180 / Math.PI);
  const MIN_SPEED = 0.03;

  // We trace from startFrame up to currentFrame to guarantee 100% continuous unrolling
  const traceStart = Math.min(startFrame, currentFrame);
  for (let f = traceStart; f <= currentFrame; f++) {
    const v = getVelocityAt(f);
    const speed = Math.hypot(v.x, v.y);
    if (speed >= MIN_SPEED) {
      const rawAngle = Math.atan2(v.y, v.x) * (180 / Math.PI);
      const diff = ((rawAngle - currentAngle + 540) % 360) - 180;
      currentAngle = currentAngle + diff;
    }
  }

  return currentAngle;
}
