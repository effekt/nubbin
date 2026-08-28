import type { PlanPrompts } from "./plan.types";

/**
 * The question each field is asked with, and the label each of its values wears.
 *
 * In the contract rather than in the interface that renders it, for the reason the plan itself is:
 * a website and a terminal asking the same question in different words are two questionnaires
 * whose answers only look like the same object. `PLAN_LABELS` is the other half of the vocabulary
 * — this one is what a customer reads while deciding, that one is what they read afterwards.
 */
export const PLAN_PROMPTS: PlanPrompts = {
  framework: {
    question: "What is your application built with?",
    options: { next: "Next.js", react: "React", other: "Something else" },
  },
  components: {
    question: "Do you already have the components authors should use?",
    options: { existing: "Yes, register them", starter: "No, start from the demo blocks" },
  },
  studio: {
    question: "Who runs Studio?",
    options: { self: "We do", nubbin: "Nubbin" },
  },
  drafts: {
    question: "Where does authoring data live?",
    options: { self: "Our infrastructure", nubbin: "Nubbin" },
  },
  publishing: {
    question: "Where does publishing happen?",
    options: { self: "Our infrastructure", nubbin: "Nubbin" },
  },
  artifacts: {
    question: "Where do published pages live?",
    options: { self: "Our infrastructure", nubbin: "Nubbin" },
  },
  delivery: {
    question: "Who serves published content?",
    options: { self: "Our infrastructure", nubbin: "Nubbin CDN" },
  },
  consumption: {
    question: "When does your application need the content?",
    options: {
      build: "At build time",
      "on-change": "When content changes",
      runtime: "At request time",
    },
  },
  notifications: {
    question: "What should happen when content is published?",
    options: {
      webhook: "Call a webhook",
      deploy: "Trigger a build or deployment",
      workflow: "Run a workflow",
    },
  },
  assets: {
    question: "Who owns asset storage and delivery?",
    options: { self: "We do", nubbin: "Nubbin" },
  },
  operations: {
    question: "Who operates the Nubbin services?",
    options: { self: "We do", nubbin: "Nubbin" },
  },
  network: {
    question: "Can this environment reach Nubbin over the public internet?",
    options: {
      public: "Yes",
      private: "Private connectivity only",
      isolated: "No — fully isolated",
    },
  },
};
