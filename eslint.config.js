import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

const portals = [
  "public",
  "student",
  "faculty",
  "invigilator",
  "org-admin",
  "super-admin",
  "coding",
  "operations",
];

const portalBoundaryRules = portals.map((portal) => {
  const otherPortals = portals.filter((p) => p !== portal);
  return {
    files: [`src/portals/${portal}/**/*.{ts,tsx}`],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: otherPortals.map((other) => ({
            group: [`@/portals/${other}*`, `../${other}*`, `../../${other}*`],
            message: `Cross-portal import forbidden: "${portal}" portal cannot import from "${other}" portal. Shared code must live in "@/shared" or "@/engines".`,
          })),
        },
      ],
    },
  };
});

export default tseslint.config(
  { ignores: ["dist", "coverage"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  ...portalBoundaryRules
);
