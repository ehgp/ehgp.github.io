// Build-time stats cache.
// Generates each stats card SVG and writes valid ones to public/stats/.
// The site references the local copies, so it never depends on external
// services at runtime.
//
// Run: GITHUB_TOKEN=$(gh auth token) npm run stats:fetch
//
// The GitHub activity and top-languages cards are built straight from the
// GitHub REST/GraphQL APIs (using GITHUB_TOKEN, which GitHub Actions provides
// automatically) and rendered to SVG here — no github-readme-stats middleman,
// so there is no dependency on a self-hosted Vercel instance. WakaTime is
// likewise fetched as JSON from the WakaTime public API and rendered here.
// The streak card still comes from github-readme-streak-stats.herokuapp.com,
// cached with the committed copy as fallback.
//
// A result is only written when it is a real SVG and NOT an error card, so a
// paused upstream or an API failure keeps the last good cached copy instead
// of overwriting it with a broken card.

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "stats");

const LOGIN = "ehgp";
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const STREAK = "https://github-readme-streak-stats.herokuapp.com";
const WAKATIME = "https://wakatime.com/api/v1/users/ehgp/stats/last_7_days";

// Languages hidden from the top-languages card (kept in sync with the old
// github-readme-stats `hide` parameter).
const HIDDEN_LANGS = new Set([
  "jupyter notebook",
  "css",
  "html",
  "scss",
  "solidity",
  "python",
  "matlab",
]);

// Shared card style: github_dark background with the site's purple accent
// (#d390d3) so all cached cards sit together visually.
const CARD_W = 495;
const BG = "#0d1117";
const TITLE = "#d390d3";
const TEXT = "#c9d1d9";
const SUB = "#8b949e";
const BAR_BG = "#333333";
const BAR_FILL = "#d390d3";
const FONT = "'Segoe UI', Ubuntu, Helvetica, Arial, sans-serif";
const BODY_TOP = 72;
const ROW_H = 26;
const BAR_X = 150;
const BAR_W = 230;

