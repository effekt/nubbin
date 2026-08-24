import type { DocumentVersion } from "@nubbin/core";
import { chandlery } from "./chandlery";
import { dispatches } from "./dispatches";
import { home } from "./home";
import { lateEdition } from "./lateEdition";
import { live } from "./live";
import { tideTables } from "./tideTables";

/** Every route the demo has a document for. Which of them the build publishes is a separate
 * decision, made by the publish script. */
export const fixtureRoutes: Record<string, DocumentVersion> = {
  "/": home,
  "/dispatches": dispatches,
  "/dispatches/tide-tables": tideTables,
  "/dispatches/late-edition": lateEdition,
  "/live": live,
  "/chandlery": chandlery,
};
