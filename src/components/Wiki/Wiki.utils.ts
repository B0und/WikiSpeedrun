import { useCallback, useEffect } from "react";
import { useLingui } from "@lingui/react/macro";
import { useGameStoreActions, useIsGameRunning } from "../../stores/GameStore";
import { useIsCtrlFEnabled } from "../../stores/SettingsStore";
import { errorToast } from "../../utils/toast";

const isNotDev = process.env.NODE_ENV !== "development";

// Ctrl+F is reported as "f" or "F" depending on Caps Lock; F3 needs no
// normalization. Compares on the normalized key so Caps Lock cannot slip past
// the counter and the browser's find bar.
export const isCheatShortcut = (event: Pick<KeyboardEvent, "key" | "ctrlKey">) =>
  event.key === "F3" || (event.ctrlKey && event.key.toLowerCase() === "f");

export const useNoCheating = () => {
  const { t } = useLingui();
  const { increaseCheatingAttemptsCounter } = useGameStoreActions();
  const isGameRunning = useIsGameRunning();
  const isSearchEnabled = useIsCtrlFEnabled();

  const disableSearch = useCallback(
    (e: globalThis.KeyboardEvent) => {
      if (!isGameRunning) return;
      if (isCheatShortcut(e)) {
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
      return undefined;
    }

    window.addEventListener("keydown", disableSearch);

    return () => {
      window.removeEventListener("keydown", disableSearch);
    };
  }, [disableSearch, isSearchEnabled]);
};
