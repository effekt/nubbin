import type { CatalogEntry, Node } from "@nubbin/core";
import { boundedStringMax } from "./boundedStringMax";
import type { WireIssue } from "./isNubbinIssueShape";
import { overLimitLine } from "./overLimitLine";
import { propAtPath } from "./propAtPath";

/**
 * The friendly line for an over-limit refusal, composed from data rather than parsed from
 * the compiler's prose: the bound from the catalog's schema, the length from the draft the
 * issue arrived against. Only an issue whose path names a bounded string field and whose
 * draft value is a string past that bound qualifies — everything else answers `undefined`
 * and keeps the compiler's message verbatim. The wording is `overLimitLine`'s, the same
 * line the bounded field shows inline, so the dropdown and the counter speak identically.
 */
export function overLimitIssueMessage(
  issue: WireIssue,
  entry: CatalogEntry | undefined,
  node: Node,
): string | undefined {
  if (issue.path === undefined) {
    return undefined;
  }
  const max = boundedStringMax(issue.path, entry);
  if (max === undefined) {
    return undefined;
  }
  const value = propAtPath(node.props, issue.path);
  if (typeof value !== "string" || value.length <= max) {
    return undefined;
  }
  return overLimitLine(max, value.length);
}
