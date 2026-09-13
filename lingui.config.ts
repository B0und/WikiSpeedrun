import { defineConfig } from "@lingui/cli";

export default defineConfig({
  sourceLocale: "en",
  fallbackLocales: { default: "en" },
  compileNamespace: "es",
  locales: ["de","en","es","fr","gr","hi","id","it","jp","nl","pl","ru","se","vi","zh"],
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["<rootDir>/src"],
    },
  ],
});
