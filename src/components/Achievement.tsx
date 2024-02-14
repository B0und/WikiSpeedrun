import clsx from "clsx";
import { type Achievement as IAchievement } from "../achievements";

export const Achievement = ({ achievement }: { achievement: IAchievement }) => {
  const currentValue = Math.min(achievement.currentValue(), achievement.targetValue);
  const isNotUnlocked = currentValue < achievement.targetValue;

  return (
    <div className="flex max-w-[var(--achievement-size)] items-start justify-start gap-5">
      <img
        width={128}
        height={128}
        src="/trophy.svg"
        alt="Golden prize cup with three stars on top" // TODO i18n
        className={clsx(isNotUnlocked && "grayscale")}
      />
      <div className="mt-8 flex flex-1 flex-col justify-between self-stretch">
        <div>
          <h3 className="text-lg">{achievement.title}</h3>
          <p className="line-clamp-2 text-xs" title="asd">
            {achievement.description}
          </p>
        </div>

        <label htmlFor="" className="flex flex-col gap-1">
          <span className="text-right text-sm">
            {currentValue}/{achievement.targetValue}
          </span>
          <progress
            className="h-2 w-full progress-unfilled:bg-gray-200  progress-filled:bg-primary-blue dark:progress-unfilled:bg-gray-700"
            value={currentValue}
            max={achievement.targetValue}
          >
            {(currentValue * 100) / achievement.targetValue}%
          </progress>
        </label>
      </div>
    </div>
  );
};
