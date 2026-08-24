import type { EditorStatus } from "./editorStatus.types";

/** One strip segment: what it says, and the dot or voice it says it in. */
export interface StatusSegment {
  kind: "ok" | "amber" | "fix" | "plain";
  text: string;
}

/**
 * What the status bar may truthfully say, from what the editor status can prove: a publish
 * that landed this session reads up to date; anything else reads as edits not yet live —
 * the same assumption the publish button makes. Issues add the fix count only while there
 * are any, and the autosave note appears only after a save has actually reached the
 * endpoint, clearing again the moment another edit is typed.
 */
export function toStatusSegments(status: EditorStatus): {
  left: StatusSegment[];
  right: StatusSegment[];
} {
  const left: StatusSegment[] = [
    status.published
      ? { kind: "ok", text: "Published · up to date" }
      : { kind: "amber", text: "Newer edits not live yet" },
  ];
  if (status.issues.length > 0) {
    left.push({ kind: "fix", text: `${status.issues.length} to fix before publish` });
  }
  return {
    left,
    right: status.savedAt === undefined ? [] : [{ kind: "plain", text: "Draft autosaved" }],
  };
}
