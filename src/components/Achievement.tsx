import clsx from "clsx";
import type { Achievement as IAchievement } from "../achievements";
import { useLingui } from "@lingui/react/macro";

export const Achievement = ({ achievement }: { achievement: IAchievement }) => {
  const { t } = useLingui();

  let currentValue: number;
  if (achievement.targetValue) {
    currentValue = Math.min(achievement.currentValue(), achievement.targetValue);
  } else {
    currentValue = achievement.currentValue?.() ?? 0;
  }

  const achievementTitle = t({ id: `${achievement.id}.title` });
  let achievementDescription: React.ReactNode = t({ id: `${achievement.id}.description` });

  let achievementAltText = achievement.imgAlt ?? t({ id: "Prize trophy" });

  if (achievement.id === "SpeedrunWaifu") {
    achievementDescription = (
      <span>
        {t({ id: "Made by Ina_den" })} {t({ id: "Follow him on" })}{" "}
        <a href="https://twitter.com/Ina_den_" target="_blank" rel="noreferrer" className="text-primary-blue underline">
          {t({ id: "twitter (X)" })}
        </a>
      </span>
    );
    achievementAltText = t({ id: "WaifuAlt" });
  }
  return (
    <div className="flex w-full max-w-[var(--achievement-size)] items-center justify-start gap-5 lg:max-w-full ">
      <img
        width={128}
        height={128}
        src={achievement.imgUrl ?? "/trophy.svg"}
        alt={achievementAltText}
        className={clsx("h-full bg-center object-cover sm:h-16 sm:w-16", !achievement.unlocked && " grayscale")}
        loading="lazy"
      />
      <div className="mt-8 flex flex-1 flex-col justify-between self-stretch">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg">{achievementTitle}</h3>
          <p className="line-clamp-2 text-xs" title="asd">
            {achievementDescription}
          </p>
        </div>

        {
          <label
            htmlFor=""
            className={clsx(
              "flex flex-col gap-1",
              currentValue === undefined && achievement.targetValue === undefined && "invisible",
            )}
          >
            <span className="text-right text-sm">
              {currentValue}/{achievement.targetValue ?? 1}
            </span>

            <progress
              className="h-2 w-full progress-filled:bg-primary-blue progress-unfilled:bg-gray-200 dark:progress-unfilled:bg-gray-700"
              value={currentValue}
              max={achievement.targetValue}
            >
              {((currentValue ?? 0) * 100) / (achievement.targetValue ?? 1)}%
            </progress>
          </label>
        }
      </div>
    </div>
  );
};
