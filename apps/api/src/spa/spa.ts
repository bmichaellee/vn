import { existsSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";

const notFound = () => new Response("Not Found", { status: 404 });

const serveFile = (filePath: string) =>
  typeof Bun === "undefined"
    ? new Response(readFileSync(filePath))
    : Bun.file(filePath);

export const createSpaHandler = (distDir: string) => {
  return ({ path }: { path: string }) => {
    if (path === "/v0" || path.startsWith("/v0/")) return notFound();
    const decoded = decodeURIComponent(path);
    const filePath = join(distDir, decoded);
    if (!filePath.startsWith(distDir)) return notFound();
    if (
      decoded !== "/" &&
      decoded !== "" &&
      !decoded.endsWith("/") &&
      existsSync(filePath)
    ) {
      return serveFile(filePath);
    }
    if (extname(decoded)) return notFound();
    const indexHtml = join(distDir, "index.html");
    return existsSync(indexHtml) ? serveFile(indexHtml) : notFound();
  };
};
