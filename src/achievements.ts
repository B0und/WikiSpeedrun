import { useGameStore } from "./stores/GameStore";
import { useStatsStore } from "./stores/StatisticsStore";

export type Achievement =
  | {
      title: string;
      description: string;
      unlocked: boolean;
      id: string;
      conditionCheck: () => boolean;
      targetValue: number;
      currentValue: () => number;
    }
  | {
      title: string;
      description: string;
      unlocked: boolean;
      id: string;
      conditionCheck: () => boolean;
      targetValue?: never;
      currentValue?: never;
    };

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
  // {
  //   title: "Speedster",
  //   description: "Reach your destination article in less than 10 clicks and 2 minutes.",
  //   conditionId: "winsGreaterThan0",
  //   unlocked: false,
  //   image: "",
  //   imageAlt: "A stopwatch with wings, symbolizing speed.",
  // },
  // {
  //   title: "Efficient Explorer",
  //   description: "Reach your destination article in the fewest clicks possible.",
  //   conditionId: "winsGreaterThan0",
  //   unlocked: false,
  //   image: "",
  //   imageAlt: "A map with a direct path between the start and destination points.",
  // },
  // {
  //   title: "Lightning Linker",
  //   description: "Complete a journey in less than 30 seconds.",
  //   conditionId: "winsGreaterThan0",
  //   unlocked: false,
  //   image: "",
  //   imageAlt: "A lightning bolt connecting two articles.",
  // },
  // {
  //   title: "Speed of Light",
  //   description: "Finish a journey with an average of less than 5 seconds per click.",
  //   conditionId: "winsGreaterThan0",
  //   unlocked: false,
  //   image: "",
  //   imageAlt: "A shining star traveling at high speed.",
  // },
  // {
  //   title: "Fast Fingers",
  //   description: "Complete a journey with an average of less than 2 seconds per click.",
  //   conditionId: "winsGreaterThan0",
  //   unlocked: false,
  //   image: "",
  //   imageAlt: "A hand typing at lightning speed.",
  // },
  // {
  //   title: "Turbo Tracker",
  //   description: "Complete 100 journeys with an average speed of less than 10 seconds per click.",
  //   conditionId: "winsGreaterThan0",
  //   unlocked: false,
  //   image: "",
  //   imageAlt: "A turbocharged car racing towards the destination article.",
  // },
  // {
  //   title: "One-Click Wonder",
  //   description: "Reach your destination article in a single click.",
  //   conditionId: "winsGreaterThan0",
  //   unlocked: false,
  //   image: "",
  //   imageAlt: "A finger pressing a button with a target symbol.",
  // },
  // {
  //   title: "Language Luminary",
  //   description:
  //     "Complete a journey by navigating through articles in a language other than your native tongue.",
  //   conditionId: "winsGreaterThan0",
  //   unlocked: false,
  //   image: "",
  //   imageAlt: "Flags of different countries with articles flowing between them.",
  // },
  // {
  //   title: "Trailblazer",
  //   description:
  //     "Successfully complete 25 journeys through newly created or recently edited articles.",
  //   conditionId: "winsGreaterThan0",
  //   unlocked: false,
  //   image: "",
  //   imageAlt: "A footstep leaving a trail of edits.",
  // },
  // ] as const satisfies readonly Achievement[];
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

/*

Both articles were random - stat

Speedster
Description: Reach your destination article in less than 10 clicks and 2 minutes.
Image: A stopwatch with wings, symbolizing speed.

Efficient Explorer
Description: Reach your destination article in the fewest clicks possible.
Image: A map with a direct path between the start and destination points.

Lightning Linker
Description: Complete a journey in less than 30 seconds.
Image: A lightning bolt connecting two articles.

Speed of Light
Description: Finish a journey with an average of less than 5 seconds per click.
Image: A shining star traveling at high speed.

Fast Fingers
Description: Complete a journey with an average of less than 2 seconds per click.
Image: A hand typing at lightning speed.

Turbo Tracker
Description: Complete 100 journeys with an average speed of less than 10 seconds per click.
Image: A turbocharged car racing towards the destination article.

One-Click Wonder
Description: Reach your destination article in a single click.
Image: A finger pressing a button with a target symbol.

Hyperlink Hero
Description: Navigate through 100 articles by following only the hyperlinks within each article.
Image: A chain-link representing interconnected articles.

Wiki Wizard
Description: Complete a journey using keyboard shortcuts only.
Image: A wizard's hat with keyboard keys as symbols.

Language Luminary
Description: Complete a journey by navigating through articles in a language other than your native tongue.
Image: Flags of different countries with articles flowing between them.

Trailblazer
Description: Successfully complete 25 journeys through newly created or recently edited articles.
Image: A footstep leaving a trail of edits.


Achievement Title: Elite Conqueror
Description: Win 50 games in the speedrun category.
Image: A golden crown symbolizing elite achievement.

Achievement Title: Master Speedrunner
Description: Win 100 games in the speedrun category.
Image: A lightning bolt with a "100" emblem.

Achievement Title: Legendary Victor
Description: Win 500 games in the speedrun category.
Image: A mythical creature holding a banner with "500" inscribed on it.
 */
