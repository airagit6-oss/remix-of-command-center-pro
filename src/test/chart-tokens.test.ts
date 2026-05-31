import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const CHART_FILES = [
  "src/pages/MetricsPage.tsx",
  "src/pages/OverviewPage.tsx",
  "src/pages/InfrastructurePage.tsx",
  "src/pages/RevenuePage.tsx",
  "src/pages/TracesPage.tsx",
  "src/components/dashboard/KpiCard.tsx",
  "src/pages/admin/ChartsQAPage.tsx",
];

const ALLOWED_TOKENS = [
  "hsl(var(--accent))",
  "hsl(var(--primary))",
  "hsl(var(--mp-success))",
  "hsl(var(--mp-warning))",
  "hsl(var(--destructive))",
  "hsl(var(--border))",
  "hsl(var(--muted-foreground))",
  "hsl(var(--popover))",
  "hsl(var(--foreground))",
];

// Recharts color props that must always reference a semantic token.
const COLOR_PROPS = ["stroke", "fill", "stopColor", "background"];

// Match prop="hsl(...)" or prop={"hsl(...)"} with a *numeric* (non-token) HSL literal.
const RAW_HSL_IN_PROP = (prop: string) =>
  new RegExp(`${prop}\\s*=\\s*\\{?\\s*["\`']hsl\\(\\s*\\d`, "g");

describe("chart color tokens", () => {
  it("exposes the full token contract in index.css", () => {
    const css = readFileSync(resolve("src/index.css"), "utf8");
    for (const v of ["--accent", "--primary", "--mp-success", "--mp-warning",
                     "--destructive", "--border", "--muted-foreground", "--popover"]) {
      expect(css, `index.css missing ${v}`).toContain(v);
    }
  });

  for (const file of CHART_FILES) {
    it(`${file}: Recharts color props use semantic tokens`, () => {
      const src = readFileSync(resolve(file), "utf8");
      for (const prop of COLOR_PROPS) {
        const matches = src.match(RAW_HSL_IN_PROP(prop)) ?? [];
        expect(matches, `${file} has raw HSL in ${prop} prop: ${matches.join(", ")}`).toHaveLength(0);
      }
      // No hex literals inside Recharts color props either.
      for (const prop of COLOR_PROPS) {
        const hex = new RegExp(`${prop}\\s*=\\s*\\{?\\s*["\`']#[0-9a-fA-F]{3,8}["\`']`, "g");
        expect(src.match(hex) ?? [], `${file} has hex in ${prop} prop`).toHaveLength(0);
      }
    });
  }

  it("ChartsQAPage exports CHART_TOKENS using only allowed tokens", async () => {
    const mod = await import("@/pages/admin/ChartsQAPage");
    const values = Object.values(mod.CHART_TOKENS);
    for (const v of values) {
      expect(ALLOWED_TOKENS, `unexpected token: ${v}`).toContain(v);
    }
  });
});