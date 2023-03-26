import { useStopwatchValue } from './StopwatchContext';
import { StopwatchDisplay } from './StopwatchDisplay';

export const Stopwatch = () => {
  const { time } = useStopwatchValue();

  return <StopwatchDisplay min={time.min} sec={time.sec} ms={time.ms} />;
};
