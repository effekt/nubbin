import { afterEach, expect, test, vi } from "vitest";
import { demoPageUrl } from "./demoPageUrl";

afterEach(() => {
  vi.unstubAllEnvs();
});

test("a route lands on the demo's dev origin by default", () => {
  expect(demoPageUrl("/dispatches")).toBe("http://localhost:3000/dispatches");
});

test("the environment override wins", () => {
  vi.stubEnv("NEXT_PUBLIC_DEMO_ORIGIN", "https://site.example");
  expect(demoPageUrl("/")).toBe("https://site.example/");
});
