import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { HistoryPanel } from "./HistoryPanel";
import { testStudioOperations } from "./testStudioOperations";

afterEach(() => {
  vi.unstubAllGlobals();
});

const reply = {
  current: "aaaa1111",
  moves: [
    { hash: "aaaa1111", documentVersion: 2, movedAt: "2026-08-24T10:00:00Z" },
    { hash: "bbbb2222", documentVersion: 1, movedAt: "2026-08-23T10:00:00Z" },
  ],
  total: 2,
};

test("the panel loads the route's history and renders the rows", async () => {
  vi.stubGlobal("fetch", () => Promise.resolve(Response.json(reply)));
  render(<HistoryPanel route="/" operations={testStudioOperations} onOutcome={vi.fn()} />);
  expect(screen.getByText("Loading history…")).toBeTruthy();
  await waitFor(() => {
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});

test("a failed load says so instead of reading as an empty log", async () => {
  vi.stubGlobal("fetch", () => Promise.reject(new Error("refused")));
  render(<HistoryPanel route="/" operations={testStudioOperations} onOutcome={vi.fn()} />);
  await waitFor(() => {
    expect(screen.getByRole("alert").textContent).toBe("History could not be loaded.");
  });
});

test("a confirmed rollback posts the endpoint and hands the outcome up", async () => {
  const calls: [string, RequestInit | undefined][] = [];
  vi.stubGlobal("fetch", (url: string, init?: RequestInit) => {
    calls.push([url, init]);
    return url === "/api/rollback"
      ? Promise.resolve(
          Response.json({ ok: true, hash: "bbbb2222", url: "http://localhost:3000/" }),
        )
      : Promise.resolve(Response.json(reply));
  });
  const onOutcome = vi.fn();
  render(<HistoryPanel route="/" operations={testStudioOperations} onOutcome={onOutcome} />);
  await waitFor(() => {
    expect(screen.getByRole("button", { name: "Roll back" })).toBeTruthy();
  });
  fireEvent.click(screen.getByRole("button", { name: "Roll back" }));
  fireEvent.click(screen.getByRole("button", { name: "Confirm roll back" }));
  await waitFor(() => {
    expect(onOutcome).toHaveBeenCalledWith({
      ok: true,
      route: "/",
      hash: "bbbb2222",
      url: "http://localhost:3000/",
    });
  });
  const rollbackCall = calls.find(([url]) => url === "/api/rollback");
  expect(JSON.parse(String(rollbackCall?.[1]?.body))).toEqual({ route: "/", hash: "bbbb2222" });
});
