import { afterEach, expect, test } from "vitest";
import { consumerOrigin } from "./consumerOrigin";

afterEach(() => {
  delete process.env.NUBBIN_CONSUMER_ORIGIN;
});

test("defaults to the demo's dev address", () => {
  expect(consumerOrigin()).toBe("http://localhost:3000");
});

test("a consumer's own origin wins", () => {
  process.env.NUBBIN_CONSUMER_ORIGIN = "https://cms.example.com";
  expect(consumerOrigin()).toBe("https://cms.example.com");
});
