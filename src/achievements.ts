import { useStatsStore } from "./stores/StatisticsStore";

export interface Achievement {
  title: string;
  description: string;
  unlocked: boolean;
  conditionId: keyof typeof conditionFunctions;
  condition?: () => void;
  image: string;
}

export const achievements: Achievement[] = [
  {
    title: "Getting started",
    description: "Get your first win",
    conditionId: "winsGreaterThanZero",
    unlocked: false,
    image: "1.png",

  },
  {
    title: "Gamer",
    description: "Get your first win",
    conditionId: "totalRunsGreaterThanFive",
    unlocked: false,
    image: "2.png",

  },
];

const conditionFunctions: Record<string, () => boolean> = {
  winsGreaterThanZero: () => useStatsStore.getState().wins > 0,
  totalRunsGreaterThanFive: () => useStatsStore.getState().totalRuns > 5,
} as const;

// Retrieve the condition function based on the ID
export function getConditionFunction(id: string): () => boolean {
  return conditionFunctions[id];
}
