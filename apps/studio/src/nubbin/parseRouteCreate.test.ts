import { expect, test } from "vitest";
import { parseRouteCreate } from "./parseRouteCreate";

test("a body naming a route parses", () => {
  expect(parseRouteCreate({ route: "/spring-sale" })).toEqual({ route: "/spring-sale" });
});

test.each([[undefined], [null], ["/x"], [{}], [{ route: 3 }]])(
  "anything else reads as malformed: %o",
  (body) => {
    expect(parseRouteCreate(body)).toBeUndefined();
  },
);
