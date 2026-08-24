export interface StatusStore<T> {
  get: () => T;
  set: (next: T) => void;
  subscribe: (listener: () => void) => () => void;
}

/**
 * The smallest external store `useSyncExternalStore` can read: a snapshot, a setter that
 * notifies, and a subscription. It exists so header chrome rendered through Puck's
 * overrides can update — count, label, open state — while the overrides object itself
 * stays referentially stable; state flows through the store instead of through props that
 * would remake the overrides and remount the header mid-interaction.
 */
export function createStatusStore<T>(initial: T): StatusStore<T> {
  let snapshot = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => snapshot,
    set: (next: T) => {
      snapshot = next;
      for (const listener of listeners) {
        listener();
      }
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
