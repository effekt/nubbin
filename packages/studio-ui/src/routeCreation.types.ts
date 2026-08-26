import type { RouteCreateOutcome } from "@nubbin/studio";

export interface RouteCreation {
  createRoute: (route: string) => Promise<RouteCreateOutcome>;
  onCreated: (route: string) => void;
}
