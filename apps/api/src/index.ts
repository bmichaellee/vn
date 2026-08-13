import { fileURLToPath } from "node:url";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import { v0, docs } from "./v0";
import { createSpaHandler } from "./spa/spa";

const PORT = Number(process.env.PORT) || 6101;

const pwaDist = fileURLToPath(new URL("../../pwa/dist", import.meta.url));
const serveSpa = createSpaHandler(pwaDist);

const app = new Elysia()
  .use(v0)
  .use(cors())
  .use(docs)
  .get("*", serveSpa)
  .head("*", serveSpa)
  .listen(PORT);

export type App = typeof app;

const port = app.server?.port ?? PORT;
const host = "http://localhost";

console.log(`🌟 API listening on ${host}:${port}`);
