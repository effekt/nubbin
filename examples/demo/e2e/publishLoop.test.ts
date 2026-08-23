import { compile, setNodeProp } from "@nubbin/core";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { fixtureRoutes } from "../fixtures/fixtureRoutes";
import { catalog } from "../src/nubbin/catalog";
import { demoStore } from "../src/nubbin/demoStore";
import { registry } from "../src/nubbin/registry";
import { type DemoServer, startDemoServer } from "./startDemoServer";

/** Its own port, so a developer's `pnpm dev` on 3000 neither answers these requests nor breaks. */
const PORT = 3123;
/** `/about` rather than `/`: a leaf route, and one no other assertion in this file republishes. */
const ROUTE = "/about";
/** A fixture the publish script deliberately leaves unpublished, so the build never saw it. */
const FRESH_ROUTE = "/promotions/flash";
/** The one fixture carrying holes of both kinds. */
const HOLE_ROUTE = "/live/pulse";

/**
 * The whole loop, asserted on served bytes at every step: compile a document, write it to the
 * store, move the pointer, and read the page back over HTTP.
 *
 * Nothing here inspects the store to decide whether a step worked. A pointer says what should be
 * served, and the gap between that and what *is* served — a cache that was never invalidated, a
 * hash that never moved — is the only failure this exists to catch. So every assertion is a
 * response body.
 *
 * Publishing goes through the running server's own endpoint rather than `demoStore.publish`,
 * because `revalidatePath` invalidates the cache of the process that calls it: publishing from
 * this process would move the pointer while the server kept serving its cached copy.
 */
describe("the publish loop, end to end", () => {
  let server: DemoServer;

  beforeAll(async () => {
    server = await startDemoServer(PORT);
  }, 180_000);

  afterAll(async () => {
    await server?.stop();
  });

  const get = async (route: string) => {
    const response = await fetch(`${server.origin}${route}`);
    return { status: response.status, body: await response.text() };
  };

  /** Compiles, writes, and moves the pointer through the server, returning the new address. */
  const publishThroughServer = async (route: string, version = fixtureRoutes[route]) => {
    if (version === undefined) {
      throw new Error(`no fixture for ${route}`);
    }
    const artifact = compile(version, catalog, registry, route);
    await demoStore.write(artifact);
    const response = await fetch(`${server.origin}/api/nubbin/publish`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ route, hash: artifact.hash }),
    });
    expect(response.ok).toBe(true);
    return artifact.hash;
  };

  /** Removes the pointer through the server, for the same reason publishing goes through it. */
  const unpublishThroughServer = async (route: string) => {
    const response = await fetch(`${server.origin}/api/nubbin/unpublish`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ route }),
    });
    expect(response.ok).toBe(true);
  };

  test("a compiled artifact reaches the browser through resolveArtifact", async () => {
    await publishThroughServer(ROUTE);
    const page = await get(ROUTE);
    expect(page.status).toBe(200);
    // The renderer stamps every node it invoked, so this is proof the tree was walked rather
    // than that some page answered.
    expect(page.body).toMatch(/data-nubbin-node="/);
  });

  test("the document's own meta becomes the page's title", async () => {
    const declared = fixtureRoutes[ROUTE]?.meta.title;
    expect(declared).toBeDefined();
    const page = await get(ROUTE);
    expect(page.body).toContain(`<title>${declared}</title>`);
  });

  test("editing a document and republishing changes the served page", async () => {
    const before = await get(ROUTE);
    const original = fixtureRoutes[ROUTE];
    if (original === undefined) {
      throw new Error(`no fixture for ${ROUTE}`);
    }
    const headlineNode = Object.values(original.elements).find(
      (node) => typeof node.props.headline === "string",
    );
    expect(headlineNode, "the fixture needs a headline to edit").toBeDefined();

    const edited = `Edited by the e2e suite ${PORT}`;
    const beforeHash = await publishThroughServer(ROUTE, original);
    const afterHash = await publishThroughServer(
      ROUTE,
      setNodeProp(original, headlineNode?.id ?? "", "headline", edited),
    );

    const after = await get(ROUTE);
    expect(after.status).toBe(200);
    expect(after.body).toContain(edited);
    expect(before.body).not.toContain(edited);
    // Content addressing is the claim, not an implementation detail: different bytes, different
    // address. Equal hashes here would mean the pointer never moved and the page changed for
    // some other reason.
    expect(afterHash).not.toBe(beforeHash);
  });

  test("republishing the original restores the page, and the address it had", async () => {
    const original = fixtureRoutes[ROUTE];
    if (original === undefined) {
      throw new Error(`no fixture for ${ROUTE}`);
    }
    const restored = await publishThroughServer(ROUTE, original);
    const page = await get(ROUTE);
    expect(page.body).not.toContain("Edited by the e2e suite");
    // The same document compiles to the same address however many edits happened in between —
    // which is what makes a rollback a pointer move rather than a rebuild.
    expect(restored).toBe(compile(original, catalog, registry, ROUTE).hash);
  });

  test("a route with no pointer is a server 404, not an empty page", async () => {
    const missing = await get("/no-document-was-ever-published-here");
    expect(missing.status).toBe(404);
  });

  // The publish-without-deploy claim in the one direction that proves it: a route this build
  // never knew about, answering 404, reachable after a publish and no deploy in between.
  test("publishing a route the build never saw makes it reachable", async () => {
    // Arranged, not assumed. A previous run — or a previous failure — can leave this route
    // published, and a test whose precondition depends on that is a test that reports the last
    // run rather than this one.
    await unpublishThroughServer(FRESH_ROUTE);
    const before = await get(FRESH_ROUTE);
    expect(before.status).toBe(404);

    await publishThroughServer(FRESH_ROUTE);

    const after = await get(FRESH_ROUTE);
    expect(after.status).toBe(200);
    expect(after.body).toMatch(/data-nubbin-node="/);
  });

  // The other direction, and the one a stale cache hides: a live route has to stop being live.
  // A 200 serving an empty page would satisfy "unpublished" to a reader and to nobody else.
  test("unpublishing a live route makes it a server 404 again", async () => {
    await publishThroughServer(FRESH_ROUTE);
    expect((await get(FRESH_ROUTE)).status).toBe(200);

    await unpublishThroughServer(FRESH_ROUTE);

    expect((await get(FRESH_ROUTE)).status).toBe(404);
  });

  // `/promotions/flash` is the fixture the publish script leaves alone, and two tests above
  // borrow it. Handing it back unpublished keeps them independent of each other's order and of
  // the last run's outcome.
  afterAll(async () => {
    await unpublishThroughServer(FRESH_ROUTE).catch(() => undefined);
  });

  // Every other test here uses a frozen page, so nothing yet proves a hole is filled at render
  // rather than left as the compile-time absence it is in the artifact.
  test("a hole is resolved into the served page, not left empty", async () => {
    await publishThroughServer(HOLE_ROUTE);
    const page = await get(HOLE_ROUTE);
    expect(page.status).toBe(200);
    // `demoHoleValue` shapes `StatBand.stats` into rows whose label is this sentence, and the
    // artifact carries no value for it — so seeing it served means the resolver ran.
    expect(page.body).toContain("times /api/now has answered");
  });
});
