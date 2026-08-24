import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { PublishControl } from "./PublishControl";

afterEach(() => {
  vi.unstubAllGlobals();
});

const publishReply = {
  ok: true,
  hash: "abc123",
  url: "http://localhost:3000/",
  timings: { compileMs: 12, writeMs: 3, moveMs: 285 },
};

function stubEndpoints(publish: Response = Response.json(publishReply)) {
  vi.stubGlobal("fetch", (url: string) =>
    Promise.resolve(
      url === "/api/publish" ? publish : Response.json({ current: null, moves: [], total: 0 }),
    ),
  );
}

test("closed, it is the publish button and a chevron — both real buttons", () => {
  stubEndpoints();
  render(<PublishControl route="/" onOutcome={vi.fn()} />);
  expect(screen.getByRole("button", { name: "Publish" }).tagName).toBe("BUTTON");
  const toggle = screen.getByRole("button", { name: "Publish history and rollback" });
  expect(toggle.tagName).toBe("BUTTON");
  expect(toggle.getAttribute("aria-expanded")).toBe("false");
});

test("publishing opens the report: three steps checked with the server's timings, then the live strip", async () => {
  stubEndpoints();
  render(<PublishControl route="/" onOutcome={vi.fn()} />);
  fireEvent.click(screen.getByRole("button", { name: "Publish" }));
  await waitFor(() => {
    expect(screen.getByText("Published")).toBeTruthy();
  });
  expect(screen.getByText("Checked the page")).toBeTruthy();
  expect(screen.getByText("Built the new version")).toBeTruthy();
  expect(screen.getByText("Switched the live page over")).toBeTruthy();
  expect(screen.getByText("0.3s")).toBeTruthy();
  expect(screen.getByRole("link", { name: "View live ↗" }).getAttribute("href")).toBe(
    "http://localhost:3000/",
  );
});

test("the report's rollback affordance opens the history view", async () => {
  stubEndpoints();
  render(<PublishControl route="/" onOutcome={vi.fn()} />);
  fireEvent.click(screen.getByRole("button", { name: "Publish" }));
  await waitFor(() => {
    expect(screen.getByRole("button", { name: "Roll back to an earlier version…" })).toBeTruthy();
  });
  fireEvent.click(screen.getByRole("button", { name: "Roll back to an earlier version…" }));
  await waitFor(() => {
    expect(screen.getByText("Publish history")).toBeTruthy();
  });
});

test("a refusal hands its issues up and closes — the IssuesPanel path is untouched", async () => {
  const issues = [{ message: "expected a string", at: "hero", path: "headline" }];
  stubEndpoints(Response.json({ ok: false, issues }, { status: 422 }));
  const onOutcome = vi.fn();
  render(<PublishControl route="/" onOutcome={onOutcome} />);
  fireEvent.click(screen.getByRole("button", { name: "Publish" }));
  await waitFor(() => {
    expect(onOutcome).toHaveBeenCalledWith({ ok: false, issues });
  });
  expect(screen.queryByText("Publishing")).toBeNull();
});

test("the chevron opens the history panel and Escape closes it, focus handed back", async () => {
  stubEndpoints();
  render(<PublishControl route="/" onOutcome={vi.fn()} />);
  const toggle = screen.getByRole("button", { name: "Publish history and rollback" });
  fireEvent.click(toggle);
  expect(toggle.getAttribute("aria-expanded")).toBe("true");
  await waitFor(() => {
    expect(screen.getByText("Nothing has been published here yet.")).toBeTruthy();
  });
  fireEvent.keyDown(document, { key: "Escape" });
  expect(screen.queryByText("Publish history")).toBeNull();
  expect(document.activeElement).toBe(toggle);
});

test("a press outside closes the panel without stealing focus", async () => {
  stubEndpoints();
  render(<PublishControl route="/" onOutcome={vi.fn()} />);
  const toggle = screen.getByRole("button", { name: "Publish history and rollback" });
  fireEvent.click(toggle);
  await waitFor(() => {
    expect(screen.getByText("Publish history")).toBeTruthy();
  });
  fireEvent.mouseDown(document.body);
  expect(screen.queryByText("Publish history")).toBeNull();
  expect(document.activeElement).not.toBe(toggle);
});
