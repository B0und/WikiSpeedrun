import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { type Achievement, ACHIEVEMENTS_LIST, achivementConditionCheckByIdMap } from "../achievements";
import { produce } from "immer";
/*
Data gets persisted in local storage
*/

interface Actions {
  actions: {
    increaseTotalRuns: () => void;
    increaseWins: () => void;
    increaseSingleRandomPressed: () => void;
    increaseMultipleRandomPressed: () => void;
    increaseArticlePreviewPressed: () => void;
    addKnownLanguage: (newLanguage: string) => void;
    increaseArticlesClicked: (amount: number) => void;
    unlockAchievements: (unlockedAchievements: Achievement[]) => void;
  };
}

export interface StatsValues {
  total_runs: number;
  wins: number;
  articles_clicked: number;
  single_random_pressed: number; // random 1 button
  multiple_random_pressed: number; // random 5 button
  article_preview_pressed: number;
  known_wiki_languages: string[];
  average_answer_time: number;
  fastest_answer_time: number;
  slowest_answer_time: number;
  missed_wins: number; // # of winning article links that you missed
  achievements: readonly Achievement[];
}

const initialState: StatsValues = {
  articles_clicked: 0,
  article_preview_pressed: 0,
  average_answer_time: 0,
  fastest_answer_time: 0,
  known_wiki_languages: [],
  single_random_pressed: 0,
  multiple_random_pressed: 0,
  slowest_answer_time: 0,
  total_runs: 0,
  wins: 0,
  missed_wins: 0,
  achievements: ACHIEVEMENTS_LIST,
};

// save IDs of unlocked achievements in local storage
interface PersistedStore extends Omit<StatsValues, "achievements"> {
  achievements: { id: string }[];
}

type StatsStore = StatsValues & Actions;

export const useStatsStore = create<StatsStore>()(
  devtools(
    persist(
      immer((set, _get) => ({
        ...initialState,

        actions: {
          increaseTotalRuns: () => {
            set(
              (state) => {
                state.total_runs += 1;
              },
              false,
              "increaseTotalRuns",
            );
          },
          increaseWins: () => {
            set(
              (state) => {
                state.wins += 1;
              },
              false,
              "increaseWins",
            );
          },
          increaseSingleRandomPressed: () => {
            set(
              (state) => {
                state.single_random_pressed += 1;
              },
              false,
              "increaseSingleRandomPressed",
            );
          },
          increaseMultipleRandomPressed: () => {
            set(
              (state) => {
                state.multiple_random_pressed += 1;
              },
              false,
              "increaseMultipleRandomPressed",
            );
          },
          increaseArticlePreviewPressed: () => {
            set(
              (state) => {
                state.article_preview_pressed += 1;
              },
              false,
              "increaseArticlePreviewPressed",
            );
          },
          addKnownLanguage: (newLanguage) => {
            set(
              (state) => {
                state.known_wiki_languages.push(newLanguage);
                state.known_wiki_languages = [...new Set(state.known_wiki_languages)];
              },
              false,
              "addKnownLanguage",
            );
          },
          increaseArticlesClicked: (amount) => {
            set(
              (state) => {
                state.articles_clicked += amount;
              },
              false,
              "increaseArticleClicked",
            );
          },
          unlockAchievements: (unlockedAchievements) => {
            set(
              (state) => {
                for (const achievement of state.achievements) {
                  if (unlockedAchievements.some((u) => achievement.id === u.id)) {
                    achievement.unlocked = true;
                  }
                }
              },
              false,
              "unlockAchievements",
            );
          },
        },
      })),
      {
        name: "statistics",
        storage: createJSONStorage(() => localStorage),

        partialize: ({ actions: _, ...rest }: StatsStore) => {
          return {
            ...rest,
            achievements: rest.achievements.filter((a) => a.unlocked).map((a) => ({ id: a.id })),
          };
        },

        // called when page loads, merging local storage with current state
        merge: (persistedState, currentState) => {
          const typedPersistedState = persistedState as PersistedStore;

          const unlockedAchievements = produce(currentState.achievements, (draftState) => {
            typedPersistedState.achievements.forEach((storageAchievement) => {
              const completedAchievement = draftState.find(
                (draftAchievement) => draftAchievement.id === storageAchievement.id,
              );
              if (completedAchievement) {
                completedAchievement.unlocked = true;
              }
            });
          });

          return {
            ...typedPersistedState,
            actions: currentState.actions,
            achievements: unlockedAchievements,
          };
        },
      },
    ),
    {
      name: "statistics-store",
    },
  ),
);

export const checkAchievements = (achievements: readonly Achievement[]) => {
  return achievements.filter((achievement) => {
    const conditionFn = achivementConditionCheckByIdMap[achievement.id];
    return !achievement.unlocked && conditionFn();
  });
};

export const useStatsStoreActions = () => useStatsStore((state) => state.actions);
export const useArticleClicks = () => useStatsStore((state) => state.articles_clicked);
export const useArticlePreviewPressed = () => useStatsStore((state) => state.article_preview_pressed);
export const useAverageAnswerTime = () => useStatsStore((state) => state.average_answer_time);
export const useFastestAnswerTime = () => useStatsStore((state) => state.fastest_answer_time);
export const useKnownWikiLanguages = () => useStatsStore((state) => state.known_wiki_languages);
export const useRandom1Pressed = () => useStatsStore((state) => state.single_random_pressed);
export const useRandom5Pressed = () => useStatsStore((state) => state.multiple_random_pressed);
export const useSlowestAnswerTime = () => useStatsStore((state) => state.slowest_answer_time);
export const useTotalRuns = () => useStatsStore((state) => state.total_runs);
export const useWins = () => useStatsStore((state) => state.wins);
export const useAchievements = () => useStatsStore((state) => state.achievements);
