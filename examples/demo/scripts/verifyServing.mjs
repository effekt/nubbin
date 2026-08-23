#!/usr/bin/env node

// Proves, against a running `next start`, the three claims Phase 2.11 exists to settle: a route
// published after the build serves without a deploy, unpublishing makes it a server 404, and the
// two hole kinds refresh on their declared schedules.
//
// Every assertion reads the served bytes. A pointer in the store says nothing about what the
// server returns — `revalidatePath` invalidates only the process that runs it, which is why
// `publishLive.ts` publishes over HTTP and why this script cannot import the store to check.
//
// Run it against a built server: `pnpm build && pnpm --filter demo fixtures:publish &&
// pnpm --filter demo build && pnpm --filter demo start`, then `pnpm --filter demo serve:verify`.
//
// Runs every assertion, prints each with what it measured, then exits non-zero if any failed.
// All of them run even after one fails: a single FAIL is usually a broken probe rather than a
// broken system, and the other six are what tell you which.

import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const ORIGIN = process.env.DEMO_ORIGIN ?? "http://127.0.0.1:3000";
const OK = 200;
const NOT_FOUND = 404;
/** Eight samples two seconds apart spans more than one FaqAccordion interval (`revalidate: 5`). */
const HOLE_SAMPLES = 8;
const HOLE_SAMPLE_PAUSE_MS = 2_000;
const HOLE_LOG = new URL("../.nubbin/hole-log.txt", import.meta.url);

const results = [];
const record = (name, isPassing, detail) => results.push({ name, isPassing, detail });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function get(path) {
  const response = await fetch(`${ORIGIN}${path}`);
  return {
    status: response.status,
    cache: response.headers.get("x-nextjs-cache"),
    body: await response.text(),
  };
}

/** Through the package script, so the route to the publisher lives in one place. */
function publishLive(route, stamp) {
  const args = ["run", "publish:live", route, ...(stamp === undefined ? [] : [stamp])];
  const run = spawnSync("pnpm", args, { encoding: "utf8" });
  if (run.status !== 0) {
    throw new Error(`publish:live ${route} failed: ${run.stdout ?? ""}${run.stderr ?? ""}`);
  }
}

