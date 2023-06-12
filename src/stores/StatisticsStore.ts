import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Achievement, achievements, getConditionFunction } from "../achievements";

/*
Data gets persisted in local storage
*/

interface Actions {
  actions: {
    increaseTotalRuns: () => void;
    increaseWins: () => void;
    unlockAchievements: (unlockedAchievements: Achievement[]) => void;
  };
}

interface Values {
  totalRuns: number;
  wins: number;
}

const initialState: Values = {
  totalRuns: 0,
  wins: 0,
};

type StatsStore = Values &
  Actions & {
    achievements: Achievement[];
  };

export const useStatsStore = create<StatsStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,
        achievements,
        actions: {
          increaseTotalRuns: () =>
            set((state) => ({ totalRuns: state.totalRuns + 1 }), false, "increaseTotalRuns"),
          increaseWins: () => set((state) => ({ wins: state.wins + 1 }), false, "increaseWins"),
          unlockAchievements: (unlockedAchievements: Achievement[]) =>
            set((state) => {
              for (const achievement of state.achievements) {
                if (unlockedAchievements.some((u) => achievement.conditionId === u.conditionId)) {
                  achievement.unlocked = true;
                }
              }
            }),
        },
      })),
      {
        name: "statistics",
        storage: createJSONStorage(() => localStorage),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        partialize: ({ actions, ...rest }: StatsStore) => rest,
      }
    ),
    {
      name: "statistics-store",
    }
  )
);

export const useStatsStoreActions = () => useStatsStore((state) => state.actions);
export const useTotalRuns = () => useStatsStore((state) => state.totalRuns);
export const useWinsCount = () => useStatsStore((state) => state.wins);
export const useAchievements = () => useStatsStore((state) => state.achievements);

export const checkAchievements = (achievements: Achievement[]) => {
  return achievements.filter((achievement) => {
    const conditionFn = getConditionFunction(achievement.conditionId);
    return !achievement.unlocked && conditionFn();
  });
};
