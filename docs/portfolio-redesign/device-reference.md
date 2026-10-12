# Device reference and rendering notes

Reviewed 12 October 2026. The showcase deliberately uses two coherent 2024 models: a **silver 14-inch MacBook Pro with M4 Pro** and a **Natural Titanium iPhone 16 Pro**. These retain the existing portfolio finish without mixing features from different generations.

## Official references inspected

- [MacBook Pro technical specifications](https://support.apple.com/en-us/121553): 312.6 × 221.2 × 15.5 mm closed; 3024 × 1964 display. These ratios drive `DEVICE_DIMENSIONS`, including the closed stack of feet, base, hinge and lid.
- [MacBook front photograph](https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/mbp14-m4-2024.png), [left side](https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/charging-expansion-en-2.png) and [right side](https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/charging-expansion-en-1.png): visually checked the rounded base, thin lid, inset keyboard, larger trackpad, notch and port order. Left: MagSafe, two Thunderbolt sockets, headphone jack. Right, rear to front: HDMI, Thunderbolt, SDXC.
- [iPhone 16 Pro technical specifications](https://support.apple.com/en-us/121031) and [official product photograph](https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/121031-iphone-16-pro.png): checked the titanium rail, matte back, front glass seam, rounded corners and three-camera assembly. Camera Control belongs to this model and is now included.
- [Apple iPhone 16 Pro dimensional drawing](https://developer.apple.com/download/files/accessories/dimensional-drawings/iphone-16-pro.pdf): drawing dimensions are 71.45 × 149.61 × 8.25 mm; active display 66.57 × 144.79 mm; glass 69.45 × 147.61 mm. Camera protrusion is 4.28 mm from the back glass, with a lower plateau. Body, glass, screen and camera positions use these proportions. The rear camera triangle was also corrected for the model’s front-facing coordinate system.

The models remain lightweight, procedural presentation geometry, not an Apple-provided CAD asset or an exact manufacturing reproduction. Continuous corner profiles, material response, tiny connector interiors and keyboard symbols are visual approximations. The references were inspected, not copied into the website.

## Screen image quality

Screens now load the original local screenshots instead of requesting a 1920/1080-pixel, quality-75 recompression. Native examples: ExtendedForms 3444 × 1780; Quzo dashboard 1673 × 906; Hey Buddy welcome and onboarding 1290 × 2796. The existing Hey Buddy launch source is 594 × 1154; upscaling cannot create missing detail. VocalXI sources are 1265 × 712. The renderer uses antialiasing, up to 2× display density, trilinear mipmaps and up to 16× anisotropic filtering, capped to the GPU capability. Three.js respects the GPU maximum texture size.

Every screen is preloaded into the same persistent material. Its 480 ms crossfade keeps both the hardware and the last valid screen present while the next image loads. No device remount or blank loading frame is introduced.

## Verification

`node --experimental-strip-types scripts/device-framing-test.mjs` checks 36,360 projected corners, fifteen viewport ratios and 101 scroll poses, including lid closure, phone rotation and zoom. It also checks the published width/depth/thickness ratios, screen aspect ratios, keycap clearance under the closed lid, reduced motion and transient zero-size layouts. Focused lint and TypeScript pass. A browser check at 1265 × 720 showed both front displays rendering cleanly and no console errors. Broader page-level viewport review is handled with the integrated portfolio changes.

A mobile review caught depth-buffer interference between the thin display glass and its image plane. The camera now derives its near/far clipping planes from the complete swept device bounds, with 0.6 scene units of padding. The screen also has a minimal depth bias. The framing test verifies more than 100 distinct 24-bit depth-buffer steps between the laptop glass and display at each viewport’s reading pose, without changing the physical lid clearance.
