import { Achievement } from "../components/Achievement";
import { InfoTooltip } from "../components/InfoTooltip";
import { useLingui } from "@lingui/react/macro";
import { useAchievements } from "../stores/StatisticsStore";

export const Achievements = () => {
  const { t } = useLingui();
  const achievements = useAchievements();
  const unlockedAchievements = achievements.filter((a) => a.unlocked).length;

  return (
    <div>
      <div className="mb-4 flex w-full items-baseline justify-between border-b-[1px] border-secondary-border">
        <InfoTooltip>
          <h2 className="align-baseline font-serif text-3xl">{t({ id: "Achievements" })}</h2>
        </InfoTooltip>
        <p className="text-xl">
          {unlockedAchievements}/{achievements.length}
        </p>
      </div>

      <div className="achievements-grid pb-8 sm:grid-cols-1 sm:gap-6">
        {achievements.map((achievement) => (
          <Achievement achievement={achievement} key={achievement.id} />
        ))}
      </div>
    </div>
  );
};
