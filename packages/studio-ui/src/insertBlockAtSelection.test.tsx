import { Puck, type PuckApi } from "@measured/puck";
import { act, render } from "@testing-library/react";
import { expect, test } from "vitest";
import { insertBlockAtSelection } from "./insertBlockAtSelection";
import { PuckApiBridge } from "./PuckApiBridge";

// A real Puck carries the store the unit dispatches into — the same api the palette is
// handed through the bridge — so what these tests assert is Puck's own resulting data.
function mountPuck(data: { content: { type: string; props: { id: string } }[] }) {
  const ref: { current: (() => PuckApi) | undefined } = { current: undefined };
  render(
    <Puck
      config={{
        components: {
          Hero: { render: () => <div /> },
          Faq: { fields: { help: { type: "slot", allow: ["CtaCard"] } }, render: () => <div /> },
          CtaCard: { render: () => <div /> },
        },
      }}
      data={{ ...data, root: { props: {} } }}
      overrides={{
        puck: ({ children }) => (
          <>
            <PuckApiBridge apiRef={ref} />
            {children}
          </>
        ),
      }}
    />,
  );
  const getPuck = ref.current;
  if (getPuck === undefined) {
    throw new Error("the bridge did not hand the api over");
  }
  return getPuck;
}

test("with nothing selected, the block lands at the end of the page", () => {
  const getPuck = mountPuck({ content: [{ type: "Hero", props: { id: "hero-1" } }] });
  act(() => {
    expect(insertBlockAtSelection(getPuck(), "Hero")).toBe(true);
  });
  const types = getPuck().appState.data.content.map((node) => node.type);
  expect(types).toEqual(["Hero", "Hero"]);
  expect(getPuck().appState.data.content[1]?.props.id).not.toBe("hero-1");
});

test("with a block selected, the new one lands directly after it", () => {
  const getPuck = mountPuck({
    content: [
      { type: "Hero", props: { id: "hero-1" } },
      { type: "Faq", props: { id: "faq-1" } },
    ],
  });
  act(() => {
    getPuck().dispatch({
      type: "setUi",
      ui: { itemSelector: { index: 0, zone: "root:default-zone" } },
    });
  });
  act(() => {
    expect(insertBlockAtSelection(getPuck(), "CtaCard")).toBe(true);
  });
  const types = getPuck().appState.data.content.map((node) => node.type);
  expect(types).toEqual(["Hero", "CtaCard", "Faq"]);
});

test("a block a slot's allow list refuses is not inserted, and the refusal is reported", () => {
  const getPuck = mountPuck({ content: [{ type: "Faq", props: { id: "faq-1" } }] });
  act(() => {
    getPuck().dispatch({
      type: "insert",
      componentType: "CtaCard",
      destinationIndex: 0,
      destinationZone: "faq-1:help",
    });
  });
  act(() => {
    getPuck().dispatch({ type: "setUi", ui: { itemSelector: { index: 0, zone: "faq-1:help" } } });
  });
  act(() => {
    expect(insertBlockAtSelection(getPuck(), "Hero")).toBe(false);
    expect(insertBlockAtSelection(getPuck(), "CtaCard")).toBe(true);
  });
  const faq = getPuck().getItemById("faq-1");
  if (faq === undefined) {
    throw new Error("the Faq block went missing");
  }
  const help: { type: string }[] = faq.props.help ?? [];
  expect(help.map((node) => node.type)).toEqual(["CtaCard", "CtaCard"]);
});
