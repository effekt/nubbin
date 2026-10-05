/**
 * Whether a thrown value is an error carrying a given system code — `EEXIST`, `ENOENT` — which is
 * how Node names what went wrong on the filesystem. A plain object with a `code` is not one: the
 * question is about what the runtime raised, not about anything shaped like it.
 */
export const hasErrorCode = (error: unknown, code: string): boolean =>
  error instanceof Error && "code" in error && error.code === code;
