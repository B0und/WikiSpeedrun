import { useGameStore } from "./stores/GameStore";
import { useStatsStore } from "./stores/StatisticsStore";

export type Achievement = {
  unlocked: boolean;
  id: string;
  imgUrl?: string;
  imgAlt?: string;
} & (
  | {
      conditionCheck: () => boolean;
      targetValue: number;
      currentValue: () => number;
    }
  | {
      conditionCheck: () => boolean;
      targetValue?: never;
      currentValue?: never;
    }
);

const missedWinsCondition = (minArticles: number) => {
  const gameState = useGameStore.getState();
  const missedWins = gameState.history.slice(0, -2).reduce((acc, el) => acc + el.winningLinks, 0);

  return missedWins === 0 && gameState.history.length - 1 >= minArticles;
};

export const ACHIEVEMENTS_LIST = [
  {
    id: "FirstWin",
    targetValue: 1,
    currentValue: () => useStatsStore.getState().wins,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "NoviceRunner",
    targetValue: 10,
    currentValue: () => useStatsStore.getState().wins,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "Speedster",
    targetValue: 25,
    currentValue: () => useStatsStore.getState().wins,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "WikiExplorer",
    targetValue: 50,
    currentValue: () => useStatsStore.getState().wins,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "SpeedDemon",
    targetValue: 100,
    currentValue: () => useStatsStore.getState().wins,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "MasterRunner",
    targetValue: 250,
    currentValue: () => useStatsStore.getState().wins,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "WikipediaChampion",
    targetValue: 500,
    currentValue: () => useStatsStore.getState().wins,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "SpeedrunAddict",
    targetValue: 1000,
    currentValue: () => useStatsStore.getState().wins,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "WikipediaLegend",
    targetValue: 2500,
    currentValue: () => useStatsStore.getState().wins,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "SpeedrunGod",
    targetValue: 5000,
    currentValue: () => useStatsStore.getState().wins,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "AttentiveExplorer",
    conditionCheck: () => missedWinsCondition(10),
    unlocked: false,
  },
  {
    id: "KeenPathfinder",
    conditionCheck: () => missedWinsCondition(25),
    unlocked: false,
  },
  {
    id: "SharpNavigator",
    conditionCheck: () => missedWinsCondition(50),
    unlocked: false,
  },
  {
    id: "ExplorerOfChance",
    targetValue: 10,
    currentValue: () =>
      useStatsStore.getState().single_random_pressed +
      useStatsStore.getState().multiple_random_pressed,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "FortuneSeeker",
    targetValue: 100,
    currentValue: () =>
      useStatsStore.getState().single_random_pressed +
      useStatsStore.getState().multiple_random_pressed,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "GachaAddict",
    targetValue: 1000,
    currentValue: () =>
      useStatsStore.getState().single_random_pressed +
      useStatsStore.getState().multiple_random_pressed,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "GachaOverlord",
    targetValue: 10000,
    currentValue: () =>
      useStatsStore.getState().single_random_pressed +
      useStatsStore.getState().multiple_random_pressed,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "Curiosity",
    targetValue: 1,
    currentValue: () => useStatsStore.getState().article_preview_pressed,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "CuriousExplorer",
    targetValue: 100,
    currentValue: () => useStatsStore.getState().article_preview_pressed,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "PreviewEnthusiast",
    targetValue: 1000,
    currentValue: () => useStatsStore.getState().article_preview_pressed,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "InsatiablesReader",
    targetValue: 10000,
    currentValue: () => useStatsStore.getState().article_preview_pressed,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "Bilingual",
    targetValue: 2,
    currentValue: () => useStatsStore.getState().known_wiki_languages.length,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "Trilingual",
    targetValue: 3,
    currentValue: () => useStatsStore.getState().known_wiki_languages.length,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "Polyglot",
    targetValue: 5,
    currentValue: () => useStatsStore.getState().known_wiki_languages.length,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "EgoStroke",
    conditionCheck: () => {
      const gameState = useGameStore.getState();
      return gameState.endingArticle.pageid === "63249569";
    },
    unlocked: false,
    imgUrl: "/ludwig-ahgren.webp",
    imgAlt: "Ludwig Ahgren",
  },
  {
    id: "SpeedrunWaifu",
    conditionCheck: () => {
      const gameState = useGameStore.getState();
      return gameState.endingArticle.pageid === "800";
    },
    unlocked: false,
    imgUrl: "/wiki-waifu.png",
  },
] as const satisfies readonly Achievement[];

// for getting a function for condition (based on its id)
// eslint-disable-next-line @typescript-eslint/ban-types
const init = {} as Record<
  // eslint-disable-next-line @typescript-eslint/ban-types
  (typeof ACHIEVEMENTS_LIST)[number]["id"] | (string & {}),
  () => boolean
>;
export const achivementConditionCheckByIdMap = ACHIEVEMENTS_LIST.reduce(
  (acc, achievement) => ({
    ...acc,
    [achievement.id]: achievement.conditionCheck.bind(achievement),
  }),
  init
);
