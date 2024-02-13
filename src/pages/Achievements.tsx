import React from "react";
import { useAchievements } from "../stores/StatisticsStore";
import { Achievement } from "../components/Achievement";
import styles from "./Achievements.module.css";

// TODO add i18n
export const Achievements = () => {
  const achievements = useAchievements();
  const unlockedAchievements = achievements.filter((a) => a.unlocked).length;

  return (
    <div>
      <div className="mb-4 flex w-full items-baseline justify-between border-b-[1px] border-secondary-border ">
        <h2 className="align-baseline font-serif text-3xl">Achievements</h2>
        <p className="text-xl">
          {unlockedAchievements}/{achievements.length}
        </p>
      </div>

      <div className={styles.grid}>
        {achievements.map((achievement) => (
          <Achievement achievement={achievement} />
        ))}
      </div>
    </div>
  );
};
