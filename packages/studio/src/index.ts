export type { AuthorIssue } from "./authorIssue.types";
/** The React context type exposed by the optional consumer-origin entry. */
export type ConsumerOriginContextType =
  typeof import("./ConsumerOriginContext").ConsumerOriginContext;
export type { StatusStore } from "./createStatusStore";
export { createStatusStore } from "./createStatusStore";
export { defineStudioConfig } from "./defineStudioConfig";
export type { EditorStatus } from "./editorStatus.types";
export { editorStatusStore } from "./editorStatusStore";
export { patchEditorStatus } from "./patchEditorStatus";
export type { StudioConfig, StudioEditorConfig, StudioViewport } from "./studioConfig.types";
export { toDocsByBlock } from "./toDocsByBlock";
export { toSlotConstraintsByBlock } from "./toSlotConstraintsByBlock";
export { toSlotNamesByBlock } from "./toSlotNamesByBlock";
