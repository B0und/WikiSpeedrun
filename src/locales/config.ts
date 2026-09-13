// Shared i18n configuration: pure data, no imports.
//
// This is the single source of truth for the supported locales and their
// contracts. App code consumes it through the src/lingui.ts facade; the E2E
// suites import it directly because the facade statically loads the .po
// catalogs, which the test bundler cannot resolve.
//
// Locale codes are the same as the BCP-47 language tags used for <html lang>,
// so no mapping between the interface locale and the document language exists.

export const SUPPORTED_LOCALES = [
  "de",
  "en",
  "es",
  "fr",
  "el",
  "hi",
  "id",
  "it",
  "ja",
  "nl",
  "pl",
  "ru",
  "sv",
  "vi",
  "zh",
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

// Locales whose script is not covered by the base "Noto Sans" family. The
// matching @fontsource CSS is loaded on demand (see LocaleProvider) so English
// users never download script fonts; `sample` lets tests verify the font
// actually loaded and `selector` where it must apply.
export const SCRIPT_FONT_BY_LOCALE: Partial<Record<Locale, { family: string; sample: string; selector: string }>> = {
  hi: { family: "Noto Sans Devanagari", sample: "विकिपीडिया", selector: "#root .font-serif" },
  ja: { family: "Noto Sans JP", sample: "ウィキペディア", selector: "#root .font-serif" },
  zh: { family: "Noto Sans SC", sample: "维基百科", selector: "#root .font-serif" },
};
