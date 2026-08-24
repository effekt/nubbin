import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { PublishNotice } from "./PublishNotice";

test("confirms the route and hash and links the live page at the URL the server built", () => {
  render(
    <PublishNotice
      route="/dispatches"
      hash="abc123"
      url="https://site.example/dispatches"
      onDismiss={() => {}}
    />,
  );
  const status = screen.getByRole("status");
  expect(status.textContent).toContain("/dispatches");
  expect(status.textContent).toContain("abc123");
  const link = screen.getByRole("link", { name: "view the live page" });
  expect(link.getAttribute("href")).toBe("https://site.example/dispatches");
});

test("the close button dismisses it", () => {
  const onDismiss = vi.fn();
  render(<PublishNotice route="/" hash="abc" url="https://site.example/" onDismiss={onDismiss} />);
  fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
  expect(onDismiss).toHaveBeenCalledTimes(1);
});

test("it leaves on its own after a moment", () => {
  vi.useFakeTimers();
  const onDismiss = vi.fn();
  render(<PublishNotice route="/" hash="abc" url="https://site.example/" onDismiss={onDismiss} />);
  vi.advanceTimersByTime(7000);
  expect(onDismiss).toHaveBeenCalledTimes(1);
  vi.useRealTimers();
});
