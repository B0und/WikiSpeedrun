import clsx from 'clsx';
import Select, { StylesConfig } from 'react-select';
import { useThemeContext } from './ThemeContext';
import { useI18nContext } from '../i18n/i18n-react';

const selectId = 'wikiLanguageSelect';

export const WikiLanguageSelect = () => {
  const { colorMode } = useThemeContext();
  const isDarkMode = colorMode === 'dark';
  const { LL } = useI18nContext();

  return (
    <div>
      <label htmlFor={selectId}>{LL.SELECT_ARTICLE_LANGUAGE()}</label>
      <Select
        inputId={selectId}
        defaultValue={LANGUAGES[0]}
        isClearable={false}
        isSearchable={true}
        name={selectId}
        styles={customStyles}
        options={LANGUAGES}
        classNames={{
          control: () => (isDarkMode ? 'dark:bg-dark-surface dark:text-dark-primary' : ''),
          menu: () => (isDarkMode ? 'dark:bg-dark-surface-secondary dark:text-dark-primary' : ''),
          loadingIndicator: () => (isDarkMode ? 'dark:bg-dark-surface' : ''),
          noOptionsMessage: () =>
            isDarkMode ? 'dark:bg-dark-surface-secondary dark:text-dark-primary' : '',
          singleValue: () => (isDarkMode ? ' dark:text-dark-primary' : ''),
          option: (state) =>
            clsx(
              state.isFocused && 'dark:bg-[#464242] dark:text-primary-blue',
              isDarkMode && `dark:bg-dark-surface-secondary dark:text-dark-primary`
            ),
          loadingMessage: () =>
            isDarkMode ? 'dark:bg-dark-surface-secondary dark:text-dark-primary' : '',
        }}
      />
    </div>
  );
};

const customStyles: StylesConfig<WikiLanguage> = {
  control: (base) => ({
    ...base,
    width: '300px',
    '&:hover': {
      borderColor: 'hsla(203, 66%, 56%)',
    },
    '&:focus': {
      boxShadow: '0 0 0 1px hsla(203, 66%, 56%)',
    },
  }),
};

interface WikiLanguage {
  readonly value: string; // WP language code
  readonly label: string;
  readonly isoCode: string; // ISO language code
}

export const LANGUAGES: ReadonlyArray<WikiLanguage> = [
  { value: 'en', label: 'English', isoCode: 'en' },
  { value: 'de', label: 'Deutsch', isoCode: 'de' },
  { value: 'zh', label: '中国人', isoCode: 'cn' },
  { value: 'hi', label: 'हिंदी', isoCode: 'hi' },
  { value: 'es', label: 'Español', isoCode: 'es' },
  { value: 'fr', label: 'Français', isoCode: 'fr' },
  { value: 'ar', label: 'عربي', isoCode: 'ar' },
  { value: 'bn', label: 'বাংলা', isoCode: 'bn' },
  { value: 'ru', label: 'Русский', isoCode: 'ru' },
  { value: 'pt', label: 'Português', isoCode: 'pt' },
  { value: 'id', label: 'bahasa Indonesia', isoCode: 'id' },
  { value: 'nl', label: 'Nederlands', isoCode: 'nl' },
  { value: 'it', label: 'Italiano', isoCode: 'it' },
  { value: 'ja', label: '日本語', isoCode: 'ja' },
  { value: 'sv', label: 'Svenska', isoCode: 'sv' },
  { value: 'pl', label: 'Polski', isoCode: 'pl' },
  { value: 'vi', label: 'Tiếng Việt', isoCode: 'vi' },
  { value: 'ceb', label: 'Cebuano', isoCode: 'ceb' },
  { value: 'arz', label: 'مصرى', isoCode: '' },
] as const;
