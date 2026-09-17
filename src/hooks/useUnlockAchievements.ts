import { useLingui } from "@lingui/react/macro";
import { achievementToast } from "../components/AchievementNotification";
import { messageDescriptors } from "../lingui";
import { checkAchievements, useAchievements, useStatsStoreActions } from "../stores/StatisticsStore";

export const useUnlockAchievements = () => {
  const { t } = useLingui();
  const achievements = useAchievements();
  const { unlockAchievements } = useStatsStoreActions();

  return () => {
    const unlockedAchievements = checkAchievements(achievements);
    for (const achievement of unlockedAchievements) {
      const titleId = `${achievement.id}.title` as const;
      achievementToast(achievement, {
        title: t(messageDescriptors[titleId]),
        imageAlt: achievement.imgAlt ? t(achievement.imgAlt) : t(messageDescriptors["Prize trophy"]),
        unlocked: t(messageDescriptors["Achievement unlocked"]),
      });
    }

    unlockAchievements(unlockedAchievements);
  };
};