function escapeXml(value) {
  return String(value).replace(
    /[<>&'"]/g,
    (c) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[
        c
      ],
  );
}

function formatCount(n) {
  if (n >= 1000) {
    return `${(n / 1000).toFixed(1)}k`;
  }
  return String(n);
}

function cardShell({ title, ariaLabel, height, body }) {
  return `<svg width="${CARD_W}" height="${height}" viewBox="0 0 ${CARD_W} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(ariaLabel)}">
  <rect width="${CARD_W}" height="${height}" rx="6" fill="${BG}"/>
  <text x="25" y="32" fill="${TITLE}" font-size="18" font-weight="600" font-family="${FONT}">${escapeXml(title)}</text>
${body}
</svg>`;
}

// Renders name / bar / value rows (used by the top-languages and WakaTime
// cards).
function renderBarRows(rows) {
  return rows
    .map((row, i) => {
      const y = BODY_TOP + i * ROW_H;
      const pct = Math.max(0, Math.min(100, Number(row.percent) || 0));
      const fillW = ((BAR_W * pct) / 100).toFixed(1);
      const rawName = String(row.name || "");
      const name = escapeXml(
        rawName.length > 14 ? `${rawName.slice(0, 13)}…` : rawName,
      );
      const text = escapeXml(row.text || `${pct.toFixed(1)}%`);
      return `  <g transform="translate(0, ${y})">
    <text x="25" y="13" fill="${TEXT}" font-size="13" font-family="${FONT}">${name}</text>
    <rect x="${BAR_X}" y="4" width="${BAR_W}" height="8" rx="4" fill="${BAR_BG}"/>
    <rect x="${BAR_X}" y="4" width="${fillW}" height="8" rx="4" fill="${BAR_FILL}"/>
    <text x="${CARD_W - 15}" y="13" fill="${SUB}" font-size="12" font-family="${FONT}" text-anchor="end">${text}</text>
  </g>`;
    })
    .join("\n");
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 40_000) {
  // AbortSignal.timeout stays armed for the life of the request, so it also
  // bounds body reads (res.json()/res.text()), not just time-to-headers.
  return fetch(url, { ...options, signal: AbortSignal.timeout(timeoutMs) });
}

function requireToken() {
  if (!TOKEN) {
    throw new Error("GITHUB_TOKEN not set (try: GITHUB_TOKEN=$(gh auth token))");
  }
}

async function githubGraphql(query, variables) {
  requireToken();
  const res = await fetchWithTimeout("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    throw new Error(`GraphQL HTTP ${res.status}`);
  }
  const payload = await res.json();
  if (payload.errors?.length) {
    throw new Error(`GraphQL: ${payload.errors[0].message}`);
  }
  return payload.data;
}

async function githubRest(path) {
  requireToken();
  const res = await fetchWithTimeout(`https://api.github.com${path}`, {
    headers: {
      Authorization: `bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
    },
  });
  if (!res.ok) {
    throw new Error(`REST ${path} HTTP ${res.status}`);
  }
  return res.json();
}

// Walks every owned repository once; the activity card sums stars over all of
// them and the top-languages card sums language bytes over the non-forks.
// Memoized so the activity and top-languages builds (which run concurrently)
// share one walk instead of doubling the request count.
let ownedReposPromise;
function fetchOwnedRepos() {
  ownedReposPromise ??= walkOwnedRepos();
  return ownedReposPromise;
}

async function walkOwnedRepos() {
  const repos = [];
  let after = null;
  do {
    const data = await githubGraphql(
      `query ($login: String!, $after: String) {
        user(login: $login) {
          repositories(first: 100, after: $after, ownerAffiliations: OWNER) {
            pageInfo { hasNextPage endCursor }
            nodes {
              isFork
              stargazers { totalCount }
              languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
                edges { size node { name } }
              }
            }
          }
        }
      }`,
      { login: LOGIN, after },
    );
    const page = data.user.repositories;
    repos.push(...page.nodes);
    after = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
  } while (after);
  return repos;
}

async function buildActivitySvg() {
  const [repos, userData, commitSearch] = await Promise.all([
    fetchOwnedRepos(),
    githubGraphql(
      `query ($login: String!) {
        user(login: $login) {
          pullRequests { totalCount }
          issues { totalCount }
          repositoriesContributedTo(
            contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]
          ) { totalCount }
        }
      }`,
      { login: LOGIN },
    ),
    githubRest(`/search/commits?q=author:${LOGIN}&per_page=1`),
  ]);

  const stars = repos.reduce((sum, r) => sum + r.stargazers.totalCount, 0);
  const rows = [
    { label: "Total Stars Earned", value: stars },
    { label: "Total Commits (all time)", value: commitSearch.total_count },
    { label: "Total PRs", value: userData.user.pullRequests.totalCount },
    { label: "Total Issues", value: userData.user.issues.totalCount },
    {
      label: "Contributed to (past year)",
      value: userData.user.repositoriesContributedTo.totalCount,
    },
  ];

  const height = BODY_TOP + rows.length * ROW_H + 12;
  const body = rows
    .map((row, i) => {
      const y = BODY_TOP + i * ROW_H;
      return `  <g transform="translate(0, ${y})">
    <text x="25" y="13" fill="${TEXT}" font-size="13" font-family="${FONT}">${escapeXml(row.label)}</text>
    <text x="${CARD_W - 25}" y="13" fill="${TITLE}" font-size="13" font-weight="600" font-family="${FONT}" text-anchor="end">${escapeXml(formatCount(row.value))}</text>
  </g>`;
    })
    .join("\n");

  return cardShell({
    title: `GitHub · Stats`,
    ariaLabel: "GitHub activity stats",
    height,
    body,
  });
}

async function buildTopLangsSvg() {
  const repos = await fetchOwnedRepos();
  const totals = new Map();
  for (const repo of repos) {
    if (repo.isFork) continue;
    for (const edge of repo.languages.edges) {
      const name = edge.node.name;
      if (HIDDEN_LANGS.has(name.toLowerCase())) continue;
      totals.set(name, (totals.get(name) || 0) + edge.size);
    }
  }

  const ranked = [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  const grandTotal = ranked.reduce((sum, [, size]) => sum + size, 0);
  if (grandTotal === 0) {
    throw new Error("no language data returned");
  }
  const rows = ranked.map(([name, size]) => ({
    name,
    percent: (size / grandTotal) * 100,
  }));

  const height = BODY_TOP + rows.length * ROW_H + 12;
  return cardShell({
    title: `GitHub · Top Languages`,
    ariaLabel: "Most used languages",
    height,
    body: renderBarRows(rows),
  });
}

// Renders the WakaTime "last 7 days" payload into a themed SVG card.
function renderWakatimeSvg(data) {
  const total = data.human_readable_total || "0 secs";
  const daily = data.human_readable_daily_average || "0 secs";
  const langs = Array.isArray(data.languages) ? data.languages.slice(0, 5) : [];

  let body;
  let height;
  if (langs.length === 0) {
    height = 118;
    const message =
      (data.total_seconds || 0) > 0
        ? "Language breakdown is private."
        : "No tracked coding time in the last 7 days.";
    body = `  <text x="25" y="${BODY_TOP + 18}" fill="${SUB}" font-size="13" font-family="${FONT}">${escapeXml(message)}</text>`;
  } else {
    height = BODY_TOP + langs.length * ROW_H + 12;
    body = renderBarRows(
      langs.map((lang) => ({
        name: lang.name,
        percent: lang.percent,
        text: lang.text || `${(Number(lang.percent) || 0).toFixed(1)}%`,
      })),
    );
  }

  const subtitle = `  <text x="25" y="54" fill="${SUB}" font-size="12" font-family="${FONT}">Total ${escapeXml(total)} · Daily avg ${escapeXml(daily)}</text>`;
  return cardShell({
    title: `WakaTime · Last 7 Days`,
    ariaLabel: "WakaTime last 7 days",
    height,
    body: `${subtitle}\n${body}`,
  });
}

// `required: true` sources fail the job when they can't be cached.
// Streak and WakaTime are optional: if the upstream is unreachable or
// rate-limited at build time, the job keeps the last good cached copy
// instead of failing.
const SOURCES = [
  {
    name: "activity",
    required: true,
    build: buildActivitySvg,
  },
  {
    name: "streak",
    required: false,
    url: `${STREAK}/?user=ehgp&theme=tokyonight&hide_border=true`,
  },
  {
    name: "top-langs",
    required: true,
    build: buildTopLangsSvg,
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

async function fetchSource({ name, url, json, render, build }) {
  try {
    let body;
    if (build) {
      body = await build();
    } else {
      const res = await fetchWithTimeout(json || url);
      if (!res.ok) {
        return { ok: false, reason: `HTTP ${res.status}` };
      }
      if (json) {
        const payload = await res.json();
        if (payload.error) {
          return { ok: false, reason: `api error: ${payload.error}` };
        }
        body = render(payload.data || {});
      } else {
        body = await res.text();
      }
    }
    const problem = validateSvg(body);
    if (problem) {
      return { ok: false, reason: problem };
    }
    await writeFile(join(OUT_DIR, `${name}.svg`), body, "utf8");
    return { ok: true, bytes: body.length };
  } catch (err) {
    const timedOut = err.name === "AbortError" || err.name === "TimeoutError";
    return { ok: false, reason: timedOut ? "timeout" : err.message };
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
