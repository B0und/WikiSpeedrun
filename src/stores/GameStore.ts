import { querystring } from "unbound-zustand-querystring";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { StopwatchProps } from "../components/StopwatchDisplay";

/*
Data partially synced with URL
*/

interface GameValues {
  history: ArticleHistory[];
  startingArticle: Article;
  endingArticle: Article;
  isGameRunning: boolean;
  cheatingAttempts: number;
  isWin: boolean;
  // Monotonic win identity: incremented on every win so UI can track
  // per-win interactions (e.g. dismissing the results dialog) across games,
  // which a derived value like history.length cannot identify uniquely.
  winCount: number;
}

interface Actions {
  actions: {
    setStartingArticle: (article: Article) => void;
    setEndingArticle: (article: Article) => void;
    setIsGameRunning: (flag: boolean) => void;
    addHistoryArticle: (article: ArticleHistory) => void;
    resetStoreState: () => void;
    increaseCheatingAttemptsCounter: () => void;
    setLastArticleWinningLinks: (links: number) => void;
    setIsWin: (isWin: boolean) => void;
  };
}

interface ArticleHistory {
  title: string;
  time: StopwatchProps;
  winningLinks: number;
}

export interface Article {
  title: string;
  pageid: string;
}

const initialState: Omit<GameValues, "startingArticle" | "endingArticle"> = {
  history: [],
  isGameRunning: false,
  cheatingAttempts: 0,
  isWin: false,
  winCount: 0,
};

type GameStore = GameValues & Actions;

export const useGameStore = create<GameStore>()(
  devtools(
    querystring(
      immer((set) => ({
        ...initialState,
        startingArticle: { pageid: "", title: "" }, // dont reset starting article
        endingArticle: { pageid: "", title: "" }, // dont reset ending article
        actions: {
          setStartingArticle: (article: Article) => {
            set(
              () => ({
                startingArticle: article,
              }),
              false,
              "setStartingArticle",
            );
          },
          setEndingArticle: (article: Article) => {
            set(
              () => ({
                endingArticle: article,
              }),
              false,
              "setEndingArticle",
            );
          },
          setIsGameRunning: (flag: boolean) => {
            set(
              (state) => {
                state.isGameRunning = flag;
              },
              false,
              "setIsGameRunning",
            );
          },
          addHistoryArticle: (article: ArticleHistory) => {
            set(
              (state) => {
                // without this, first article will be slightly later than 0
                if (state.history.length === 0) {
                  article.time.ms = "000";
                }
                state.history.push(article);
              },
              false,
              "addHistoryArticle",
            );
          },
          resetStoreState: () => {
            set(
              // winCount is preserved: it is a monotonic win identity, not
              // game state (resetting it would let a dismissed win in one
              // game suppress the results dialog of a later win).
              (state) => ({ ...initialState, history: [], winCount: state.winCount }),
              false,
              "resetGame",
            );
          },
          increaseCheatingAttemptsCounter: () => {
            set(
              (state) => {
                state.cheatingAttempts += 1;
              },
              false,
              "increaseCheatingAttemptsCounter",
            );
          },
          setLastArticleWinningLinks: (links) => {
            set(
              (state) => {
                state.history[state.history.length - 1].winningLinks = links;
              },
              false,
              "setLastArticleWinningLinks",
            );
          },
          setIsWin: (isWin) => {
            set(
              (state) => {
                state.isWin = isWin;
                // New win identity for the results dialog; resetStoreState
                // clears it along with the rest of the game state.
                if (isWin) {
                  state.winCount += 1;
                }
              },
              false,
              "setIsWin",
            );
          },
        },
      })),
      {
        // save to URL if specified as true
        select(pathname) {
          const isWikiPage = pathname.startsWith("/wiki");

          return {
            history: isWikiPage,
            startingArticle: true,
            endingArticle: true,
            isGameRunning: false,
            cheatingAttempts: isWikiPage,
            isWin: false,
          };
        },
      },
    ),
    {
      name: "game-store",
    },
  ),
);

export const useGameStoreActions = () => useGameStore((state) => state.actions);
export const useIsGameRunning = () => useGameStore((state) => state.isGameRunning);
export const useStartingArticle = () => useGameStore((state) => state.startingArticle);
export const useEndingArticle = () => useGameStore((state) => state.endingArticle);
export const useHistory = () => useGameStore((state) => state.history);
export const useClicks = () =>
  useGameStore((state) => (state.history.length > 1 ? state.history.length - 1 : 0));
export const useIsWin = () => useGameStore((state) => state.isWin);
export const useWinCount = () => useGameStore((state) => state.winCount);

export const useCheatingAttempts = () => useGameStore((state) => state.cheatingAttempts);
