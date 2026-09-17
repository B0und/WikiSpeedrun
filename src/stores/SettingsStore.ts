import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { LANGUAGES } from "../components/WikiLanguageSelect";
import type { Locales } from "../i18n/i18n-types";

/*
 Data gets persisted in local storage
*/

type WikiLanguage = (typeof LANGUAGES)[number]["value"];
interface Actions {
  actions: {
    setInterfaceLanguage: (language: Locales) => void;
    setWikiLanguage: (language: WikiLanguage) => void;
    setSidebarWidth: (width: number) => void;
    set_is_CTRL_F_enabled: (flag: boolean) => void;
  };
}
interface Values {
  // Empty string means "not selected yet"; falls back to browser detection in
  // LocaleProvider.
  interfaceLanguage: Locales | "";
  wikiLanguage: WikiLanguage;
  sidebarWidth: number;
  is_CTRL_F_enabled: boolean;
}

const initialState: Values = {
  interfaceLanguage: "",
  wikiLanguage: "en",
  sidebarWidth: 400,
  is_CTRL_F_enabled: false,
};

type SettingsStore = Values & Actions;
const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        actions: {
          setInterfaceLanguage: (language: Locales) => {
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

export const useSettingsStoreActions = () => useSettingsStore((state) => state.actions);
export const useInterfaceLanguage = () => useSettingsStore((state) => state.interfaceLanguage);
export const useWikiLanguage = () => useSettingsStore((state) => state.wikiLanguage);
export const useSidebarWidth = () => useSettingsStore((state) => state.sidebarWidth);
export const useIsCtrlFEnabled = () => useSettingsStore((state) => state.is_CTRL_F_enabled);
