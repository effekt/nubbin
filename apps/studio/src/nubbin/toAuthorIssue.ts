import type { Catalog, DocumentVersion } from "@nubbin/core";
import type { AuthorIssue } from "./authorIssue.types";
import type { WireIssue } from "./isNubbinIssueShape";
import { toFieldLabel } from "./toFieldLabel";

/**
 * One compiler issue in author words: `at` looked up as a node in the draft gives the block's
 * name and the schema the field label resolves through. An `at` naming no node — a route, a
 * block name, or nothing — keeps only the message and the raw path, and stays unclickable.
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
  return {
    nodeId: node.id,
    blockName: node.block,
    fieldLabel: toFieldLabel(issue.path, catalog[node.block]),
    message: issue.message,
  };
}
