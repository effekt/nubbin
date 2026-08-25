import { expect, test } from "vitest";

test("the consumer-origin entry exports exactly its context", async () => {
  expect(Object.keys(await import("./ConsumerOriginContext"))).toEqual(["ConsumerOriginContext"]);
});
