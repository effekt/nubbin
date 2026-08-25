import type { PublishOutcome } from "../nubbin/publishOutcome.types";
import { PublishNotice } from "./PublishNotice";

interface OutcomeNoticeProps {
  outcome: PublishOutcome | undefined;
  onDismiss: () => void;
}

/** The canvas notice for a landed publish or rollback; refusals belong to the issues panel. */
export function OutcomeNotice({ outcome, onDismiss }: OutcomeNoticeProps) {
  return outcome?.ok === true ? (
    <PublishNotice
      route={outcome.route}
      hash={outcome.hash}
      url={outcome.url}
      onDismiss={onDismiss}
    />
  ) : null;
}
