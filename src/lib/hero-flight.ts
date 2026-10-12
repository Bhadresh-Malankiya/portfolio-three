export const flightStops = [.08, .5, .9] as const;
export const flightScrollStops = [.06, .38, .76] as const;

// The finished aircraft gets the last third of the scroll to cruise in view.
// Visitors can still scroll freely or jump straight to a chapter.
const scrollTimeline = [0, .12, .31, .44, .64, .94, 1];
const sceneTimeline = [.08, .08, .5, .5, .86, .97, 1];

export function flightTimelineProgress(value: number) {
  for (let i = 1; i < scrollTimeline.length; i += 1) {
    if (value <= scrollTimeline[i]) {
      const t = Math.max(0, (value - scrollTimeline[i - 1]) / (scrollTimeline[i] - scrollTimeline[i - 1]));
      return sceneTimeline[i - 1] + t * (sceneTimeline[i] - sceneTimeline[i - 1]);
    }
  }
  return sceneTimeline[sceneTimeline.length - 1];
}

export const flightChapterAt = (value: number) => value < .32 ? 0 : value < .84 ? 1 : 2;

export const flightRevealSeconds = .32;
export const flightEntranceSeconds = 1.5;

export type FlightClock = {
  presentedSeconds: number;
  previousProgress: number | null;
  wasPlaying: boolean;
};

export function createFlightClock(): FlightClock {
  return { presentedSeconds: 0, previousProgress: null, wasPlaying: false };
}

export function advanceFlightClock(clock: FlightClock, frame: {
  delta: number;
  progress: number;
  active: boolean;
  presented: boolean;
  reducedMotion: boolean;
}) {
  const delta = Number.isFinite(frame.delta) ? Math.min(.05, Math.max(0, frame.delta)) : 0;
  let presentedSeconds = clock.presentedSeconds;
  if (frame.active && frame.presented) {
    // Completing the entrance for reduced motion also prevents replay if the
    // preference changes while this same scene remains mounted.
    presentedSeconds = frame.reducedMotion
      ? Math.max(presentedSeconds, flightRevealSeconds + flightEntranceSeconds)
      : presentedSeconds + delta;
  }
  const elapsed = Math.max(0, presentedSeconds - flightRevealSeconds);
  const playing = frame.active && frame.presented && !frame.reducedMotion && elapsed > 0;
  const continuous = playing && clock.wasPlaying && clock.previousProgress !== null && delta > 0;
  const velocity = continuous && delta > 0
    ? Math.max(-1, Math.min(1, (frame.progress - clock.previousProgress!) / delta))
    : 0;
  const enteredBuild = continuous
    && flightChapterAt(clock.previousProgress!) !== 1
    && flightChapterAt(frame.progress) === 1;

  return {
    clock: { presentedSeconds, previousProgress: frame.progress, wasPlaying: playing },
    delta,
    elapsed: frame.reducedMotion ? 0 : elapsed,
    arrival: frame.reducedMotion ? 1 : 1 - (1 - Math.min(1, elapsed / flightEntranceSeconds)) ** 3,
    playing,
    velocity,
    enteredBuild,
  };
}
