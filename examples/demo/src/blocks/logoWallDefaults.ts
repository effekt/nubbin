import type { z } from "zod";
import type { logoWallSchema } from "./LogoWall.schema";

/** Text marks on purpose: the demo ships no logo assets, and a wall of set names shows the
 * block inhabited rather than waiting for uploads. */
export const logoWallDefaults: z.infer<typeof logoWallSchema> = {
  heading: "Read aloud in six harbours",
  items: [
    { name: "Whitstable Harbour Office" },
    { name: "Faversham Creek Boatyard" },
    { name: "Seasalter Wildfowlers" },
    { name: "The Shingle Bank Café" },
    { name: "Oare Marshes Wardens" },
    { name: "The Long Reach Ferry" },
  ],
};
