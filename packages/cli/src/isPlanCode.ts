/**
 * What every plan code starts with: a revision, then the body. The revision is any number rather
 * than the one `decodePlan` reads, so a code from a later contract is still refused as a code —
 * `not a plan code` — and never looked for on disk as a file.
 */
const CODE_PREFIX = /^v\d+-/;

/** Whether an argument is a plan code, as opposed to a path to a plan file. */
export const isPlanCode = (argument: string): boolean => CODE_PREFIX.test(argument);
