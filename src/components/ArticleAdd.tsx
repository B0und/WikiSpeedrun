import { useGameStoreActions, useArticles } from "../GameStore";
import { useI18nContext } from "../i18n/i18n-react";

export default function ArticleAdd() {
  const { setArticles } = useGameStoreActions();
  const { LL } = useI18nContext();
  const articles = useArticles();

  const addArticle = () => {
    setArticles([...articles, { pageid: "", title: "" }]);
  };

  return (
    <button className="border max-w-fit rounded hover:border-primary-blue" onClick={addArticle} type="button">
      <span className="p-1 w-full flex justify-between">
        <p>{LL.ADD_ARTICLE()}</p>
        <p className="px-2">+</p>
      </span>
    </button>
  );
}