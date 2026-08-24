import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { RichTextToolbar } from "./RichTextToolbar";

test("one real button per mark and one for the link, pressed exactly as the span carries", () => {
  render(
    <RichTextToolbar
      span={{ text: "x", marks: ["strong", "code"], href: "/y" }}
      readOnly={false}
      onToggleMark={() => 0}
      onToggleLink={() => 0}
    />,
  );
  expect(screen.getByRole("toolbar", { name: "Text style" })).toBeDefined();
  expect(screen.getByRole("button", { name: "strong" }).getAttribute("aria-pressed")).toBe("true");
  expect(screen.getByRole("button", { name: "em" }).getAttribute("aria-pressed")).toBe("false");
  expect(screen.getByRole("button", { name: "code" }).getAttribute("aria-pressed")).toBe("true");
  expect(screen.getByRole("button", { name: "link" }).getAttribute("aria-pressed")).toBe("true");
});

test("a plain span presses nothing", () => {
  render(
    <RichTextToolbar
      span={{ text: "x" }}
      readOnly={false}
      onToggleMark={() => 0}
      onToggleLink={() => 0}
    />,
  );
  for (const button of screen.getAllByRole("button")) {
    expect(button.getAttribute("aria-pressed")).toBe("false");
  }
});

test("with no span selected every toggle is disabled", () => {
  render(
    <RichTextToolbar
      span={undefined}
      readOnly={false}
      onToggleMark={() => 0}
      onToggleLink={() => 0}
    />,
  );
  for (const button of screen.getAllByRole("button")) {
    expect(button).toHaveProperty("disabled", true);
  }
});

test("a mark toggle names its mark; the link toggle speaks for itself", () => {
  const onToggleMark = vi.fn();
  const onToggleLink = vi.fn();
  render(
    <RichTextToolbar
      span={{ text: "x" }}
      readOnly={false}
      onToggleMark={onToggleMark}
      onToggleLink={onToggleLink}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "em" }));
  fireEvent.click(screen.getByRole("button", { name: "link" }));
  expect(onToggleMark).toHaveBeenCalledWith("em");
  expect(onToggleLink).toHaveBeenCalledTimes(1);
});
