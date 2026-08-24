import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { PreviewRefusal } from "./PreviewRefusal";

test("names the route, lists the compiler's words, and links back to the editor", () => {
  render(
    <PreviewRefusal
      route="/spring-sale"
      issues={[{ code: "no-roots", message: "a document needs a root" }]}
    />,
  );
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Nothing to preview yet");
  expect(screen.getByRole("listitem").textContent).toBe("a document needs a root");
  const back = screen.getByRole("link", { name: "Back to the editor" });
  expect(back.getAttribute("href")).toBe("/edit/spring-sale");
});
