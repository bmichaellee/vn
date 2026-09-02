import { fileURLToPath } from "node:url";

import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import postgres from "postgres";

import * as schema from "@Schema";

export const PGLITE_DIR = fileURLToPath(
  new URL("../../../.data/pglite", import.meta.url),
);

type Db = PostgresJsDatabase<typeof schema>;

let db: Db | undefined;

function createDb(): Db {
  const url = process.env.DATABASE_URL;

  if (url) {
    return drizzle(postgres(url, { max: 5 }), { schema });
  }

  return drizzlePglite(PGLITE_DIR, { schema }) as unknown as Db;
}

export class Database {
  static async getConnectionStatus(): Promise<boolean> {
    const status = await Database.instance
      .execute("SELECT 1")
      .then(() => true)
      .catch(() => false);

    return status;
  }

  static get instance() {
    return (db ??= createDb());
  }
}
