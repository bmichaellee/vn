import { eq } from "drizzle-orm";

import { Database } from "@Database";
import { usersSchema } from "@Schema";

type UserData = {
  handle: string;
};

export class UsersService {
  static async createUser(userData: UserData) {
    const [user] = await Database.instance
      .insert(usersSchema)
      .values(userData)
      .returning();

    return user;
  }

  static async getUserById(id: string) {
    const [user] = await Database.instance
      .select()
      .from(usersSchema)
      .where(eq(usersSchema.id, id));

    return user;
  }
}
