/** The rollback button's word for its own state: resting, asking for the second press of
 * the two-step confirm, or waiting on the endpoint. */
export function rollbackLabel(confirming: boolean, pending: boolean): string {
  if (pending) {
    return "Rolling back…";
  }
  return confirming ? "Confirm roll back" : "Roll back";
}
