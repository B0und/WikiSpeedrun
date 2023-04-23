import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { persist, createJSONStorage } from "zustand/middleware";

/*
Data gets persisted in local storage
*/

interface Actions {
  actions: {
    increaseTotalRuns: () => void;
    increaseWins: () => void;
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

type StatsStore = Values & Actions;
const useStatsStore = create<StatsStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        actions: {
          increaseTotalRuns: () =>
            set((state) => ({ totalRuns: state.totalRuns + 1 }), false, "increaseTotalRuns"),
          increaseWins: () => set((state) => ({ wins: state.wins + 1 }), false, "increaseWins"),
        },
      }),
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
