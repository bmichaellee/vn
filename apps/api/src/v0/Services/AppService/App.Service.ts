import { version } from "@Root/package.json";

export class AppService {
  static getVersion(): string {
    return version;
  }
}
