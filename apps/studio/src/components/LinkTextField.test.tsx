import { ConsumerOriginContext } from "@nubbin/studio-ui";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { LinkTextField } from "./LinkTextField";

function renderField(
  value: string | undefined,
  options: { origin?: string; max?: number; onChange?: (next: string) => void } = {},
) {
  return render(
    <ConsumerOriginContext.Provider value={options.origin}>
      <LinkTextField
        id="href"
        label="href"
        max={options.max}
        value={value}
        readOnly={false}
        onChange={options.onChange ?? (() => undefined)}
      />
    </ConsumerOriginContext.Provider>,
  );
}

test("a value that is not a link gets the quiet note, and nothing to open", () => {
  renderField("tide tables", { origin: "http://localhost:3100" });
  expect(screen.getByText(/Not a link yet/)).toBeDefined();
  expect(screen.queryByRole("link")).toBeNull();
});

test("an empty value shows neither note nor Open — there is nothing to judge yet", () => {
  renderField("", { origin: "http://localhost:3100" });
  expect(screen.queryByText(/Not a link yet/)).toBeNull();
  expect(screen.queryByRole("link")).toBeNull();
});

test("a root-relative path opens against the consumer origin, named by its destination", () => {
  renderField("/dispatches/tide-tables", { origin: "http://localhost:3100" });
  const open = screen.getByRole("link", {
    name: "Open http://localhost:3100/dispatches/tide-tables in a new tab",
  });
  expect(open.getAttribute("href")).toBe("http://localhost:3100/dispatches/tide-tables");
  expect(open.getAttribute("target")).toBe("_blank");
  expect(open.getAttribute("rel")).toBe("noreferrer");
});

test("an absolute URL opens as-is, origin or no origin", () => {
  renderField("https://example.com/pricing", {});
  const open = screen.getByRole("link", {
    name: "Open https://example.com/pricing in a new tab",
  });
  expect(open.getAttribute("href")).toBe("https://example.com/pricing");
});

test("a relative path with no origin shows no Open rather than the studio's own port", () => {
  renderField("/dispatches", {});
  expect(screen.queryByRole("link")).toBeNull();
  expect(screen.queryByText(/Not a link yet/)).toBeNull();
});

test("a garbage value still saves — the note is a courtesy, the schema is the gate", () => {
  const onChange = vi.fn();
  renderField("was /dispatches", { origin: "http://localhost:3100", onChange });
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "still not a link" } });
  expect(onChange).toHaveBeenCalledWith("still not a link");
});

test("a schema bound keeps its counter beside the link check", () => {
  renderField("/dispatches", { origin: "http://localhost:3100", max: 60 });
  expect(screen.getByText("11/60")).toBeDefined();
});
