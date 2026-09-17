import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { LANGUAGES } from "../components/WikiLanguageSelect";
import { detectLocale, isLocale, type Locale, SOURCE_LOCALE } from "../locales/config";

/*
 Data gets persisted in local storage
*/

type WikiLanguage = (typeof LANGUAGES)[number]["value"];
interface Actions {
  actions: {
    setInterfaceLanguage: (language: Locale) => void;
    setWikiLanguage: (language: WikiLanguage) => void;
    setSidebarWidth: (width: number) => void;
    set_is_CTRL_F_enabled: (flag: boolean) => void;
  };
}
export interface SettingsValues {
  interfaceLanguage: Locale;
  wikiLanguage: WikiLanguage;
  sidebarWidth: number;
  is_CTRL_F_enabled: boolean;
}

const initialState: SettingsValues = {
  interfaceLanguage: detectLocale(),
  wikiLanguage: "en",
  sidebarWidth: 400,
  is_CTRL_F_enabled: false,
};

type SettingsStore = SettingsValues & Actions;
const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        actions: {
          setInterfaceLanguage: (language: Locale) => {
            set(() => ({ interfaceLanguage: language }), false, "setInterfaceLanguage");
          },
          setWikiLanguage: (language: WikiLanguage) => {
            set(() => ({ wikiLanguage: language }), false, "setWikiLanguage");
          },
          setSidebarWidth: (width: number) => {
            set(() => ({ sidebarWidth: width }), false, "setSidebarWidth");
          },
          set_is_CTRL_F_enabled: (flag: boolean) => {
            set(() => ({ is_CTRL_F_enabled: flag }), false, "setSearchEnabled");
          },
        },
      }),
      {
        name: "settings",
        storage: createJSONStorage(() => localStorage),
        partialize: ({ actions: _actions, ...rest }: SettingsStore) => rest,
        version: 1,
      },
    ),
    {
      name: "settings-store",
    },
  ),
);

const resolveInterfaceLanguage = (language: unknown): Locale => {
  // Persisted settings can outlive catalog renames and contain a locale that
  // no longer maps to a catalog. Fall back at the store interface so startup
  // can always activate a valid catalog without resetting unrelated settings.
  return typeof language === "string" && isLocale(language) ? language : SOURCE_LOCALE;
};

export const useSettingsStoreActions = () => useSettingsStore((state) => state.actions);
export const getInterfaceLanguage = () => resolveInterfaceLanguage(useSettingsStore.getState().interfaceLanguage);
export const useInterfaceLanguage = () =>
  useSettingsStore((state) => resolveInterfaceLanguage(state.interfaceLanguage));
export const useWikiLanguage = () => useSettingsStore((state) => state.wikiLanguage);
export const useSidebarWidth = () => useSettingsStore((state) => state.sidebarWidth);
export const useIsCtrlFEnabled = () => useSettingsStore((state) => state.is_CTRL_F_enabled);
