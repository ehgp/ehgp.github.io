# AGENTS.md

## Mission Brief

- Replace the current Python 3.8.16 + Frozen-Flask site (`website.py`, `templates/`, `content/`, `_build/`) with a statically exported Next.js 16 + TypeScript + MUI v7 portfolio that retains all existing content and theme cues while adding modern interactions.
- Preserve the monochrome+purple visual identity defined in `static/style.css` (black #000 backgrounds, white #fff typography, purple accent `rgb(211,144,211)` / `#d390d3`, muted gray #333) and the Inter/Roboto Mono typography choices.
- Mirror every page and data point from the Markdown/source files (`content/home.md`, `content/about.md`, `content/my-work.md`) and template fragments (`templates/*`) inside the new application, expanding them into richer card layouts, animated sections, and responsive behavior.
- Maintain deployability to GitHub Pages by producing a full static export (`next build && next export`) and retiring the Frozen-Flask freezer-only workflow once the Next.js pipeline is verified.

## Current State Snapshot

- Flask app entry (`website.py`) renders Markdown via `markdown2` and Jinja templates layered over a single `base.html` layout. Deployment relies on `freezer.py` and `_build/` artifacts promoted to `gh-pages` through `.github/workflows/python-lint-analyze-test-build-frozen-flask.yml`.
- Static assets live under `static/` (favicons, `wave.gif`, `sketch.js` eyelid animation, `resume-pic.webp`, manifest) and `media/`. CSS is centralized in `static/style.css` and controls the entire theme.
- Content highlights:
  - Home: emoji greeting, hero tagline, GitHub stats/streak cards, badge grids (languages, frameworks, tools, platforms), Wakatime embed, and social buttons.
  - My Work: Markdown introduction + Google Drive project embed (`1UvN-gFCw8ms_Yo7RnwL3kBEOU8pJAKRE`).
  - About: Profile banner (`me-card.html`), summary list from `content/about.md`.
  - Contact + Resumes: icon list of socials, mailto obfuscation, Drive-based resume embed (`1yokQ2vI0eXsm9Uc5RfBffDwV5nTR01wz`).
- Package metadata already includes Next 16 scripts but lacks an implemented React codebase. Requirements.txt/pyproject still lock onto Flask/Frozen-Flask 0.18.

## Target Stack & Guardrails

- **Runtime & Tooling:** Node.js 20 (or latest LTS), npm (or pnpm) with lockfile committed, TypeScript ≥ 5.6 in strict mode, ESLint 9 + `@typescript-eslint`, Prettier, Husky + lint-staged, Jest or Vitest + React Testing Library.
- **Framework:** Next.js 16 App Router (`src/app`), React 19, MUI v7 (`@mui/material@^7`, `@emotion/react`, `@emotion/styled`, `@mui/icons-material`).
- **Styling & Animations:** MUI theme overrides + CSS variables for palette, Framer Motion for declarative transitions, and `prefers-reduced-motion` fallbacks.
- **Content Pipeline:** Either Contentlayer, MDX, or strongly typed JSON/TS modules that ingest the existing Markdown while allowing the heavy HTML (badge sections) to live in MDX-friendly components.
- **Deployment:** `next build` + `next export` to `out/`, publish via `peaceiris/actions-gh-pages@v3` (Node job) or migrate to Vercel; keep Frozen-Flask pipeline until static export is validated.
- **Compliance Requirements:**
  - Before modifying any tracked file, duplicate it to `filename.BAK` (or `filename.YYYYMMDDHHMM.BAK`) using `cp file file.BAK`. Never skip this backup step.
  - Preserve color palette, fonts, wording, and Google integrations (Tag Manager `GTM-WFF39GD`, AdSense `ca-pub-6937005527826464`, visitor badge) unless replacements are explicitly approved.
  - Every new UI addition must stay responsive (≥320px) and ship accessible focus states, alt text, and keyboard navigation.
  - Secrets/IDs must come from environment variables (`NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_ADSENSE_CLIENT`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `FORMSPREE`, `NEXT_PUBLIC_CONTACT_ENDPOINT`) sourced via `.env.local`, never hard-coded.

## Migration Plan (LLM Execution Steps)

1. **Baseline & Backups**
   - Verify `.BAK` copies exist for any file you intend to rewrite (ex: `cp templates/base.html templates/base.html.BAK`).
   - Document current behavior via screenshots or notes so feature parity can be checked later; note third-party embed IDs and social handles.

2. **Next.js 16 Foundation**
   - Initialize `src/app` with `layout.tsx`, `page.tsx` (Home), and route segments for `/about`, `/my-work`, `/contact`, `/resumes`.
   - Add `tsconfig.json` with strict settings, baseUrl `src`, and path aliases (`@/components`, `@/content`).
   - Create `next.config.mjs` enabling static export (`output: 'export'`), remote image allow-list (`github-readme-stats.vercel.app`, `github-readme-streak-stats.herokuapp.com`, `img.shields.io`, `wakatime.com`, `visitor-badge.laobi.icu`, `drive.google.com`), and disable `swcMinify` only if necessary.

3. **Design System & Theme**
   - Build a dedicated `src/theme/palette.ts` that codifies:
   - `primary.main = #d390d3`, `primary.contrastText = #ffffff`
   - `background.default = #000000`, `background.paper = #0a0a0a`
   - `text.primary = #f5f5f5`, `text.secondary = #bdbdbd`
   - `divider = #333333`

- Load Inter + Roboto Mono via `next/font/google`, inject through `<CssBaseline />`, and mirror the card/glow look with `Paper` shadows and `boxShadow: '-40px -22px 0 0 rgba(128,0,128,0.35)'`.
- Encapsulate repeated card shells (title, optional arrow link, body) as a `SectionCard` component with variants for hero/about/work/contact/resume.
- Wrap the entire layout body with `AppRouterCacheProvider` from `@mui/material-nextjs/v14-appRouter` before mounting the app’s theme provider so that Emotion caches stay in sync across SSR/CSR and prevent hydration mismatches.
- Expose client-only libs (MUI ThemeProvider, reCAPTCHA provider, animations) inside dedicated client components so server components stay deterministic.

4. **Content Migration**
   - Convert Markdown files into either MDX (`/content/*.mdx`) or structured data modules (e.g., `src/content/home.ts`) that export typed objects for: hero copy, badge metadata, stats image URLs, embed IDs, contact links, resume/project IDs.
   - Introduce a `data/socials.ts` file containing Twitter (`ehgp93`), LinkedIn (`/in/ehgp`), GitHub (`ehgp`), and email (obfuscated string). Provide helper utilities to render `mailto:` addresses while keeping obfuscation.
   - Recreate project/resume embeds using responsive wrappers (MUI `AspectRatio` or custom `ResponsiveEmbed`) with `iframe` attributes `loading="lazy"` and `referrerPolicy="no-referrer"`.
   - Port `static/sketch.js` into a lazily-loaded client component (dynamic import of `p5`) or replace it with a canvas-based React component that mimics the eye animation. Respect `prefers-reduced-motion` by pausing animation when necessary.

5. **Experience Enhancements**
   - Add Framer Motion transitions (fade/slide) for section entry, hero underline blink, and nav hover sweeps; use `reducedMotion` hook to disable when needed.
   - Implement sticky/slide-in nav replicating `ul#navbar` styling, but optimized for mobile (hamburger + Drawer) while keeping the uppercase typography.
   - Build reusable components for GitHub stats badges and language/framework grids; load data from config arrays to limit HTML duplication.
   - Introduce call-to-action buttons (Projects, Contact) with subtle gradients or animated outlines matching the original purple accent.
   - Ship an accessible contact form that relies on `react-google-recaptcha-v3`, Formik validation, and environment-driven targets. On submit, attach the reCAPTCHA token and POST JSON to `FORMSPREE` (preferred) or `NEXT_PUBLIC_CONTACT_ENDPOINT`; surface success/error states inline, disable the button while submitting, and verify tokens server-side as documented in `docs/recaptcha-server-example.md`.

6. **Testing, Accessibility & Performance**
   - Add unit tests for content mappers and page rendering (React Testing Library). Use Playwright or Cypress smoke tests for nav routing.
   - Run `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build` before every commit. Fix warnings, especially around `Image` remote sources and `iframe` `allow` attributes.
   - Use Lighthouse (desktop & mobile) to confirm ≥95 performance/accessibility. Tune MUI loading (`next/script` for GTM/AdSense deferred) to avoid layout shift.

7. **CI/CD & Deployment**
   - Replace the Python workflow with a Node-based pipeline: checkout → `actions/setup-node@v4` (Node 20) → `npm ci` → lint/typecheck/test/build/export → deploy `out/` via `peaceiris/actions-gh-pages@v3`.
   - Keep the legacy Flask workflow reachable (rename to `python-legacy.yml`) until the Next export has been live-tested. Document rollback steps.
   - Update README to describe the new stack and remove instructions about running `freezer.py` once migration completes.

## Implementation Guidelines

- **Directory Layout (new):**
  - `src/app/(pages)/page.tsx`, `about/page.tsx`, etc. for routes.
  - `src/components/` for SectionCard, Navbar, Hero, BadgeGrid, ContactList, ResumeEmbed, ProjectEmbed, AnimatedBackground.
  - `src/content/` or `src/data/` for structured content mirroring Markdown.
  - `public/` for all assets from `static/` (favicons, `wave.gif`, manifest, resume picture) plus newly generated `robots.txt` and `sitemap.xml` via Next route handlers.
  - `legacy/flask/` (optional) to archive `website.py`, `templates/`, `content/` once the move is complete.
- **Theme & Typography:** Use MUI's ThemeProvider at the root, expose palette + typography tokens through `Theme` augmentation, and centralize spacing constants (e.g., 8px grid). Keep uppercase headings for section titles.
- **Animations:** Use Framer Motion `motion.div` wrappers with spring transitions for hero text, nav underline sweeps, and card hover lifts (`scale: 1.02`). Provide `prefersReducedMotion` checks and disable heavy animations for `prefers-reduced-motion` users.
- **Responsiveness:** Implement CSS Grid/Stack breakpoints at 600px, 900px, 1200px; ensure nav collapses to Drawer under 768px. All embed iframes must be 100% width with 16:9 wrappers.
- **External Scripts:** Load GTM + AdSense through `next/script`, `strategy="afterInteractive"`, mirroring IDs from `base.html`. Provide noscript fallback for GTM.
- **Images & Icons:** Configure `next.config.mjs` remote patterns for GitHub badge providers and optionally download static badges into `/public/badges` if caching is needed. Use `@mui/icons-material` for socials while matching brand colors (#1DA1F2 for Twitter, #4078c0 for GitHub/LinkedIn, #ffa930 for email).
- **SEO:** Recreate canonical URL, og/twitter meta, theme color, favicon links, and Google site verification meta via the App Router `metadata` export. Add JSON-LD (`Person` schema) describing EHGP's roles.
- **Content Integrity:** Keep wording from Markdown files verbatim unless asked otherwise. Provide toggles (accordion) for the long badge sections similar to the `<details>` sections currently used.
- **Data Privacy:** Do not hard-code secrets. If adding contact forms or reCAPTCHA (`react-google-recaptcha-v3` already listed), load keys via environment variables and expose only the site key client-side.

## Repository Guidelines

- **Backups:** Every edit must start with `cp <file> <file>.BAK`. Include `.BAK` files in `.gitignore` only after confirming the user no longer needs them; until then, keep them tracked so diffs are obvious.
- **Branching:** Use feature branches (`feature/next-migration`, `chore/update-theme`). Never merge directly to `main` without CI passing.
- **Commits:** Conventional Commits (`feat:`, `chore:`, `fix:`). Reference issues/TODO items (e.g., `TODO-AGENTS.md`) when applicable.
- **Tooling:**
  - `npm run dev` → Next dev server.
  - `npm run lint` → ESLint.
  - `npm run typecheck` → `tsc --noEmit`.
  - `npm run test` → unit/integration tests.
  - `npm run build && npm run export` → production bundle to `out/`.
- **Coding Standards:** Enforce TypeScript strictness, avoid `any`, prefer hooks + server components where static data suffices, and isolate client-only behavior (`"use client"`). Document complex logic with concise comments.
- **Documentation:** Update README + AGENTS anytime instructions change. Include screenshots/gifs after major visual work. Track open questions inside `TODO-AGENTS.md`.
- **Documentation of dynamic UX:** Whenever animations, embed behaviors, or third-party scripts change, record the decision (including fallbacks and accessibility impacts) in AGENTS + README. Supplement with `docs/animation-embed-guidelines.md` (animations/embeds/cache), `docs/recaptcha-server-example.md` (backend verification), `docs/badge-strategy.md` (badge hosting rationale), and `docs/observability.md` (Lighthouse + screenshot workflow).
- **Legacy Code:** Keep Flask files read-only references until the Next.js site is deployed; after sign-off, move them under `legacy/` with notes explaining archival status.

## Validation Checklist (Run Before Hand-off)

- `.BAK` exists for each modified file.
- `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e`, `npm run build`, `npm run export` all succeed locally.
- Lighthouse ≥95 on both desktop and mobile for Performance, Accessibility, Best Practices, SEO.
- All remote embeds (GitHub stats, Wakatime, Google Drive) render inside responsive containers without console errors.
- Animations respect `prefers-reduced-motion` and maintain ≥45fps on mid-tier hardware.
- CI workflow green on GitHub Actions, artifact `out/` published to `gh-pages`.
- README + AGENTS describe the new stack and steps accurately.
- `.env` values (`NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_ADSENSE_CLIENT`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `NEXT_PUBLIC_CONTACT_ENDPOINT`) exist in deployment environments or the contact form/analytics are gracefully disabled with warnings.

## Deliverables & Open Items

- ✅ This AGENTS.md directive.
- ✅ Next.js 16 codebase with replicated content, animations, and theming.
- ✅ Updated CI/CD pipeline, README, and environment variable guidance.
- ✅ Documented decision to retain the p5-inspired animation as a React client component with reduced-motion safeguards.
- ✅ Archived Flask assets under `legacy/flask/` for rollback.

Follow this document whenever an LLM is instructed to work inside `ehgp.github.io`. Update the plan (with a fresh `.BAK`) any time new requirements arrive.
