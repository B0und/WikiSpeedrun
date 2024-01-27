module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  settings: {
    react: {
      version: "detect",
    },
  },

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:@tanstack/eslint-plugin-query/recommended"
  ],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    "project": true
  },
  plugins: ["react", "@typescript-eslint", "@tanstack/query"],
  rules: {
    // suppress errors for missing 'import React' in files
    // "react/react-in-jsx-scope": "off",
    // allow jsx syntax in js files (for next.js project)
    // "react/jsx-filename-extension": [1, { extensions: [".ts", ".tsx"] }], //should add ".ts" if typescript project
  },
};
