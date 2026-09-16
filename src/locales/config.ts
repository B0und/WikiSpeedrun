import { detect, fromNavigator } from "@lingui/detect-locale";

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

export const SOURCE_LOCALE: Locale = "en";

export const isLocale = (locale: string): locale is Locale => SUPPORTED_LOCALES.includes(locale as Locale);

export const resolveLocale = (languageTag: string | null | undefined): Locale => {
  if (!languageTag) return SOURCE_LOCALE;

  const locale = languageTag.trim().toLowerCase().replaceAll("_", "-").split("-")[0];
  return isLocale(locale) ? locale : SOURCE_LOCALE;
};

export const detectLocale = (): Locale => {
  if (typeof navigator === "undefined") return SOURCE_LOCALE;
  return resolveLocale(detect(fromNavigator(), SOURCE_LOCALE));
};

export const getLanguageTag = (locale: Locale): string => (locale === "zh" ? "zh-Hans" : locale);
