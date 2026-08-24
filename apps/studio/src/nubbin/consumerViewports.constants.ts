import type { Viewports } from "@measured/puck";

/**
 * The canvas presets, named after the consumer's own breakpoints rather than invented ones.
 * The demo declares no `--breakpoint-*` tokens in its `@theme` (`examples/demo/src/app/globals.css`
 * customizes colors and a font only), so under Tailwind 4's CSS-first config the documented
 * defaults — sm 640, md 768, lg 1024, xl 1280, 2xl 1536 — ARE the demo's breakpoints, and
 * writing them here is a statement of that fact, not a substitute for reading its config.
 * A consumer who declares their own tokens changes this list, and it lives in the binding
 * seam for exactly that reason. `icon` carries the breakpoint's name because Puck renders an
 * icon string it does not recognize verbatim, which is what makes the buttons read as chips.
 */
export const CONSUMER_VIEWPORTS: Viewports = [
  { width: 640, height: "auto", icon: "sm", label: "sm" },
  { width: 768, height: "auto", icon: "md", label: "md" },
  { width: 1024, height: "auto", icon: "lg", label: "lg" },
  { width: 1280, height: "auto", icon: "xl", label: "xl" },
  { width: 1536, height: "auto", icon: "2xl", label: "2xl" },
];
