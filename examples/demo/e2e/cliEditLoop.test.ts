import { execFile } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { promisify } from "node:util";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { type DemoServer, startDemoServer } from "./startDemoServer";

const run = promisify(execFile);

/** Its own port; the route is shared with `publishLoop`, which is why the drafts are cleaned
 * on both sides — the loop here must start from the fixture and leave the fixture behind. */
const PORT = 3125;
const ROUTE = "/dispatches/late-edition";
const DEMO_ROOT = new URL("..", import.meta.url).pathname;
const DRAFTS = new URL("../.nubbin-drafts", import.meta.url).pathname;
const NUBBIN = new URL("../../../packages/cli/dist/bin.js", import.meta.url).pathname;

/**
 * The editing loop a person actually runs, driven by the binary a consumer installs: `show` to
 * learn an id, a write verb against it, `publish` through the running server, and a page that
 * changed. Every assertion is a served byte or an exit code — a draft that was written but
 * never served is exactly the failure this file exists to catch.
 */
describe("the editing loop, driven by the CLI", () => {
  let server: DemoServer;

  beforeAll(async () => {
    rmSync(DRAFTS, { recursive: true, force: true });
    server = await startDemoServer(PORT);
  }, 180_000);

  afterAll(async () => {
    rmSync(DRAFTS, { recursive: true, force: true });
    await server?.stop();
  });

  const nubbin = async (args: readonly string[]) => {
    try {
      const { stdout } = await run(process.execPath, [NUBBIN, ...args], { cwd: DEMO_ROOT });
      return { out: stdout.trim(), code: 0 };
    } catch (error) {
      const failure = error as { stdout?: string; stderr?: string; code?: number };
      return { out: (failure.stderr ?? failure.stdout ?? "").trim(), code: failure.code ?? -1 };
    }
  };

  const idOf = (outline: string, block: string): string =>
    outline.match(new RegExp(`^\\s*(\\S+) {2}${block}$`, "m"))?.[1] ?? "";

  const get = async (route: string) => {
    const response = await fetch(`${server.origin}${route}`);
    return { status: response.status, body: await response.text() };
  };

  test("show, set, publish: the edit is served, from the same fixture it started from", async () => {
    const shown = await nubbin(["show", ROUTE]);
    expect(shown.code).toBe(0);
    const header = idOf(shown.out, "PageHeader");
    expect(header).not.toBe("");

    await nubbin(["publish", ROUTE, "--origin", server.origin]);
    expect((await get(ROUTE)).body).not.toContain("Corrected after the tide turned");

    const edited = await nubbin([
      "set",
      ROUTE,
      header,
      "headline",
      "Corrected after the tide turned",
    ]);
    expect(edited.code).toBe(0);
    expect(edited.out).toBe(`set headline on ${header} in ${ROUTE}`);

    const published = await nubbin(["publish", ROUTE, "--origin", server.origin]);
    expect(published.code).toBe(0);
    const served = await get(ROUTE);
    expect(served.status).toBe(200);
    expect(served.body).toContain("Corrected after the tide turned");
  });

  test("add prints the id the document then holds, and the block it placed is served", async () => {
    const grid = idOf((await nubbin(["show", ROUTE])).out, "CardGrid");
    const added = await nubbin(["add", ROUTE, "Card", "--parent", grid, "--slot", "cards"]);
    expect(added.code).toBe(0);
    const minted = added.out.split(" -> ")[1] ?? "";
    expect(minted).toMatch(/^[0-9a-f-]{36}$/);

    const titled = await nubbin(["set", ROUTE, minted, "title", "A fifth card, filed by hand"]);
    expect(titled.code).toBe(0);
    await nubbin(["publish", ROUTE, "--origin", server.origin]);
    expect((await get(ROUTE)).body).toContain("A fifth card, filed by hand");
  });

  test("a move the slot's allow forbids refuses with its code, and nothing was saved", async () => {
    const shown = await nubbin(["show", ROUTE]);
    const header = idOf(shown.out, "PageHeader");
    const grid = idOf(shown.out, "CardGrid");

    const refused = await nubbin(["move", ROUTE, header, "--parent", grid, "--slot", "cards"]);
    expect(refused.code).toBe(1);
    expect(refused.out).toContain("slot-not-allowed");

    const after = await nubbin(["show", ROUTE]);
    expect(after.out).toBe(shown.out);
  });

  test("set refuses a data-hinted path by name, and the draft it would have made is absent", async () => {
    const band = idOf((await nubbin(["show", "/live"])).out, "LiveBand");
    const refused = await nubbin(["set", "/live", band, "items", "[]"]);
    expect(refused.code).toBe(1);
    expect(refused.out).toContain('"items" on LiveBand resolves per request');
    expect(existsSync(`${DRAFTS}/${encodeURIComponent("/live")}.json`)).toBe(false);
  });
});
