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

  extends: ["plugin:@tanstack/eslint-plugin-query/recommended", "plugin:lingui/recommended"],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["react", "@typescript-eslint", "@tanstack/query", "lingui"],
  rules: {
    "lingui/no-unlocalized-strings": [
      "warn",
      {
        // Anchored identifier-shaped strings: slugs, paths, hex colors, store
        // names. Grown per eslint-plugin-lingui audit discipline.
        ignore: ["^(?![A-Z])\\S+$", "^[A-Z0-9_-]+$"],
        ignoreNames: ["className", "styleName", "src", "data-testid", "displayName", "label", "id"],
        ignoreFunctions: ["console.*", "cn", "cva", "clsx", "addFolderWithExport", "*.addButton", "Error"],
      },
    ],
  },
  overrides: [
    {
      files: ["**/*.test.*", "**/*.spec.*", "src/mocks/**", "src/test_mocks/**", "src/test-extend.tsx"],
      rules: {
        "lingui/no-unlocalized-strings": "off",
      },
    },
  ],
};
