import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { PublishNotice } from "./PublishNotice";

test("confirms the route and hash and links the live page at the URL the server built", () => {
  render(<PublishNotice route="/dispatches" hash="abc123" url="https://site.example/dispatches" />);
  const status = screen.getByRole("status");
  expect(status.textContent).toContain("/dispatches");
  expect(status.textContent).toContain("abc123");
  const link = screen.getByRole("link", { name: "view the live page" });
  expect(link.getAttribute("href")).toBe("https://site.example/dispatches");
});
