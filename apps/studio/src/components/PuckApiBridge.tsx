"use client";

import type { PuckApi } from "@measured/puck";
import { useGetPuck } from "@measured/puck";
import type { RefObject } from "react";
import { useEffect } from "react";

interface PuckApiBridgeProps {
  apiRef: RefObject<(() => PuckApi) | undefined>;
}

/**
 * Hands Puck's API out of its provider: rendered inside `<Puck>` (via the `puck` override),
 * it writes the store getter into a ref the editor's own chrome holds — so the issues panel
 * can live outside Puck's tree and still select a node. A ref rather than state, because the
 * getter never changes identity in a way the chrome needs to re-render for.
 */
export function PuckApiBridge({ apiRef }: PuckApiBridgeProps) {
  const getPuck = useGetPuck();
  useEffect(() => {
    apiRef.current = getPuck;
  }, [apiRef, getPuck]);
  return null;
}
