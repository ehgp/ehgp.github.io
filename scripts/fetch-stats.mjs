// Build-time stats cache.
// Downloads each stats card SVG and writes valid ones to public/stats/.
// The site references the local copies, so it never depends on the external
// services at runtime (which periodically pause / rate-limit).
//
// Run: npm run stats:fetch
//
// Most sources are SVG cards from github-readme-stats / streak-stats. WakaTime
// is fetched as JSON straight from the WakaTime public API and rendered into an
// SVG here, because the github-readme-stats WakaTime endpoint reports ANY
// upstream hiccup (notably rate-limiting of its server IP) as the misleading
// "Wakatime user not found" error card. Going to the source removes that
// middleman.
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
const WAKATIME = "https://wakatime.com/api/v1/users/ehgp/stats/last_7_days";

function escapeXml(value) {
  return String(value).replace(
    /[<>&'"]/g,
    (c) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[
        c
      ],
  );
}

// Renders the WakaTime "last 7 days" payload into a themed SVG card.
// Colors follow github_dark (to sit beside the other cached cards) with the
// site's purple accent (#d390d3) on the title and language bars.
function renderWakatimeSvg(data) {
  const W = 495;
  const BG = "#0d1117";
  const TITLE = "#d390d3";
  const TEXT = "#c9d1d9";
  const SUB = "#8b949e";
  const BAR_BG = "#333333";
  const BAR_FILL = "#d390d3";

  const total = escapeXml(data.human_readable_total || "0 secs");
  const daily = escapeXml(data.human_readable_daily_average || "0 secs");
  const langs = Array.isArray(data.languages) ? data.languages.slice(0, 5) : [];

  const FONT = "'Segoe UI', Ubuntu, Helvetica, Arial, sans-serif";
  const BODY_TOP = 72;
  const ROW_H = 26;
  const BAR_X = 150;
  const BAR_W = 230;

  let body;
  let height;
  if (langs.length === 0) {
    height = 118;
    const message =
      (data.total_seconds || 0) > 0
        ? "Language breakdown is private."
        : "No tracked coding time in the last 7 days.";
    body = `  <text x="25" y="${BODY_TOP + 18}" fill="${SUB}" font-size="13" font-family="${FONT}">${message}</text>`;
  } else {
    height = BODY_TOP + langs.length * ROW_H + 12;
    body = langs
      .map((lang, i) => {
        const y = BODY_TOP + i * ROW_H;
        const pct = Math.max(0, Math.min(100, Number(lang.percent) || 0));
        const fillW = ((BAR_W * pct) / 100).toFixed(1);
        const rawName = String(lang.name || "");
        const name = escapeXml(
          rawName.length > 14 ? `${rawName.slice(0, 13)}…` : rawName,
        );
        const text = escapeXml(lang.text || `${pct.toFixed(1)}%`);
        return `  <g transform="translate(0, ${y})">
    <text x="25" y="13" fill="${TEXT}" font-size="13" font-family="${FONT}">${name}</text>
    <rect x="${BAR_X}" y="4" width="${BAR_W}" height="8" rx="4" fill="${BAR_BG}"/>
    <rect x="${BAR_X}" y="4" width="${fillW}" height="8" rx="4" fill="${BAR_FILL}"/>
    <text x="${W - 15}" y="13" fill="${SUB}" font-size="12" font-family="${FONT}" text-anchor="end">${text}</text>
  </g>`;
      })
      .join("\n");
  }

  return `<svg width="${W}" height="${height}" viewBox="0 0 ${W} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="WakaTime last 7 days">
  <rect width="${W}" height="${height}" rx="6" fill="${BG}"/>
  <text x="25" y="32" fill="${TITLE}" font-size="18" font-weight="600" font-family="${FONT}">WakaTime &#183; Last 7 Days</text>
  <text x="25" y="54" fill="${SUB}" font-size="12" font-family="${FONT}">Total ${total} &#183; Daily avg ${daily}</text>
${body}
</svg>`;
}

// `required: true` sources fail the job when they can't be cached.
// WakaTime is optional: if the API is unreachable or rate-limited at build
// time, the job keeps the last good cached copy instead of failing.
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
    json: WAKATIME,
    render: renderWakatimeSvg,
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

async function fetchSource({ name, url, json, render }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 40_000);
  try {
    const res = await fetch(json || url, { signal: controller.signal });
    if (!res.ok) {
      return { ok: false, reason: `HTTP ${res.status}` };
    }
    let body;
    if (json) {
      const payload = await res.json();
      if (payload.error) {
        return { ok: false, reason: `api error: ${payload.error}` };
      }
      body = render(payload.data || {});
    } else {
      body = await res.text();
    }
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
