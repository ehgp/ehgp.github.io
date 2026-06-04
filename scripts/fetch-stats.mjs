// Build-time stats cache.
// Downloads each stats card SVG and writes valid ones to public/stats/.
// The site references the local copies, so it never depends on the external
// services at runtime (which periodically pause / rate-limit).
//
// Run: npm run stats:fetch
//
// A fetch is only written when it is a real SVG and NOT an error card, so a
// paused upstream or an empty WakaTime profile keeps the last good cached copy
// instead of overwriting it with a broken card.

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "stats");

const GRS = "https://github-readme-stats-plum-psi.vercel.app";
const STREAK = "https://github-readme-streak-stats.herokuapp.com";

// `required: true` sources fail the job when they can't be cached.
// WakaTime is optional: it renders an error card until the profile has tracked
// public coding activity, so a skip there is expected, not a failure.
const SOURCES = [
  {
    name: "activity",
    required: true,
    url: `${GRS}/api?username=ehgp&include_all_commits=true&show_icons=true&theme=github_dark&hide_border=true`,
  },
  {
    name: "streak",
    required: true,
    url: `${STREAK}/?user=ehgp&theme=tokyonight&hide_border=true`,
  },
  {
    name: "top-langs",
    required: true,
    url: `${GRS}/api/top-langs/?username=ehgp&theme=github_dark&hide_border=true&hide=Jupyter%20Notebook,css,html,scss,solidity,python,MATLAB&layout=compact`,
  },
  {
    name: "wakatime",
    required: false,
    url: `${GRS}/api/wakatime?username=ehgp&theme=github_dark&hide_border=true`,
  },
];

const ERROR_MARKERS = [
  "Something went wrong",
  "Maximum retries",
  "rate limit",
  "Wakatime user not found",
  "No coding activity",
];

function validateSvg(body) {
  const trimmed = body.trimStart();
  if (!trimmed.startsWith("<svg")) {
    return "not an SVG";
  }
  const marker = ERROR_MARKERS.find((m) =>
    body.toLowerCase().includes(m.toLowerCase()),
  );
  if (marker) {
    return `error card ("${marker}")`;
  }
  return null;
}

async function fetchSource({ name, url }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 40_000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      return { ok: false, reason: `HTTP ${res.status}` };
    }
    const body = await res.text();
    const problem = validateSvg(body);
    if (problem) {
      return { ok: false, reason: problem };
    }
    await writeFile(join(OUT_DIR, `${name}.svg`), body, "utf8");
    return { ok: true, bytes: body.length };
  } catch (err) {
    return { ok: false, reason: err.name === "AbortError" ? "timeout" : err.message };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const results = await Promise.all(
    SOURCES.map(async (source) => ({ source, result: await fetchSource(source) })),
  );

  let requiredFailures = 0;
  for (const { source, result } of results) {
    if (result.ok) {
      console.log(`OK    ${source.name.padEnd(10)} ${result.bytes} bytes`);
    } else {
      const tag = source.required ? "FAIL " : "SKIP ";
      console.log(`${tag}${source.name.padEnd(10)} ${result.reason} (kept existing copy)`);
      if (source.required) requiredFailures += 1;
    }
  }

  if (requiredFailures > 0) {
    console.error(`\n${requiredFailures} required source(s) failed.`);
    process.exit(1);
  }
}

main();
