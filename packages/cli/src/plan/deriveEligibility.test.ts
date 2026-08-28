import { describe, expect, it } from "vitest";
import { defaultPlan } from "./defaultPlan";
import { deriveEligibility } from "./deriveEligibility";

describe("deriveEligibility", () => {
  it("is free when the customer runs every service", () => {
    expect(deriveEligibility(defaultPlan)).toBe("free");
  });

  it("is paid when Nubbin runs any service", () => {
    expect(deriveEligibility({ ...defaultPlan, drafts: "nubbin" })).toBe("paid");
    expect(deriveEligibility({ ...defaultPlan, assets: "nubbin" })).toBe("paid");
  });

  it("is a conversation off a public network, hosted or not", () => {
    expect(deriveEligibility({ ...defaultPlan, network: "private" })).toBe("contact");
    expect(deriveEligibility({ ...defaultPlan, network: "isolated" })).toBe("contact");
    expect(deriveEligibility({ ...defaultPlan, network: "private", studio: "nubbin" })).toBe(
      "contact",
    );
  });

  it("is a conversation when Nubbin operates infrastructure the customer runs", () => {
    expect(deriveEligibility({ ...defaultPlan, operations: "nubbin" })).toBe("contact");
  });

  it("is paid, not a conversation, when Nubbin operates and hosts", () => {
    expect(deriveEligibility({ ...defaultPlan, operations: "nubbin", studio: "nubbin" })).toBe(
      "paid",
    );
  });
});
