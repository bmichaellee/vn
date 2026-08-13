import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import { v0, docs } from "./v0";

const PORT = Number(process.env.PORT) || 6101;

const app = new Elysia().use(v0).use(cors()).use(docs).listen(PORT);

export type App = typeof app;

const port = app.server?.port ?? PORT;
const host = "http://localhost";

console.log(`🌟 API listening on ${host}:${port}`);
