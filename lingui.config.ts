import { defineConfig } from "@lingui/cli";

export default defineConfig({
  sourceLocale: "en",
  compileNamespace: "es",
  locales: ["en"],
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["<rootDir>/src"],
    },
  ],
});
