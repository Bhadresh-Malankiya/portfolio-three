# The Weekend Builder — immersive portfolio

Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion, Lenis and React Three Fiber.

The homepage uses an open gold ribbon sculpture and a scroll-driven featured-project deck. On desktop, cards unfold from a stack into a horizontal carousel. Narrow/short screens and reduced-motion settings use the native swipeable carousel. Book downloads and the original ID card remain available.

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
- `Hero.tsx`, `ProductObject.tsx`, and `three/ProductCore.tsx` implement the hero and original ribbon geometry.
- `ProjectShowcase.tsx` implements the stack/fan/carousel sequence, with keyboard controls and a skip link.
- `ProjectGallery.tsx` provides screenshot inspection, zoom, keyboard navigation and focus restoration on case-study pages.
- `public/downloads/` retains the résumé and memoir PDFs. Source working documents stay ignored.

## Verification

`npm run lint`, `npm run build`, and `npm audit --audit-level=high` check the source and dependencies. The GitHub workflow also runs `scripts/portfolio-smoke.mjs` against a production server, checking routes, responsive overflow, images, gallery controls, downloads, reduced motion and no-JavaScript rendering. Browser evidence in `docs/portfolio-redesign/` records the earlier recruiter-first design; it is historical, not a capture of the latest animation.
