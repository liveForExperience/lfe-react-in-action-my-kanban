import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,jsx}", "!./vite.config.js"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "no-unused-expressions": ["error", { allowShortCircuit: true }],
      "react/prop-types": ["error", { skipUndeclared: true }],
      "react/no-unknown-property": ["error", { ignore: ["css"] }],
    },
    settings: {
      react: {
        version: "detect",
      }
    },
  },
];