import { compile } from "@nubbin/core";
import { describe, expect, test } from "vitest";
import { catalog } from "../src/nubbin/catalog";
import { registry } from "../src/nubbin/registry";
import { fixtureRoutes } from "./fixtureRoutes";

describe("fixtures", () => {
  test.each(Object.keys(fixtureRoutes))("%s compiles, deterministically", (route) => {
    const version = fixtureRoutes[route];
    if (!version) {
      throw new Error(route);
    }
    const { artifact } = compile(version, catalog, registry, route);
    expect(artifact.route).toBe(route);
    expect(compile(version, catalog, registry, route).artifact.hash).toBe(artifact.hash);
  });

  // Every hint here is an interval. A `{ data: "request" }` kind is still supported, but no
  // fixture uses one: it maps to `cache: "no-store"`, which a cached page refuses, and the
  // static-or-dynamic choice is per route — so a single per-request field takes a whole page
  // with it.
  test("live fields compile to holes, not frozen props", () => {
    const version = fixtureRoutes["/live"];
    if (!version) {
      throw new Error("missing fixture");
    }
    const { artifact } = compile(version, catalog, registry, "/live");
    const sections = artifact.tree[0]?.slots?.sections ?? [];
    const band = sections.find((node) => node.block === "LiveBand");
    const feed = sections.find((node) => node.block === "UpdateFeed");
    expect(band?.holes).toEqual({ items: { revalidate: 5 } });
    expect(band?.props).not.toHaveProperty("items");
    expect(feed?.holes).toEqual({ entries: { revalidate: 5 } });
    expect(feed?.props).not.toHaveProperty("entries");
  });

  test("a page that uses no hinted block compiles to zero holes", () => {
    const version = fixtureRoutes["/dispatches"];
    if (!version) {
      throw new Error("missing fixture");
    }
    const { artifact } = compile(version, catalog, registry, "/dispatches");
    const nodes = [artifact.tree[0], ...(artifact.tree[0]?.slots?.sections ?? [])];
    expect(nodes.every((node) => node?.holes === undefined)).toBe(true);
  });

  // The composition this demo exists to show: a stack holding a split, a pane holding a grid,
  // the grid holding cards. Asserted by walking it, because a flat page would pass every other
  // test in this file unchanged.
  test("the home page nests four levels deep", () => {
    const version = fixtureRoutes["/"];
    if (!version) {
      throw new Error("missing fixture");
    }
    const { artifact } = compile(version, catalog, registry, "/");
    const split = (artifact.tree[0]?.slots?.sections ?? []).find((node) => node.block === "Split");
    const grid = split?.slots?.start?.[0];
    expect(split?.block).toBe("Split");
    expect(grid?.block).toBe("CardGrid");
    expect(grid?.slots?.cards?.map((card) => card.block)).toEqual(["Card", "Card", "Card"]);
    expect(split?.slots?.end?.[0]?.block).toBe("UpdateFeed");
  });
});
