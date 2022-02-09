// https://stackoverflow.com/a/66604983/10692354

import { useEffect, useRef } from "react";

const useRenderingTrace = (componentName, propsAndStates, level = "debug") => {
  const prev = useRef(propsAndStates);

  useEffect(() => {
    const changedProps = Object.entries(propsAndStates).reduce(
      (property, [key, value]) => {
        if (prev.current[key] !== value) {
          property[key] = {
            old: prev.current[key],
            new: value,
          };
        }
        return property;
      },
      {}
    );

    if (Object.keys(changedProps).length > 0) {
      console[level](`[${componentName}] Changed props:`, changedProps);
    }

    prev.current = propsAndStates;
  });
};

export default useRenderingTrace;
