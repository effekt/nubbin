import { expect, test } from "vitest";
import { toDocAddress } from "./toDocAddress";

test("resolves the route against the origin, scheme stripped for display", () => {
  expect(toDocAddress("http://localhost:3102", "/dispatches")).toEqual({
    label: "localhost:3102/dispatches",
    href: "http://localhost:3102/dispatches",
  });
});

test("a production origin reads as the bare host, port-free", () => {
  expect(toDocAddress("https://windwardsupply.com", "/spring-sale")).toEqual({
    label: "windwardsupply.com/spring-sale",
    href: "https://windwardsupply.com/spring-sale",
  });
});

test("the root route keeps its slash", () => {
  expect(toDocAddress("http://localhost:3102", "/")).toEqual({
    label: "localhost:3102/",
    href: "http://localhost:3102/",
  });
});

test("without an origin only the route can be said, and nothing opens", () => {
  expect(toDocAddress(undefined, "/dispatches")).toEqual({ label: "/dispatches" });
});

test("an origin that is not a URL falls back to the route rather than throwing", () => {
  expect(toDocAddress("not a url", "/dispatches")).toEqual({ label: "/dispatches" });
});
