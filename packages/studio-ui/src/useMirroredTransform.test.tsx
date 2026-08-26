import { render, waitFor } from "@testing-library/react";
import { useRef } from "react";
import { expect, test } from "vitest";
import { useMirroredTransform } from "./useMirroredTransform";

function Probe() {
  const ref = useRef<HTMLSpanElement>(null);
  const transform = useMirroredTransform(ref, ".zoomed");
  return <span ref={ref} data-mirrored={transform} />;
}

function mountZoomed(): { host: HTMLElement; probe: () => HTMLElement | null } {
  const host = document.createElement("div");
  host.className = "zoomed";
  host.style.transform = "scale(1.1494)";
  document.body.appendChild(host);
  render(<Probe />, { container: host });
  return { host, probe: () => host.querySelector("span") };
}

test("mirrors the ancestor's inline transform on mount", async () => {
  const { host, probe } = mountZoomed();
  await waitFor(() => expect(probe()?.dataset.mirrored).toBe("scale(1.1494)"));
  host.remove();
});

test("follows a rewrite of the ancestor's style, as Puck re-scales on zoom", async () => {
  const { host, probe } = mountZoomed();
  host.style.transform = "scale(1.5873)";
  await waitFor(() => expect(probe()?.dataset.mirrored).toBe("scale(1.5873)"));
  host.remove();
});

test("with no matching ancestor it stays empty rather than guessing", () => {
  const { container } = render(<Probe />);
  expect(container.querySelector("span")?.dataset.mirrored).toBe("");
});
