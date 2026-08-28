// One fixture per use case the product documents, asserted verbatim across every projection.
//
// Verbatim rather than shape assertions: a projection that returns the right *kind* of thing for
// the wrong plan is exactly the defect these exist to catch, and `toBeTruthy` cannot see it.

import { describe, expect, it } from "vitest";
import { defaultPlan } from "./defaultPlan";
import { deriveDiagram } from "./deriveDiagram";
import { deriveEligibility } from "./deriveEligibility";
import { deriveOwnership } from "./deriveOwnership";
import { derivePackages } from "./derivePackages";
import { deriveSteps } from "./deriveSteps";
import { describePlan } from "./describePlan";
import type { Plan } from "./plan.types";
import { PLAN_FIELDS } from "./planFields.constants";
import { planIssues } from "./planIssues";

const SELF_HOSTED_PATH = ["studio", "drafts", "publish", "artifacts", "assets", "app"];
const SELF_HOSTED_OWNERSHIP = {
  you: [
    "Application",
    "Components",
    "Studio",
    "Draft storage",
    "Publishing",
    "Artifact store",
    "Delivery",
    "Assets",
    "Operations",
  ],
  nubbin: [],
};
const SELF_HOSTED_PACKAGES = [
  { name: "@nubbin/core", dev: false },
  { name: "@nubbin/react", dev: false },
  { name: "@nubbin/next", dev: false },
  { name: "@nubbin/store-fs", dev: false },
  { name: "@nubbin/studio", dev: false },
  { name: "@nubbin/studio-ui", dev: false },
  { name: "@nubbin/cli", dev: true },
];
const SELF_HOSTED_DESCRIPTION =
  "You run Studio and keep drafts on your own infrastructure. You store and serve published " +
  "artifacts yourself, and your application reads them at build time.";

const USE_CASES: {
  name: string;
  plan: Plan;
  nodes: string[];
  ownership: { you: string[]; nubbin: string[] };
  packages: { name: string; dev: boolean }[];
  eligibility: "free" | "paid" | "contact";
  description: string;
}[] = [
  {
    name: "everything self-hosted",
    plan: defaultPlan,
    nodes: SELF_HOSTED_PATH,
    ownership: SELF_HOSTED_OWNERSHIP,
    packages: SELF_HOSTED_PACKAGES,
    eligibility: "free",
    description: SELF_HOSTED_DESCRIPTION,
  },
  {
    name: "local authoring with Nubbin storing and serving",
    plan: { ...defaultPlan, artifacts: "nubbin", delivery: "nubbin", consumption: "runtime" },
    nodes: ["studio", "drafts", "publish", "artifacts", "delivery", "assets", "app"],
    ownership: {
      you: [
        "Application",
        "Components",
        "Studio",
        "Draft storage",
        "Publishing",
        "Assets",
        "Operations",
      ],
      nubbin: ["Artifact store", "Delivery"],
    },
    packages: [
      { name: "@nubbin/core", dev: false },
      { name: "@nubbin/react", dev: false },
      { name: "@nubbin/next", dev: false },
      { name: "@nubbin/studio", dev: false },
      { name: "@nubbin/studio-ui", dev: false },
      { name: "@nubbin/cli", dev: true },
    ],
    eligibility: "paid",
    description:
      "You run Studio and keep drafts on your own infrastructure. Nubbin stores and serves " +
      "published artifacts, and your application reads them on every request.",
  },
  {
    name: "Nubbin hosts every service",
    plan: {
      ...defaultPlan,
      studio: "nubbin",
      drafts: "nubbin",
      publishing: "nubbin",
      artifacts: "nubbin",
      delivery: "nubbin",
      assets: "nubbin",
      consumption: "runtime",
    },
    nodes: ["studio", "drafts", "publish", "artifacts", "delivery", "assets", "app"],
    ownership: {
      you: ["Application", "Components", "Operations"],
      nubbin: ["Studio", "Draft storage", "Publishing", "Artifact store", "Delivery", "Assets"],
    },
    packages: [
      { name: "@nubbin/core", dev: false },
      { name: "@nubbin/react", dev: false },
      { name: "@nubbin/next", dev: false },
    ],
    eligibility: "paid",
    description:
      "Nubbin runs Studio and keeps your drafts. Nubbin stores and serves published artifacts, " +
      "and your application reads them on every request.",
  },
  {
    name: "a hosted Studio over the customer's own store",
    plan: { ...defaultPlan, studio: "nubbin", drafts: "nubbin" },
    nodes: SELF_HOSTED_PATH,
    ownership: {
      you: [
        "Application",
        "Components",
        "Publishing",
        "Artifact store",
        "Delivery",
        "Assets",
        "Operations",
      ],
      nubbin: ["Studio", "Draft storage"],
    },
    packages: [
      { name: "@nubbin/core", dev: false },
      { name: "@nubbin/react", dev: false },
      { name: "@nubbin/next", dev: false },
      { name: "@nubbin/store-fs", dev: false },
      { name: "@nubbin/cli", dev: true },
    ],
    eligibility: "paid",
    description:
      "Nubbin runs Studio and keeps your drafts. You store and serve published artifacts " +
      "yourself, and your application reads them at build time.",
  },
  {
    name: "build-time consumption with a deploy notification",
    plan: {
      ...defaultPlan,
      framework: "react",
      components: "starter",
      notifications: ["deploy"],
    },
    nodes: SELF_HOSTED_PATH,
    ownership: SELF_HOSTED_OWNERSHIP,
    packages: [
      { name: "@nubbin/core", dev: false },
      { name: "@nubbin/react", dev: false },
      { name: "@nubbin/store-fs", dev: false },
      { name: "@nubbin/studio", dev: false },
      { name: "@nubbin/studio-ui", dev: false },
      { name: "@nubbin/cli", dev: true },
    ],
    eligibility: "free",
    description: SELF_HOSTED_DESCRIPTION,
  },
  {
    name: "bring your own infrastructure, operated by Nubbin",
    plan: { ...defaultPlan, operations: "nubbin" },
    nodes: SELF_HOSTED_PATH,
    ownership: {
      you: [
        "Application",
        "Components",
        "Studio",
        "Draft storage",
        "Publishing",
        "Artifact store",
        "Delivery",
        "Assets",
      ],
      nubbin: ["Operations"],
    },
    packages: SELF_HOSTED_PACKAGES,
    eligibility: "contact",
    description: SELF_HOSTED_DESCRIPTION,
  },
  {
    name: "an isolated network",
    plan: { ...defaultPlan, network: "isolated" },
    nodes: SELF_HOSTED_PATH,
    ownership: SELF_HOSTED_OWNERSHIP,
    packages: SELF_HOSTED_PACKAGES,
    eligibility: "contact",
    description: SELF_HOSTED_DESCRIPTION,
  },
];

