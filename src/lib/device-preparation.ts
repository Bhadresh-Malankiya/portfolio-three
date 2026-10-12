/** Start work after the page's critical assets, with a deadline for slow third parties. */
export function scheduleDevicePreparation(prepare: () => void, delay = 0) {
  let cancelled = false;
  let scheduled = false;
  let idle = 0;
  let timer = 0;
  let deadline = 0;

  const run = () => {
    if (!cancelled) prepare();
  };
  const enqueue = () => {
    if (cancelled || scheduled) return;
    scheduled = true;
    window.removeEventListener("load", enqueue);
    window.clearTimeout(deadline);
    timer = window.setTimeout(() => {
      if (cancelled) return;
      if (typeof window.requestIdleCallback === "function") {
        idle = window.requestIdleCallback(run, { timeout: 1200 });
      } else {
        timer = window.setTimeout(run, 80);
      }
    }, delay);
  };

  if (document.readyState === "complete") enqueue();
  else {
    window.addEventListener("load", enqueue, { once: true });
    deadline = window.setTimeout(enqueue, 2200);
  }

  return () => {
    cancelled = true;
    window.removeEventListener("load", enqueue);
    window.clearTimeout(timer);
    window.clearTimeout(deadline);
    if (idle) window.cancelIdleCallback(idle);
  };
}
