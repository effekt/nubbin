import { splitPath } from "./splitPath";

/** Copy-on-write down one dotted path. Paths address object fields only; `[]` has no single target. */
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
    throw new Error(`path "${path}" descends into an array at "${head}", which addresses no field`);
  }
  const base =
    typeof child === "object" && child !== null ? (child as Record<string, unknown>) : {};
  return { ...target, [head]: setAtPath(base, tail.join("."), value) };
}
