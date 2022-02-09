import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTimeLimit } from "../redux/settingsSelectors";
import { endGame, setIsWin, setTimeLimit } from "../redux/settingsSlice";

import { StopwatchContext } from "./Stopwatch/StopwatchContext";

const LoseTracker = () => {
  const dispatch = useDispatch();
  const stopwatch = useContext(StopwatchContext);
  const timeLimit = useSelector(selectTimeLimit);

  useEffect(() => {
    if (timeLimit && stopwatch.getTimeInMs() > timeLimit) {
      stopwatch.pauseTimer();
      stopwatch.disableTimer(true);
      dispatch(setTimeLimit(null));
      dispatch(setIsWin(false));
      dispatch(endGame());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopwatch.time.ms]);

  return null;
};

export default LoseTracker;
