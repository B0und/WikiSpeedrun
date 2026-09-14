// Shared i18n configuration: the single source of truth for the supported
// locales and their script-font contracts. App code consumes it through the
// src/lingui.ts facade; the E2E suites and lingui.config.ts import it directly
// because the facade statically loads the .po catalogs, which the E2E runner
// cannot resolve.
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

// Locales whose script needs a dedicated @fontsource family beyond the base
// "Noto Sans". `load` pulls the CSS on demand (see LocaleProvider) so English
// users never download script fonts.
export const SCRIPT_FONT_BY_LOCALE: Partial<Record<Locale, { load: () => Promise<unknown> }>> = {
  hi: {
    load: () =>
      Promise.all([
        import("@fontsource/noto-sans-devanagari/400.css"),
        import("@fontsource/noto-sans-devanagari/700.css"),
      ]),
  },
  ja: {
    load: () => Promise.all([import("@fontsource/noto-sans-jp/400.css"), import("@fontsource/noto-sans-jp/700.css")]),
  },
  zh: {
    load: () => Promise.all([import("@fontsource/noto-sans-sc/400.css"), import("@fontsource/noto-sans-sc/700.css")]),
  },
};
