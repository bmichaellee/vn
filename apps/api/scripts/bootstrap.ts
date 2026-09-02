import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { PGlite } from "@electric-sql/pglite";
import { config } from "dotenv";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { PGLITE_DIR } from "@Database";
import { fixture_testUser, usersSchema } from "@Schema";

const apiDir = fileURLToPath(new URL("..", import.meta.url));
const rootDir = join(apiDir, "..", "..");
const envPath = join(rootDir, ".env");

if (!existsSync(envPath)) {
  copyFileSync(join(rootDir, ".env.example"), envPath);
  console.log("📝 Created .env from .env.example");
}

config({ path: envPath });

const url = process.env.DATABASE_URL;

if (url) {
  const probe = postgres(url, { max: 1, connect_timeout: 5 });

  try {
    await probe`SELECT 1`;
  } catch (error) {
    const { code, message } = error as NodeJS.ErrnoException;
    console.error(`✖ DATABASE_URL is set but unreachable: ${url}`);
    console.error(
      `  ${[code, message].filter(Boolean).join(": ") || String(error)}`,
    );
    console.error(
      "  Start Postgres, fix DATABASE_URL in .env, or leave it empty to use the embedded database.",
    );
    process.exit(1);
  }

  await probe.end();
} else {
  mkdirSync(PGLITE_DIR, { recursive: true });
}

const push = Bun.spawnSync(["bunx", "drizzle-kit", "push", "--force"], {
  cwd: apiDir,
  stdout: "inherit",
  stderr: "inherit",
});

if (!push.success) {
  console.error("✖ drizzle-kit push failed");
  process.exit(push.exitCode || 1);
}

if (url) {
  const client = postgres(url, { max: 1 });
  await drizzlePostgres(client)
    .insert(usersSchema)
    .values(fixture_testUser)
    .onConflictDoNothing();
  await client.end();
} else {
  const client = new PGlite(PGLITE_DIR);
  await drizzlePglite(client)
    .insert(usersSchema)
    .values(fixture_testUser)
    .onConflictDoNothing();
  await client.close();
}

console.log(
  `🌱 Database ready — dev account "${fixture_testUser.handle}" seeded`,
);
