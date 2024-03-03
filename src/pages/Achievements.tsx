import { useAchievements } from "../stores/StatisticsStore";
import { Achievement } from "../components/Achievement";
import { InfoTooltip } from "../components/InfoTooltip";
import { useI18nContext } from "../i18n/i18n-react";

// TODO add i18n
export const Achievements = () => {
  const { LL } = useI18nContext();
  const achievements = useAchievements();
  const unlockedAchievements = achievements.filter((a) => a.unlocked).length;

  return (
    <div>
      <div className="mb-4 flex w-full items-baseline justify-between border-b-[1px] border-secondary-border ">
        <InfoTooltip>
          <h2 className="align-baseline font-serif text-3xl">{LL["Achievements"]()}</h2>
        </InfoTooltip>
        <p className="text-xl">
          {unlockedAchievements}/{achievements.length}
        </p>
      </div>

      <div className="achievements-grid">
        {achievements.map((achievement) => (
          <Achievement achievement={achievement} key={achievement.id} />
        ))}
      </div>
    </div>
  );
};
