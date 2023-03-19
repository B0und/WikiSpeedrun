import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/*
 This file is only for runtime data that gets erased of webpage restart 
*/

interface Actions {
  setStartingArticle: (article: string) => void;
  setEndingArticle: (article: string) => void;
  setIsGameRunning: (flag: boolean) => void;
  addHistoryArticle: (article: ArticleHistory) => void;
}

interface ArticleHistory {
  title: string;
  time: string;
}
interface GameStore {
  actions: Actions;
  history: ArticleHistory[];
  startingArticle: string;
  endingArticle: string;
  isGameRunning: boolean;
}

const initialState = {
  history: [],
  startingArticle: '',
  endingArticle: '',
  currentArticle: '',
  isGameRunning: false,
};

const useGameStore = create<GameStore>()(
  devtools(
    (set) => ({
      ...initialState,
      actions: {
        setStartingArticle: (title: string) =>
          set(() => ({ startingArticle: title }), false, 'setStartingArticle'),
        setEndingArticle: (title: string) =>
          set(() => ({ endingArticle: title }), false, 'setEndingArticle'),
        setIsGameRunning: (flag: boolean) =>
          set(() => ({ isGameRunning: flag }), false, 'setIsGameRunning'),
        addHistoryArticle: (article: ArticleHistory) =>
          set(
            (state) => {
              // without this, first article will be slightly later than 0
              if (state.history.length === 0) {
                article.time = '00:00.000';
              }
              return { history: [...state.history, article] };
            },
            false,
            'addHistoryArticle'
          ),
      },
    }),
    {
      name: 'game-store',
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
    return state.endingArticle === currentArticle;
  });
