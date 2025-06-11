import { useCallback, useEffect, useRef, useState } from "react";

// https://twitter.com/dan_abramov/status/1102690107264520193
// https://codesandbox.io/s/1qwlpk4o8l?file=/src/index.js:259-998

// Gives you a continuously updating timestamp.
// Note this triggers a render on every frame.
const useFrameNow = (isActive: boolean) => {
  const [now, setNow] = useState<number | null>(null);

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
    return () => {
      cancelAnimationFrame(id);
    };
  }, [isActive]);

  return isActive ? now : null;
};

const useStopwatch = () => {
  const totalLapseRef = useRef(0);
  // Previous accumulated lapse
  const [pastLapse, setPastLapse] = useState(0);

  // When we started the last one (or null)
  const [startTime, setStartTime] = useState<number | null>(null);

  // Calculate the number to show
  const isRunning = startTime !== null;
  const frameNow = useFrameNow(isRunning) ?? 0;
  const currentLapse = isRunning ? Math.max(0, frameNow - startTime) : 0;
  const totalLapse = pastLapse + currentLapse;
  totalLapseRef.current = totalLapse;

  const pauseStopwatch = useCallback(() => {
    if (isRunning) {
      setPastLapse((l) => l + performance.now() - startTime);
      setStartTime(null);
    }
  }, [isRunning, startTime]);

  const startStopwatch = useCallback(() => {
    if (!isRunning) {
      setStartTime(performance.now());
    }
  }, [isRunning]);

  const resetStopwatch = useCallback(() => {
    setPastLapse(0);
    setStartTime(null);
  }, []);

  const getTimeInMs = useCallback(() => {
    return totalLapse;
  }, [totalLapse]);

  const getFormattedTime = useCallback(() => {
    const pad = (time: string, length: number) => {
      while (time.length < length) {
        time = `0${time}`;
      }
      return time;
    };

    let newMs = totalLapseRef.current;
    // biome-ignore lint/suspicious/noImplicitAnyLet: todo
    let seconds;
    seconds = Math.floor(totalLapseRef.current / 1000);
    newMs = newMs - seconds * 1000;

    const minutes = Math.floor(seconds / 60);
    seconds = seconds - minutes * 60;

    return {
      min: pad(String(minutes), 2),
      sec: pad(String(seconds), 2),
      ms: pad(newMs.toFixed(0), 3),
    };
  }, []);

  const time = getFormattedTime();
  const timeInMs = getTimeInMs();

  return { time, timeInMs, pauseStopwatch, startStopwatch, resetStopwatch, getFormattedTime };
};

export default useStopwatch;
