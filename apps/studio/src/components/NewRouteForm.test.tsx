import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { NewRouteForm } from "./NewRouteForm";

afterEach(() => {
  vi.unstubAllGlobals();
});

function fillAndSubmit(route: string) {
  fireEvent.change(screen.getByLabelText("Route for the new page"), {
    target: { value: route },
  });
  fireEvent.click(screen.getByRole("button", { name: "Create page" }));
}

test("a created page hands its route to the navigation callback", async () => {
  vi.stubGlobal("fetch", () =>
    Promise.resolve(Response.json({ ok: true, route: "/spring-sale" }, { status: 201 })),
  );
  const onCreated = vi.fn();
  render(<NewRouteForm onCreated={onCreated} />);
  fillAndSubmit("/spring-sale");
  await waitFor(() => {
    expect(onCreated).toHaveBeenCalledWith("/spring-sale");
  });
});

test("a refusal shows as an alert tied to the field, in the server's words", async () => {
  vi.stubGlobal("fetch", () =>
    Promise.resolve(new Response("a page already lives at /live", { status: 409 })),
  );
  render(<NewRouteForm onCreated={() => undefined} />);
  fillAndSubmit("/live");
  const alert = await screen.findByRole("alert");
  expect(alert.textContent).toBe("a page already lives at /live");
  const input = screen.getByLabelText("Route for the new page");
  expect(input.getAttribute("aria-describedby")).toBe(alert.getAttribute("id"));
  expect(input.getAttribute("aria-invalid")).toBe("true");
});
