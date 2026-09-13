import { achievementToast } from "../components/AchievementNotification";
import { useTranslation } from "../lingui";
import { checkAchievements, useAchievements, useStatsStoreActions } from "../stores/StatisticsStore";

export const useUnlockAchievements = () => {
  const t = useTranslation();
  const achievements = useAchievements();
  const { unlockAchievements } = useStatsStoreActions();

  return () => {
    const unlockedAchievements = checkAchievements(achievements);
    for (const achievement of unlockedAchievements) {
      achievementToast(achievement, t);
    }

    unlockAchievements(unlockedAchievements);
  };
};