describe.each(USE_CASES)(
  "$name",
  ({ plan, nodes, ownership, packages, eligibility, description }) => {
    it("draws the boxes the plan puts on the page", () => {
      expect(deriveDiagram(plan).nodes.map((node) => node.id)).toEqual(nodes);
    });

    it("splits ownership", () => {
      expect(deriveOwnership(plan)).toEqual(ownership);
    });

    it("names the packages", () => {
      expect(derivePackages(plan)).toEqual(packages);
    });

    it("says what it costs", () => {
      expect(deriveEligibility(plan)).toBe(eligibility);
    });

    it("describes itself", () => {
      expect(describePlan(plan)).toBe(description);
    });

    it("is a plan the product can deliver", () => {
      expect(planIssues(plan)).toEqual([]);
    });
  },
);

const NOTIFICATION_SETS: Plan["notifications"][] = [
  [],
  ["webhook"],
  ["deploy"],
  ["workflow"],
  ["webhook", "deploy", "workflow"],
];

/** The default plan varied one field at a time, across every value every field declares. */
const everyPlan: Plan[] = [
  ...PLAN_FIELDS.framework.map((framework) => ({ ...defaultPlan, framework })),
  ...PLAN_FIELDS.components.map((components) => ({ ...defaultPlan, components })),
  ...PLAN_FIELDS.studio.map((studio) => ({ ...defaultPlan, studio })),
  ...PLAN_FIELDS.drafts.map((drafts) => ({ ...defaultPlan, drafts })),
  ...PLAN_FIELDS.publishing.map((publishing) => ({ ...defaultPlan, publishing })),
  ...PLAN_FIELDS.artifacts.map((artifacts) => ({ ...defaultPlan, artifacts })),
  ...PLAN_FIELDS.delivery.map((delivery) => ({ ...defaultPlan, delivery })),
  ...PLAN_FIELDS.consumption.map((consumption) => ({ ...defaultPlan, consumption })),
  ...NOTIFICATION_SETS.map((notifications) => ({ ...defaultPlan, notifications })),
  ...PLAN_FIELDS.assets.map((assets) => ({ ...defaultPlan, assets })),
  ...PLAN_FIELDS.operations.map((operations) => ({ ...defaultPlan, operations })),
  ...PLAN_FIELDS.network.map((network) => ({ ...defaultPlan, network })),
];

describe("every projection", () => {
  it("returns for every value of every field, including the plans with issues", () => {
    expect(everyPlan.length).toBeGreaterThan(20);
    for (const plan of everyPlan) {
      expect(deriveDiagram(plan).nodes.length).toBeGreaterThan(0);
      expect(deriveOwnership(plan).you).toContain("Application");
      expect(derivePackages(plan).length).toBeGreaterThan(0);
      expect(deriveSteps(plan).length).toBeGreaterThan(0);
      expect(["free", "paid", "contact"]).toContain(deriveEligibility(plan));
      expect(describePlan(plan).split(". ")).toHaveLength(2);
    }
  });

  it("never writes more steps than a reader finishes", () => {
    for (const plan of everyPlan) {
      expect(deriveSteps(plan).length).toBeLessThanOrEqual(8);
    }
  });
});
