import assert from "node:assert/strict";
import { buildCompanionJourneyRoute, routeDistanceAtScroll, sampleCompanionRouteDistance, validateCompanionRoute } from "../src/lib/companion-route.ts";

let positions = 0;
for (const width of [320, 390, 768, 1024, 1440, 1920, 2560]) {
  for (const height of [568, 720, 900, 1080]) {
    const sectionTops = { work: height * 2.1, mobile: height * 5.6, about: height * 10, experience: height * 12 };
    const compact = width < 1000 || height < 600;
    const size = width < 700 ? { width: 60, height: 76, right: 12, bottom: 12 } : { width: 112, height: height <= 560 ? 105 : 144, right: 20, bottom: 18 };
    const inside = point => {
      const left = width - size.right - size.width + point.x;
      const top = height - size.bottom - size.height + point.y;
      assert.ok(left >= 12 && left + size.width <= width - 12, `${width}×${height}: horizontal viewport clearance`);
      assert.ok(top >= 12 && top + size.height <= height - 12, `${width}×${height}: vertical viewport clearance`);
      const canvas = width < 700 ? { width: 72, height: 118 } : height <= 560 ? { width: 108, height: 174 } : { width: 144, height: 236 };
      const canvasLeft = left + (size.width - canvas.width) / 2;
      const canvasTop = height - size.bottom - canvas.height + point.y;
      assert.ok(canvasLeft >= 0 && canvasLeft + canvas.width <= width, "The expanded balloon canvas stays inside the viewport");
      assert.ok(canvasTop >= 72 && canvasTop + canvas.height <= height - 12, "Balloon, rider and tether retain vertical clearance from navigation");
      positions++;
    };
    const fixed = buildCompanionJourneyRoute({ sectionTops, width, height, fixed: true });
    assert.equal(fixed.totalDistance, 0, "Reduced motion, compact viewports and auxiliary pages have no travel route");
    for (const scroll of [0, sectionTops.work, sectionTops.about, sectionTops.experience]) {
      const position = sampleCompanionRouteDistance(routeDistanceAtScroll(scroll, fixed), fixed);
      assert.deepEqual([position.x, position.y, position.phase, position.flight], [0, 0, "rest", 0]);
      inside(position);
    }
    const route = buildCompanionJourneyRoute({ sectionTops, width, height, fixed: compact });
    if (compact) {
      assert.equal(route.legs.length, 0, "Small viewports retain their side margin");
      continue;
    }
    validateCompanionRoute(route.legs.map(segment => segment.leg));
    assert.deepEqual(route.legs.map(segment => segment.leg.mode), ["run", "run", "fly", "fly"]);
    assert.equal(route.legs[0].leg.start, sectionTops.work - height * .1);
    assert.equal(route.legs[0].leg.end, sectionTops.work + height * 1.4);
    assert.equal(route.legs[1].leg.start, sectionTops.mobile - height * .1);
    assert.equal(route.legs[1].leg.end, sectionTops.mobile + height * 1.1);
    assert.equal(width - size.right - size.width + route.legs[0].leg.to.x, 154, "Left stop preserves the downloads/control lane");
    assert.equal(route.legs[2].leg.to.y, -Math.min(190, height * .22), "About flight retains its capped perch height");
    assert.equal(route.legs[2].leg.lift, 18);
    assert.equal(route.legs[3].leg.lift, 10);
    for (const segment of route.legs) {
      let previous = sampleCompanionRouteDistance(segment.startDistance, route);
      for (let index = 1; index <= 500; index++) {
        const distance = segment.startDistance + (segment.endDistance - segment.startDistance) * index / 500;
        const point = sampleCompanionRouteDistance(distance, route);
        inside(point);
        assert.ok(width - size.right - size.width + point.x >= 154 - 1e-9, "Travel does not cross the downloads button's lane");
        if (segment.leg.mode === "run") {
          assert.equal(point.y, 0, "Ordinary showcase crossings stay on the ground");
          assert.equal(point.flight, 0);
        } else assert.equal(point.x, 0, "Only the right margin hosts the About flight");
        assert.ok(Math.hypot(point.x - previous.x, point.y - previous.y) <= (segment.endDistance - segment.startDistance) / 500 + 1e-9);
        previous = point;
      }
    }
    const addresses = Array.from({ length: 301 }, (_, index) => route.totalDistance * index / 300);
    assert.deepEqual(
      addresses.map(distance => sampleCompanionRouteDistance(distance, route)),
      [...addresses].reverse().map(distance => sampleCompanionRouteDistance(distance, route)).reverse(),
      "Scrolling back follows the same measured route",
    );
    const last = sampleCompanionRouteDistance(Infinity, route);
    assert.deepEqual([last.x, last.y, last.phase], [0, 0, "rest"], "The guide returns to its original margin after About");
  }
}
for (const [sectionTops, modes] of [
  [{}, []],
  [{ work: 2000, mobile: 5500, about: 9500 }, ["run", "run"]],
  [{ about: 9500, experience: 11500 }, ["fly", "fly"]],
  [{ work: 1000, mobile: 1050, about: 1100, experience: 1200 }, ["fly", "fly"]],
]) {
  const route = buildCompanionJourneyRoute({ sectionTops, width: 1440, height: 900, fixed: false });
  validateCompanionRoute(route.legs.map(segment => segment.leg));
  assert.deepEqual(route.legs.map(segment => segment.leg.mode), modes, "Missing or compressed sections cannot create overlapping/disconnected travel");
}
console.log(`Companion journey: ${positions.toLocaleString()} actual route positions fit; stationary compact/reduced routes, control clearance, ground runs, About flight and reversal passed.`);
