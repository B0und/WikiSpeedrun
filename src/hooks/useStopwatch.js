import { useEffect, useState } from "react";

// https://twitter.com/dan_abramov/status/1102690107264520193
// https://codesandbox.io/s/1qwlpk4o8l?file=/src/index.js:259-998

// Gives you a continuously updating timestamp.
// Note this triggers a render on every frame.
const useFrameNow = (isActive) => {
  const [now, setNow] = useState(null);

  useEffect(() => {
    if (!isActive) {
      return;
    }
    // Update now with current time.
    function updateNow() {
      setNow(performance.now());
    }
    // Do that on every animation frame.
    function tick() {
      if (!isActive) {
        return;
      }
      updateNow();
      id = requestAnimationFrame(tick);
    }
    // And when we start the animation.
    updateNow();
    // Let the magic go.
    let id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [isActive]);

  return isActive ? now : null;
};

const useStopwatch = () => {
  // Previous accumulated lapse
  const [pastLapse, setPastLapse] = useState(0);

  // When we started the last one (or null)
  const [startTime, setStartTime] = useState(null);

  // Prevent starting the timer
  const [isDisabled, setIsDisabled] = useState(false);

  // Calculate the number to show
  const isRunning = startTime !== null;
  const frameNow = useFrameNow(isRunning);
  const currentLapse = isRunning ? Math.max(0, frameNow - startTime) : 0;
  const totalLapse = pastLapse + currentLapse;

  const pause = () => {
    if (isRunning) {
      setPastLapse((l) => l + performance.now() - startTime);
      setStartTime(null);
    }
  };

  const start = () => {
    if (!isRunning && !isDisabled) {
      setStartTime(performance.now());
    }
  };

  const reset = () => {
    setPastLapse(0);
    setStartTime(null);
  };

  const getFormattedTime = (time) => {
    const pad = (time, length) => {
      while (time.length < length) {
        time = "0" + time;
      }
      return time;
    };

    time = new Date(time);
    let m = pad(time.getMinutes().toString(), 2);
    let s = pad(time.getSeconds().toString(), 2);
    let ms = pad(time.getMilliseconds().toString(), 3);

    return { m, s, ms };
  };

  return [getFormattedTime(totalLapse), pause, start, reset, setIsDisabled];
};

export default useStopwatch;
