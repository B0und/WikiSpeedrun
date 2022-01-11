import { useState, useEffect } from "react";

const useDebounce = (value, timeout) => {
  const [state, setState] = useState(value);

  useEffect(() => {
    const timerID = setTimeout(() => setState(value), timeout);

    return () => clearTimeout(timerID);
  }, [value, timeout]);

  return state;
};

export default useDebounce;
