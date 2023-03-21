import { useStopwatchValue } from './StopwatchContext';

export const Stopwatch = () => {
  const { time } = useStopwatchValue();

  return (
    <div className="">
      <span className="stopwatch text-5xl">
        {time.min}:{time.sec}
      </span>
      <span className="stopwatch text-2xl">.{time.ms}</span>
    </div>
  );
};
