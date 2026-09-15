import { achievementToast } from "../components/AchievementNotification";
import { useLingui } from "@lingui/react";
import { checkAchievements, useAchievements, useStatsStoreActions } from "../stores/StatisticsStore";

export const useUnlockAchievements = () => {
  const { _: t } = useLingui();
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
