import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ImageFigure } from "./ImageFigure";
import { imageFigureDefaults } from "./imageFigureDefaults";

describe("ImageFigure", () => {
  test("renders the picture inside a figure, captioned and credited in a figcaption", () => {
    const { container } = render(<ImageFigure {...imageFigureDefaults} />);

    const figure = container.querySelector("figure");
    expect(figure?.querySelector("img")?.getAttribute("alt")).toBe(imageFigureDefaults.image.alt);
    const figcaption = figure?.querySelector("figcaption");
    expect(figcaption?.textContent).toContain(imageFigureDefaults.caption);
    expect(figcaption?.textContent).toContain(imageFigureDefaults.credit);
  });

  test("no caption and no credit means no figcaption at all", () => {
    const { container } = render(
      <ImageFigure {...imageFigureDefaults} caption={undefined} credit={undefined} />,
    );

    expect(container.querySelector("figcaption")).toBeNull();
  });

  test("a credit alone still earns the figcaption", () => {
    const { container } = render(<ImageFigure {...imageFigureDefaults} caption={undefined} />);

    expect(container.querySelector("figcaption")?.textContent).toBe(imageFigureDefaults.credit);
  });

  test("the full width frees the image from the reading measure, not the caption", () => {
    render(<ImageFigure {...imageFigureDefaults} width="full" />);

    const image = screen.getByAltText(imageFigureDefaults.image.alt);
    expect(image.parentElement?.className).not.toContain("max-w");
    expect(document.querySelector("figcaption")?.className).toContain("max-w-3xl");
  });
});
