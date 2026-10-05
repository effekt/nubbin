import { joinOrNothing } from "./joinOrNothing";
import type { Ownership } from "./plan/deriveOwnership";

/**
 * The ownership split as two lines, one per party, so a reader sees at a glance which side of
 * the publish path is theirs. The labels are `deriveOwnership`'s own — the same words the
 * website's diagram uses — so the terminal and the page name one system.
 */
export function formatOwnership(ownership: Ownership): string[] {
  return [
    `You run: ${joinOrNothing(ownership.you)}`,
    `Nubbin runs: ${joinOrNothing(ownership.nubbin)}`,
  ];
}
