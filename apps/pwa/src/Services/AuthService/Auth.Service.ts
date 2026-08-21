import { API } from "@API";

export interface SessionUser {
  id: string;
  handle: string;
}

export interface Session {
  id: string;
  expiresAt: string;
  user: SessionUser;
}

export class AuthService {
  static LOGIN_SUCCESSFUL = "Login successful";
  static INVALID_CREDENTIALS = "Invalid handle or password";
  static SERVICE_UNAVAILABLE =
    "Service is unavailable. Please try again later.";

  static async login(_handle: string, _password: string) {
    const { session } = await API.post<{ session: Session | null }>(
      "auth/login",
      {
        handle: _handle,
        password: _password,
      },
    ).catch((error) => {
      throw error instanceof TypeError
        ? new Error(AuthService.SERVICE_UNAVAILABLE)
        : error;
    });

    if (session) {
      return {
        message: AuthService.LOGIN_SUCCESSFUL,
        session,
      };
    }

    throw new Error(AuthService.INVALID_CREDENTIALS);
  }

  static async getSession() {
    const { session } = await API.get<{ session: Session | null }>(
      "auth/session",
    );
    return session;
  }
}
