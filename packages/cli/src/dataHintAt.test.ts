import { defineCatalog } from "@nubbin/core";
import { describe, expect, test } from "vitest";
import { z } from "zod";
import { dataHintAt } from "./dataHintAt";

const catalog = defineCatalog({
  Feed: {
    schema: z.object({
      entries: z.object({ source: z.string() }).optional(),
      heading: z.string().optional(),
    }),
    ui: { fields: { entries: { data: { revalidate: 5 } }, heading: {} } },
  },
});

describe("dataHintAt", () => {
  test("names the hint a path writes into exactly", () => {
    expect(dataHintAt(catalog, "Feed", "entries")).toBe("entries");
  });

  test("a path under the hint lands inside the hole, so it counts", () => {
    expect(dataHintAt(catalog, "Feed", "entries.source")).toBe("entries");
  });

  test("a hint field without data is no hole, so it does not count", () => {
    expect(dataHintAt(catalog, "Feed", "heading")).toBeUndefined();
  });

  test("an unhinted path on a hinted block is free", () => {
    expect(dataHintAt(catalog, "Feed", "title")).toBeUndefined();
  });

  test("a block the catalog does not hold hints nothing", () => {
    expect(dataHintAt(catalog, "Ghost", "entries")).toBeUndefined();
  });
});
