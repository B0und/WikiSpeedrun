import { useCallback, useEffect } from "react";
import { useLingui } from "@lingui/react/macro";
import { useGameStoreActions, useIsGameRunning } from "../../stores/GameStore";
import { useIsCtrlFEnabled } from "../../stores/SettingsStore";
import { errorToast } from "../../utils/toast";

const isNotDev = process.env.NODE_ENV !== "development";

export const useNoCheating = () => {
  const { t } = useLingui();
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
        errorToast(t({ id: "No Cheating!" }));
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
