import { ALLY_PATHS } from './constants/allyPaths';
import { useBezierTravel } from './motion/useBezierTravel';

const allies = ['blue', 'green', 'pink', 'yellow'] as const;

for (const id of allies) {
  const config = ALLY_PATHS[id];
  console.log(`\n=== Testing ${config.name} (startFrame: ${config.startFrame}, duration: ${config.durationFrames}) ===`);

  for (let f = config.startFrame - 8; f <= config.startFrame + config.durationFrames + 10; f += 4) {
    const result = useBezierTravel({
      path: config.svgPath,
      frame: f,
      startFrame: config.startFrame,
      durationInFrames: config.durationFrames,
      identity: config.identity,
      timingEase: config.timingEase,
      responsiveness: config.responsiveness,
      organicDeviation: config.organicDeviation,
      orbSize: 153,
      pointerSize: 110.5,
      clearance: 10.0,
      idle: config.idle,
    });

    console.log(
      `Frame ${f}: state=${result.motionState.padEnd(12)} opacity=${result.cursorOpacity.toFixed(2)} rawDir=${result.targetDirectionDeg.toFixed(1)}° smoothDir=${result.directionDeg.toFixed(1)}° cursor=(${result.cursorX.toFixed(1)}, ${result.cursorY.toFixed(1)})`
    );
  }
}