async function post(path, payload) {
  const response = await fetch(`${ORIGIN}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`POST ${path} answered ${response.status}`);
  }
}

/** Anchored on each block's own visible copy, so reordering the fixture cannot swap them. */
const CACHED_AT = /When was this answer cached\?\s*(\d{4}-\d{2}-\d{2}T[\d:.]+Z)/;

/**
 * Rendered text only: `<script>` blocks removed, then tags stripped. Dropping the scripts keeps
 * the RSC payload — which repeats the same copy in escaped JSON — from satisfying a match.
 *
 * Two earlier versions failed, in opposite directions. Matching raw HTML found nothing, because a
 * 340-character inline `<svg>` sits between the FAQ question and its answer. Truncating at the
 * first `<script` found nothing either, because Next emits preload scripts in `<head>`, so
 * everything before the first one is a single character.
 */
const renderedText = (body) =>
  body
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");

/** Throws rather than returning null: an unreadable probe is a broken check, not a passing one. */
function readMatch(body, pattern, what) {
  const found = pattern.exec(renderedText(body))?.[1];
  if (found === undefined) {
    throw new Error(`could not read ${what} from the served page — the probe is broken`);
  }
  return found;
}

async function baselineServes() {
  const summer = await get("/promotions/summer");
  const isPassing = summer.status === OK && summer.body.includes('data-nubbin-node="hero"');
  record("1 prerendered route serves its stamped tree", isPassing, `status ${summer.status}`);
}

async function publishWithoutDeploy() {
  const before = await get("/promotions/flash");
  publishLive("/promotions/flash");
  const after = await get("/promotions/flash");
  const isPassing = before.status === NOT_FOUND && after.status === OK;
  record(
    "2 published after the build, no deploy",
    isPassing,
    `${before.status} -> ${after.status}`,
  );
}

async function unpublishIsAServerNotFound() {
  await post("/api/nubbin/unpublish", { route: "/promotions/flash" });
  const after = await get("/promotions/flash");
  record("3 unpublish is a server 404", after.status === NOT_FOUND, `status ${after.status}`);
}

async function revalidateHitsOnlyOneRoute() {
  const stamp = `r${process.pid}`;
  const otherBefore = await get("/promotions/summer");
  publishLive("/promotions/winter", stamp);
  const winter = await get("/promotions/winter");
  const otherAfter = await get("/promotions/summer");
  // Rendered text on the untouched route, not raw bytes. Every route renders on demand, and two
  // renders of one unchanged page stream their RSC payload in different `self.__next_f.push`
  // chunks — same length, same content, different split points. Comparing bodies measured
  // whether the page was cached; comparing what it rendered measures what this claims to.
  const isPassing =
    winter.body.includes(stamp) && renderedText(otherAfter.body) === renderedText(otherBefore.body);
  record("4 revalidate hits exactly the published route", isPassing, `${stamp} in winter only`);
}

/**
 * Sampled rather than compared pairwise. Two adjacent requests can legitimately straddle a refresh
 * boundary, so "identical across two GETs" fails at random on a working system. What separates the
 * two hole kinds is the shape: a per-request hole takes a new value every time, an interval hole
 * repeats itself and still moves.
 */
async function holesRefreshOnTheirOwnSchedules() {
  const cached = [];
  for (let sample = 0; sample < HOLE_SAMPLES; sample += 1) {
    cached.push(readMatch((await get("/live/pulse")).body, CACHED_AT, "the cached value"));
    await sleep(HOLE_SAMPLE_PAUSE_MS);
  }
  const distinct = new Set(cached).size;
  record(
    "5 an interval hole holds, then refreshes",
    distinct > 1 && distinct < cached.length,
    `${distinct} distinct across ${cached.length} samples, needs >1 and <${cached.length}`,
  );
}

/**
 * The reason for compiling a page at all: it is rendered once and served from cache until
 * something republishes it. Read off `x-nextjs-cache` rather than by comparing bodies, because
 * two identical responses say nothing about whether the second was rebuilt to produce it.
 *
 * `next dev` emits no such header, which is why this lives here and not in the e2e suite.
 */
async function aPublishedPageIsCachedUntilRepublished() {
  const stamp = `c${process.pid}`;
  await get("/about");
  const warm = await get("/about");
  publishLive("/about", stamp);
  const regenerated = await get("/about");
  const settled = await get("/about");
  const isPassing =
    warm.cache === "HIT" && regenerated.body.includes(stamp) && settled.cache === "HIT";
  record(
    "7 a page is cached, and a publish regenerates it",
    isPassing,
    `warm ${warm.cache}, regenerated ${regenerated.cache} carrying ${stamp}, settled ${settled.cache}`,
  );
}

async function staticPropsTriggerNoFetch() {
  const log = await readFile(HOLE_LOG, "utf8").catch(() => "");
  const lines = log.split("\n").filter((line) => line.trim() !== "");
  const isPassing =
    lines.some((line) => line.startsWith("/live/pulse")) && !log.includes("/promotions/");
  record("6 a static prop triggers no fetch", isPassing, `${lines.length} hole-log line(s)`);
}

export async function verifyServing() {
  for (const check of [
    baselineServes,
    publishWithoutDeploy,
    unpublishIsAServerNotFound,
    revalidateHitsOnlyOneRoute,
    holesRefreshOnTheirOwnSchedules,
    staticPropsTriggerNoFetch,
    aPublishedPageIsCachedUntilRepublished,
  ]) {
    await check();
  }
  for (const { name, isPassing, detail } of results) {
    console.log(`  ${isPassing ? "✅" : "❌"} ${name}  — ${detail}`);
  }
  const failures = results.filter(({ isPassing }) => !isPassing);
  console.log(
    failures.length === 0
      ? `\n✅ ${results.length} assertion(s) passed against ${ORIGIN}.`
      : `\n❌ ${failures.length} of ${results.length} assertion(s) failed against ${ORIGIN}.`,
  );
  return failures.length;
}

process.exit((await verifyServing()) === 0 ? 0 : 1);
