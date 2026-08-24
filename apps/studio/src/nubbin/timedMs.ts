/** Runs one step and reports how long it took, in whole milliseconds — the measurement a
 * publish reply carries so the editor's report shows durations the server actually saw. */
export async function timedMs<T>(step: () => Promise<T> | T): Promise<{ value: T; ms: number }> {
  const start = performance.now();
  const value = await step();
  return { value, ms: Math.round(performance.now() - start) };
}
