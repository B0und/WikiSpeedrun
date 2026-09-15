import type { Messages } from "@lingui/core";
import { i18n } from "@lingui/core";
import { useLingui } from "@lingui/react";
import { SCRIPT_FONT_BY_LOCALE, SUPPORTED_LOCALES, type Locale } from "./locales/config";
import { messages as englishMessages } from "./locales/en/messages.po";
import type { Translate } from "./locales/messages";

export { SUPPORTED_LOCALES, type Locale } from "./locales/config";
export type { MessageId, Translate } from "./locales/messages";
export { i18n };

type CatalogModule = { messages: Messages };

const catalogLoaders = import.meta.glob<CatalogModule>(["./locales/*/messages.po", "!./locales/en/messages.po"]);

const loadMessages = async (locale: Locale): Promise<Messages> => {
  if (locale === "en") return englishMessages;

  const loadCatalog = catalogLoaders[`./locales/${locale}/messages.po`];
  if (!loadCatalog) throw new Error(`Missing message catalog for locale "${locale}"`);

  return (await loadCatalog()).messages;
};

let activationSequence = 0;

export const activateLocale = async (locale: Locale): Promise<void> => {
  const sequence = ++activationSequence;

  try {
    const [messages] = await Promise.all([loadMessages(locale), SCRIPT_FONT_BY_LOCALE[locale]?.load()]);
    if (sequence !== activationSequence) return;

    i18n.loadAndActivate({ locale, messages });
    document.documentElement.lang = locale;
  } catch (error) {
    if (sequence === activationSequence) throw error;
  }
};

i18n.loadAndActivate({ locale: "en", messages: englishMessages });

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

export const useTranslation = (): Translate => useLingui()._;
