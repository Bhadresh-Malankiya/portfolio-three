export type CompanionRoutePosition = { x: number; y: number };
export type CompanionRouteLeg = {
  /** Document scroll positions. Gaps between legs are stationary reading stops. */
  start: number;
  end: number;
  from: CompanionRoutePosition;
  to: CompanionRoutePosition;
  mode: "run" | "fly";
  /** Maximum extra lift above the line between endpoints, in CSS pixels. */
  lift?: number;
};
export type CompanionRouteSample = CompanionRoutePosition & {
  phase: "rest" | "run" | "fly";
  flight: number;
  progress: number;
  legIndex: number;
};

const ORIGIN: CompanionRoutePosition = { x: 0, y: 0 };
const samePoint = (a: CompanionRoutePosition, b: CompanionRoutePosition) => Math.abs(a.x - b.x) < .001 && Math.abs(a.y - b.y) < .001;

/** Validate once when constructing the route, not in the animation loop. */
export function validateCompanionRoute(legs: readonly CompanionRouteLeg[]) {
  legs.forEach((leg, index) => {
    if (![leg.start, leg.end, leg.from.x, leg.from.y, leg.to.x, leg.to.y, leg.lift ?? 0].every(Number.isFinite)) {
      throw new Error(`Companion route leg ${index} must use finite coordinates.`);
    }
    if (leg.end <= leg.start) throw new Error(`Companion route leg ${index} needs a positive scroll span.`);
    if (leg.mode !== "run" && leg.mode !== "fly") throw new Error(`Companion route leg ${index} has an unsupported movement mode.`);
    if ((leg.lift ?? 0) < 0) throw new Error(`Companion route leg ${index} cannot have negative lift.`);
    if (leg.mode === "run" && (leg.from.y !== leg.to.y || (leg.lift ?? 0) !== 0)) {
      throw new Error(`Companion route leg ${index}: a ground run must have a level path.`);
    }
    if (index && (leg.start < legs[index - 1].end || !samePoint(leg.from, legs[index - 1].to))) {
      throw new Error(`Companion route leg ${index} overlaps or disconnects from the previous stop.`);
    }
  });
}

const ease = (progress: number) => progress ** 3 * (progress * (progress * 6 - 15) + 10);
const rest = (position: CompanionRoutePosition, legIndex: number, progress: number): CompanionRouteSample => ({
  ...position, phase: "rest", flight: 0, progress, legIndex,
});

/**
 * A reversible, scroll-addressed route: there is no elapsed time or animation queue.
 * Apply velocity limiting to this desired position in the rendering layer.
 * The optional origin is used only when the route has no legs.
 */
export function sampleCompanionRoute(
  scrollY: number,
  legs: readonly CompanionRouteLeg[],
  origin: CompanionRoutePosition = ORIGIN,
): CompanionRouteSample {
  if (Number.isNaN(scrollY)) throw new Error("Companion route scroll position cannot be NaN.");
  if (!legs.length) return rest(origin, -1, 0);
  let previous = legs[0].from;
  for (let index = 0; index < legs.length; index += 1) {
    const leg = legs[index];
    if (scrollY <= leg.start) return rest(previous, index - 1, index ? 1 : 0);
    if (scrollY < leg.end) {
      const progress = (scrollY - leg.start) / (leg.end - leg.start);
      const travel = ease(progress);
      const lift = leg.mode === "fly" ? leg.lift ?? 32 : 0;
      if (samePoint(leg.from, leg.to) && !lift) return rest(leg.from, index, progress);
      // A fourth-power arc has zero velocity and acceleration at both landings.
      const flight = leg.mode === "fly" ? Math.sin(progress * Math.PI) ** 4 : 0;
      return {
        x: leg.from.x + (leg.to.x - leg.from.x) * travel,
        y: leg.from.y + (leg.to.y - leg.from.y) * travel - flight * lift,
        phase: leg.mode,
        flight,
        progress,
        legIndex: index,
      };
    }
    previous = leg.to;
  }
  return rest(previous, legs.length - 1, 1);
}

export type CompanionRouteDistancePoint = CompanionRoutePosition & { distance: number; progress: number };
export type CompiledCompanionRouteLeg = {
  leg: CompanionRouteLeg;
  startDistance: number;
  endDistance: number;
  samples: readonly CompanionRouteDistancePoint[];
};
export type CompiledCompanionRoute = {
  origin: CompanionRoutePosition;
  totalDistance: number;
  legs: readonly CompiledCompanionRouteLeg[];
};

