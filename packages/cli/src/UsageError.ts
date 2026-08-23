/**
 * A refusal the caller fixes by running a different command — a missing config, a route with no
 * document, an argument that is not there. Kept apart from `NubbinError`, which is the library
 * refusing a document, because the two exit differently: a usage error means nothing was
 * attempted, and a refusal means the thing attempted is not legal.
 */
export class UsageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UsageError";
  }
}
