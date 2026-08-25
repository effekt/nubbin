/** Parses an HTTP body without letting malformed JSON escape the transport boundary. */
export function parseHttpJson(body: string): unknown {
  try {
    return JSON.parse(body);
  } catch {
    return undefined;
  }
}
