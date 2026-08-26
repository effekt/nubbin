import { expect, test } from "vitest";
import { inspectorBody } from "./inspectorBody";

test("the inspector's body is the region while it is mounted", () => {
  const region = document.createElement("div");
  region.className = "nb-insp-body";
  document.body.appendChild(region);
  expect(inspectorBody(document)).toBe(region);
  region.remove();
});

test("no inspector degrades to the document body, never a crash", () => {
  expect(inspectorBody(document)).toBe(document.body);
});
