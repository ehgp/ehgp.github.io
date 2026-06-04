# AGENTS-TODO.md -- Outstanding Work (Project: ehgp.github.io Portfolio)

**Last updated**: 2026-04-09

## Priority 1 (Blocking / Critical)
- [ ] Complete Next.js 16 migration -- React codebase implementation is not yet in place despite package.json scripts
- [ ] Implement `src/app` routes: Home, About, My Work, Contact, Resumes (currently only Flask templates exist)
- [ ] Migrate content from Markdown files (`content/home.md`, `content/about.md`, `content/my-work.md`) to Next.js components or MDX
- [ ] Create MUI v7 theme provider with existing palette: primary `#d390d3`, background `#000`, text `#f5f5f5`, divider `#333`

## Priority 2 (Important)
- [ ] Port `static/sketch.js` eyelid animation to a React client component with `prefers-reduced-motion` fallback
- [ ] Implement responsive nav (desktop + mobile hamburger/drawer) matching uppercase typography style
- [ ] Set up CI/CD: replace Python workflow with Node-based pipeline (checkout, setup-node, npm ci, lint, typecheck, test, build, deploy)
- [ ] Add SEO metadata exports: canonical URL, og/twitter meta, theme color, favicon links, JSON-LD Person schema
- [ ] Configure `next.config.mjs` remote image patterns for GitHub badge providers, Wakatime, visitor badge
- [ ] Implement Google Tag Manager (`GTM-WFF39GD`) and AdSense (`ca-pub-6937005527826464`) via `next/script`
- [ ] Create `.BAK` copies of all modified files per compliance requirements in AGENTS.md

## Priority 3 (Nice to Have)
- [ ] Achieve Lighthouse scores >= 95 on desktop and mobile for Performance, Accessibility, Best Practices, SEO
- [ ] Add Framer Motion transitions (fade/slide for section entry, hero underline blink, nav hover sweeps)
- [ ] Build reusable badge grid components for languages/frameworks/tools (currently duplicated HTML)
- [ ] Add contact form with reCAPTCHA v3 + Formspree integration using environment-driven config
- [ ] Add Playwright or Cypress smoke tests for navigation routing
- [ ] Implement accessible focus states, alt text, and keyboard navigation on all interactive elements

## Backlog
- [ ] Archive Flask files under `legacy/flask/` once Next.js deployment is verified
- [ ] Replace static badge images with dynamically fetched badges from GitHub APIs
- [ ] Add dark/light mode toggle (currently monochrome-only)
- [ ] Implement sitemap.xml and robots.txt generation
- [ ] Add Wakatime stats component with responsive embed wrapper
- [ ] Consider Vercel deployment as alternative to GitHub Pages
