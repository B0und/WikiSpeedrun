import type { Messages } from "@lingui/core";
import { i18n } from "@lingui/core";
import { SCRIPT_FONT_BY_LOCALE, type Locale } from "./config";

type CatalogModule = { messages: Messages };

const catalogLoaders = import.meta.glob<CatalogModule>("./*/messages.po");

const loadMessages = async (locale: Locale): Promise<Messages> => {
  const loadCatalog = catalogLoaders[`./${locale}/messages.po`];
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
