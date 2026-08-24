import type { DocumentVersion, Node } from "@nubbin/core";
import { addNode, compile, moveNode, NubbinError, removeNode, setNodeProp } from "@nubbin/core";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { fixtureRoutes } from "../fixtures/fixtureRoutes";
import { catalog } from "../src/nubbin/catalog";
import { demoStore } from "../src/nubbin/demoStore";
import { registry } from "../src/nubbin/registry";
import { type DemoServer, startDemoServer } from "./startDemoServer";

/** Its own port, so a developer's `pnpm dev` on 3000 neither answers these requests nor breaks. */
const PORT = 3123;
/** A leaf route rather than `/`, and one no other assertion in this file republishes. */
const ROUTE = "/dispatches/tide-tables";
/** The fixture `fixtures:publish` deliberately leaves unpublished, so the build never saw it. */
const FRESH_ROUTE = "/dispatches/late-edition";
/** The page that is holes and nothing else: both of its fields resolve per request. */
const HOLE_ROUTE = "/live";
/** The fixture carrying `FaqAccordion`, the one block with a client component inside it. */
const INTERACTIVE_ROUTE = "/";
/** Borrows `FRESH_ROUTE`'s address, never its fixture: its document is composed here. */
const COMPOSED_ROUTE = "/dispatches/late-edition";

/** An empty page — the state an author starts from, before a single block is placed. */
const emptyPage = (): DocumentVersion => ({
  documentId: "composed-in-a-test",
  version: 1,
  roots: ["stack"],
  elements: { stack: { id: "stack", block: "SectionStack", props: {}, slots: { sections: [] } } },
  meta: { title: "Composed by the operations" },
  createdAt: "2026-01-01T00:00:00Z",
  createdBy: "e2e",
});

/** A node of `block` under a freshly minted id, carrying the catalog's own defaults. */
const seeded = (block: keyof typeof catalog): Node => ({
  id: crypto.randomUUID(),
  block,
  props: { ...(catalog[block]?.defaults ?? {}) },
});

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
    const { artifact } = compile(version, catalog, registry, route);
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
    expect(restored).toBe(compile(original, catalog, registry, ROUTE).artifact.hash);
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

  // A block is a server component and cannot be a client one — invoking a client reference on
  // the server returns no host element, so `invokeBlock` rejects it. The supported shape is a
  // server block whose host root contains client children, and nothing had ever run it. This is
  // that shape, served: the control has to arrive rendered, and the stamp has to survive a root
  // that now has a client component inside it.
  //
  // What this cannot see is a silent downgrade. Drop the `"use client"` from
  // `FaqDisclosureGroup` and it renders identical markup as a server component, passing here
  // while no longer being interactive. Catching that needs the build output or a browser, and
  // neither is in reach of a fetch — `pnpm --filter demo build` puts the component in a chunk
  // under `.next/static`, which is where that question is answered today.
  test("a client component inside a block is served, and the block is still stamped", async () => {
    await publishThroughServer(INTERACTIVE_ROUTE);
    const page = await get(INTERACTIVE_ROUTE);

    expect(page.status).toBe(200);
    expect(page.body).toContain('data-nubbin-faq-control="expand-all"');
    expect(page.body).toMatch(/data-nubbin-node="[^"]*"/);
  });

  // Every other test here publishes a document someone wrote in TypeScript. This one builds a
  // page out of nothing but `addNode`, `moveNode`, `setNodeProp` and `removeNode` — the path a
  // CLI or an editor takes — and asks the server what it serves. Unit tests prove the operations
  // rewrite a `DocumentVersion`; only this proves what they produce can be compiled, stored and
  // rendered.
  test("a document composed from the operations alone compiles, publishes and serves", async () => {
    const header = seeded("PageHeader");
    const grid = seeded("CardGrid");
    const card = seeded("Card");
    const footer = seeded("SiteFooter");
    const doomed = seeded("CtaBanner");

    let page = addNode(emptyPage(), "stack", "sections", header);
    page = addNode(page, "stack", "sections", doomed);
    page = addNode(page, "stack", "sections", grid);
    page = addNode(page, grid.id, "cards", card);
    page = addNode(page, "stack", "sections", footer);
    page = setNodeProp(page, header.id, "headline", "Written by an operation");
    page = moveNode(page, footer.id, "stack", "sections", 0);
    page = removeNode(page, doomed.id);

    await publishThroughServer(COMPOSED_ROUTE, page);
    const served = await get(COMPOSED_ROUTE);

    expect(served.status).toBe(200);
    expect(served.body).toContain("Written by an operation");
    // The move put the footer first and the removal took the banner out — both readable in the
    // order the renderer stamped the nodes it walked. The card proves the nested add: a child
    // placed in a grid's slot by the same operation the top level used, walked and stamped.
    const stamps = [...served.body.matchAll(/data-nubbin-node="([^"]+)"/g)].map((hit) => hit[1]);
    expect(stamps).toContain(footer.id);
    expect(stamps.indexOf(footer.id)).toBeLessThan(stamps.indexOf(header.id));
    expect(stamps).toContain(card.id);
    expect(stamps).not.toContain(doomed.id);
  });

  // `CardGrid.cards` declares `allow: ["Card"]`, and the refusal is the compiler's rather than
  // the operation's: `addNode` deliberately lets a document be illegal between two edits that
  // end legal. Remove the allow list from `CardGrid.block.ts` and this compiles clean — which
  // is exactly the regression the assertion exists to catch, and it names the offender.
  test("composing a foreign block into CardGrid.cards is refused by name at compile", () => {
    const grid = seeded("CardGrid");
    const stray = seeded("CtaBanner");
    let page = addNode(emptyPage(), "stack", "sections", grid);
    page = addNode(page, grid.id, "cards", seeded("Card"));
    page = addNode(page, grid.id, "cards", stray);

    const attempt = () => compile(page, catalog, registry, COMPOSED_ROUTE);
    expect(attempt).toThrowError(NubbinError);
    expect(attempt).toThrowError(/"CtaBanner" is not allowed in slots\.cards of "CardGrid"/);
  });

  // `/dispatches/late-edition` is the fixture `fixtures:publish` leaves alone, and three tests
  // above borrow its address. Handing it back unpublished keeps them independent of each
  // other's order and of the last run's outcome.
  afterAll(async () => {
    await unpublishThroughServer(FRESH_ROUTE).catch(() => undefined);
  });

  // Every other test here uses a frozen page, so nothing yet proves a hole is filled at render
  // rather than left as the compile-time absence it is in the artifact.
  test("a hole is resolved into the served page, not left empty", async () => {
    await publishThroughServer(HOLE_ROUTE);
    const page = await get(HOLE_ROUTE);
    expect(page.status).toBe(200);
    // `demoHoleValue` shapes `LiveBand.items` and `UpdateFeed.entries` into rows carrying these
    // sentences, and the artifact holds no value for either field — so each sentence served
    // means the resolver ran for that block, not merely that some hole somewhere resolved.
    expect(page.body).toContain("The estuary has been read");
    expect(page.body).toContain("times since the server started");
  });
});
