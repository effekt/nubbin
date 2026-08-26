import { createStudioHttpClient } from "@nubbin/studio";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { RouteSwitcher } from "./RouteSwitcher";

const routes = ["/", "/dispatches", "/spring-sale"];

function open() {
  renderSwitcher();
  fireEvent.click(screen.getByRole("button", { name: /Pages/ }));
}

function renderSwitcher() {
  return render(
    <RouteSwitcher
      route="/dispatches"
      routes={routes}
      hrefForRoute={(route) => (route === "/" ? "/edit" : `/edit${route}`)}
      createRoute={createStudioHttpClient().createRoute}
      onCreated={() => undefined}
    />,
  );
}

test("closed, it is the specimen's one plain Pages disclosure", () => {
  renderSwitcher();
  const button = screen.getByRole("button", { name: /Pages/ });
  expect(button.getAttribute("aria-expanded")).toBe("false");
  expect(screen.queryByRole("navigation")).toBeNull();
});

test("open, every route is a real link to its editor and the current one is marked", () => {
  open();
  const links = screen.getAllByRole("link");
  expect(links.map((link) => link.getAttribute("href"))).toEqual([
    "/edit",
    "/edit/dispatches",
    "/edit/spring-sale",
  ]);
  const current = screen.getByRole("link", { name: "/dispatches" });
  expect(current.getAttribute("aria-current")).toBe("page");
  expect(
    screen.getByRole("link", { name: "/spring-sale" }).getAttribute("aria-current"),
  ).toBeNull();
});

test("New page swaps into the route form", () => {
  open();
  fireEvent.click(screen.getByRole("button", { name: "New page…" }));
  expect(screen.getByLabelText("Route for the new page")).toBeTruthy();
});

test("Escape closes the list and hands focus back to the button", () => {
  open();
  fireEvent.keyDown(document, { key: "Escape" });
  expect(screen.queryByRole("navigation")).toBeNull();
  expect(document.activeElement).toBe(screen.getByRole("button", { name: /Pages/ }));
});
