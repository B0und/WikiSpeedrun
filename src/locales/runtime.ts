import { i18n } from "@lingui/core";
import { getLanguageTag, type Locale } from "./config";

let activationSequence = 0;

export async function dynamicActivate(locale: Locale): Promise<void> {
  const sequence = ++activationSequence;
  // Dynamic import is required: the module specifier is genuinely
  // runtime-selected (one compiled .po catalog per locale, emitted as separate
  // lazy chunks by @lingui/vite-plugin).
  const { messages } = await import(`./${locale}/messages.po`);

  // Catalog requests can resolve out of order when the user switches quickly.
  if (sequence !== activationSequence) return;

  i18n.load(locale, messages);
  i18n.activate(locale);
  document.documentElement.lang = getLanguageTag(locale);
}

export { i18n };
