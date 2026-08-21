import { eq } from "drizzle-orm";

import { Database } from "@Database";
import { usersSchema } from "@Schema";

import { AuthService } from "../AuthService";

type UserData = {
  handle: string;
  password: string;
};

export class UsersService {
  static async createUser({ handle, password }: UserData) {
    const [user] = await Database.instance
      .insert(usersSchema)
      .values({ handle, passwordHash: AuthService.hashPassword(password) })
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