/** Precompute once after section measurement; animation frames only sample this table. */
export function compileCompanionRoute(
  legs: readonly CompanionRouteLeg[],
  origin: CompanionRoutePosition = ORIGIN,
): CompiledCompanionRoute {
  validateCompanionRoute(legs);
  if (![origin.x, origin.y].every(Number.isFinite)) throw new Error("Companion route origin must use finite coordinates.");
  const route: CompiledCompanionRouteLeg[] = [];
  let distance = 0;
  for (const source of legs) {
    const leg = { ...source, from: { ...source.from }, to: { ...source.to } };
    const startDistance = distance;
    const samples: CompanionRouteDistancePoint[] = [];
    let previous = leg.from;
    // 128 short chords keep subpixel curve error while making physical speed
    // exact along the compiled path, including vertical and diagonal flights.
    for (let index = 0; index <= 128; index += 1) {
      const progress = index / 128;
      const sample = sampleCompanionRoute(leg.start + progress * (leg.end - leg.start), [leg]);
      distance += Math.hypot(sample.x - previous.x, sample.y - previous.y);
      samples.push({ x: sample.x, y: sample.y, progress, distance });
      previous = sample;
    }
    route.push({ leg, startDistance, endDistance: distance, samples });
  }
  return { origin: { ...(legs[0]?.from ?? origin) }, totalDistance: distance, legs: route };
}

/** Map document scrolling to a desired physical distance without spending time in reading-stop gaps. */
export function routeDistanceAtScroll(scrollY: number, route: CompiledCompanionRoute) {
  if (Number.isNaN(scrollY)) throw new Error("Companion route scroll position cannot be NaN.");
  for (const segment of route.legs) {
    const { leg, samples } = segment;
    if (scrollY <= leg.start) return segment.startDistance;
    if (scrollY < leg.end) {
      const progress = (scrollY - leg.start) / (leg.end - leg.start);
      const position = progress * (samples.length - 1);
      const lower = Math.floor(position);
      const fraction = position - lower;
      return samples[lower].distance + (samples[lower + 1].distance - samples[lower].distance) * fraction;
    }
  }
  return route.totalDistance;
}

/** Sample the actual travelled distance so motion and pose stay together after rapid scroll jumps. */
export function sampleCompanionRouteDistance(
  distance: number,
  route: CompiledCompanionRoute,
): CompanionRouteSample {
  if (Number.isNaN(distance)) throw new Error("Companion route distance cannot be NaN.");
  if (!route.legs.length || distance <= 0) return rest(route.origin, -1, 0);
  if (distance >= route.totalDistance) return rest(route.legs[route.legs.length - 1].leg.to, route.legs.length - 1, 1);
  for (let index = 0; index < route.legs.length; index += 1) {
    const segment = route.legs[index];
    if (distance === segment.endDistance) return rest(segment.leg.to, index, 1);
    if (distance <= segment.startDistance || distance > segment.endDistance) continue;
    const { samples, leg } = segment;
    let low = 0;
    let high = samples.length - 1;
    while (high - low > 1) {
      const middle = Math.floor((low + high) / 2);
      if (samples[middle].distance < distance) low = middle;
      else high = middle;
    }
    const before = samples[low];
    const after = samples[high];
    const length = after.distance - before.distance;
    const fraction = length > 0 ? (distance - before.distance) / length : 0;
    const progress = before.progress + (after.progress - before.progress) * fraction;
    const sample = sampleCompanionRoute(leg.start + progress * (leg.end - leg.start), [leg]);
    return {
      ...sample,
      x: before.x + (after.x - before.x) * fraction,
      y: before.y + (after.y - before.y) * fraction,
      legIndex: index,
    };
  }
  return rest(route.origin, -1, 0);
}

export type CompanionJourneyRouteOptions = {
  sectionTops: { work?: number; mobile?: number; about?: number; experience?: number };
  /** Layout viewport width (document.documentElement.clientWidth). */
  width: number;
  height: number;
  fixed: boolean;
};

/** The portfolio's measured ground route and one deliberate About-section flight. */
export function buildCompanionJourneyRoute({ sectionTops, width, height, fixed }: CompanionJourneyRouteOptions): CompiledCompanionRoute {
  const legs: CompanionRouteLeg[] = [];
  if (!fixed) {
    const { work, mobile, about, experience } = sectionTops;
    const ground = { x: 0, y: 0 };
    // Leave the downloads control a clear lane on the left.
    const left = { x: -Math.max(0, width - 286), y: 0 };
    if (work !== undefined && mobile !== undefined && about !== undefined) {
      const firstStart = Math.max(0, work - height * .1);
      const firstEnd = Math.min(work + height * 1.4, mobile - height * .8);
      const secondStart = Math.max(firstEnd + 160, mobile - height * .1);
      const secondEnd = Math.min(mobile + height * 1.1, about - height * .85);
      if (firstEnd > firstStart && secondEnd > secondStart) {
        legs.push({ start: firstStart, end: firstEnd, from: ground, to: left, mode: "run" });
        legs.push({ start: secondStart, end: secondEnd, from: left, to: ground, mode: "run" });
      }
    }
    if (about !== undefined && experience !== undefined) {
      const start = Math.max((legs.at(-1)?.end ?? 0) + 120, about - height * .65);
      const end = Math.max(start + 160, about - height * .12);
      const perch = { x: 0, y: -Math.min(190, height * .22) };
      const landing = Math.max(end + height * .4, experience - height * .1);
      legs.push({ start, end, from: ground, to: perch, mode: "fly", lift: 18 });
      legs.push({ start: landing, end: landing + height * .65, from: perch, to: ground, mode: "fly", lift: 10 });
    }
  }
  return compileCompanionRoute(legs);
}
