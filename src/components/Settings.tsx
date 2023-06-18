import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEndingArticle, useGameStoreActions, useStartingArticle } from "../stores/GameStore";
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
import { Article } from "../stores/GameStore";
import { useStatsStoreActions } from "../stores/StatisticsStore";
import { achievements } from "../achievements";
import { achievementToast } from "./AchievementNotification";

const Settings = () => {
  const { LL } = useI18nContext();
  const navigate = useNavigate();
  const { startStopwatch } = useStopwatchActions();
  const { setIsGameRunning, setStartingArticle, setEndingArticle, addHistoryArticle } =
    useGameStoreActions();
  const startArticle = useStartingArticle();
  const endArticle = useEndingArticle();
  const resetGame = useResetGame();
  const [modalData, setModalData] = useState<Article[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFunction, setModalFunction] = useState({ fn: setStartingArticle });
  const { increaseTotalRuns } = useStatsStoreActions();

  const randomFailText = LL.RANDOM_FAIL();
  const copyNotification = () => toast.success(LL.LINK_COPIED(), { position: "top-center" });

  const startGameHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await resetGame();
    addHistoryArticle({
      title: startArticle.title,
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
    increaseTotalRuns();
  };

  return (
    <div>
      <button
        onClick={() => {
          achievements.forEach((achievement, index) => {
            setTimeout(() => {
              achievementToast(achievement);
            }, index * 400);
          });
        }}
      >
        asaaaaaaaaaaaaaad
      </button>
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

        <div className="flex items-end gap-2 sm:gap-0">
          <ArticleAutocomplete
            label={LL.STARTING_ARTICLE_LABEL()}
            placeholder={LL.INPUT_PLACEHOLDER()}
            required={true}
            onSelect={setStartingArticle}
            defaultValue={startArticle.title}
            selectId="startArticle"
          />
          <ArticlePreview pageid={startArticle.pageid} />
          <RandomButton
            queryKey="startingArticle"
            onSuccess={(data) => {
              handleOnRandomSuccess({
                data,
                setArticle: setStartingArticle,
                failText: randomFailText,
              });
            }}
          />
          <RandomButton
            queryKey="startingArticleMultiple"
            randomCount={5}
            onSuccess={(data) => {
              setModalFunction({ fn: setStartingArticle });
              setModalOpen(true);
              const articles = getNHighestLinksPages(data, 5);
              if (articles) {
                setModalData(articles);
              }
            }}
          />
        </div>

        <div className="flex items-end gap-2 sm:gap-0">
          <ArticleAutocomplete
            label={LL.ENDING_ARTICLE_LABEL()}
            placeholder={LL.INPUT_PLACEHOLDER()}
            required={true}
            onSelect={setEndingArticle}
            defaultValue={endArticle.title}
            selectId="startArticle"
          />
          <ArticlePreview pageid={endArticle.pageid} />
          <RandomButton
            queryKey="endingArticle"
            onSuccess={(data) => {
              handleOnRandomSuccess({
                data,
                setArticle: setEndingArticle,
                failText: randomFailText,
              });
            }}
          />
          <RandomButton
            queryKey="endingArticleMultiple"
            randomCount={5}
            onSuccess={(data) => {
              setModalFunction({ fn: setEndingArticle });
              setModalOpen(true);
              const articles = getNHighestLinksPages(data, 5);
              if (articles) {
                setModalData(articles);
              }
            }}
          />
        </div>

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
