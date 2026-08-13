import Elysia from "elysia";

import { routes } from "@Routes";

import { docs } from "./docs";
export { docs } from "./docs";

export const v0 = new Elysia({
  prefix: "/v0",
})
  .use(routes)
  .use(docs);
