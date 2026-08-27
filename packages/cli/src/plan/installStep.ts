import { derivePackages } from "./derivePackages";
import type { Plan } from "./plan.types";
import type { Step } from "./step.types";

/**
 * The install line for a plan, with the development dependencies in their own command.
 *
 * Built from `derivePackages` rather than written out: a page quoting an install line is a second
 * copy of the package rule, and it is the copy nobody updates.
 */
export function installStep(plan: Plan): Step {
  const refs = derivePackages(plan);
  const commands: string[] = [];
  for (const isDevelopment of [false, true]) {
    const names = refs.filter((ref) => ref.dev === isDevelopment).map((ref) => ref.name);
    if (names.length === 0) continue;
    commands.push(`npm install ${isDevelopment ? "-D " : ""}${names.join(" ")}`);
  }
  return { title: "Install the packages", command: commands.join(" && ") };
}
