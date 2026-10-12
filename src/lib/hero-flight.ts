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
