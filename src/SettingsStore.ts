import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

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
interface SettingsStore {
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
  isGameRunning: false,
};

const useSettingsStore = create<SettingsStore>()(
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
          set((state) => ({ history: [...state.history, article] }), false, 'addHistoryArticle'),
      },
    }),
    {
      name: 'settings-storage',
    }
  )
);

export const useSettingsStoreActions = () => useSettingsStore((state) => state.actions);
export const useIsGameRunning = () => useSettingsStore((state) => state.isGameRunning);
export const useStartingArticle = () => useSettingsStore((state) => state.startingArticle);
export const useEndingArticle = () => useSettingsStore((state) => state.endingArticle);
