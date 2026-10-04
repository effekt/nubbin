import type { PublishPathField } from "./hostedPublishField";

/**
 * What `init` says when a plan hands a stage of the publish path to Nubbin: the field, and what a
 * config written here could and could not have said about it. The plan was read and printed, so
 * none of these is a refusal — the command exits as done.
 */
export const WROTE_NOTHING: Record<PublishPathField, string> = {
  drafts: "wrote nothing: drafts are Nubbin's, and a config can only read drafts you keep",
  publishing:
    "wrote nothing: publishing is Nubbin's, so there is no terminal publish path to configure",
  artifacts: "wrote nothing: artifacts are Nubbin's, and a config can only name a store you run",
};
