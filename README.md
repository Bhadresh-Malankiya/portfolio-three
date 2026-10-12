# The Weekend Builder — immersive portfolio

Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion, Lenis and React Three Fiber.

The homepage follows a question → build → ship story with a real 3D paper plane. Desktop scrolling unfolds the story; mobile and reduced-motion visitors can choose chapters directly. Separate MacBook and iPhone stages showcase the featured work. A small animated cartoon guide tracks each section and reveals the profile card and CV on hover, focus or tap. Book downloads remain available.

## Development

```sh
npm ci
npm run dev
npm run lint
npm run build
```

Use Node.js 22.13 or newer supported LTS. `npm run start` serves the production build. Vercel deploys the `main` branch.

## Content and components

- `src/data/portfolio.ts` is the public project presentation: employer contributions, founder ventures, public screenshots and current profile context. `src/data/projects.ts` retains the original project archive.
- `src/data/profile.ts` contains identity/contact details; `src/data/experience.ts` contains the career timeline.
- `Hero.tsx`, `three/PaperPlaneScene.tsx` and `app/hero-story.css` implement the opening story and folded-paper geometry.
- `FloatingContactCard.tsx`, `three/BuilderAvatar.tsx`, `lib/companion-sections.ts` and `app/companion.css` implement the animated guide and downloadable CV card.
- `DeviceGallery.tsx` and `three/DeviceScene.tsx` implement the separate scroll-driven desktop and mobile project chapters.
- `ProjectGallery.tsx` provides screenshot inspection, zoom, keyboard navigation and focus restoration on case-study pages.
- `public/downloads/` retains the résumé and memoir PDFs. Source working documents stay ignored.

## Verification

`npm run lint`, `npm run build`, and `npm audit --audit-level=high` check the source and dependencies. The GitHub workflow also runs `scripts/portfolio-smoke.mjs` against a production server, checking routes, responsive overflow, images, gallery controls, downloads, reduced motion and no-JavaScript rendering. Browser evidence in `docs/portfolio-redesign/` records the earlier recruiter-first design; it is historical, not a capture of the latest animation.
