import { type Achievement as IAchievement } from "../achievements";

export const Achievement = ({ achievement }: { achievement: IAchievement }) => {
  return (
    <div className="flex max-w-[var(--achievement-size)] items-start justify-start gap-5">
      <img
        width={128}
        height={128}
        src="/achievement.png"
        alt="Prize cup for getting an achievement"
      />
      <div className="flex flex-1 flex-col justify-between self-stretch">
        <div>
          <h3 className="text-lg">{achievement.title}</h3>
          <p className="line-clamp-2 text-xs" title="asd">
            {achievement.description}
          </p>
        </div>

        <label htmlFor="" className="flex flex-col gap-1">
          <span className="text-right text-sm">0/119</span>
          <progress
            className="h-2 w-full progress-unfilled:bg-secondary-border progress-filled:bg-secondary-blue"
            value={30}
            max={100}
          >
            33%
          </progress>
        </label>
      </div>
    </div>
  );
};
