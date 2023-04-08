import { useCallback, useEffect } from "react";
import { useGameStoreActions, useIsGameRunning } from "./GameStore";
import { toast } from "react-hot-toast";
import { useI18nContext } from "./i18n/i18n-react";

const isNotDev = process.env.NODE_ENV !== "development";

export const useWikiConsoleLogo = () => {
  useEffect(() => {
    isNotDev &&
      console.log(
        "%cWikiSpeedrunGame",
        "font-weight: bold; background-color:#0e0d0d; font-size: 42px;color: #4acd79; text-shadow: 3px 3px 0 #33a75e , 6px 6px 0 #13793a , 9px 9px 0 #094d22; padding: 5%"
      );
  }, []);
};

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
