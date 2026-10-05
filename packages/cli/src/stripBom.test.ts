import { describe, expect, test } from "vitest";
import { stripBom } from "./stripBom";

describe("stripBom", () => {
  test("drops a leading byte order mark", () => {
    expect(stripBom("﻿{}")).toBe("{}");
  });

  test("leaves text without one untouched, including an empty string", () => {
    expect(stripBom("{}")).toBe("{}");
    expect(stripBom("")).toBe("");
  });

  test("drops only the first, and only at the start", () => {
    expect(stripBom("﻿﻿{}")).toBe("﻿{}");
    expect(stripBom("{﻿}")).toBe("{﻿}");
  });
});
