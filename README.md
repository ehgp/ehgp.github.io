# ehgp.github.io (Next.js 16 + MUI v7)

A statically exported portfolio built with Next.js 16 App Router, TypeScript, and MUI v7. The site mirrors the original Flask experience while adding responsive layouts, motion-enhanced cards, and automated testing.

## Tech Stack

- **Framework:** Next.js 16 (App Router, `output: 'export'`)
- **UI:** MUI v7, Framer Motion, Next Font (Inter + Roboto Mono)
- **Language & Tooling:** TypeScript (strict), ESLint 9 flat config, Prettier 3, Vitest + React Testing Library, Husky + lint-staged
- **Static Hosting:** GitHub Pages via the `next-static-export` GitHub Actions workflow

## Getting Started

```bash
npm install
npm run dev        # start dev server
npm run lint       # eslint --max-warnings=0
npm run typecheck  # tsc --noEmit
npm run test       # vitest run (jsdom)
npm run test:e2e   # playwright test (launches dev server automatically)
npm run lighthouse # run Lighthouse against the static export in /out
npm run build      # next build -> static assets in /out
```

### Environment variables

Copy `.env.example` to `.env.local` and provide:

- `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_ADSENSE_CLIENT` – analytics/Adsense IDs.
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` – reCAPTCHA v3 site key powering the contact form.
- `NEXT_PUBLIC_CONTACT_ENDPOINT` – webhook or API endpoint that will receive submissions (e.g., Function, Zapier, Formspree).
- `FORMSPREE` – optional Formspree endpoint; takes precedence over `NEXT_PUBLIC_CONTACT_ENDPOINT` when set.

See `docs/recaptcha-server-example.md` for a sample Next.js API route that verifies tokens with Google before processing submissions.

Because `next.config.mjs` sets `output: 'export'`, `next build` creates the deployable `out/` directory that the workflow publishes to GitHub Pages.

## Project Structure

```
src/
  app/           # App Router routes (Home, About, Contact, My Work, Resumes)
  components/    # Reusable UI (SectionCard, HeroSection, EyeSketch, etc.)
  data/          # Structured content derived from the original markdown/templates
  hooks/         # Custom hooks (e.g., prefers-reduced-motion)
legacy/flask/    # Archived Frozen-Flask implementation + workflows/configs
public/          # Static assets copied from the legacy site
e2e/            # Playwright smoke tests
.github/workflows/next-static-export.yml  # Node-based CI/CD pipeline
```

## Legacy Flask App

The entire Frozen-Flask stack (templates, markdown content, static assets, requirements, and the original workflow) now lives under `legacy/flask/`. This keeps rollback artifacts available without interfering with the new Next.js toolchain.

## CI/CD

`.github/workflows/next-static-export.yml` runs on pushes/PRs to `main`:

1. `npm ci`
2. `npm run lint`
3. `npm run typecheck`
4. `npm run test`
5. `npm run test:e2e`
6. `npm run build` (emits `out/`)
7. Uploads `out/` as an artifact and deploys to GitHub Pages using `peaceiris/actions-gh-pages@v3` when on `main`.

## Accessibility & Motion

- Color palette and typography honor the legacy monochrome + purple branding
- All interactive elements keep focus outlines and ARIA labels where needed
- The legacy p5 eye animation is ported to a client component that automatically disables itself when `prefers-reduced-motion: reduce` is detected
- The contact form uses Formik + reCAPTCHA v3; configure the env vars above to connect it to your backend or webhook.

- Additional implementation notes:
  - `docs/animation-embed-guidelines.md` – animation fallbacks, embed rules, cache checklist.
  - `docs/badge-strategy.md` – reasoning for continuing to use shields.io along with mitigation plans.
  - `docs/observability.md` + `docs/screenshots/README.md` – workflow for capturing Lighthouse scores and UI screenshots.

For more detailed migration instructions, see `AGENTS.md` and `docs/migration-plan.md`.
