import { access } from "node:fs/promises";

/** Whether a path is there at all — the question `access` answers by throwing. */
export const pathExists = (path: string): Promise<boolean> =>
  access(path).then(
    () => true,
    () => false,
  );
