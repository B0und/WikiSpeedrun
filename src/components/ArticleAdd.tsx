import { useGameStoreActions, useArticles } from "../GameStore";

export default function ArticleAdd() {
  const { setArticles } = useGameStoreActions();
  const articles = useArticles();

  const addArticle = () => {
    setArticles([...articles, { pageid: "", title: "" }]);
  };

  return (
    <button className="border w-40 rounded hover:border-primary-blue" onClick={addArticle} type="button">
      <span className="p-1 w-full flex justify-between">
        <p>Add Article</p>
        <p className="pr-2">+</p>
      </span>
    </button>
  );
}