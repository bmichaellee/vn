import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import rootPkg from "../../package.json" with { type: "json" };

const apiPort = Number(process.env.API_PORT ?? 6101);
const pwaPort = Number(process.env.PWA_PORT ?? 6102);

export default defineConfig({
  envDir: "../../",
  plugins: [react(), tailwindcss()],
  define: {
    "globalThis.__APP_VERSION__": JSON.stringify(rootPkg.version),
  },
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
  server: {
    port: pwaPort,
    strictPort: true,
    proxy: {
      "/api": {
        target: `http://localhost:${apiPort}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "") || "/",
      },
    },
  },
});
