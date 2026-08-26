import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { PublishButton } from "./PublishButton";

test("renders a real button wearing the label it is handed", () => {
  render(<PublishButton label="Publish changes" onPublish={() => undefined} />);
  const control = screen.getByRole("button", { name: "Publish changes" });
  expect(control.tagName).toBe("BUTTON");
  expect(control.getAttribute("type")).toBe("button");
});

test("pressing it triggers the publish flow", () => {
  const onPublish = vi.fn();
  render(<PublishButton label="Publish changes" onPublish={onPublish} />);
  fireEvent.click(screen.getByRole("button", { name: "Publish changes" }));
  expect(onPublish).toHaveBeenCalledTimes(1);
});
