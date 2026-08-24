import { expect, test, vi } from "vitest";
import { goToEditor } from "./goToEditor";

test("sends the browser to the route's editor, the root mapping to the bare prefix", () => {
  const assign = vi.spyOn(window.location, "assign").mockImplementation(() => undefined);
  goToEditor("/spring-sale");
  expect(assign).toHaveBeenCalledWith("/edit/spring-sale");
  goToEditor("/");
  expect(assign).toHaveBeenCalledWith("/edit");
  assign.mockRestore();
});
