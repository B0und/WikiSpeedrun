import React, { createContext } from "react";
import { useMemo } from "react";
import useStopwatch from "../hooks/useStopwatch";

interface StopwatchContext {
  time: { min: string; sec: string; ms: string };
  timeInMs: number;
}

interface StopwatchContextActions {
  pauseStopwatch: () => void;
  startStopwatch: () => void;
  resetStopwatch: () => void;
  getFormattedTime: () => {
    min: string;
    sec: string;
    ms: string;
  };
}

const StopwatchContextValue = createContext<StopwatchContext | undefined>(undefined);
const StopwatchContextActions = createContext<StopwatchContextActions | undefined>(undefined);

export const StopwatchContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { time, timeInMs, pauseStopwatch, startStopwatch, resetStopwatch, getFormattedTime } = useStopwatch();

  const actions = useMemo(
    () => ({ pauseStopwatch, startStopwatch, resetStopwatch, getFormattedTime }),
    [getFormattedTime, pauseStopwatch, resetStopwatch, startStopwatch],
  );
  const values = useMemo(() => ({ time, timeInMs }), [time, timeInMs]);

  return (
    <StopwatchContextActions.Provider value={actions}>
      <StopwatchContextValue.Provider value={values}>{children}</StopwatchContextValue.Provider>
    </StopwatchContextActions.Provider>
  );
};

export function useStopwatchActions() {
  const context = React.useContext(StopwatchContextActions);
  if (context === undefined) {
    throw new Error("useCount must be used within a StopwatchContextActions");
  }

  return context;
}

export function useStopwatchValue() {
  const context = React.useContext(StopwatchContextValue);
  if (context === undefined) {
    throw new Error("useCount must be used within a StopwatchContextValue");
  }

  return context;
}
