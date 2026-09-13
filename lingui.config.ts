import { defineConfig } from "@lingui/cli";

export default defineConfig({
  sourceLocale: "en",
  fallbackLocales: { default: "en" },
  compileNamespace: "es",
  locales: ["de","en","es","fr","el","hi","id","it","ja","nl","pl","ru","sv","vi","zh"],
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["<rootDir>/src"],
    },
  ],
});
