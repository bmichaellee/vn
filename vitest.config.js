import { defineConfig, defineProject } from "vitest/config";
import react from "@vitejs/plugin-react";

const rootWithNormalizedDriveLetter = process
  .cwd()
  .replace(/^[a-z]:/, (drive) => drive.toUpperCase());

export default defineConfig({
  root: rootWithNormalizedDriveLetter,
  test: {
    projects: [
      defineProject({
        resolve: { tsconfigPaths: true },
        test: {
          name: { label: "api", color: "yellow" },
          environment: "node",
          include: ["apps/api/src/**/*.test.ts"],
          setupFiles: ["./apps/api/vitest.setup.ts"],
        },
      }),
      defineProject({
        plugins: [react()],
        resolve: { tsconfigPaths: true },
        test: {
          name: { label: "pwa", color: "blue" },
          environment: "jsdom",
          include: ["apps/pwa/src/**/*.test.{ts,tsx}"],
          setupFiles: ["./apps/pwa/vitest.setup.ts"],
          globals: true,
        },
      }),
    ],
    coverage: {
      provider: "istanbul",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./.coverage",
      include: ["apps/api/src/**/*.ts", "apps/pwa/src/**/*.{ts,tsx}"],
      exclude: [
        "**/*.test.{ts,tsx}",
        "apps/api/src/**/index.ts",
        "apps/api/src/**/*.docs.ts",
        "apps/api/src/v0/Schema/**",
        "apps/pwa/src/main.tsx",
      ],
    },
  },
});
