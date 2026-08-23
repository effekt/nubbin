import type { DocumentVersion } from "./document.types";
import { NubbinIssueCode } from "./NubbinIssueCode";
import type { NubbinIssue } from "./nubbinIssue.types";
import type { Registry } from "./registry.types";

/** A node naming a block the registry lacks can never resolve to a component. */
export function findUnknownBlocks(version: DocumentVersion, registry: Registry): NubbinIssue[] {
  return Object.values(version.elements)
    .filter((node) => registry.get(node.block) === undefined)
    .map((node) => ({
      at: node.id,
      path: "block",
      code: NubbinIssueCode.UnknownBlock,
      message: `"${node.block}" is not a registered block`,
    }));
}
