import { expect, test } from "vitest";
import { toOrdinal } from "./toOrdinal";

test("the first few positions take their own suffixes", () => {
  expect(toOrdinal(1)).toBe("1st");
  expect(toOrdinal(2)).toBe("2nd");
  expect(toOrdinal(3)).toBe("3rd");
  expect(toOrdinal(4)).toBe("4th");
});

test("the teens all take th, including 111 through 113", () => {
  expect(toOrdinal(11)).toBe("11th");
  expect(toOrdinal(12)).toBe("12th");
  expect(toOrdinal(13)).toBe("13th");
  expect(toOrdinal(112)).toBe("112th");
});

test("past the teens the last digit decides again", () => {
  expect(toOrdinal(21)).toBe("21st");
  expect(toOrdinal(22)).toBe("22nd");
  expect(toOrdinal(23)).toBe("23rd");
  expect(toOrdinal(30)).toBe("30th");
});
