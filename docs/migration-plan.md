# Next.js 16 + MUI v7 Migration Plan

## Objectives

1. Rebuild ehgp.github.io as a statically exported Next.js 16 + TypeScript portfolio that mirrors all existing Flask content, theme colors, and Google integrations documented in `AGENTS.md`.
2. Adopt MUI v7 for theming/layout, Framer Motion for animations, and modern DX tooling (TS strict mode, ESLint 9, Jest/Vitest, Husky + lint-staged).
3. Preserve deployability to GitHub Pages via `next build && next export` while maintaining a rollback path to the Frozen-Flask `_build` artifacts until validation completes.

## Guiding References

- Next.js 16 App Router + upgrade considerations, static export, metadata, and image requirements.
- MUI v7 theming and palette customization guidance.
- Repository constraints captured in `AGENTS.md` (palette, typography, .BAK workflow, CI expectations).

## Phase 0 – Inventory & Backups

- Snapshot current Flask files (`website.py`, `templates/*.html`, `static/`, `content/*.md`, `_build/`) and store `.BAK` copies before edits.
- Export current site screenshots for regression reference (desktop + mobile) and note embed IDs (GitHub stats, Google Drive, Wakatime) inside `docs/content-inventory.md`.
- Confirm Node.js 20.x and npm/pnpm LTS installed; upgrade if necessary.

## Phase 1 – Tooling & Project Scaffolding

1. Initialize Next.js 16 App Router structure within existing repo:
   - Create `src/app/layout.tsx`, `src/app/page.tsx`, and subfolders for `/about`, `/my-work`, `/contact`, `/resumes`.
   - Configure `tsconfig.json` (strict true, isolatedModules, baseUrl `src`, paths for `@/components/*`, `@/content/*`).
   - Add `next.config.mjs` with `output: 'export'`, remote image allow-list for badge/stat providers, and instrumentation for `next/script` analytics.
2. Update `package.json` dependencies/devDependencies per AGENTS targets (Next 16, React 19, `@mui/material@^7`, `@emotion/*`, `framer-motion`, `contentlayer` or MDX tooling, ESLint 9 stack, testing libs). Install with lockfile committed.
3. Add root scripts: `dev`, `build`, `export`, `lint`, `typecheck`, `test`, `format`, `prepare` (Husky).

## Phase 2 – Design System & Global Layout

1. Create `src/theme/index.ts` exporting a `ThemeOptions` object with palette values from `static/style.css` (black backgrounds, white text, purple accent, #333 divider) and typography mapping Inter / Roboto Mono using `next/font/google`.
2. Build shared layout components:
   - `AppThemeProvider` for `ThemeProvider`, `CssBaseline`, and color scheme meta tags.
   - `Navigation` replicating the original vertical nav styling with responsive Drawer fallback and Framer Motion hover underline.
   - `SectionCard`, `SectionTitle`, `PageContainer`, `ResponsiveEmbed` components for consistent surface/spacing.
3. Implement metadata in `layout.tsx` (title templates, descriptions, canonical URL, OpenGraph/Twitter, theme color, Google verification) leveraging Next 16 metadata API.

## Phase 3 – Content Pipeline

1. Decide ingestion strategy:
   - Preferred: MDX via Contentlayer to import Markdown + embedded JSX for badge grids.
   - Alternate: Convert Markdown to structured TS objects with sanitized HTML strings.
2. Create `src/content/home.mdx`, `about.mdx`, `my-work.mdx` by porting `content/*.md`. Wrap long badge sections inside collapsible components replicating `<details>` UX.
3. Introduce `src/data/socials.ts`, `src/data/embeds.ts` to hold contact links, Google Drive IDs, GitHub stats endpoints, Wakatime config. Include obfuscated email helper.
4. Recreate `sketch.js` behavior as a client-only `EyeSketch` component using P5 or Canvas API with `prefersReducedMotion` guard.

## Phase 4 – Feature Implementation

1. Build page routes:
   - Home: hero heading, tagline card, GitHub stats grid, language/framework badges, social buttons, Wakatime embed, visitor counter.
   - About: profile banner, summary markdown, contact CTA.
   - My Work: Markdown intro, Google Drive project embed, CTA buttons.
   - Contact: icon list with MUI icons, `mailto:` obfuscation, optional contact form using `react-google-recaptcha-v3` site key env.
   - Resumes: Google Drive embed, link downloads.
2. Add Framer Motion animations (fade-up on cards, hover lift, blink caret). Provide `useReducedMotion` checks.
3. Ensure all embed iframes and canvases are responsive, lazy-loaded, and accessible (title, `aria-label`).
4. Port static assets to `public/` (favicons, `wave.gif`, `resume-pic.webp`, manifest, robots, sitemap). Add Next route handlers for `robots.txt`/`sitemap.xml` if needed.

## Phase 5 – Testing & Quality Gates

1. Configure ESLint (Next core web vitals + custom rules), Prettier, Stylelint (optional). Wire Husky pre-commit to run `lint-staged`.
2. Implement unit/component tests (React Testing Library) covering page routes, SectionCard, ResponsiveEmbed, email obfuscation. Add integration smoke tests with Playwright or Cypress (optional) for nav/navigation.
3. Run Lighthouse audits (desktop + mobile) to confirm ≥95 across PWA metrics; adjust image optimization, script loading as required.

## Phase 6 – CI/CD & Deployment

1. Replace `.github/workflows/python-lint-analyze-test-build-frozen-flask.yml` with a Node-based pipeline:
   - Steps: checkout → `actions/setup-node@v4` (Node 20) → `npm ci` → `npm run lint` → `npm run typecheck` → `npm run test` → `npm run build && npm run export` → deploy `out/` via `peaceiris/actions-gh-pages@v3`.
   - Temporarily keep the Flask workflow under a new filename (`python-legacy.yml`) until the Next export is live-tested.
2. Update README to describe the new stack, local dev commands, and deployment strategy; archive Flask instructions under a "Legacy" section.
3. After successful deploy verification on GitHub Pages, tag release (e.g., `v2.0.0-next`) and remove Frozen-Flask dependencies from `requirements.txt`/`pyproject.toml` (with `.BAK` backups).

## Validation Checklist

- `.BAK` exists for every edited legacy file.
- `npm run lint`, `typecheck`, `test`, `build`, `export` succeed locally and in CI.
- All pages render content parity vs. Flask version (copy, embeds, imagery) and respect color/typography rules.
- Animations pause for `prefers-reduced-motion`; nav + cards meet WCAG focus/contrast.
- GitHub Pages hosts the `out/` artifacts with canonical URLs and analytics scripts functioning.

## Deliverables

1. Completed Next.js codebase under `src/` with theming, content, and components.
2. Updated documentation: `README`, `AGENTS`, `docs/migration-plan.md`, content inventory, deployment notes.
3. Passing CI workflow and published static site on `https://ehgp.github.io`.
4. Archived Flask implementation kept in `legacy/` or referenced via `.BAK`/git history for rollback.
