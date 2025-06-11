import { useCallback, useEffect } from "react";
import { useGameStoreActions, useIsGameRunning } from "../../stores/GameStore";
import { useI18nContext } from "../../i18n/i18n-react";
import { toast } from "react-hot-toast";
import { useIsCtrlFEnabled } from "../../stores/SettingsStore";

const errorToast = (text: string) => toast.error(text, { position: "bottom-center" });
const isNotDev = process.env.NODE_ENV !== "development";

export const useNoCheating = () => {
  const { LL } = useI18nContext();
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
        errorToast(LL["No Cheating!"]());
      }
    },
    [LL, increaseCheatingAttemptsCounter, isGameRunning],
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
