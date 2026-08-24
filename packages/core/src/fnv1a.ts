const OFFSET_BASIS = 14695981039346656037n;
const PRIME = 1099511628211n;
/** FNV-1a is defined modulo 2^64; BigInt multiplication is unbounded, so the wrap is explicit. */
const MASK = 0xffffffffffffffffn;
const HEX_RADIX = 16;
const HEX_WIDTH = 16;

/**
 * FNV-1a, 64-bit. Used where a value only has to change when its input changes — the content
 * address of an artifact. It is not a security primitive and must not be used as
 * one. core cannot reach node:crypto, and crypto.subtle is async where these call sites are not.
 *
 * 64 bits rather than 32 because the content address is load-bearing: `fsWriteArtifact` skips a
 * hash the store already holds, on the ground that the same address means the same bytes. At 32
 * bits the birthday bound puts a collision inside a store of tens of thousands of artifacts, and
 * every publish mints one — so the assumption fails quietly, and a route serves a page compiled
 * from a different document. BigInt is the cost of closing that; hashing runs once per compile,
 * not per render.
 */
export function fnv1a(input: string): string {
  let hash = OFFSET_BASIS;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= BigInt(input.charCodeAt(index));
    hash = (hash * PRIME) & MASK;
  }
  return hash.toString(HEX_RADIX).padStart(HEX_WIDTH, "0");
}
