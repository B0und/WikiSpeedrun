import { fromNavigator } from "@lingui/detect-locale";

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
  "pt-BR",
  "ru",
  "sv",
  "vi",
  "zh",
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const SOURCE_LOCALE: Locale = "en";

export const isLocale = (locale: string): locale is Locale =>
  SUPPORTED_LOCALES.some((supported) => supported === locale);

export const detectLocale = (): Locale => {
  if (typeof navigator === "undefined") return SOURCE_LOCALE;

  const language = fromNavigator()?.trim().replace("_", "-").toLowerCase();
  const matchingLocale = SUPPORTED_LOCALES.find(
    (supported) => supported.toLowerCase() === language,
  );
  if (matchingLocale) return matchingLocale;

  const baseLanguage = language?.split("-")[0];
  return (
    SUPPORTED_LOCALES.find((supported) => supported.toLowerCase() === baseLanguage) ?? SOURCE_LOCALE
  );
};

export const getLanguageTag = (locale: Locale): string => (locale === "zh" ? "zh-Hans" : locale);
