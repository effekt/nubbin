import type { Config } from "@measured/puck";
import { createRegistry, type DocumentVersion } from "@nubbin/core";
import { createStudioHttpClient } from "@nubbin/studio";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { StudioEditor } from "./StudioEditor";

vi.mock("@measured/puck", () => ({
  Puck: () => <div data-testid="puck-engine" />,
}));

afterEach(cleanup);

const version: DocumentVersion = {
  documentId: "home",
  version: 1,
  roots: [],
  elements: {},
  meta: { title: "Home" },
  createdAt: "2026-01-01T00:00:00.000Z",
  createdBy: "test",
};

test("assembles the controlled editor engine with replaceable host chrome", () => {
  render(
    <StudioEditor
      config={{ catalog: {}, registry: createRegistry([]), viewports: [] }}
      route="/"
      routes={["/"]}
      initialData={{ content: [], root: { props: {} } }}
      initialVersion={version}
      initialRevision="revision-1"
      consumerOrigin="http://localhost:3000"
      saveDraft={() => Promise.resolve({ status: "saved", revision: "revision-2", issues: [] })}
      operations={createStudioHttpClient()}
      puckConfig={{ components: {} } as Config}
      presentation={{ overrides: () => ({}), status: () => <p>Draft ready</p> }}
    />,
  );
  expect(screen.getByTestId("puck-engine")).toBeDefined();
  expect(screen.getByText("Draft ready")).toBeDefined();
});
