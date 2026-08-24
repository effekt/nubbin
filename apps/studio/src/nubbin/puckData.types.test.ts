import type { ComponentData, Data, DefaultComponents } from "@measured/puck";
import { describe, expect, it } from "vitest";
import type { PuckComponentData, PuckData } from "./puckData.types";

/** The local mirror exists to keep `unknown` where Puck writes `any`; these are the
 * compile-time proofs that mirror and original stay the same shape. Each helper is an
 * identity the type checker judges — a Puck upgrade that changes `Data` breaks the build
 * here, not silently inside the adapter. */
describe("puckData.types", () => {
  it("accepts what the adapter builds as Puck's own Data", () => {
    const local: PuckData = {
      content: [{ type: "Hero", props: { id: "hero", headline: "hi" } }],
      root: { props: { title: "home" } },
    };
    // Root props widened: Puck's default root generic is `{ title?: string }`, while the
    // adapter carries the whole `DocumentMeta` there — the shape our config instantiates.
    const real: Data<DefaultComponents, Record<string, unknown>> = local;
    expect(real.content).toHaveLength(1);
  });

  it("accepts Puck's own Data where the adapter reads the mirror", () => {
    const real: Data = {
      content: [{ type: "Hero", props: { id: "hero" } }],
      root: { props: { title: "home" } },
      zones: {},
    };
    const local: PuckData = real;
    expect(local.content[0]?.type).toBe("Hero");
  });

  it("holds one component the way Puck's ComponentData does, both directions", () => {
    const local: PuckComponentData = { type: "Card", props: { id: "c1", title: "t" } };
    const real: ComponentData = local;
    const back: PuckComponentData = real;
    expect(back.props.id).toBe("c1");
  });
});
