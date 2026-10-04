import type { ConfiglessCommand } from "./command.types";
import { ExitCode } from "./exitCode.constants";
import { formatPlan } from "./formatPlan";
import { formatPlanIssue } from "./formatPlanIssue";
import { encodePlan } from "./plan/encodePlan";
import { planIssues } from "./plan/planIssues";
import { readPlanArgument } from "./readPlanArgument";
import { requiredArgument } from "./requiredArgument";
import { writeInitConfig } from "./writeInitConfig";

/**
 * A plan code or a plan file in, and a `nubbin.config.ts` out where the plan allows one. It runs
 * before any config exists and asks nothing: a code is the whole set of answers, so there is
 * nothing left to ask.
 *
 * An inconsistent plan prints only its issues and is refused, because it is not a plan anybody
 * can act on. A consistent one is printed in full — description, ownership, steps — then the one
 * outcome line, then its code, last, so a JSON file leaves with the code it can be pasted back
 * as and a refusal still ends the same way.
 */
export const initCommand: ConfiglessCommand = async (cwd, args) => {
  const plan = await readPlanArgument(cwd, requiredArgument(args, 0, "plan code or plan file"));
  const issues = planIssues(plan);
  if (issues.length > 0) return { lines: issues.map(formatPlanIssue), code: ExitCode.Refused };
  const written = await writeInitConfig(cwd, plan);
  return {
    lines: [...formatPlan(plan), ...written.lines, `Plan: ${encodePlan(plan)}`],
    code: written.code,
  };
};
