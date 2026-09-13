import { useCallback, useEffect } from "react";
import { useTranslation } from "../../lingui";
import { useGameStoreActions, useIsGameRunning } from "../../stores/GameStore";
import { useIsCtrlFEnabled } from "../../stores/SettingsStore";
import { errorToast } from "../../utils/toast";

const isNotDev = process.env.NODE_ENV !== "development";

export const useNoCheating = () => {
  const t = useTranslation();
  const { increaseCheatingAttemptsCounter } = useGameStoreActions();
  const isGameRunning = useIsGameRunning();
  const isSearchEnabled = useIsCtrlFEnabled();

  const disableSearch = useCallback(
    (e: globalThis.KeyboardEvent) => {
      if (!isGameRunning) return;
      if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) {
        if (isNotDev) {
          e.preventDefault();
        }
        increaseCheatingAttemptsCounter();
        errorToast(t("No Cheating!"));
      }
    },
    [t, increaseCheatingAttemptsCounter, isGameRunning],
  );

  useEffect(() => {
    if (isSearchEnabled) {
      return;
    }

    window.addEventListener("keydown", disableSearch);

    return () => {
      window.removeEventListener("keydown", disableSearch);
    };
  }, [disableSearch, isSearchEnabled]);
};
