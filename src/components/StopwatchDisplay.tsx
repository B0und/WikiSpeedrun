export interface StopwatchProps {
  min: string;
  sec: string;
  ms: string;
}
export const StopwatchDisplay = ({ min = "00", sec = "00", ms = "000" }: StopwatchProps) => {
  return (
    <div>
      <span className="stopwatch text-5xl">
        {min}:{sec}
      </span>
      <span className="stopwatch text-2xl">.{ms}</span>
    </div>
  );
};
