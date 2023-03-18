import type { FormattersInitializer } from 'typesafe-i18n';
import type { Locales, Formatters } from './i18n-types.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const initFormatters: FormattersInitializer<Locales, Formatters> = (_locale: Locales) => {
  const formatters: Formatters = {
    // add your formatter functions here
  };

  return formatters;
};
