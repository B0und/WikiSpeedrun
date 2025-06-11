import { useNavigate } from "@tanstack/react-router";
import { useStopwatchActions } from "../components/StopwatchContext";
import { useGameStoreActions } from "../stores/GameStore";

export const useResetGame = () => {
  const navigate = useNavigate();
  const { resetStoreState, setIsWin } = useGameStoreActions();
  const { resetStopwatch } = useStopwatchActions();

  return () => {
    setIsWin(false);
    resetStopwatch();
    resetStoreState();
    void navigate({ to: '/settings' });
  };
};
