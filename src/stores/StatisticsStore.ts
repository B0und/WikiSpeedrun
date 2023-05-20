import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

/*
Data gets persisted in local storage
*/

interface Actions {
  actions: {
    increaseTotalRuns: () => void;
    increaseWins: () => void;
    checkAchievements: () => void;
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

export interface Achievement {
  title: string;
  description: string;
  unlocked: boolean;
  condition: () => boolean;
  image: string;
}

type StatsStore = Values &
  Actions & {
    achievements: Achievement[];
  };

const useStatsStore = create<StatsStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,
        achievements: [
          {
            title: "Getting started",
            description: "Get your first win",
            condition: () => get().wins > 0,
            unlocked: false,
            image: "wiki-waifu.png",
          },
          {
            title: "Gamer",
            description: "Get your first win",
            condition: () => get().totalRuns > 5,
            unlocked: false,
            image: "wiki-waifu.png",
          },
        ],
        actions: {
          increaseTotalRuns: () =>
            set((state) => ({ totalRuns: state.totalRuns + 1 }), false, "increaseTotalRuns"),
          increaseWins: () => set((state) => ({ wins: state.wins + 1 }), false, "increaseWins"),
          checkAchievements: () =>
            set((state) => {
              state.achievements.forEach((achievement) => {
                if (!achievement.unlocked && achievement.condition()) {
                  achievement.unlocked = true;
                  console.log(`Achievement unlocked: ${achievement.title}`);
                }
              });
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
