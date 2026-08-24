import { UsageError } from "./UsageError";

/**
 * The application's handler for one action, resolved against the origin as given.
 *
 * Relative rather than absolute, so an origin carrying a path keeps it: an application served
 * under a base path, or behind a path-prefixed proxy, would otherwise be posted to at the host's
 * root and told its handler answered 404.
 *
 * An origin that is not a URL is the caller's mistake rather than the application's, so it is
 * refused as usage — `--origin localhost:3000`, missing its scheme, is the common way to make it.
 */
export function endpointFor(origin: string, action: string): URL {
  const base = origin.endsWith("/") ? origin : `${origin}/`;
  try {
    return new URL(`api/nubbin/${action}`, base);
  } catch {
    throw new UsageError(`--origin ${origin} is not a URL — it needs a scheme, like http://`);
  }
}
