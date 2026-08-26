/**
 * The publish button's word for where the draft stands: `Publish changes` while anything
 * typed since the last landed publish is ahead of the live pointer — first load included,
 * since a fresh page cannot prove otherwise — and `Published ✓` once a publish lands.
 */
export function publishLabel(isPublished: boolean): string {
  return isPublished ? "Published ✓" : "Publish changes";
}
