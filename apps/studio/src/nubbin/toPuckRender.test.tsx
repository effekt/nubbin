import { render, screen } from "@testing-library/react";
import { isValidElement } from "react";
import { expect, test } from "vitest";
import { toPuckRender } from "./toPuckRender";

function Stack(props: Record<string, unknown>) {
  return (
    <div>
      <p>{typeof props.label === "string" ? props.label : null}</p>
      {isValidElement(props.sections) ? props.sections : null}
    </div>
  );
}

test("renders the block with its slot components resolved to elements", () => {
  const renderBlock = toPuckRender(Stack, ["sections"]);
  const Slot = () => <p>slot child</p>;
  render(renderBlock({ label: "the stack", sections: Slot }));
  expect(screen.getByText("the stack")).toBeDefined();
  expect(screen.getByText("slot child")).toBeDefined();
});
