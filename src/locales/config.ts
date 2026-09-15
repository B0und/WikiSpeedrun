// Shared i18n configuration used by the app runtime, Lingui CLI, and visual
// tests.

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

export const isLocale = (locale: string): locale is Locale => SUPPORTED_LOCALES.includes(locale as Locale);

const localeFromLanguageTag = (languageTag: string): Locale | undefined => {
  const locale = languageTag.trim().toLowerCase().replaceAll("_", "-").split("-")[0];

  return isLocale(locale) ? locale : undefined;
};

export const detectLocale = (): Locale => {
  if (typeof navigator === "undefined") return "en";

  for (const language of navigator.languages) {
    const locale = localeFromLanguageTag(language);
    if (locale) return locale;
  }

  return localeFromLanguageTag(navigator.language) ?? "en";
};
