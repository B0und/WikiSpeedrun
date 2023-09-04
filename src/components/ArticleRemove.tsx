import { useGameStoreActions, useArticles } from "../GameStore";

interface ArticleRemoveProps {
  index: number;
}

export default function ArticleRemove(props: ArticleRemoveProps) {
  const { setArticles } = useGameStoreActions();
  const articles = useArticles();
  const { index } = props;

  const removeArticle = (index: number) => {
    return () => {
      const newArticles = [...articles];
      newArticles.splice(index, 1);
      setArticles(newArticles);
    };
  };

  return <button onClick={removeArticle(index)} className="p-2 hover:text-primary-blue" type="button">✕</button>
}