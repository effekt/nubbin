import { join } from "node:path";
import { afterEach, expect, test } from "vitest";
import { storeDir } from "./storeDir";

afterEach(() => {
  delete process.env.NUBBIN_STUDIO_STORE;
});

test("defaults to the demo's store, reached from the studio's working directory", () => {
  delete process.env.NUBBIN_STUDIO_STORE;
  expect(storeDir()).toBe(join(process.cwd(), "..", "..", "examples", "demo", ".nubbin"));
});

test("the environment override wins, so a test never writes the demo's real store", () => {
  process.env.NUBBIN_STUDIO_STORE = "/somewhere/else";
  expect(storeDir()).toBe("/somewhere/else");
});
