export interface StopwatchProps {
  min: string | undefined;
  sec: string | undefined;
  ms: string | undefined;
}
export const StopwatchDisplay = ({ min = "00", sec = "00", ms = "000" }: StopwatchProps) => {
  return (
    <div className="z-10">
      <span className="stopwatch text-5xl sm:text-3xl">
        {min}:{sec}
      </span>
      <span className="stopwatch text-2xl sm:text-xl">.{ms}</span>
    </div>
  );
};
