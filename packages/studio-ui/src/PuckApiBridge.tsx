"use client";

import type { PuckApi } from "@measured/puck";
import { useGetPuck } from "@measured/puck";
import type { RefObject } from "react";
import { useEffect } from "react";

export interface PuckApiBridgeProps {
  apiRef: RefObject<(() => PuckApi) | undefined>;
}

/** Hands Puck's store getter to package chrome rendered outside its provider. */
export function PuckApiBridge({ apiRef }: PuckApiBridgeProps) {
  const getPuck = useGetPuck();
  useEffect(() => {
    apiRef.current = getPuck;
  }, [apiRef, getPuck]);
  return null;
}
