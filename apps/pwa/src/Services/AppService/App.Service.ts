import { API } from "@API";

import type { HealthResponse } from "@API";

export class AppService {
  static async getHealth(): Promise<HealthResponse> {
    return API.get<HealthResponse>("health");
  }

  static getVersion(): string {
    const injected = (globalThis as { __APP_VERSION__?: unknown })
      .__APP_VERSION__;
    return typeof injected === "string" ? injected : "0.0.0";
  }
}
