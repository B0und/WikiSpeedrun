import { useCallback, useEffect } from "react";
import { useI18nContext } from "../../i18n/i18n-react";
import { useGameStoreActions, useIsGameRunning } from "../../stores/GameStore";
import { useIsCtrlFEnabled } from "../../stores/SettingsStore";
import { errorToast } from "../../utils/toast";

const isNotDev = process.env.NODE_ENV !== "development";

export const useNoCheating = () => {
  const { LL } = useI18nContext();
  const { increaseCheatingAttemptsCounter } = useGameStoreActions();
  const isGameRunning = useIsGameRunning();
  const isSearchEnabled = useIsCtrlFEnabled();

  const disableSearch = useCallback(
    (e: globalThis.KeyboardEvent) => {
      if (!isGameRunning) return;
      if (e.key === "F3" || (e.ctrlKey && e.key === "f")) {
        if (isNotDev) {
          e.preventDefault();
        }
        increaseCheatingAttemptsCounter();
        errorToast(LL["No Cheating!"]());
      }
    },
    [LL, increaseCheatingAttemptsCounter, isGameRunning],
  );

  useEffect(() => {
    if (isSearchEnabled) {
      return undefined;
    }

    window.addEventListener("keydown", disableSearch);

    return () => {
      window.removeEventListener("keydown", disableSearch);
    };
  }, [disableSearch, isSearchEnabled]);
};
