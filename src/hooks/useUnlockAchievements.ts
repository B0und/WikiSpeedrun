import { achievementToast } from "../components/AchievementNotification";
import { useI18nContext } from "../i18n/i18n-react";
import {
  checkAchievements,
  useAchievements,
  useStatsStoreActions,
} from "../stores/StatisticsStore";

export const useUnlockAchievements = () => {
  const { LL } = useI18nContext();
  const achievements = useAchievements();
  const { unlockAchievements } = useStatsStoreActions();

  return () => {
    const unlockedAchievements = checkAchievements(achievements);
    for (const achievement of unlockedAchievements) {
      achievementToast(achievement, LL);
    }

    unlockAchievements(unlockedAchievements);
  };
};
