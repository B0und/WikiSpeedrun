import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { detectLocale, isLocale, type Locale } from "../lingui";
import type { LANGUAGES } from "../components/WikiLanguageSelect";

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
// v1 stored non-BCP-47 locale codes (gr/jp/se) and used "" as the
// initial-language sentinel. The migrate hook below remaps the legacy codes
// and drops anything unsupported so the persist merge falls back to the
// detected initial value instead of crashing catalog loading with an unknown
// locale.
const LEGACY_LOCALE_BY_CODE: Record<string, Locale> = { gr: "el", jp: "ja", se: "sv" };

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
        version: 2,
        migrate: (persistedState, version) => {
          if (version >= 2) {
            return persistedState;
          }

          const state = { ...(persistedState as Record<string, unknown> | undefined) };
          const code = state.interfaceLanguage;
          const remapped = typeof code === "string" ? (LEGACY_LOCALE_BY_CODE[code] ?? code) : undefined;
          if (remapped !== undefined && isLocale(remapped)) {
            state.interfaceLanguage = remapped;
          } else {
            delete state.interfaceLanguage;
          }

          return state as typeof persistedState;
        },
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
