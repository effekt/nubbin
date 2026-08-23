import type { NubbinIssue } from "./nubbinIssue.types";

/**
 * Builds one issue for a collector to gather, the counterpart to `refuse` for the surfaces that
 * report rather than throw — `compile`'s finders, which return every problem they see so an
 * author fixing six sees six.
 *
 * `at` and `path` are omitted rather than set to `undefined` when there is nothing to name:
 * `exactOptionalPropertyTypes` is on, and a serialized issue should not carry a key that says
 * nothing.
 */
export function toIssue(
  code: NubbinIssue["code"],
  message: string,
  at?: string,
  path?: string,
): NubbinIssue {
  return {
    code,
    message,
    ...(at === undefined ? {} : { at }),
    ...(path === undefined ? {} : { path }),
  };
}
