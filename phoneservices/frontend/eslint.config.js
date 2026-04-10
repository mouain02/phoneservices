import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist", "node_modules"] },
  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      // JSX usage marking can be noisy in mixed JS projects; keep lint focused on runtime issues.
      "no-unused-vars": "off",
    },
  },
  {
    files: [
      "../backend/**/*.js",
      "*.config.{js,cjs,mjs}",
      "vite.config.js",
      "vitest.config.js",
      "postcss.config.cjs",
      "tailwind.config.cjs",
    ],
    languageOptions: {
      globals: globals.node,
    },
  },
];