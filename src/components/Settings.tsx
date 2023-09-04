import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useArticles, useGameStoreActions } from "../GameStore";
import ArticleAutocomplete from "./ArticleAutocomplete/ArticleAutocomplete";
import RandomButton from "./RandomButton/RandomButton";
import { getNHighestLinksPages, handleOnRandomSuccess } from "./Settings.helpers";
import { useStopwatchActions } from "./StopwatchContext";
import { useResetGame } from "../hooks/useResetGame";
import { useI18nContext } from "../i18n/i18n-react";
import { WikiLanguageSelect } from "./WikiLanguageSelect";
import { toast } from "react-hot-toast";
import ArticlePreview from "./ArticlePreview/ArticlePreview";
import { RandomModal } from "./RandomModal";
import { Article } from "../GameStore";

const Settings = () => {
  const { LL } = useI18nContext();
  const navigate = useNavigate();
  const { startStopwatch } = useStopwatchActions();
  const { setIsGameRunning, setArticles, addHistoryArticle } =
    useGameStoreActions();
  const articles = useArticles();
  const resetGame = useResetGame();
  const [modalData, setModalData] = useState<Article[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const setArticle = (index: number) => {
    return (article: Article) => {
      const newArticles = [...articles];
      newArticles[index] = article;
      setArticles(newArticles);
    };
  };
  const [modalFunction, setModalFunction] = useState({ fn: setArticle(0) });

  const randomFailText = LL.RANDOM_FAIL();
  const copyNotification = () => toast.success(LL.LINK_COPIED(), { position: "top-center" });

  const addArticle = () => {
    setArticles([...articles, { pageid: "", title: "" }]);
  };

  const removeArticle = (index: number) => {
    return () => {
      const newArticles = [...articles];
      newArticles.splice(index, 1);
      setArticles(newArticles);
    };
  };


  const startGameHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await resetGame();
    addHistoryArticle({
      title: articles[0].title,
      time: {
        min: "00",
        sec: "00",
        ms: "000",
      },
      winningLinks: 0,
    });
    navigate("/wiki");
    startStopwatch();
    setIsGameRunning(true);
  };

  return (
    <div>
      <h3 className="border-b-[1px] border-secondary-border text-2xl ">{LL.SETTINGS()}</h3>
      <p className="pb-8 pt-4 dark:text-dark-primary">{LL.SETTINGS_DESCRIPTION()}</p>

      <form className="flex max-w-[650px] flex-col gap-4" onSubmit={startGameHandler}>
        <WikiLanguageSelect />
        <RandomModal
          data={modalData}
          open={modalOpen}
          setOpen={setModalOpen}
          setArticle={modalFunction.fn}
        />
        <button className="border w-40" onClick={addArticle}>Add Article</button>
        {articles.map((article, index) => (

          <div key={index} className="flex items-end gap-2 sm:gap-0">
            <ArticleAutocomplete
              label={LL.STARTING_ARTICLE_LABEL()}
              placeholder={LL.INPUT_PLACEHOLDER()}
              required={true}
              onSelect={setArticle(index)}
              defaultValue={articles[index].title}
              selectId="startArticle"
            />
            <div className="flex gap-2 sm:gap-0 items-center">
              <ArticlePreview pageid={articles[index].pageid} />
              <RandomButton
                queryKey={`article${index}`}
                onSuccess={(data) => {
                  handleOnRandomSuccess({
                    data,
                    setArticle: setArticle(index),
                    failText: randomFailText,
                  });
                }}
              />
              <RandomButton
                queryKey={`article${index}multiple`}
                randomCount={5}
                onSuccess={(data) => {
                  setModalFunction({ fn: setArticle(index) });
                  setModalOpen(true);
                  const articles = getNHighestLinksPages(data, 5);
                  if (articles) {
                    setModalData(articles);
                  }
                }}
              />
              {articles.length > 2 && (
                <button onClick={removeArticle(index)}>X</button>
              )}
            </div>
          </div>
        ))}

        <div className="flex flex-wrap gap-8">
          <button
            type="button"
            className="mt-4 w-fit border-b-[1px] border-b-transparent py-3 hover:border-b-primary-blue focus-visible:border-b-primary-blue"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              copyNotification();
            }}
          >
            {LL.SHARE_SETTINGS()}
          </button>
          <button
            type="submit"
            className="mt-4 w-fit bg-secondary-blue px-10 py-3 hover:bg-primary-blue"
          >
            {LL.PLAY()}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
