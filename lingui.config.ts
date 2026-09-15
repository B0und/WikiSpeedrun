import { defineConfig } from "@lingui/cli";
import { SUPPORTED_LOCALES } from "./src/locales/config";

export default defineConfig({
  sourceLocale: "en",
  fallbackLocales: { default: "en" },
  compileNamespace: "es",
  locales: [...SUPPORTED_LOCALES],
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["<rootDir>/src"],
    },
  ],
});
