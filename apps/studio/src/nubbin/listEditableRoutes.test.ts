import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fixtureRoutes } from "demo/fixtures/fixtureRoutes";
import { home } from "demo/fixtures/home";
import { beforeEach, expect, test } from "vitest";
import { draftFilePath } from "./draftFilePath";
import { listEditableRoutes } from "./listEditableRoutes";
import { writeDraftFile } from "./writeDraftFile";

beforeEach(() => {
  process.env.NUBBIN_STUDIO_DRAFTS = mkdtempSync(join(tmpdir(), "nubbin-drafts-"));
});

test("with no drafts, the editable routes are the fixtures", () => {
  expect(listEditableRoutes()).toEqual(Object.keys(fixtureRoutes).sort());
});

test("a draft-only route joins the list; an edited fixture appears once", () => {
  writeDraftFile(draftFilePath("/spring-sale"), home);
  writeDraftFile(draftFilePath("/"), home);
  const routes = listEditableRoutes();
  expect(routes).toContain("/spring-sale");
  expect(routes.filter((route) => route === "/")).toHaveLength(1);
  expect(routes).toEqual([...routes].sort());
});
