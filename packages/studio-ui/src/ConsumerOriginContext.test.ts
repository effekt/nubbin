import { expect, test } from "vitest";

test("exports the consumer origin context", async () => {
  expect(Object.keys(await import("./ConsumerOriginContext"))).toEqual(["ConsumerOriginContext"]);
});
