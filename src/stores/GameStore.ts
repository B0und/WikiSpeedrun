import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { StopwatchProps } from "../components/StopwatchDisplay";
import { querystring } from "zustand-querystring";
import { immer } from "zustand/middleware/immer";

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
              "setStartingArticle"
            );
          },
          setEndingArticle: (article: Article) => {
            set(
              () => ({
                endingArticle: article,
              }),
              false,
              "setEndingArticle"
            );
          },
          setIsGameRunning: (flag: boolean) => {
            set(
              (state) => {
                state.isGameRunning = flag;
              },
              false,
              "setIsGameRunning"
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
              "addHistoryArticle"
            );
          },
          resetStoreState: () => {
            set(() => ({ ...initialState, history: [] }), false, "resetGame");
          },
          increaseCheatingAttemptsCounter: () => {
            set(
              (state) => {
                state.cheatingAttempts += 1;
              },
              false,
              "increaseCheatingAttemptsCounter"
            );
          },
          setLastArticleWinningLinks: (links) => {
            set(
              (state) => {
                state.history[state.history.length - 1].winningLinks = links;
              },
              false,
              "setLastArticleWinningLinks"
            );
          },
          setIsWin: (isWin) => {
            set(
              (state) => {
                state.isWin = isWin;
              },
              false,
              "setIsWin"
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
export const useCurrentArticle = () => useGameStore((state) => state.history.slice(-1)[0]?.title);
export const useIsWin = () => useGameStore((state) => state.isWin);

export const useCheatingAttempts = () => useGameStore((state) => state.cheatingAttempts);
