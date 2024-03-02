import { achievementToast } from "../components/AchievementNotification";
import {
  checkAchievements,
  useAchievements,
  useStatsStoreActions,
} from "../stores/StatisticsStore";

export const useUnlockAchievements = () => {
  const achievements = useAchievements();
  const { unlockAchievements } = useStatsStoreActions();

  return () => {
    const unlockedAchievements = checkAchievements(achievements);
    for (const achievement of unlockedAchievements) {
      achievementToast(achievement);
    }

    unlockAchievements(unlockedAchievements);
  };
};
