const TAU = Math.PI * 2;
const THIGH = .205;
const SHIN = .205;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const smooth = (value: number) => value * value * (3 - 2 * value);

/** Alternating contact and recovery, solved from a foot path rather than rotating rigid legs. */
export function sampleAvatarStride(phase: number, amount: number) {
  const running = smooth(clamp((amount - .38) / .62, 0, 1));
  const bodyY = -(.035 + .028 * running) + Math.cos(phase * 2) * (.008 + .01 * running);
  const stanceFraction = .62 - .2 * running;
  const strideLength = .105 + .065 * running;
  const leg = (offset: number) => {
    const cycle = ((phase / TAU + offset) % 1 + 1) % 1;
    const grounded = cycle < stanceFraction;
    const progress = grounded ? cycle / stanceFraction : (cycle - stanceFraction) / (1 - stanceFraction);
    const forward = grounded
      ? strideLength * (1 - 2 * progress)
      : strideLength * (2 * smooth(progress) - 1);
    const lift = grounded ? 0 : Math.sin(progress * Math.PI) ** 1.25 * (.065 + .07 * running);
    const down = THIGH + SHIN + bodyY - lift;
    const reach = clamp(Math.hypot(forward, down), .07, THIGH + SHIN - .001);
    const knee = Math.PI - Math.acos(clamp((THIGH * THIGH + SHIN * SHIN - reach * reach) / (2 * THIGH * SHIN), -1, 1));
    const hip = Math.atan2(-forward, down) - Math.acos(clamp((THIGH * THIGH + reach * reach - SHIN * SHIN) / (2 * THIGH * reach), -1, 1));
    const sole = grounded
      ? -.18 * Math.max(0, 1 - progress / .18) + (.32 + running * .15) * smooth(clamp((progress - .74) / .26, 0, 1))
      : -.12;
    return { hip, knee, ankle: sole - hip - knee, grounded, forward, lift };
  };
  return { running, bodyY, right: leg(0), left: leg(.5) };
}
