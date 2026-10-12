import assert from "node:assert/strict";
import { companionChapters, companionDestination } from "../src/lib/companion-sections.ts";

let cases = 0;
for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  for (const height of [568, 720, 900]) {
    const mobile = width < 700;
    const size = mobile ? { width: 60, height: 76, right: 12, bottom: 12 } : { width: 112, height: 144, right: 20, bottom: 18 };
    const inside = ({ x, y }) => {
      const left = width - size.right - size.width + x;
      const top = height - size.bottom - size.height + y;
      assert.ok(left >= 12 && left + size.width <= width - 12, `${width}×${height}: horizontal bounds`);
      assert.ok(top >= 12 && top + size.height <= height - 12, `${width}×${height}: vertical bounds`);
      cases++;
    };
    for (const downloadsVisible of [false, true]) {
      let previous = companionDestination(companionChapters[0], width, height, downloadsVisible);
      for (const chapter of companionChapters) {
        const destination = companionDestination(chapter, width, height, downloadsVisible);
        inside(destination);
        if (mobile) assert.equal(destination.x, 0, "Mobile movement stays in its side margin");
        if (!mobile && chapter.side === "left") {
          assert.equal(width - size.right - size.width + destination.x, 20, "Left landing keeps an edge margin");
          if (downloadsVisible) assert.ok(size.bottom - destination.y >= 90, "Left landing clears the download button");
        }
        const reduced = companionDestination(chapter, width, height, downloadsVisible, true);
        assert.deepEqual(reduced, { x: 0, y: -0, side: "right" }, "Reduced motion keeps a stationary guide");
        for (let step = 0; step <= 100; step++) {
          const progress = step / 100;
          const lift = Math.abs(previous.x - destination.x) >= 8 ? Math.min(44, height * .055) : 0;
          inside({
            x: previous.x + (destination.x - previous.x) * progress,
            y: previous.y + (destination.y - previous.y) * progress - Math.sin(progress * Math.PI) * lift,
          });
        }
        previous = destination;
      }
    }
  }
}
console.log(`Companion journey: ${cases.toLocaleString()} rest and flight positions fit; mobile, reduced motion and download clearance passed.`);
