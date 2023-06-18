import { useStatsStore } from "./stores/StatisticsStore";

type ConditionParams = {
  winsGreaterThanN: { wins: number };
  // Add more condition keys and their parameter types here
};

const conditionFunctions = {
  winsGreaterThan0: () => useStatsStore.getState().wins > 0,
  winsGreaterThanN: (conditionParams: Record<"wins", number>) =>
    useStatsStore.getState().wins >= conditionParams.wins,
  totalRunsGreaterThanFive: () => useStatsStore.getState().totalRuns > 0,
} as const;

type ConditionId = keyof typeof conditionFunctions;
export interface Achievement<T extends ConditionId = ConditionId> {
  title: string;
  description: string;
  unlocked: boolean;
  conditionId: T;
  conditionParams?: T extends keyof ConditionParams ? ConditionParams[T] : undefined;
  condition?: (
    conditionParams: T extends keyof ConditionParams ? ConditionParams[T] : undefined
  ) => void;
  image: string;
  imageAlt: string;
}

export const achievements = [
  {
    title: "First W",
    description: "Get your first win",
    conditionId: "winsGreaterThan0",
    unlocked: false,
    image: "",
    imageAlt: "asd",
  },
  {
    title: "Rookie Champion",
    description: "Win 10 games",
    conditionId: "winsGreaterThanN",
    conditionParams: {
      wins: 10,
    },
    unlocked: false,
    image: "",
    imageAlt: 'A trophy with a "10" emblem.',
  },
  {
    title: "Seasoned Victor",
    description: "Win 25 games",
    conditionId: "winsGreaterThanN",
    conditionParams: {
      wins: 25,
    },
    unlocked: false,
    image: "",
    imageAlt: "vvv",
  },
] satisfies Achievement[];

// Retrieve the condition function based on the ID
export function getConditionFunction(id: ConditionId) {
  return conditionFunctions[id];
}

/**
 * 
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
 */
