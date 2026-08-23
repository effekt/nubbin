import type { UnknownProps } from "./block.types";
import type { Node } from "./document.types";
import { formatIssuePath } from "./formatIssuePath";
import { isUnknownProps } from "./isUnknownProps";
import { NubbinIssueCode } from "./NubbinIssueCode";
import type { NubbinIssue } from "./nubbinIssue.types";
import { standardValidate } from "./standardValidate";

/**
 * Validates one node's draft props against the real schema and returns the value `validate()`
 * parsed — never the input object. A draft can hold a value for a union branch no longer
 * selected; the parsed value is where that stale field has already been dropped.
 */
export function validateNodeProps(
  node: Node,
  schema: unknown,
): { value?: UnknownProps; issues: NubbinIssue[] } {
  const result = standardValidate(schema, node.props);
  if (result.issues !== undefined) {
    const issues = result.issues.map((issue) => ({
      at: node.id,
      path: formatIssuePath(issue.path),
      code: NubbinIssueCode.InvalidProps,
      message: issue.message,
    }));
    return { issues };
  }
  if (!isUnknownProps(result.value)) {
    return {
      issues: [
        {
          at: node.id,
          path: "",
          code: NubbinIssueCode.InvalidProps,
          message: "block props must parse to an object",
        },
      ],
    };
  }
  return { value: result.value, issues: [] };
}
