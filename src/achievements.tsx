import { InaDescription } from "./components/InaDescription";
import { useGameStore } from "./stores/GameStore";
import { useStatsStore } from "./stores/StatisticsStore";

export type Achievement = {
  title: string;
  description: React.ReactNode | JSX.Element;
  unlocked: boolean;
  id: string;
  imgUrl?: string;
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
    title: "First Victory",
    description: "Complete your first speedrun",
    targetValue: 1,
    currentValue: () => useStatsStore.getState().wins,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "NoviceRunner",
    title: "Novice Runner",
    description: "Win 10 speedruns",
    targetValue: 10,
    currentValue: () => useStatsStore.getState().wins,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "Speedster",
    title: "Speedster",
    description: "Win 25 speedruns",
    targetValue: 25,
    currentValue: () => useStatsStore.getState().wins,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "WikiExplorer",
    title: "Wiki Explorer",
    description: "Win 50 speedruns",
    targetValue: 50,
    currentValue: () => useStatsStore.getState().wins,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "SpeedDemon",
    title: "Speed Demon",
    description: "Win 100 speedruns",
    targetValue: 100,
    currentValue: () => useStatsStore.getState().wins,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "MasterRunner",
    title: "Master Runner",
    description: "Win 250 speedruns",
    targetValue: 250,
    currentValue: () => useStatsStore.getState().wins,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "WikipediaChampion",
    title: "Wikipedia Champion",
    description: "Win 500 speedruns",
    targetValue: 500,
    currentValue: () => useStatsStore.getState().wins,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "SpeedrunAddict",
    title: "Speedrun Addict",
    description: "Win 1000 speedruns",
    targetValue: 1000,
    currentValue: () => useStatsStore.getState().wins,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "WikipediaLegend",
    title: "Wikipedia Legend",
    description: "Win 2500 speedruns",
    targetValue: 2500,
    currentValue: () => useStatsStore.getState().wins,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "SpeedrunGod",
    title: "Speedrun God",
    description: "Win 5000 speedruns",
    targetValue: 5000,
    currentValue: () => useStatsStore.getState().wins,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  //////// missed wins
  {
    id: "AttentiveExplorer",
    title: "Attentive Explorer",
    description: "Navigate through at least 10 articles without missing the winning link",
    conditionCheck: () => missedWinsCondition(10),
    unlocked: false,
  },
  {
    id: "KeenPathfinder",
    title: "Keen Pathfinder",
    description: "Navigate through at least 25 articles without missing the winning link",
    conditionCheck: () => missedWinsCondition(25),
    unlocked: false,
  },
  {
    id: "SharpNavigator",
    title: "Sharp Navigator",
    description: "Navigate through at least 50 articles without missing the winning link",
    conditionCheck: () => missedWinsCondition(50),
    unlocked: false,
  },
  /////////////// Random selection
  {
    id: "ExplorerOfChance",
    title: "Explorer of Chance",
    description: `Select 10 random articles`,
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
    title: "Fortune Seeker",
    description: `Select 100 random articles`,
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
    title: "Gacha Addict",
    description: `Select 1000 random articles`,
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
    title: "Gacha Overlord",
    description: `Select 10000 random articles`,
    targetValue: 10000,
    currentValue: () =>
      useStatsStore.getState().single_random_pressed +
      useStatsStore.getState().multiple_random_pressed,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  /////// ARTICLE PREVIEW
  {
    id: "Curiosity",
    title: "Curiosity didn't kill the cat",
    description: `Preview an article`,
    targetValue: 1,
    currentValue: () => useStatsStore.getState().article_preview_pressed,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "CuriousExplorer",
    title: "Curious Explorer",
    description: `Preview 100 articles`,
    targetValue: 100,
    currentValue: () => useStatsStore.getState().article_preview_pressed,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "PreviewEnthusiast",
    title: "Preview Enthusiast",
    description: `Preview 1000 articles`,
    targetValue: 1000,
    currentValue: () => useStatsStore.getState().article_preview_pressed,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "InsatiablesReader",
    title: "Insatiable Reader",
    description: `Preview 10000 articles`,
    targetValue: 10000,
    currentValue: () => useStatsStore.getState().article_preview_pressed,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  ////////////// KNOWN LANGUAGES
  {
    id: "Bilingual",
    title: "Bilingual",
    description: `Explore articles in 2 different languages`,
    targetValue: 2,
    currentValue: () => useStatsStore.getState().known_wiki_languages.length,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "Trilingual",
    title: "Trilingual",
    description: `Explore articles in 3 different languages`,
    targetValue: 3,
    currentValue: () => useStatsStore.getState().known_wiki_languages.length,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "Polyglot",
    title: "Polyglot",
    description: `Explore articles in 5 different languages`,
    targetValue: 5,
    currentValue: () => useStatsStore.getState().known_wiki_languages.length,
    conditionCheck() {
      return this.currentValue() >= this.targetValue;
    },
    unlocked: false,
  },
  {
    id: "EgoStroke",
    title: "Ego Stroke",
    description: `Thank you for inspiring this whole project`,
    conditionCheck: () => {
      const gameState = useGameStore.getState();
      return gameState.endingArticle.pageid === "63249569";
    },
    unlocked: false,
    imgUrl: "/ludwig-ahgren.webp",
  },
  {
    id: "SpeedrunWaifu",
    title: "Wiki Speedrun Waifu",
    description: InaDescription,
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

const achievementsI18n = {};
ACHIEVEMENTS_LIST.forEach((achievement) => {
  // Create an object for each achievement with title and description fields
  achievementsI18n[achievement.id] = {
    title: achievement.title,
    description: achievement.description,
  };
});

console.log({ achievementsI18n });
