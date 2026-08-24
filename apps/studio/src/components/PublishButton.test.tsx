import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { PublishButton } from "./PublishButton";

test("renders a real button — focusable and keyboard-operable for free", () => {
  render(<PublishButton onPublish={() => undefined} />);
  const control = screen.getByRole("button", { name: "Publish" });
  expect(control.tagName).toBe("BUTTON");
  expect(control.getAttribute("type")).toBe("button");
});

test("pressing it triggers the publish flow", () => {
  const onPublish = vi.fn();
  render(<PublishButton onPublish={onPublish} />);
  fireEvent.click(screen.getByRole("button", { name: "Publish" }));
  expect(onPublish).toHaveBeenCalledTimes(1);
});
