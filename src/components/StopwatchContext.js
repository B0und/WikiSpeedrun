import React, { createContext } from "react";
import useStopwatch from "../hooks/useStopwatch";

export const StopwatchContext = createContext();

// This context provider is passed to any component requiring the context
export const StopwatchProvider = ({ children }) => {
  const [time, toggleTimer, resetTimer] = useStopwatch();

  return (
    <StopwatchContext.Provider
      value={{
        time,
        toggleTimer,
        resetTimer,
      }}
    >
      {children}
    </StopwatchContext.Provider>
  );
};
