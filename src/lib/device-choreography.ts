/** One scroll timeline shared by the device, captions and project navigation. */
export const PROJECT_STOPS = [0.29, 0.52, 0.75] as const;
export const PROJECT_BREAKS = [0.4, 0.63] as const;
export const smoothStep = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};
export function devicePose(progress: number, phone: boolean, animated = true) {
  const p = animated ? progress : 0.29;
  const enter = animated ? smoothStep(p / 0.1) : 1;
  const open = animated ? smoothStep((p - 0.08) / 0.12) : 1;
  const close = animated ? smoothStep((p - 0.85) / 0.08) : 0;
  const exit = animated ? smoothStep((p - 0.94) / 0.06) : 0;
  // Ease back a little for each new project, then push into its screen.
  const transition = PROJECT_BREAKS.reduce((sum, stop) =>
    sum + Math.exp(-Math.pow((p - stop) / 0.035, 2)), 0);
  const focus = smoothStep((p - 0.2) / 0.1) * (1 - close);
  return {
    hinge: Math.PI / 2 + (-0.13 - Math.PI / 2) * open * (1 - close),
    scale: 1 + (0.075 - 0.045 * transition) * focus,
    rotationY: phone
      ? Math.PI * (1 - enter) - 0.12 + 0.09 * focus - 0.45 * exit
      : -0.24 + 0.16 * enter + 0.055 * focus + 0.16 * exit,
    rotationZ: phone ? -0.045 * (1 - focus) : 0,
  };
}
