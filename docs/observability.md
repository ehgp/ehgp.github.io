# Visual + Lighthouse Workflow

1. Run `npm run build` to produce `out/`.
2. Capture Lighthouse metrics locally with `npm run lighthouse` (uses `lighthouserc.json` to analyze the static export). Attach the HTML/JSON output to PRs as needed.
3. Store screenshots in `docs/screenshots/` with filenames like `2025-11-11-home-desktop.png`. Include both desktop and mobile captures after any significant design change.
4. Record the Lighthouse scores (Performance, Accessibility, Best Practices, SEO) in PR descriptions or `docs/screenshots/README.md` to prove compliance with the ≥95 target from AGENTS.md.
