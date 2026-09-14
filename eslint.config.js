import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig(
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "prefer-const": "off",
    },
  },
  {
    files: [
      "src/components/layout/ThemeToggle.tsx",
      "src/components/ui/carousel.tsx",
      "src/hooks/use-mobile.ts",
      "src/hooks/use-step-player.ts",
    ],
    rules: { "react-hooks/set-state-in-effect": "off" },
  },
  {
    files: ["src/components/ui/sidebar.tsx"],
    rules: { "react-hooks/purity": "off" },
  },
  eslintPluginPrettier,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
);
