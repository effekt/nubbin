import type { PuckApi } from "@measured/puck";
import { Puck } from "@measured/puck";
import { render, waitFor } from "@testing-library/react";
import { expect, test } from "vitest";
import { toBridgedOverrides } from "./toBridgedOverrides";

test("the bridge hands Puck's API out of the provider, ids resolvable", async () => {
  const apiRef: { current: (() => PuckApi) | undefined } = { current: undefined };
  render(
    <Puck
      config={{ components: { Hero: { fields: {}, render: () => <div /> } } }}
      data={{ content: [{ type: "Hero", props: { id: "hero" } }], root: { props: {} } }}
      overrides={toBridgedOverrides(apiRef)}
    />,
  );
  await waitFor(() => {
    expect(apiRef.current).toBeDefined();
  });
  const selector = apiRef.current?.().getSelectorForId("hero");
  expect(selector).toMatchObject({ index: 0 });
});
