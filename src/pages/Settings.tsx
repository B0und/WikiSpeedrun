import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEndingArticle, useGameStoreActions, useStartingArticle } from "../stores/GameStore";
import ArticleAutocomplete from "../components/ArticleAutocomplete/ArticleAutocomplete";
import RandomButton from "../components/RandomButton/RandomButton";
import { getNHighestLinksPages, handleOnRandomSuccess } from "../components/Settings.helpers";
import { useStopwatchActions } from "../components/StopwatchContext";
import { useResetGame } from "../hooks/useResetGame";
import { useI18nContext } from "../i18n/i18n-react";
import { WikiLanguageSelect } from "../components/WikiLanguageSelect";
import { toast } from "react-hot-toast";
import ArticlePreview from "../components/ArticlePreview/ArticlePreview";
import { RandomModal } from "../components/RandomModal";
import { Article } from "../stores/GameStore";
import { useStatsStoreActions } from "../stores/StatisticsStore";
import { useCheckAchievements } from "../hooks/useCheckAchievements";
import { useIsFetching } from "@tanstack/react-query";

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
  const { increaseTotalRuns, increaseSingleRandomPressed } = useStatsStoreActions();
  const isFetching = useIsFetching() > 0;

  useCheckAchievements({
    trackedStats: ["single_random_pressed", "multiple_random_pressed", "article_preview_pressed"],
  });

  const randomFailText = LL["Random failed, try again"]();
  const copyNotification = () =>
    toast.success(LL["Copied to clipboard"](), { position: "top-center" });

  const startGameHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetGame();
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
      <h2 className="border-b-[1px] border-secondary-border font-serif text-3xl">
        {LL.Settings()}
      </h2>

      <p className="pb-8 pt-4 dark:text-dark-primary">
        {LL[
          "Start typing and then select values from the dropdown list or press the random button"
        ]()}
      </p>

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
            label={LL["Select starting article"]()}
            placeholder={LL["Start typing to see options"]()}
            required={true}
            onSelect={setStartingArticle}
            defaultValue={startArticle.title}
            selectId="startArticle"
          />
          <ArticlePreview pageid={startArticle.pageid} />
          <RandomButton
            onSuccess={(data) => {
              increaseSingleRandomPressed();
              handleOnRandomSuccess({
                data,
                setArticle: setStartingArticle,
                failText: randomFailText,
              });
            }}
          />
          <RandomButton
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
            label={LL["Select ending article"]()}
            placeholder={LL["Start typing to see options"]()}
            required={true}
            onSelect={setEndingArticle}
            defaultValue={endArticle.title}
            selectId="endArticle"
          />
          <ArticlePreview pageid={endArticle.pageid} />
          <RandomButton
            onSuccess={(data) => {
              increaseSingleRandomPressed();
              handleOnRandomSuccess({
                data,
                setArticle: setEndingArticle,
                failText: randomFailText,
              });
            }}
          />
          <RandomButton
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
            onClick={async () => {
              await navigator.clipboard.writeText(window.location.href);
              copyNotification();
            }}
          >
            {LL["Share settings"]()}
          </button>
          <button
            type="submit"
            disabled={isFetching}
            className="mt-4 w-fit bg-secondary-blue px-10 py-3 hover:bg-primary-blue disabled:grayscale"
          >
            {LL.Play()}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
