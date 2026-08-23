import type { UnknownProps } from "./block.types";
import { formatIssuePath } from "./formatIssuePath";
import { NubbinIssueCode } from "./NubbinIssueCode";
import { refuse } from "./refuse";
import { standardValidate } from "./standardValidate";

/**
 * `defaults` is what a freshly dropped block renders with, so defaults that fail their own
 * schema produce a block that is invalid the instant it is placed. Registration refuses them.
 */
export function assertValidDefaults(
  blockName: string,
  schema: unknown,
  defaults: UnknownProps,
): void {
  const result = standardValidate(schema, defaults);
  if (result.issues === undefined) return;
  const detail = result.issues
    .map((issue) => `${formatIssuePath(issue.path)}: ${issue.message}`)
    .join("; ");
  refuse(
    NubbinIssueCode.InvalidDefaults,
    `defaults do not satisfy the schema — ${detail}`,
    blockName,
  );
}
