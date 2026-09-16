import { achievementToast } from "../components/AchievementNotification";
import { useLingui } from "@lingui/react/macro";
import { checkAchievements, useAchievements, useStatsStoreActions } from "../stores/StatisticsStore";

export const useUnlockAchievements = () => {
  const { t } = useLingui();
  const achievements = useAchievements();
  const { unlockAchievements } = useStatsStoreActions();

  return () => {
    const unlockedAchievements = checkAchievements(achievements);
    for (const achievement of unlockedAchievements) {
      achievementToast(achievement, {
        title: t({ id: `${achievement.id}.title` }),
        imageAlt: t({ id: "Prize trophy" }),
        unlocked: t({ id: "Achievement unlocked" }),
      });
    }

    unlockAchievements(unlockedAchievements);
  };
};
