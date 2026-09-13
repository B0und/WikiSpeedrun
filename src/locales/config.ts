// Shared i18n configuration: pure data, no imports.
//
// This is the single source of truth for the supported locales and their
// contracts. App code consumes it through the src/lingui.ts facade; the E2E
// suites import it directly because the facade statically loads the .po
// catalogs, which the test bundler cannot resolve.

export const SUPPORTED_LOCALES = [
  "de",
  "en",
  "es",
  "fr",
  "gr",
  "hi",
  "id",
  "it",
  "jp",
  "nl",
  "pl",
  "ru",
  "se",
  "vi",
  "zh",
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

// The locale codes are internal identifiers, not BCP-47 language tags:
// "gr" is Greece (Greek is "el"), "jp" is Japan (Japanese is "ja"),
// "se" is Sweden (Swedish is "sv"). Map them to real tags for
// <html lang> so screen readers, spell checkers and translation tools work.
export const DOCUMENT_LANGUAGE_BY_LOCALE: Partial<Record<Locale, string>> = {
  gr: "el",
  jp: "ja",
  se: "sv",
};

// Locales whose script is not covered by the base "Noto Sans" family. Each
// script font is bundled via @fontsource (see src/main.tsx); `sample` lets
// tests verify the font actually loaded and `selector` where it must apply.
export const SCRIPT_FONT_BY_LOCALE: Partial<Record<Locale, { family: string; sample: string; selector: string }>> = {
  hi: { family: "Noto Sans Devanagari", sample: "विकिपीडिया", selector: "#root .font-serif" },
  jp: { family: "Noto Sans JP", sample: "ウィキペディア", selector: "#root .font-serif" },
  zh: { family: "Noto Sans SC", sample: "维基百科", selector: "#root .font-serif" },
};
