import { defineConfig } from "@lingui/cli";
import { SOURCE_LOCALE, SUPPORTED_LOCALES } from "./src/locales/config";

export default defineConfig({
  sourceLocale: SOURCE_LOCALE,
  fallbackLocales: { default: SOURCE_LOCALE },
  locales: [...SUPPORTED_LOCALES],
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["<rootDir>/src"],
      exclude: ["**/*.test.*", "**/*.spec.*", "**/__screenshots__/**"],
    },
  ],
});
