import { API } from "@API";

export class AuthService {
  static async getSession() {
    const { session } = await API.get<{ session: unknown }>("auth/session");
    return session;
  }
}
