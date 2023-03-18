import { useContext, useEffect } from 'react';
import { useIsGameRunning } from '../GameStore';
import { useStopwatchActions, useStopwatchValue } from './StopwatchContext';

interface StopwatchProps {
  min?: string;
  sec?: string;
  ms?: string;
}
const Stopwatch = ({ min = '00', sec = '00', ms = '000' }: StopwatchProps) => {
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

export default Stopwatch;
