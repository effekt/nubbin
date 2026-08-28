import { describe, expect, it } from "vitest";
import { defaultPlan } from "./defaultPlan";
import { installStep } from "./installStep";

describe("installStep", () => {
  it("installs the runtime packages and the command line separately", () => {
    expect(installStep(defaultPlan)).toEqual({
      title: "Install the packages",
      command:
        "npm install @nubbin/core @nubbin/react @nubbin/next @nubbin/store-fs @nubbin/studio @nubbin/studio-ui && npm install -D @nubbin/cli",
    });
  });

  it("writes one command when nothing is a development dependency", () => {
    expect(installStep({ ...defaultPlan, publishing: "nubbin" }).command).toBe(
      "npm install @nubbin/core @nubbin/react @nubbin/next @nubbin/store-fs @nubbin/studio @nubbin/studio-ui",
    );
  });
});
