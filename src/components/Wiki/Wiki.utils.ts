import { useCallback, useEffect } from "react";
import { useGameStoreActions, useIsGameRunning } from "../../GameStore";
import { useI18nContext } from "../../i18n/i18n-react";
import { toast } from "react-hot-toast";

const errorToast = (text: string) => toast.error(text, { position: "bottom-center" });

export const useNoCheating = () => {
  const { LL } = useI18nContext();
  const { increaseCheatingAttemptsCounter } = useGameStoreActions();
  const isGameRunning = useIsGameRunning();
  const disableSearch = useCallback(
    (e: globalThis.KeyboardEvent) => {
      if (!isGameRunning) return;
      if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) {
        e.preventDefault();
        increaseCheatingAttemptsCounter();
        errorToast(LL.NO_CHEATING());
      }
    },
    [LL, increaseCheatingAttemptsCounter, isGameRunning]
  );
  useEffect(() => {
    window.addEventListener("keydown", disableSearch);

    return () => {
      window.removeEventListener("keydown", disableSearch);
    };
  }, [disableSearch]);
};
