import { useCallback, useEffect, useRef, useState } from "react";

// https://twitter.com/dan_abramov/status/1102690107264520193
// https://codesandbox.io/s/1qwlpk4o8l?file=/src/index.js:259-998

// Gives you a continuously updating timestamp.
// Note this triggers a render on every frame.
const useFrameNow = (isActive: boolean) => {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (!isActive) {
      return undefined;
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

const pad = (time: string, length: number) => {
  while (time.length < length) {
    time = `0${time}`;
  }
  return time;
};

const formatLapse = (totalLapse: number) => {
  let newMs = totalLapse;
  const totalSeconds = Math.floor(totalLapse / 1000);
  newMs = newMs - totalSeconds * 1000;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds - minutes * 60;

  return {
    min: pad(String(minutes), 2),
    sec: pad(String(seconds), 2),
    ms: pad(String(Math.min(999, Math.round(newMs))), 3),
  };
};

const useStopwatch = () => {
  // Previous accumulated lapse
  const [pastLapse, setPastLapse] = useState(0);

  // When we started the last one (or null)
  const [startTime, setStartTime] = useState<number | null>(null);

  // Latest values for the callbacks below. They mirror the state on every
  // commit, so the callbacks can read the current lapse at call time without
  // depending on per-frame state (which would change their identity every
  // frame and re-render every useStopwatchActions consumer, e.g. the whole
  // shadow-DOM article subtree).
  const pastLapseRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  useEffect(() => {
    pastLapseRef.current = pastLapse;
    startTimeRef.current = startTime;
  }, [pastLapse, startTime]);

  // Calculate the number to show
  const isRunning = startTime !== null;
  const frameNow = useFrameNow(isRunning) ?? 0;
  const currentLapse = isRunning ? Math.max(0, frameNow - startTime) : 0;
  const totalLapse = pastLapse + currentLapse;

  const getTotalLapse = useCallback(() => {
    const startTimeNow = startTimeRef.current;
    return pastLapseRef.current + (startTimeNow !== null ? performance.now() - startTimeNow : 0);
  }, []);

  const pauseStopwatch = useCallback(() => {
    const startAt = startTimeRef.current;
    if (startAt !== null) {
      setPastLapse((lapse) => lapse + performance.now() - startAt);
      setStartTime(null);
    }
  }, []);

  const startStopwatch = useCallback(() => {
    if (startTimeRef.current === null) {
      setStartTime(performance.now());
    }
  }, []);

  const resetStopwatch = useCallback(() => {
    setPastLapse(0);
    setStartTime(null);
  }, []);

  const getFormattedTime = useCallback(() => formatLapse(getTotalLapse()), [getTotalLapse]);

  // The displayed time still updates per frame from state; the callbacks above
  // only provide imperative access (pause/actions context) and must stay stable.
  const time = formatLapse(totalLapse);
  const timeInMs = totalLapse;

  return { time, timeInMs, pauseStopwatch, startStopwatch, resetStopwatch, getFormattedTime };
};

export default useStopwatch;
