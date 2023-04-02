import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Locales } from './i18n/i18n-types';
import { LANGUAGES } from './components/WikiLanguageSelect';

/*
 Data that gets persisted in local storage
*/

type WikiLanguage = (typeof LANGUAGES)[number]['value'];
interface Actions {
  actions: {
    setInterfaceLanguage: (language: Locales) => void;
    setWikiLanguage: (language: WikiLanguage) => void;
  };
}
interface Values {
  interfaceLanguage: Locales;
  wikiLanguage: WikiLanguage;
}

const initialState: Values = {
  interfaceLanguage: '' as Locales,
  wikiLanguage: 'en',
};

type SettingsStore = Values & Actions;
const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        actions: {
          setInterfaceLanguage: (language: Locales) =>
            set(() => ({ interfaceLanguage: language }), false, 'setInterfaceLanguage'),
          setWikiLanguage: (language: WikiLanguage) =>
            set(() => ({ wikiLanguage: language }), false, 'setWikiLanguage'),
        },
      }),
      {
        name: 'settings',
        storage: createJSONStorage(() => localStorage),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        partialize: ({ actions, ...rest }: SettingsStore) => rest,
      }
    ),
    {
      name: 'settings-store',
    }
  )
);

export const useSettingsStoreActions = () => useSettingsStore((state) => state.actions);
export const useInterfaceLanguage = () => useSettingsStore((state) => state.interfaceLanguage);
export const useWikiLanguage = () => useSettingsStore((state) => state.wikiLanguage);
