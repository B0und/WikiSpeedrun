import { produce } from "immer";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { ACHIEVEMENTS_LIST, type Achievement, achievementConditionCheckByIdMap } from "../achievements";

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
type PersistedStore = Partial<Omit<StatsValues, "achievements">> & {
  achievements?: { id: string }[];
};

const persistedNumber = (value: unknown, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

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
          const stored = persistedState as PersistedStore | undefined;

          const unlockedAchievements = produce(currentState.achievements, (draftState) => {
            (stored?.achievements ?? []).forEach((storageAchievement) => {
              const completedAchievement = draftState.find(
                (draftAchievement) => draftAchievement.id === storageAchievement.id,
              );
              if (completedAchievement) {
                completedAchievement.unlocked = true;
              }
            });
          });

          return {
            // Preserve defaults for fields missing from older or malformed
            // persisted state, including counters serialized as null.
            ...currentState,
            ...stored,
            actions: currentState.actions,
            achievements: unlockedAchievements,
            articles_clicked: persistedNumber(stored?.articles_clicked, currentState.articles_clicked),
            article_preview_pressed: persistedNumber(
              stored?.article_preview_pressed,
              currentState.article_preview_pressed,
            ),
            average_answer_time: persistedNumber(stored?.average_answer_time, currentState.average_answer_time),
            fastest_answer_time: persistedNumber(stored?.fastest_answer_time, currentState.fastest_answer_time),
            single_random_pressed: persistedNumber(stored?.single_random_pressed, currentState.single_random_pressed),
            multiple_random_pressed: persistedNumber(
              stored?.multiple_random_pressed,
              currentState.multiple_random_pressed,
            ),
            slowest_answer_time: persistedNumber(stored?.slowest_answer_time, currentState.slowest_answer_time),
            total_runs: persistedNumber(stored?.total_runs, currentState.total_runs),
            wins: persistedNumber(stored?.wins, currentState.wins),
            missed_wins: persistedNumber(stored?.missed_wins, currentState.missed_wins),
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
    const conditionFn = achievementConditionCheckByIdMap[achievement.id];
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
