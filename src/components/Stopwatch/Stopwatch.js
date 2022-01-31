import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/macro";

import {
  endGame,
  selectTimeLimit,
  setIsWin,
  setTimeLimit,
} from "../../redux/settingsSlice";
import { StopwatchContext } from "./StopwatchContext";

const Stopwatch = ({ time }) => {
  const stopwatch = useContext(StopwatchContext);
  const timeLimit = useSelector(selectTimeLimit);
  const dispatch = useDispatch();

  // check for timer timeout
  useEffect(() => {
    if (timeLimit && stopwatch.getTimeInMs() > timeLimit) {
      stopwatch.pauseTimer();
      stopwatch.disableTimer(true);
      dispatch(setIsWin(false));
      dispatch(setTimeLimit(null));
      dispatch(endGame());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time.s, time.m]);

  return (
    <StyledStopwatch>
      <StopwatchBase>
        {time.m}:{time.s}
      </StopwatchBase>
      <StopwatchMs>.{time.ms}</StopwatchMs>
    </StyledStopwatch>
  );
};

const StyledStopwatch = styled.div`
  font-size: ${36 / 16}rem;
  text-align: right;
`;

const GradientText = styled.span`
  background-image: linear-gradient(180deg, #4acd79, #1cad4a);
  background-size: 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -moz-text-fill-color: transparent;
  -webkit-text-fill-color: transparent;
`;

const StopwatchBase = styled(GradientText)`
  font-size: 1em;
`;
const StopwatchMs = styled(GradientText)`
  font-size: 0.7em;
`;

export default Stopwatch;
