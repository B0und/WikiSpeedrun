// Shared i18n configuration used by the app runtime, Lingui CLI, and visual
// tests. Locale codes are also the BCP-47 tags assigned to <html lang>.

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
// "Noto Sans". `activateLocale` loads the CSS on demand so English users never
// download script fonts.
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
