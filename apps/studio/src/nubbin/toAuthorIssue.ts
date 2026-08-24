import type { Catalog, DocumentVersion } from "@nubbin/core";
import type { AuthorIssue } from "./authorIssue.types";
import type { WireIssue } from "./isNubbinIssueShape";
import { overLimitIssueMessage } from "./overLimitIssueMessage";
import { toFieldLabel } from "./toFieldLabel";

/**
 * One compiler issue in author words: `at` looked up as a node in the draft gives the block's
 * name and the schema the field label resolves through. An `at` naming no node — a route, a
 * block name, or nothing — keeps only the message and the raw path, and stays unclickable.
 * A refusal the studio can word better than the compiler — a bounded string the draft holds
 * past its limit — reads as the field's own over-limit line; everything else keeps the
 * compiler's prose verbatim.
 */
export function toAuthorIssue(
  issue: WireIssue,
  catalog: Catalog,
  version: DocumentVersion,
): AuthorIssue {
  const node = issue.at === undefined ? undefined : version.elements[issue.at];
  if (node === undefined) {
    const fieldLabel = issue.path === undefined || issue.path === "" ? undefined : issue.path;
    return { fieldLabel, message: issue.message };
  }
  const entry = catalog[node.block];
  return {
    nodeId: node.id,
    blockName: node.block,
    fieldLabel: toFieldLabel(issue.path, entry),
    message: overLimitIssueMessage(issue, entry, node) ?? issue.message,
  };
}
