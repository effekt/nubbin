const POLL_PAUSE_MS = 250;

/**
 * Polls the origin until the server answers anything at all — a 404 counts, because the question
 * is whether the socket is accepting, not what it thinks of the route.
 *
 * A port announced is not a port accepting: Turbopack prints its ready banner before the first
 * request can be handled, so a GET fired on the banner alone races it and fails as a connection
 * refusal that reads like a broken test.
 */
export async function waitForDemoAnswer(origin: string, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const answered = await fetch(origin)
      .then(() => true)
      .catch(() => false);
    if (answered) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_PAUSE_MS));
  }
  throw new Error(`demo never answered a request at ${origin}`);
}
