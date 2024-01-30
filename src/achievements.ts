import { useStatsStore } from "./stores/StatisticsStore";

export interface Achievement {
  title: string;
  description: string;
  unlocked: boolean;
  id: string;
  conditionCheck: () => boolean;
  image: string;
  imageAlt: string;
}

export const ACHIEVEMENTS_LIST = [
  {
    title: "First W",
    description: "Get your first win",
    id: "FirstWin",
    conditionCheck: () => useStatsStore.getState().wins > 0,
    unlocked: false,
    image: "FirstWin",
    imageAlt: "FirstWin alt",
  },

  {
    title: "3 Third WWW",
    description: "Get your 3rd win",
    id: "ThirdWin",
    conditionCheck: () => useStatsStore.getState().wins === 3,
    unlocked: false,
    image: "3Win",
    imageAlt: "3Win alt",
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
  //   title: "Hyperlink Hero",
  //   description:
  //     "Navigate through 100 articles by following only the hyperlinks within each article.",
  //   conditionId: "winsGreaterThan0",
  //   unlocked: false,
  //   image: "",
  //   imageAlt: "A chain-link representing interconnected articles.",
  // },
  // {
  //   title: "Wiki Wizard",
  //   description: "Complete a journey using keyboard shortcuts only.",
  //   conditionId: "winsGreaterThan0",
  //   unlocked: false,
  //   image: "",
  //   imageAlt: "A wizard's hat with keyboard keys as symbols.",
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
    [achievement.id]: achievement.conditionCheck,
  }),
  init
);

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
