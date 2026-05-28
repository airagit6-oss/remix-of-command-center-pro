import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
<<<<<<< HEAD
    globalSetup: ["./server/__tests__/qa-core/globalSetup.ts"],

    // Test file discovery — all suites
    include: [
      "src/**/*.{test,spec}.{ts,tsx}",
      "server/**/*.{test,spec}.{ts,tsx}",
    ],
    exclude: [
      "node_modules/**",
      "dist/**",
      "dist-server/**",
      "e2e/**",
    ],

    // Parallel execution with isolation per file
    pool: "forks",
    poolOptions: {
      forks: { singleFork: false },
    },

    // Timeouts
    testTimeout: 30_000,
    hookTimeout: 15_000,

    // Reporters: text summary + verbose for CI + JSON for tooling
    reporters: process.env.CI ? ["verbose", "json"] : ["verbose"],
    outputFile: { json: "test-results/report.json" },

    // Coverage
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "coverage",
      exclude: [
        "node_modules/**",
        "dist/**",
        "dist-server/**",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "**/types/**",
        "**/config/**",
        "e2e/**",
        "src/test/**",
        "prisma/**",
        "scripts/**",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
=======
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
>>>>>>> 9d5c7142de34928df544f515aec409a9e1aaef5e
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
