# Animation, Embed, and Cache Guidance

## Animations
- **EyeSketch** mirrors the legacy `sketch.js` eye animation. It dynamically imports `p5` inside a client component and pauses automatically when `prefers-reduced-motion: reduce` is true. When updating animation parameters, keep randomness deterministic on the server (only run inside the client component) to avoid hydration drifts.
- **Framer Motion cards/nav** must wrap `motion` components inside Client Components. Always guard high-motion effects with `usePrefersReducedMotion`.
- Document animation changes in README + AGENTS and capture Lighthouse perf results after major tweaks.

## Embeds (GitHub, Drive, Wakatime)
- Store all embed URLs in `src/data/embeds.ts`. This ensures React Server Components render deterministic HTML when building static pages.
- Wrap every `<iframe>` in `DriveEmbed` to enforce lazy loading, `referrerPolicy`, and responsive sizing.
- For images loaded via external SVG generators (GitHub badges, shields), keep the remote domains listed in `next.config.mjs.images.remotePatterns`.

## Cache & Static Export Notes
- The project uses `output: 'export'`. Do not rely on runtime server functions.
- Revalidate expensive external data separately (e.g., via scheduled jobs) if future features need fresh APIs.
- Always run `npm run build` locally before pushing—static export will fail fast if a component depends on server-only APIs.

## Screenshot & Lighthouse Checklist
- After major UI or animation changes, update the screenshot in `public/` (or `docs/`) and run Lighthouse (Desktop + Mobile). Record scores inside PR descriptions.
- Store any additional screenshots or videos under `docs/screenshots/` with filenames like `2025-11-11-home-desktop.png`.
