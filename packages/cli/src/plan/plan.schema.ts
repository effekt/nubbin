import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { Plan } from "./plan.types";
import { planShapeIssues } from "./planShapeIssues";

/** The Standard Schema revision this hand-written schema declares. */
const STANDARD_SCHEMA_VERSION = 1;

/**
 * The plan contract as a Standard Schema, so any consumer validates a plan the same way.
 *
 * Hand-written against `@standard-schema/spec` rather than built from a validator: `./plan` is
 * imported by a browser bundle, and twelve closed enums are a membership test — a validator
 * dependency would ship a parser to do it, and make itself a transitive runtime dependency of
 * everyone who installs the command line.
 */
export const planSchema: StandardSchemaV1<unknown, Plan> = {
  "~standard": {
    version: STANDARD_SCHEMA_VERSION,
    vendor: "nubbin",
    validate: (value) => {
      const issues = planShapeIssues(value);
      return issues.length > 0 ? { issues } : { value: value as Plan };
    },
  },
};
