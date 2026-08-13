import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@Schema";

const url = process.env.DATABASE_URL;

const db = url
  ? drizzle(postgres(url, { max: 5 }), { schema })
  : new Proxy({} as ReturnType<typeof drizzle>, {
      get() {
        throw new Error("DATABASE_URL not set");
      },
    });

export class Database {
  static async getConnectionStatus(): Promise<boolean> {
    const status = await db
      .execute("SELECT 1")
      .then(() => true)
      .catch(() => false);

    return status;
  }

  static get instance() {
    return db;
  }
}
