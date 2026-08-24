"use client";

import { createContext } from "react";

/** The consumer app's origin, handed down from the edit page's server half — the one
 * process that holds the seam — so a link control can resolve a root-relative path against
 * the site the pages actually serve from, never against the studio's own port. `undefined`
 * outside the editor: a control then offers Open only for absolute URLs. */
export const ConsumerOriginContext = createContext<string | undefined>(undefined);
