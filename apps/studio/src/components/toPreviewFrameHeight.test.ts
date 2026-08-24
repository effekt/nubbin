import { expect, test } from "vitest";
import {
  PREVIEW_FRAME_LOADING_PX,
  PREVIEW_FRAME_MAX_VIEWPORT_SHARE,
} from "./blockPreviewPanel.constants";
import { toPreviewFrameHeight } from "./toPreviewFrameHeight";

const SCALE = 0.4;
const VIEWPORT = 1000;
const CAP = VIEWPORT * PREVIEW_FRAME_MAX_VIEWPORT_SHARE;

test("unmeasured content gets the compact loading strip, not zero", () => {
  expect(toPreviewFrameHeight(undefined, SCALE, VIEWPORT)).toBe(PREVIEW_FRAME_LOADING_PX);
});

test("short content sizes the region to its scaled height — a compact card", () => {
  expect(toPreviewFrameHeight(500, SCALE, VIEWPORT)).toBe(200);
});

test("tall content is capped at the viewport share instead of burying the palette", () => {
  expect(toPreviewFrameHeight(5000, SCALE, VIEWPORT)).toBe(CAP);
});

test("a small viewport caps the loading strip too", () => {
  const short = PREVIEW_FRAME_LOADING_PX / PREVIEW_FRAME_MAX_VIEWPORT_SHARE - 100;
  expect(toPreviewFrameHeight(undefined, SCALE, short)).toBe(
    Math.round(short * PREVIEW_FRAME_MAX_VIEWPORT_SHARE),
  );
});
