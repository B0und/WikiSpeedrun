import { useNavigate } from "react-router";
import { useGameStoreActions } from "../GameStore";
import { queryClient } from "../components/Providers";
import { useStopwatchActions } from "../components/StopwatchContext";

export const useResetGame = () => {
  const navigate = useNavigate();
  const { resetStoreState } = useGameStoreActions();
  const { resetStopwatch } = useStopwatchActions();

  return async () => {
    await queryClient.removeQueries({ queryKey: ["article"] });
    resetStoreState();
    resetStopwatch();
    navigate("/settings");
  };
};
