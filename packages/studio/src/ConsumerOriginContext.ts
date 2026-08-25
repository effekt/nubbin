"use client";

import { createContext } from "react";

/** The application origin used to resolve root-relative links outside Studio itself. */
export const ConsumerOriginContext = createContext<string | undefined>(undefined);
