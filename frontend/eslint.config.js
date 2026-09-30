import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  { ignores: ["node_modules/**", "dist/**"] },
  js.configs.recommended,
  { files: ["**/*.{js,jsx}"], ...react.configs.flat.recommended },
  { files: ["**/*.{js,jsx}"], ...react.configs.flat["jsx-runtime"] },
  { files: ["**/*.{js,jsx}"], ...reactHooks.configs.flat.recommended },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }],
      "react/prop-types": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    files: ["vite.config.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
  prettier,
];
