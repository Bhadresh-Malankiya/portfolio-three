"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { MotionValue } from "framer-motion";
import type { CompanionTravel } from "@/components/three/BuilderAvatar";
import { companionChapters, getCompanionChapter, type CompanionChapter } from "@/lib/companion-sections";
import { buildCompanionJourneyRoute, compileCompanionRoute, rebaseCompanionRouteDistance, routeDistanceAtScroll, sampleCompanionRouteDistance } from "@/lib/companion-route";
import { createCueState, updateCompanionCue } from "@/lib/companion-cues";

type Options = {
  pathname: string;
  viewport: { width: number; height: number };
  reduced: boolean;
  paused: boolean;
  ready: boolean;
  expanded: boolean;
  downloadsOpen: boolean;
  dock: RefObject<HTMLDivElement | null>;
  travel: RefObject<CompanionTravel>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  onChapter: (chapter: CompanionChapter) => void;
  onSide: (side: "left" | "right") => void;
  onCue: (visible: boolean) => void;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/** Scroll chooses a stop; physical travel, arrival, speech and pointing share
 * one clock. Only time when the visitor can actually read a cue is counted. */
export function useCompanionJourney({ pathname, viewport, reduced, paused, ready, expanded, downloadsOpen, dock, travel, x, y, onChapter, onSide, onCue }: Options) {
  const cursor = useRef({ distance: 0, velocity: 0, initialized: false, width: 0, height: 0, resizePending: false });
  const cues = useRef(createCueState());
  const chapter = useRef(getCompanionChapter(pathname));

  useEffect(() => {
    const element = dock.current;
    if (!element || !viewport.width) return;
    const state = travel.current;
    const motion = cursor.current;
    const { width, height } = viewport;
    const compact = width < 1000 || height < 600;
    const fixed = reduced || compact || pathname !== "/";
    let chapters: { chapter: CompanionChapter; element: Element; top: number }[] = [];
    let route = compileCompanionRoute([]);
    let frame = 0;
    let previousTime = performance.now();
    let navigationStarted = 0;
    let lastScrollAt = previousTime;
    let lastScrollY = window.scrollY;
    let scrollSpeed = 0;
    let lastSide: "left" | "right" | undefined;
    let dirty = true;
    motion.resizePending ||= !motion.initialized || motion.width !== width || motion.height !== height;
    motion.width = width;
    motion.height = height;

    const updateCue = (now: number, deltaMs: number, eligible: boolean) => {
      const result = updateCompanionCue(cues.current, { now, id: chapter.current.id, eligible, deltaMs });
      if (result.visible !== cues.current.visible) onCue(result.visible);
      cues.current = result.state;
      element.setAttribute("data-cue", result.visible ? "speaking" : result.pending ? "arriving" : "quiet");
      return result;
    };
    // A hidden tab may never run its queued RAF. Record interruptions now so
    // returning to the page cannot resume an already-read speech mid-sentence.
    if (paused || expanded || downloadsOpen) {
      updateCue(previousTime, 0, false);
    }
    const rebuild = () => {
      chapters = pathname === "/" ? companionChapters.flatMap(chapter => {
        const section = document.querySelector(chapter.selector);
        return section ? [{ chapter, element: section, top: section.getBoundingClientRect().top + window.scrollY }] : [];
      }) : [];
      const find = (id: string) => chapters.find(item => item.chapter.id === id)?.top;
      route = buildCompanionJourneyRoute({
        sectionTops: { work: find("work"), mobile: find("mobile"), about: find("about"), experience: find("experience") },
        width: document.documentElement.clientWidth,
        height,
        fixed,
      });
      motion.distance = clamp(motion.distance, 0, route.totalDistance);
      dirty = false;
    };

    const tick = (now: number) => {
      frame = 0;
      if (dirty || chapters.some(item => !item.element.isConnected)) rebuild();
      const deltaMs = Math.min(100, Math.max(0, now - previousTime));
      const dt = Math.min(.035, Math.max(.001, deltaMs / 1000));
      previousTime = now;
      if (now - lastScrollAt > 80) scrollSpeed *= Math.exp(-dt * 18);
      const scroll = window.scrollY;
      const readingLine = Math.min(height * .38, 300);
      let next = getCompanionChapter(pathname);
      for (const item of chapters) if (item.top - scroll <= readingLine) next = item.chapter;
      if (next.id !== chapter.current.id) {
        chapter.current = next;
        onChapter(next);
      }
      const current = chapter.current;
      // Project headings can change in place while their section remains pinned.
      const targetElement = current.target ? document.querySelector(current.target) : null;
      const target = routeDistanceAtScroll(scroll, route);
      if (paused || expanded || downloadsOpen) {
        updateCue(now, 0, false);
        state.speaking = false;
        motion.velocity = 0;
        state.journeyVelocity = 0;
        state.pointing = false;
        element.dataset.travelling = "false";
        element.dataset.walking = "false";
        return;
      }

      // Anchor navigation can skip the whole page. Rejoin its destination once
      // the page settles, instead of replaying all the skipped chapters.
      element.style.opacity = navigationStarted ? "0" : "1";
      const navigationSettled = navigationStarted && now - navigationStarted > 170 && (now - lastScrollAt > 150 || now - navigationStarted > 1800);
      if (motion.resizePending || navigationSettled) {
        motion.distance = target;
        motion.velocity = 0;
        motion.initialized = true;
        motion.resizePending = false;
        navigationStarted = 0;
        element.style.opacity = "1";
      } else if (!navigationStarted) {
        const rebased = rebaseCompanionRouteDistance(motion.distance, target, route);
        if (Math.abs(rebased - motion.distance) > .1) {
          motion.distance = rebased;
          motion.velocity = 0;
        }
        const difference = target - motion.distance;
        const sample = sampleCompanionRouteDistance(motion.distance, route);
        const flying = sample.phase === "fly" || sample.y < -.5;
        // Quicker catch-up on long ground trips, softer braking at each stop.
        const speedLimit = flying ? 220 : clamp(270 + Math.abs(difference) * .22, 270, 430);
        const acceleration = flying ? 650 : 950;
        const desiredVelocity = Math.sign(difference) * Math.min(speedLimit, Math.sqrt(2 * acceleration * Math.abs(difference)), Math.abs(difference) * 7);
        motion.velocity += clamp(desiredVelocity - motion.velocity, -acceleration * dt, acceleration * dt);
        const advance = motion.velocity * dt;
        if (Math.abs(difference) < .3 || (advance * difference > 0 && Math.abs(advance) >= Math.abs(difference))) {
          motion.distance = target;
          motion.velocity = 0;
        } else motion.distance = clamp(motion.distance + advance, 0, route.totalDistance);
      }
      const sample = sampleCompanionRouteDistance(motion.distance, route);
      const previousX = x.get();
      x.set(sample.x);
      y.set(sample.y);
      const remaining = Math.abs(target - motion.distance);
      const moving = Math.abs(motion.velocity) > 4 || remaining > 1 || navigationStarted > 0;
      // The balloon stays inflated while the guide is at an elevated stop.
      state.flight = Math.max(sample.flight, clamp(-sample.y / 90, 0, 1));
      state.journeyVelocity = moving && !navigationStarted ? sample.phase === "fly" ? motion.velocity : (sample.x - previousX) / dt : 0;
      const side = sample.x < -(document.documentElement.clientWidth - 152) / 2 ? "left" : "right";
      if (side !== lastSide) { lastSide = side; onSide(side); }
      element.dataset.travelling = String(moving);
      element.dataset.walking = String(moving && state.flight < .2);
      element.dataset.flying = String(state.flight > .2);
      element.dataset.direction = state.journeyVelocity < 0 ? "back" : "forward";
      element.style.setProperty("--companion-lift", `${Math.max(0, -sample.y)}px`);
      element.style.setProperty("--companion-flight", String(state.flight));
      const scrollable = document.documentElement.scrollHeight - height;
      element.style.setProperty("--companion-progress", String(scrollable > 0 ? clamp(scroll / scrollable, 0, 1) : 1));

      const targetBounds = targetElement?.getBoundingClientRect();
      const visible = Boolean(targetBounds && !targetElement?.closest("[inert]") && targetBounds.bottom > 100 && targetBounds.top < height * .82);
      const cue = updateCue(now, deltaMs, ready && !compact && !moving && scrollSpeed < 900 && (visible || !current.target));
      state.speaking = cue.visible;
      state.pointing = cue.visible && visible;
      if (targetBounds && visible) {
        const centerX = document.documentElement.clientWidth - 76 + sample.x;
        const centerY = height - 90 + sample.y - state.flight * 70;
        const dx = targetBounds.left + targetBounds.width / 2 - centerX;
        const dy = centerY - (targetBounds.top + targetBounds.height / 2);
        state.pointDirection = dx >= 0 ? 1 : -1;
        state.pointElevation = clamp(Math.atan2(dy, Math.abs(dx)) / (Math.PI / 2), -1, 1);
      } else state.pointDirection = side === "left" ? 1 : -1;

      if (moving || navigationStarted || cue.pending || scrollSpeed >= 900) frame = requestAnimationFrame(tick);
    };
    const schedule = () => { if (!frame) { previousTime = performance.now(); frame = requestAnimationFrame(tick); } };
    const scrollChanged = () => {
      const now = performance.now();
      scrollSpeed = Math.abs(window.scrollY - lastScrollY) / Math.max(.016, (now - lastScrollAt) / 1000);
      lastScrollAt = now;
      lastScrollY = window.scrollY;
      schedule();
    };
    const navigate = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.pathname !== pathname || !destination.hash || fixed || expanded) return;
      navigationStarted = lastScrollAt = performance.now();
      motion.velocity = 0;
      schedule();
    };
    const resize = () => { dirty = true; schedule(); };
    const observer = new ResizeObserver(resize);
    observer.observe(document.body);
    window.addEventListener("scroll", scrollChanged, { passive: true });
    document.addEventListener("click", navigate, true);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", scrollChanged);
      document.removeEventListener("click", navigate, true);
      state.journeyVelocity = 0;
      element.style.opacity = "1";
    };
  }, [pathname, viewport, reduced, paused, ready, expanded, downloadsOpen, dock, travel, x, y, onChapter, onSide, onCue]);
}
