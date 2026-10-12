"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { MotionValue } from "framer-motion";
import type { CompanionTravel } from "@/components/three/BuilderAvatar";
import { companionChapters, getCompanionChapter, type CompanionChapter } from "@/lib/companion-sections";
import { buildCompanionJourneyRoute, compileCompanionRoute, routeDistanceAtScroll, sampleCompanionRouteDistance } from "@/lib/companion-route";

type Options = {
  pathname: string;
  viewport: { width: number; height: number };
  reduced: boolean;
  paused: boolean;
  expanded: boolean;
  downloadsOpen: boolean;
  dock: RefObject<HTMLDivElement | null>;
  travel: RefObject<CompanionTravel>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  onChapter: (chapter: CompanionChapter) => void;
  onSide: (side: "left" | "right") => void;
  onCue: () => void;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/** One measured route, with long reading stops. Scroll chooses the destination;
 * bounded acceleration controls the journey there, including reverse travel. */
export function useCompanionJourney({ pathname, viewport, reduced, paused, expanded, downloadsOpen, dock, travel, x, y, onChapter, onSide, onCue }: Options) {
  const cursor = useRef({ distance: 0, velocity: 0, initialized: false, width: 0, height: 0, resizePending: false });
  const announced = useRef(new Set<string>());

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
    let current = getCompanionChapter(pathname);
    let frame = 0;
    let previousTime = performance.now();
    let settledSince = previousTime;
    let navigationStarted = 0;
    let lastScrollAt = 0;
    let lastSide: "left" | "right" | undefined;
    let targetElement: Element | null = null;
    let dirty = true;
    motion.resizePending ||= !motion.initialized || motion.width !== width || motion.height !== height;
    motion.width = width;
    motion.height = height;

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
      const dt = Math.min(.035, Math.max(.001, (now - previousTime) / 1000));
      previousTime = now;
      const scroll = window.scrollY;
      const readingLine = Math.min(height * .38, 300);
      let next = getCompanionChapter(pathname);
      for (const item of chapters) if (item.top - scroll <= readingLine) next = item.chapter;
      if (next.id !== current.id) {
        current = next;
        settledSince = now;
        onChapter(current);
      }
      // Re-resolve a target on a scroll frame: project headings can change in place.
      targetElement = current.target ? document.querySelector(current.target) : null;
      const target = routeDistanceAtScroll(scroll, route);
      const difference = target - motion.distance;
      if (paused || expanded || downloadsOpen) {
        motion.velocity = 0;
        state.journeyVelocity = 0;
        state.pointing = false;
        element.dataset.travelling = "false";
        element.dataset.walking = "false";
        return;
      }

      // Anchor links skip whole chapters. Quietly rejoin the current scene rather
      // than replaying metres of obsolete travel across the visitor's reading.
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
        const sample = sampleCompanionRouteDistance(motion.distance, route);
        const speedLimit = sample.phase === "fly" ? 145 : 210;
        const desiredVelocity = Math.sign(difference) * Math.min(speedLimit, Math.sqrt(2 * 460 * Math.abs(difference)), Math.abs(difference) * 5);
        motion.velocity += clamp(desiredVelocity - motion.velocity, -460 * dt, 460 * dt);
        const advance = motion.velocity * dt;
        if (Math.abs(difference) < .15 || (advance * difference > 0 && Math.abs(advance) >= Math.abs(difference))) {
          motion.distance = target;
          motion.velocity = 0;
        } else motion.distance = clamp(motion.distance + advance, 0, route.totalDistance);
      }
      const sample = sampleCompanionRouteDistance(motion.distance, route);
      const previousX = x.get();
      x.set(sample.x);
      y.set(sample.y);
      const moving = Math.abs(motion.velocity) > 4 || navigationStarted > 0;
      // A hovering guide keeps an airborne pose even at the reading stop.
      state.flight = Math.max(sample.flight, clamp(-sample.y / 100, 0, .7));
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
      state.pointing = !moving && visible && state.speaking === true;
      if (targetBounds && visible) {
        const centerX = document.documentElement.clientWidth - 76 + sample.x;
        const centerY = height - 90 + sample.y;
        const dx = targetBounds.left + targetBounds.width / 2 - centerX;
        const dy = centerY - (targetBounds.top + targetBounds.height / 2);
        state.pointDirection = dx >= 0 ? 1 : -1;
        state.pointElevation = clamp(Math.atan2(dy, Math.abs(dx)) / (Math.PI / 2), -1, 1);
      } else state.pointDirection = side === "left" ? 1 : -1;

      if (moving || Math.abs(target - motion.distance) > 1) settledSince = now;
      const canIntroduce = !compact && !announced.current.has(current.id) && (visible || !current.target);
      const readingTime = now - Math.max(settledSince, lastScrollAt);
      if (canIntroduce && readingTime > 650) {
        announced.current.add(current.id);
        onCue();
      }
      if (moving || Math.abs(target - motion.distance) > .15 || navigationStarted || (canIntroduce && readingTime <= 650)) {
        frame = requestAnimationFrame(tick);
      }
    };
    const schedule = () => { if (!frame) { previousTime = performance.now(); frame = requestAnimationFrame(tick); } };
    const scrollChanged = () => { lastScrollAt = performance.now(); schedule(); };
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
  }, [pathname, viewport, reduced, paused, expanded, downloadsOpen, dock, travel, x, y, onChapter, onSide, onCue]);
}
