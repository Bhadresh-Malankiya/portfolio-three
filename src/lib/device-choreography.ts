/** One scroll timeline shared by the hardware, captions and project navigation. */
export const DEVICE_TIMELINE = {
  arriveStart: 0.025,
  arriveEnd: 0.14,
  openStart: 0.14,
  openEnd: 0.26,
  closeStart: 0.76,
  closeEnd: 0.865,
  exitStart: 0.87,
  exitEnd: 1,
} as const;
export const PROJECT_STOPS = [0.325, 0.51, 0.68] as const;
export const PROJECT_BREAKS = [0.43, 0.6] as const;
export const smoothStep = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};
export function devicePose(progress: number, phone: boolean, animated = true) {
  const p = animated ? progress : PROJECT_STOPS[0];
  const timeline = DEVICE_TIMELINE;
  const enter = animated ? smoothStep((p - timeline.arriveStart) / (timeline.arriveEnd - timeline.arriveStart)) : 1;
  const open = animated ? smoothStep((p - timeline.openStart) / (timeline.openEnd - timeline.openStart)) : 1;
  const close = animated ? smoothStep((p - timeline.closeStart) / (timeline.closeEnd - timeline.closeStart)) : 0;
  const exit = animated ? smoothStep((p - timeline.exitStart) / (timeline.exitEnd - timeline.exitStart)) : 0;
  const transition = PROJECT_BREAKS.reduce((sum, stop) =>
    sum + Math.exp(-Math.pow((p - stop) / 0.025, 2)), 0);
  const focus = smoothStep((p - 0.23) / 0.095) * (1 - close);
  return {
    lift: phone ? 0 : 0.85 * (1 - open * (1 - close)),
    hinge: Math.PI / 2 + (-0.13 - Math.PI / 2) * open * (1 - close),
    scale: 1 + (0.075 - 0.03 * transition) * focus,
    rotationY: phone
      ? Math.PI * (1 - open) - 0.12 + 0.09 * focus - 0.4 * exit
      : -0.24 + 0.16 * enter + 0.055 * focus + 0.16 * exit,
    rotationZ: phone ? -0.045 * (1 - focus) : 0,
  };
}
