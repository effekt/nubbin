import { describe, expect, test } from "vitest";
import { z } from "zod";
import { faqItemSchema } from "../blocks/faqItem.schema";
import { timedEntrySchema } from "../blocks/timedEntry.schema";
import { demoHoleValue } from "./demoHoleValue";

const payload = { now: Date.parse("2026-08-01T09:14:00Z"), served: 7 };

describe("demoHoleValue", () => {
  // The failure with no other guard anywhere: a value of the wrong shape. Nothing validates a
  // hole at render, so parsing against the schema the artifact was compiled with is what makes
  // a wrong shape a test failure rather than a blank patch of page.
  test("LiveBand.items satisfies the field's real schema", () => {
    const items = z.array(timedEntrySchema).parse(demoHoleValue("LiveBand", "items", payload));
    expect(items[0]?.text).toContain("7");
    expect(items[0]?.at).toBe("09:14");
  });

  test("UpdateFeed.entries satisfies the field's real schema", () => {
    const entries = z
      .array(timedEntrySchema)
      .parse(demoHoleValue("UpdateFeed", "entries", payload));
    expect(entries[0]?.at).toBe("09:14");
  });

  test("FaqAccordion.items satisfies the field's real schema", () => {
    const items = z.array(faqItemSchema).parse(demoHoleValue("FaqAccordion", "items", payload));
    expect(items[0]?.answer).toBe("2026-08-01T09:14:00.000Z");
  });

  test("a field with no resolver is named, rather than resolving to nothing", () => {
    expect(() => demoHoleValue("Hero", "headline", payload)).toThrow(/Hero\.headline/);
  });
});
