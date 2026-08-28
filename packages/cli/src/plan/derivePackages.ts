import type { Plan } from "./plan.types";

/** A package the plan requires, and whether it is installed as a development dependency. */
export type PackageRef = {
  name: string;
  dev: boolean;
};

/**
 * The packages a plan requires, in install order.
 *
 * Derived rather than listed on a page: the install line, the getting-started step and a portal
 * card all read the same answer, and a hand-written list is the one that misses a package when a
 * field grows a value. `dev` is on every entry rather than only on the development ones, so two
 * refs compare by value.
 */
export function derivePackages(plan: Plan): PackageRef[] {
  const refs: PackageRef[] = [
    { name: "@nubbin/core", dev: false },
    { name: "@nubbin/react", dev: false },
  ];
  if (plan.framework === "next") refs.push({ name: "@nubbin/next", dev: false });
  if (plan.artifacts === "self") refs.push({ name: "@nubbin/store-fs", dev: false });
  if (plan.studio === "self") {
    refs.push({ name: "@nubbin/studio", dev: false }, { name: "@nubbin/studio-ui", dev: false });
  }
  if (plan.publishing === "self") refs.push({ name: "@nubbin/cli", dev: true });
  return refs;
}
