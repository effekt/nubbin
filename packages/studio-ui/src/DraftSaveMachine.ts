import {
  type DocumentConflict,
  type DocumentVersion,
  reconcileDocumentVersion,
  resolveDocumentConflict,
} from "@nubbin/core";
import type { DraftSaveMachineCallbacks } from "./draftSaveMachine.types";
import type { StudioDraftSaver } from "./studioEditorProps.types";

/** Serializes autosaves and owns the base/revision pair used for three-way reconciliation. */
export class DraftSaveMachine {
  readonly #route: string;
  readonly #saveDraft: StudioDraftSaver;
  readonly #callbacks: DraftSaveMachineCallbacks;
  #base: DocumentVersion;
  #revision: string;
  #latest: DocumentVersion;
  #pending = false;
  #saving = false;
  #reconciliation:
    | { version: DocumentVersion; conflicts: readonly DocumentConflict[] }
    | undefined = undefined;

  constructor(
    route: string,
    initialVersion: DocumentVersion,
    initialRevision: string,
    saveDraft: StudioDraftSaver,
    callbacks: DraftSaveMachineCallbacks,
  ) {
    this.#route = route;
    this.#base = initialVersion;
    this.#latest = initialVersion;
    this.#revision = initialRevision;
    this.#saveDraft = saveDraft;
    this.#callbacks = callbacks;
  }

  queue(version: DocumentVersion): void {
    this.#latest = version;
    this.#pending = true;
  }

  async flush(): Promise<void> {
    if (this.#saving || this.#reconciliation !== undefined) return;
    this.#saving = true;
    try {
      while (this.#pending && this.#reconciliation === undefined) {
        this.#pending = false;
        await this.#persistLatest();
      }
    } catch {
      this.#callbacks.failed();
    } finally {
      this.#saving = false;
    }
  }

  resolve(index: number, choice: "local" | "remote"): void {
    const conflict = this.#reconciliation?.conflicts[index];
    if (conflict === undefined || this.#reconciliation === undefined) return;
    const version = resolveDocumentConflict(this.#reconciliation.version, conflict, choice);
    const conflicts = this.#reconciliation.conflicts.filter((_, at) => at !== index);
    this.#latest = version;
    this.#callbacks.reconciled(version);
    this.#callbacks.conflicts(conflicts);
    if (conflicts.length > 0) {
      this.#reconciliation = { version, conflicts };
      return;
    }
    this.#reconciliation = undefined;
    this.#pending = true;
    void this.flush();
  }

  async #persistLatest(): Promise<void> {
    const local = this.#latest;
    const outcome = await this.#saveDraft({
      route: this.#route,
      version: local,
      expectedRevision: this.#revision,
    });
    if (outcome.status === "missing") throw new Error(`no draft for ${this.#route}`);
    if (outcome.status === "saved") {
      this.#base = local;
      this.#revision = outcome.revision;
      this.#callbacks.saved(outcome.issues ?? []);
      return;
    }
    this.#acceptConflict(outcome.version, outcome.revision);
  }

  #acceptConflict(remote: DocumentVersion, revision: string): void {
    const reconciled = reconcileDocumentVersion(this.#base, this.#latest, remote);
    this.#base = remote;
    this.#revision = revision;
    this.#latest = reconciled.version;
    this.#callbacks.reconciled(reconciled.version);
    if (reconciled.conflicts.length === 0) {
      this.#pending = true;
      return;
    }
    this.#reconciliation = reconciled;
    this.#callbacks.conflicts(reconciled.conflicts);
  }
}
