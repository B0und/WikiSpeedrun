import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  endGame,
  selectTimeLimit,
  setIsWin,
  setTimeLimit,
} from "../redux/settingsSlice";
import { StopwatchContext } from "./Stopwatch/StopwatchContext";

const LoseTracker = () => {
  const dispatch = useDispatch();
  const stopwatch = useContext(StopwatchContext);
  const timeLimit = useSelector(selectTimeLimit);
  const [lose, setLose] = useState(false);

  useEffect(() => {
    if (lose) return;

    if (timeLimit && stopwatch.getTimeInMs() > timeLimit) {
      setLose(true);
      stopwatch.pauseTimer();
      stopwatch.disableTimer(true);
      dispatch(setTimeLimit(null));
      dispatch(setIsWin(false));
      dispatch(endGame());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopwatch.time.s]);

  return <></>;
};

export default LoseTracker;
