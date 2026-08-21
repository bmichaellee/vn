import { API } from "@API";

import type { HealthResponse } from "@API";

export class AppService {
  static APP_NAME = "PWA App";
  static TAGLINE = "Generic PWA App";
  static LOGIN_BUTTON_TEXT = "Log In";

  static async getHealth(): Promise<HealthResponse> {
    return API.get<HealthResponse>("health");
  }

  static getVersion(): string {
    const injected = (globalThis as { __APP_VERSION__?: unknown })
      .__APP_VERSION__;
    return typeof injected === "string" ? injected : "0.0.0";
  }
}
