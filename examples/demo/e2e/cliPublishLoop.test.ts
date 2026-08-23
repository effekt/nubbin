import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { type DemoServer, startDemoServer } from "./startDemoServer";

const run = promisify(execFile);

/** Its own port, and its own route: the other e2e file republishes `/about` and `/`. */
const PORT = 3124;
const ROUTE = "/security";
const DEMO_ROOT = new URL("..", import.meta.url).pathname;
/** The built executable itself: the `.bin` symlink only exists once a build has already run. */
const NUBBIN = new URL("../../../packages/cli/dist/bin.js", import.meta.url).pathname;

/**
 * The publish loop again, driven by the binary a consumer installs rather than by this process
 * calling `compile` and the store directly.
 *
 * It is a second file rather than more cases in the first because it answers a different
 * question. `publishLoop` asks whether the pipeline is correct; this asks whether the shipped
 * command line reaches it — the config is found by climbing from a working directory, the
 * consumer's registry is loaded through a TypeScript file that imports `.tsx` components, and
 * the pointer moves through the running server's endpoint because `--origin` said so.
 *
 * Every assertion is a served byte or an exit code, for the reason the file beside it gives:
 * a store that says one thing while the site serves another is the whole failure being hunted.
 */
describe("the publish loop, driven by the CLI", () => {
  let server: DemoServer;

  beforeAll(async () => {
    server = await startDemoServer(PORT);
  }, 180_000);

  afterAll(async () => {
    await server?.stop();
  });

  /** The installed binary, run from the demo directory with no config path — it finds its own. */
  const nubbin = async (args: readonly string[], stamp?: string) => {
    const env = stamp === undefined ? process.env : { ...process.env, STAMP: stamp };
    try {
      const { stdout } = await run(process.execPath, [NUBBIN, ...args], { cwd: DEMO_ROOT, env });
      return { out: stdout.trim(), code: 0 };
    } catch (error) {
      const failure = error as { stdout?: string; code?: number };
      return { out: (failure.stdout ?? "").trim(), code: failure.code ?? -1 };
    }
  };

  const hashOf = (output: string): string => output.split(" -> ")[1]?.split("\n")[0] ?? "";

  const get = async (route: string) => {
    const response = await fetch(`${server.origin}${route}`);
    return { status: response.status, body: await response.text() };
  };

  test("publishes through the running server, and the page changes with no restart", async () => {
    const before = await nubbin(["publish", ROUTE, "--origin", server.origin]);
    expect(before.code).toBe(0);
    expect((await get(ROUTE)).body).not.toContain("cli-e2e");

    const after = await nubbin(["publish", ROUTE, "--origin", server.origin], "cli-e2e");
    expect(after.code).toBe(0);
    expect(hashOf(after.out)).not.toBe(hashOf(before.out));

    const served = await get(ROUTE);
    expect(served.status).toBe(200);
    expect(served.body).toContain("cli-e2e");
  });

  test("status names the hash the page is actually being served from", async () => {
    const published = await nubbin(["publish", ROUTE, "--origin", server.origin], "cli-status");
    const listed = await nubbin(["status", ROUTE]);
    expect(listed.out).toContain(hashOf(published.out));
    expect((await get(ROUTE)).body).toContain("cli-status");
  });

  test("rolls the route back to an earlier artifact, and that page is served again", async () => {
    const first = await nubbin(["publish", ROUTE, "--origin", server.origin], "cli-first");
    await nubbin(["publish", ROUTE, "--origin", server.origin], "cli-second");
    expect((await get(ROUTE)).body).toContain("cli-second");

    const rolled = await nubbin(["rollback", ROUTE, hashOf(first.out), "--origin", server.origin]);
    expect(rolled.code).toBe(0);
    const served = await get(ROUTE);
    expect(served.body).toContain("cli-first");
    expect(served.body).not.toContain("cli-second");
  });

  test("unpublishing serves a real 404, and republishing brings the page back", async () => {
    await nubbin(["publish", ROUTE, "--origin", server.origin], "cli-back");
    const dropped = await nubbin(["unpublish", ROUTE, "--origin", server.origin]);
    expect(dropped.code).toBe(0);
    expect((await get(ROUTE)).status).toBe(404);

    await nubbin(["publish", ROUTE, "--origin", server.origin], "cli-back");
    const restored = await get(ROUTE);
    expect(restored.status).toBe(200);
    expect(restored.body).toContain("cli-back");
  });

  // `next dev` renders per request, so a page here changes whether the pointer moved locally or
  // through the server — which means no served byte can tell `--origin` from its absence. This
  // pins the flag by its mechanics instead: nothing listens on port 1, so a publish that reaches
  // the network fails, and one that quietly wrote to the store instead would report success.
  test("--origin publishes over HTTP, and fails when nothing answers there", async () => {
    const refused = await nubbin(["publish", ROUTE, "--origin", "http://127.0.0.1:1"], "unsent");
    expect(refused.code).toBe(2);
    expect((await get(ROUTE)).body).not.toContain("unsent");
  });

  test("check clears a store whose pages were all published by this registry", async () => {
    const checked = await nubbin(["check"]);
    expect(checked.code).toBe(0);
    expect(checked.out).toContain("compatible");
  });

  test("refuses a route with no document, and says so by name", async () => {
    const refused = await nubbin(["publish", "/no-such-fixture"]);
    expect(refused.code).toBe(2);
    expect(refused.out).toContain("no document for /no-such-fixture");
  });
});
