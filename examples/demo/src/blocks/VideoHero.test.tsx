import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { VideoHero } from "./VideoHero";
import { videoHeroDefaults } from "./videoHeroDefaults";

describe("VideoHero", () => {
  test("renders the headline and a labelled, poster-first player", () => {
    const { container } = render(<VideoHero {...videoHeroDefaults} />);
    const video = container.querySelector("video");

    expect(screen.getByRole("heading", { name: videoHeroDefaults.headline })).toBeDefined();
    expect(video?.getAttribute("poster")).toBe(videoHeroDefaults.poster.url);
    expect(video?.getAttribute("aria-label")).toBe(videoHeroDefaults.poster.alt);
    expect(video?.getAttribute("preload")).toBe("none");
  });

  test("never autoplays: motion waits for the reader, then loops muted", () => {
    const { container } = render(<VideoHero {...videoHeroDefaults} />);
    const video = container.querySelector("video");

    expect(video?.hasAttribute("autoplay")).toBe(false);
    expect(video?.hasAttribute("controls")).toBe(true);
    expect(video?.loop).toBe(true);
    expect(video?.muted).toBe(true);
  });

  test.each([
    ["dawn", "from-orange/30"],
    ["dusk", "from-teal/40"],
  ] as const)("the %s overlay is decorative and lets clicks through", (overlay, expected) => {
    const { container } = render(<VideoHero {...videoHeroDefaults} overlay={overlay} />);
    const wash = container.querySelector('[aria-hidden="true"]');

    expect(wash?.className).toContain(expected);
    expect(wash?.className).toContain("pointer-events-none");
  });

  test("overlay none renders no wash at all", () => {
    const { container } = render(<VideoHero {...videoHeroDefaults} overlay="none" />);

    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
  });
});
