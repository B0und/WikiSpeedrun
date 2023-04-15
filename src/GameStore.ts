import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { StopwatchProps } from "./components/StopwatchDisplay";
import { querystring } from "zustand-querystring";
import { immer } from "zustand/middleware/immer";

/*
 Data partially synced with URL
*/

interface Actions {
  setStartingArticle: (article: Article) => void;
  setEndingArticle: (article: Article) => void;
  setIsGameRunning: (flag: boolean) => void;
  addHistoryArticle: (article: ArticleHistory) => void;
  resetStoreState: () => void;
  increaseCheatingAttemptsCounter: () => void;
}

interface ArticleHistory {
  title: string;
  time: StopwatchProps;
}

export interface Article {
  title: string;
  pageid: string;
}
interface GameStore {
  actions: Actions;
  history: ArticleHistory[];
  startingArticle: Article;
  endingArticle: Article;
  isGameRunning: boolean;
  cheatingAttempts: number;
}

const initialState = {
  history: [],
  isGameRunning: false,
  cheatingAttempts: 0,
};

const useGameStore = create<GameStore>()(
  devtools(
    querystring(
      immer((set) => ({
        ...initialState,
        startingArticle: { pageid: "", title: "" },
        endingArticle: { pageid: "", title: "" },
        actions: {
          setStartingArticle: (article: Article) =>
            set(
              () => ({
                startingArticle: article,
              }),
              false,
              "setStartingArticle"
            ),
          setEndingArticle: (article: Article) =>
            set(
              () => ({
                endingArticle: article,
              }),
              false,
              "setEndingArticle"
            ),
          setIsGameRunning: (flag: boolean) =>
            set(
              (state) => {
                state.isGameRunning = flag;
              },
              false,
              "setIsGameRunning"
            ),
          addHistoryArticle: (article: ArticleHistory) =>
            set(
              (state) => {
                // without this, first article will be slightly later than 0
                if (state.history.length === 0) {
                  article.time.ms = "000";
                }
                state.history.push(article);
              },
              false,
              "addHistoryArticle"
            ),
          resetStoreState: () => set(() => ({ ...initialState, history: [] }), false, "resetGame"),
          increaseCheatingAttemptsCounter: () =>
            set(
              (state) => {
                state.cheatingAttempts += 1;
              },
              false,
              "increaseCheatingAttemptsCounter"
            ),
        },
      })),
      {
        select(pathname) {
          const isWikiPage = pathname.startsWith("/wiki");

          return {
            history: isWikiPage,
            startingArticle: true,
            endingArticle: true,
            isGameRunning: false,
            cheatingAttempts: isWikiPage,
          };
        },
      }
    ),
    {
      name: "game-store",
    }
  )
);

export const useGameStoreActions = () => useGameStore((state) => state.actions);
export const useIsGameRunning = () => useGameStore((state) => state.isGameRunning);
export const useStartingArticle = () => useGameStore((state) => state.startingArticle);
export const useEndingArticle = () => useGameStore((state) => state.endingArticle);
export const useHistory = () => useGameStore((state) => state.history);
export const useClicks = () =>
  useGameStore((state) => (state.history.length > 1 ? state.history.length - 1 : 0));
export const useCurrentArticle = () => useGameStore((state) => state.history.slice(-1)?.[0]?.title);
export const useIsWin = () =>
  useGameStore((state) => {
    const currentArticle = state.history.slice(-1)?.[0]?.title;
    return state.endingArticle.title === currentArticle;
  });

export const useCheatingAttempts = () => useGameStore((state) => state.cheatingAttempts);
