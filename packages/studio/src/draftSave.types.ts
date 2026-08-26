import type { DocumentVersion } from "@nubbin/core";
import type { DraftRevision } from "./draftRevision.types";

/** A compare-and-save request carrying both descendants' shared base. */
export interface DraftSave {
  readonly route: string;
  readonly version: DocumentVersion;
  readonly expectedRevision: DraftRevision;
}

/** Every host outcome the editor can recover from without interpreting an exception. */
export type DraftSaveOutcome<Issue = unknown> =
  | {
      readonly status: "saved";
      readonly revision: DraftRevision;
      readonly issues?: readonly Issue[];
    }
  | {
      readonly status: "conflict";
      readonly revision: DraftRevision;
      readonly version: DocumentVersion;
    }
  | { readonly status: "missing" };
