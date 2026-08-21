import { API } from "@API";

export class AuthService {
  static INVALID_CREDENTIALS = "Invalid handle or password";

  static async login(_handle: string, _password: string) {
    const { session } = await API.post<{ session: unknown }>("auth/login", {
      handle: _handle,
      password: _password,
    });

    if (session) {
      return session;
    }

    throw new Error(this.INVALID_CREDENTIALS);
  }

  static async getSession() {
    const { session } = await API.get<{ session: unknown }>("auth/session");
    return session;
  }
}
