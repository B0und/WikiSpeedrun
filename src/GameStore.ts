import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { StopwatchProps } from "./components/StopwatchDisplay";
import { querystring } from "zustand-querystring";
import { immer } from "zustand/middleware/immer";

/*
 Data partially synced with URL
*/

interface Actions {
  setArticles: (articles: Article[]) => void;
  setTargetArticle: (index: number) => void;
  setIsGameRunning: (flag: boolean) => void;
  addHistoryArticle: (article: ArticleHistory) => void;
  resetStoreState: () => void;
  increaseCheatingAttemptsCounter: () => void;
  setLastArticleWinningLinks: (links: number) => void;
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
interface GameStore {
  actions: Actions;
  history: ArticleHistory[];
  articles: Article[];
  targetArticle: number;
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
        articles: [{ pageid: "", title: "" },{ pageid: "", title: "" }],
        targetArticle: 1,
        actions: {
          setArticles: (articles: Article[]) =>
            set(
              (state) => {
                state.articles = articles;
              },
              false,
              "setArticles"
            ),
          setTargetArticle: (index: number) =>
            set(
              (state) => {
                state.targetArticle = index;
              },
              false,
              "setTargetArticle"
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
          setLastArticleWinningLinks: (links: number) =>
            set(
              (state) => {
                state.history[state.history.length - 1].winningLinks = links;
              },
              false,
              "setLastArticleWinningLinks"
            ),
        },
      })),
      {
        // save to URL if specified as true
        select(pathname) {
          const isWikiPage = pathname.startsWith("/wiki");

          return {
            history: isWikiPage,
            articles: true,
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
export const useArticles = () => useGameStore((state) => state.articles);
export const useTargetArticle = () => useGameStore((state) => state.targetArticle);
export const useHistory = () => useGameStore((state) => state.history);
export const useClicks = () =>
  useGameStore((state) => (state.history.length > 1 ? state.history.length - 1 : 0));
export const useCurrentArticle = () => useGameStore((state) => state.history.slice(-1)?.[0]?.title);
export const useIsWin = () =>
  useGameStore((state) => {
    const currentArticle = state.history.slice(-1)?.[0]?.title;
    if (state.articles[state.targetArticle]?.title === currentArticle){
      if (state.articles.length === state.targetArticle + 1) {
        return true;
      }
      else {
        state.actions.setTargetArticle(state.targetArticle + 1);
        return false;
      }
    }
    return false;
  });

export const useCheatingAttempts = () => useGameStore((state) => state.cheatingAttempts);
