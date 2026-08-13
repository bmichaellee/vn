import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: "../../.env" });

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/v0/Schema/tables/**/*.schema.ts",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
});
