"use client";

import { useId, useState } from "react";
import { studioHttpClient } from "../nubbin/studioHttpClient";

interface NewRouteFormProps {
  onCreated: (route: string) => void;
}

/** The prompt behind "New page": one labelled field for the literal route, judged
 * server-side by core's own validator so this form ships no second copy of that judgment.
 * A refusal — malformed route or a page already there — lands under the field in the
 * server's words, announced as an alert and tied to the input for assistive tech. */
export function NewRouteForm({ onCreated }: NewRouteFormProps) {
  const inputId = useId();
  const errorId = useId();
  const [error, setError] = useState<string | undefined>(undefined);
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const route = String(new FormData(event.currentTarget).get("route") ?? "");
    void studioHttpClient
      .createRoute(route)
      .then((outcome) => (outcome.ok ? onCreated(outcome.route) : setError(outcome.message)));
  };
  return (
    <form className="nubbin-pages-form" onSubmit={onSubmit}>
      <label htmlFor={inputId}>Route for the new page</label>
      <input
        id={inputId}
        name="route"
        type="text"
        placeholder="/spring-sale"
        required
        aria-describedby={error === undefined ? undefined : errorId}
        aria-invalid={error === undefined ? undefined : true}
      />
      {error === undefined ? null : (
        <p id={errorId} role="alert">
          {error}
        </p>
      )}
      <button type="submit">Create page</button>
    </form>
  );
}
