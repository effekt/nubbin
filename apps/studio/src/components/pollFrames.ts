/** Polls a probe once per animation frame until it yields a value, for at most `frames`
 * frames. Puck re-renders the inspector asynchronously after a selection, so a caller
 * waiting for its controls waits render-paced and bounded — never an arbitrary timeout —
 * and receives `undefined` when the budget runs out first. */
export function pollFrames<T>(probe: () => T | undefined, frames: number): Promise<T | undefined> {
  return new Promise((resolve) => {
    let remaining = frames;
    const attempt = () => {
      const value = probe();
      if (value !== undefined || remaining <= 0) {
        resolve(value);
        return;
      }
      remaining -= 1;
      requestAnimationFrame(attempt);
    };
    attempt();
  });
}
