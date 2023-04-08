export interface StopwatchProps {
  min: string;
  sec: string;
  ms: string;
}
export const StopwatchDisplay = ({ min = "00", sec = "00", ms = "000" }: StopwatchProps) => {
  return (
    <div>
      <span className="stopwatch text-5xl sm:text-3xl">
        {min}:{sec}
      </span>
      <span className="stopwatch text-2xl sm:text-xl">.{ms}</span>
    </div>
  );
};
