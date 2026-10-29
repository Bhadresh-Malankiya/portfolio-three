// Heavy background work (device scenes, the companion avatar) waits until the
// hero plane has finished its entrance, so its first seconds stay smooth.
import { flightEntranceSeconds } from "@/lib/hero-flight";

let heroReadyAt: number | null = null;
const waiting = new Set<() => void>();

/** Called once the hero plane is on screen and starting its entrance. */
export function markHeroReady() {
  if (heroReadyAt !== null) return;
  heroReadyAt = performance.now();
  waiting.forEach((resume) => resume());
  waiting.clear();
}

/**
 * Runs `task` after the hero has settled and the browser is idle. Pages
 * without the hero, a failed hero scene, or the visitor scrolling away all
 * release the task early, so nothing waits forever.
 */
export function afterHeroSettled(task: () => void, extraDelay = 0) {
  let cancelled = false;
  let timer = 0;
  let fallback = 0;
  let idle = 0;
  let started = false;
  const run = () => {
    if (cancelled) return;
    if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(() => { if (!cancelled) task(); }, { timeout: 1500 });
    else timer = window.setTimeout(() => { if (!cancelled) task(); }, 80);
  };
  const start = (delay: number) => {
    if (cancelled || started) return;
    started = true;
    waiting.delete(resume);
    window.removeEventListener("scroll", onScroll);
    window.clearTimeout(fallback);
    timer = window.setTimeout(run, Math.max(0, delay) + extraDelay);
  };
  const settleDelay = () => heroReadyAt === null ? 0 : heroReadyAt + flightEntranceSeconds * 1000 + 400 - performance.now();
  const resume = () => start(settleDelay());
  const onScroll = () => { if (window.scrollY > window.innerHeight * 0.35) start(0); };

  if (!document.getElementById("hero") || heroReadyAt !== null) resume();
  else {
    waiting.add(resume);
    window.addEventListener("scroll", onScroll, { passive: true });
    // If the hero scene never reports ready (no WebGL, error), do not block.
    fallback = window.setTimeout(() => start(0), 6000);
  }

  return () => {
    cancelled = true;
    waiting.delete(resume);
    window.removeEventListener("scroll", onScroll);
    window.clearTimeout(timer);
    window.clearTimeout(fallback);
    if (idle) window.cancelIdleCallback(idle);
  };
}
