import type { DocumentMeta } from "@nubbin/core";
import { expect, test } from "vitest";
import { toDocumentMeta } from "./toDocumentMeta";

const prior: DocumentMeta = { title: "Prior title" };

test("every string field carries over", () => {
  const full = {
    title: "T",
    description: "D",
    robots: "noindex",
    canonical: "https://example.com/t",
  };
  expect(toDocumentMeta(full, prior)).toStrictEqual(full);
});

test("a missing optional field stays absent rather than becoming undefined", () => {
  expect(toDocumentMeta({ title: "T" }, prior)).toStrictEqual({ title: "T" });
});

test("a missing title falls back to the prior draft's", () => {
  expect(toDocumentMeta({}, prior).title).toBe("Prior title");
});

test("absent root props keep the prior title", () => {
  expect(toDocumentMeta(undefined, prior)).toStrictEqual({ title: "Prior title" });
});

test("a non-string field is dropped, not carried", () => {
  expect(toDocumentMeta({ title: "T", description: 7 }, prior)).toStrictEqual({ title: "T" });
});

test("an emptied optional field folds back to absent, never to an empty string", () => {
  const emptied = { title: "T", description: "", robots: "", canonical: "" };
  expect(toDocumentMeta(emptied, prior)).toStrictEqual({ title: "T" });
});

test("an emptied optional field stays absent even when the prior draft carried one", () => {
  const carried: DocumentMeta = { title: "T", description: "Old", canonical: "https://old.test/" };
  expect(toDocumentMeta({ title: "T", description: "", canonical: "" }, carried)).toStrictEqual({
    title: "T",
  });
});
