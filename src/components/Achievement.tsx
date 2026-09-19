import { useLingui } from "@lingui/react/macro";
import { clsx } from "clsx";
import type { Achievement as IAchievement } from "../achievements";
import { messageDescriptors } from "../lingui";

export const Achievement = ({ achievement }: { achievement: IAchievement }) => {
  const { t } = useLingui();

  let currentValue: number;
  if (achievement.targetValue) {
    currentValue = Math.min(achievement.currentValue(), achievement.targetValue);
  } else {
    currentValue = achievement.currentValue?.() ?? 0;
  }

  const titleId = `${achievement.id}.title` as const;
  const descriptionId = `${achievement.id}.description` as const;
  const achievementTitle = t(messageDescriptors[titleId]);
  let achievementDescription: React.ReactNode = t(messageDescriptors[descriptionId]);

  let achievementAltText: string = achievement.imgAlt
    ? t(achievement.imgAlt)
    : t(messageDescriptors["Prize trophy"]);

  if (achievement.id === "SpeedrunWaifu") {
    achievementDescription = (
      <span>
        {t(messageDescriptors["Made by Ina_den"])} {t(messageDescriptors["Follow him on"])}{" "}
        <a
          href="https://twitter.com/Ina_den_"
          target="_blank"
          rel="noreferrer"
          className="text-primary-blue underline"
        >
          {t(messageDescriptors["twitter (X)"])}
        </a>
      </span>
    );
    achievementAltText = t(messageDescriptors.WaifuAlt);
  }
  return (
    <div className="flex w-full max-w-[var(--achievement-size)] min-w-0 items-center justify-start gap-5 sm:items-start lg:max-w-full">
      <img
        width={128}
        height={128}
        src={achievement.imgUrl ?? "/trophy.svg"}
        alt={achievementAltText}
        className={clsx(
          "h-32 w-32 shrink-0 bg-center object-cover sm:h-16 sm:w-16",
          !achievement.unlocked && "grayscale",
        )}
        loading="lazy"
      />
      <div className="mt-8 flex min-w-0 flex-1 flex-col justify-between self-stretch sm:mt-0">
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-lg break-words">{achievementTitle}</h3>
          <p className="line-clamp-2 text-xs break-words">{achievementDescription}</p>
        </div>

        {
          <label
            htmlFor=""
            className={clsx(
              "flex min-w-0 flex-col gap-1",
              currentValue === undefined && achievement.targetValue === undefined && "invisible",
            )}
          >
            <span className="text-right text-sm">
              {currentValue}/{achievement.targetValue ?? 1}
            </span>

            <progress
              className="h-2 w-full progress-unfilled:bg-gray-200 dark:progress-unfilled:bg-gray-700 progress-filled:bg-primary-blue"
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
