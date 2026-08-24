import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { PublishNotice } from "./PublishNotice";

test("confirms the route and hash and links the demo's live page", () => {
  render(<PublishNotice route="/dispatches" hash="abc123" />);
  const status = screen.getByRole("status");
  expect(status.textContent).toContain("/dispatches");
  expect(status.textContent).toContain("abc123");
  const link = screen.getByRole("link", { name: "view it on the demo site" });
  expect(link.getAttribute("href")).toBe("http://localhost:3000/dispatches");
});

test("a missing hash still confirms the route", () => {
  render(<PublishNotice route="/" hash={undefined} />);
  expect(screen.getByRole("status").textContent).toContain("Published /");
});
