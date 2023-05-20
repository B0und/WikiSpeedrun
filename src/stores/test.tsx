import { create } from "zustand";

interface StoreApi<S> {
  currentArticle: string;
  targetArticle: string;
  clicks: number;
  time: number;
  achievements: {
    name: string;
    condition: (state: S) => boolean;
  }[];
}

const store = create((set) => ({
  currentArticle: "",
  targetArticle: "",
  clicks: 0,
  time: 0,
  achievements: [
    {
      name: "Reach the target Wikipedia article in 10 clicks or less.",
      condition: (state) => state.clicks <= 10,
    },
    {
      name: "Reach the target Wikipedia article in under 10 seconds.",
      condition: (state) => state.time <= 10000,
    },
    {
      name: "Reach the target Wikipedia article without clicking on any links.",
      condition: (state) => state.clicks === 0,
    },
    {
      name: "Reach the target Wikipedia article by clicking on links that are related to the current article.",
      condition: (state) => state.currentArticle === state.targetArticle,
    },
  ],
}));

const useAchievements = () => {
  const store = useStore(store);

  const getAchievements = () => {
    const achievements = store.achievements;

    achievements.forEach((achievement) => {
      if (achievement.achieved) {
        // Display achievement
        alert(`Achievement unlocked: ${achievement.name}`);
      }
    });
  };

  return {
    getAchievements,
  };
};

const App = () => {
  const { getAchievements } = useAchievements();

  return (
    <div>
      <h1>Wiki Speedrun</h1>
      <button onClick={() => getAchievements()}>Check Achievements</button>
    </div>
  );
};

export default App;
