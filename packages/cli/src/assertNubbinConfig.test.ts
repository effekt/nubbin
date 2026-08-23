import { describe, expect, test } from "vitest";
import { assertNubbinConfig } from "./assertNubbinConfig";

const complete = {
  catalog: {},
  registry: {},
  store: {},
  document: () => null,
};

describe("assertNubbinConfig", () => {
  test("accepts a config carrying all four fields", () => {
    expect(() => assertNubbinConfig(complete, "nubbin.config.ts")).not.toThrow();
  });

  test("names the file when the module default-exports nothing", () => {
    expect(() => assertNubbinConfig(undefined, "nubbin.config.ts")).toThrow(/nubbin\.config\.ts/);
  });

  test("names every missing field, not only the first", () => {
    expect(() => assertNubbinConfig({ catalog: {} }, "nubbin.config.ts")).toThrow(
      /registry.*store.*document/,
    );
  });

  test("refuses a document that is a record rather than a loader", () => {
    const asRecord = { ...complete, document: { "/": {} } };
    expect(() => assertNubbinConfig(asRecord, "nubbin.config.ts")).toThrow(/function of a route/);
  });
});
