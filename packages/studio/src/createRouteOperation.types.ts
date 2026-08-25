/** Host-owned route creation behind Studio's HTTP boundary. */
export type CreateRouteOperation = (
  route: string,
) => "created" | "exists" | Promise<"created" | "exists">;
