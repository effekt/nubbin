import type { UnknownProps } from "./block.types";
import { isUnknownProps } from "./isUnknownProps";

/**
 * Every dotted path present in what an author wrote and absent from what the schema parsed.
 *
 * A schema reshapes as well as validates: it may add a key from a default and change a value
 * through a coercion or a transform, and neither is a loss. What is a loss is a key that went in
 * and did not come out — almost always a typo, and until this existed it vanished in silence
 * with the artifact compiling perfectly.
 *
 * It reports the outermost path only: a dropped object is one issue naming it, not one per key
 * beneath it. Arrays are not descended, for the same reason a hint cannot address a member —
 * `[]` names every one of them rather than a single target.
 */
export function droppedKeyPaths(
  written: UnknownProps,
  parsed: UnknownProps,
  prefix = "",
): string[] {
  const dropped: string[] = [];
  for (const [key, value] of Object.entries(written)) {
    const path = prefix === "" ? key : `${prefix}.${key}`;
    if (!Object.hasOwn(parsed, key)) {
      dropped.push(path);
      continue;
    }
    const kept = parsed[key];
    if (isUnknownProps(value) && isUnknownProps(kept)) {
      dropped.push(...droppedKeyPaths(value, kept, path));
    }
  }
  return dropped;
}
