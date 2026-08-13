import { AppService } from "@Services";

const appVersion = AppService.getVersion();

export const Version = () => <>{appVersion}</>;
