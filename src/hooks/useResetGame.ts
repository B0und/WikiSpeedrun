import { useNavigate } from "react-router";
import { useGameStoreActions } from "../GameStore";
import { useStopwatchActions } from "../components/StopwatchContext";

export const useResetGame = () => {
  const navigate = useNavigate();
  const { resetStoreState } = useGameStoreActions();
  const { resetStopwatch } = useStopwatchActions();

  return async () => {
    resetStopwatch();
    resetStoreState();
    navigate("/settings");
  };
};
