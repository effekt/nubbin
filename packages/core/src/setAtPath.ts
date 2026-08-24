import { NubbinIssueCode } from "./NubbinIssueCode";
import { refuse } from "./refuse";
import { splitPath } from "./splitPath";

// Paths address object fields only; `[]` has no single target.
/**
 * Writes a value at a dotted path in a plain object, copying every level the path passes
 * through. `setNodeProp` edits props with it, and the renderer fills a resolved hole with it.
 *
 * The path is `.`-separated object keys — `price`, `cta.link.label`. Each segment names a key,
 * never an array index: a numeric segment is the key `"0"`, and an array met on the way down is
 * refused rather than descended into. The last segment is written wholesale, so an array or
 * object already sitting there is replaced entire. An intermediate key holding no object — a
 * missing key, `null`, a string, a number — is replaced by a fresh object.
 *
 * @param target - The object to write into. Read, never written.
 * @param path - Dotted path of object keys. Every segment must be non-empty and free of `[]`.
 * @param value - What to write at the path. Anything, including `undefined`.
 * @returns A new record with the path written. The argument is not mutated: each level along
 *   the path is a fresh object, and every key off the path is carried over by reference.
 * @throws {NubbinError} `path-not-addressable` when a segment is empty, carries `[]` — which
 *   names every member of an array rather than one target — or descends into an array.
 * @example
 * ```ts
 * setAtPath({ title: "T", price: 0 }, "price", 42); // { title: "T", price: 42 }
 * setAtPath({}, "cta.price", 42); // { cta: { price: 42 } } — intermediates are created
 * setAtPath({ cta: "text" }, "cta.price", 42); // { cta: { price: 42 } } — the string is gone
 * setAtPath({ items: ["a", "b"] }, "items", ["c"]); // { items: ["c"] } — a whole-field write
 *
 * setAtPath({ items: ["a", "b"] }, "items.0", "X"); // throws — `items` is an array
 * setAtPath({}, "items[].price", 42); // throws — `[]` names every member, not one
 * ```
 */
export function setAtPath(
  target: Record<string, unknown>,
  path: string,
  value: unknown,
): Record<string, unknown> {
  const { head, tail } = splitPath(path);
  if (tail.length === 0) {
    return { ...target, [head]: value };
  }
  const child = target[head];
  // An array is refused rather than descended into. `typeof [] === "object"`, so spreading one
  // produced a record wearing its indices — `["a","b"]` became `{ 0: …, 1: "b" }` — which no
  // schema accepts and nothing on the write path reported. `takeAtPath` already refuses an array
  // at this same step; the two walk in opposite directions over one vocabulary, so they refuse
  // the same shapes.
  if (Array.isArray(child)) {
    refuse(
      NubbinIssueCode.PathNotAddressable,
      `path "${path}" descends into an array at "${head}", which addresses no field`,
      path,
    );
  }
  const base =
    typeof child === "object" && child !== null ? (child as Record<string, unknown>) : {};
  return { ...target, [head]: setAtPath(base, tail.join("."), value) };
}
