import { useIsFetching } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import ArticleAutocomplete from "../components/ArticleAutocomplete/ArticleAutocomplete";
import ArticlePreview from "../components/ArticlePreview/ArticlePreview";
import RandomButton from "../components/RandomButton/RandomButton";
import { RandomModal } from "../components/RandomModal";
import {
  getNHighestLinksPages,
  handleOnRandomSuccess,
  useSyncWikiLanguageFromUrl,
} from "../components/Settings.helpers";
import { useStopwatchActions } from "../components/StopwatchContext";
import { LabelSwitch } from "../components/Switch";
import { WikiLanguageSelect } from "../components/WikiLanguageSelect";
import { useCheckAchievements } from "../hooks/useCheckAchievements";
import { useResetGame } from "../hooks/useResetGame";
import { useI18nContext } from "../i18n/i18n-react";
import type { Article } from "../stores/GameStore";
import { useEndingArticle, useGameStoreActions, useStartingArticle } from "../stores/GameStore";
import { useIsCtrlFEnabled, useSettingsStoreActions, useWikiLanguage } from "../stores/SettingsStore";
import { useStatsStoreActions } from "../stores/StatisticsStore";

const Settings = () => {
  const { LL } = useI18nContext();
  const navigate = useNavigate();
  const { startStopwatch } = useStopwatchActions();
  const { setIsGameRunning, setStartingArticle, setEndingArticle, addHistoryArticle } = useGameStoreActions();
  const startArticle = useStartingArticle();
  const endArticle = useEndingArticle();
  const resetGame = useResetGame();
  const [modalData, setModalData] = useState<Article[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFunction, setModalFunction] = useState({ fn: setStartingArticle });
  const { increaseTotalRuns } = useStatsStoreActions();
  const wikiLang = useWikiLanguage();
  const isFetching = useIsFetching() > 0;

  const { set_is_CTRL_F_enabled } = useSettingsStoreActions();
  const isCTRLFEnabled = useIsCtrlFEnabled();

  useSyncWikiLanguageFromUrl();

  useCheckAchievements({
    trackedStats: ["single_random_pressed", "multiple_random_pressed", "article_preview_pressed"],
  });

  const copyNotification = () => toast.success(LL["Copied to clipboard"](), { position: "top-center" });

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
    void navigate({ to: `/wiki/${startArticle.title}` });

    startStopwatch();
    setIsGameRunning(true);
    increaseTotalRuns();
  };

  return (
    <div>
      <h2 className="border-secondary-border border-b-[1px] font-serif text-3xl">{LL.Settings()}</h2>

      <p className="pt-4 pb-8 dark:text-dark-primary">
        {LL["Start typing and then select values from the dropdown list or press the random button"]()}
      </p>

      <form className="flex max-w-[650px] flex-col gap-4" onSubmit={startGameHandler}>
        <WikiLanguageSelect />
        <RandomModal data={modalData} open={modalOpen} setOpen={setModalOpen} setArticle={modalFunction.fn} />

        <SelectArticleSettings
          label={LL["Select starting article"]()}
          placeholder={LL["Start typing to see options"]()}
          required={true}
          setArticle={setStartingArticle}
          defaultValue={startArticle.title}
          selectId="startArticle"
          pageId={startArticle.pageid}
          setModalData={setModalData}
          setModalFunction={setModalFunction}
          setModalOpen={setModalOpen}
        />

        <SelectArticleSettings
          label={LL["Select ending article"]()}
          placeholder={LL["Start typing to see options"]()}
          required={true}
          setArticle={setEndingArticle}
          defaultValue={endArticle.title}
          selectId="endArticle"
          pageId={endArticle.pageid}
          setModalData={setModalData}
          setModalFunction={setModalFunction}
          setModalOpen={setModalOpen}
        />

        <LabelSwitch
          switchText={LL["Enable search during gameplay"]()}
          checked={isCTRLFEnabled}
          onCheckedChange={set_is_CTRL_F_enabled}
        />

        <div className="mt-6 flex flex-wrap gap-8">
          <button
            type="button"
            className="mt-4 w-fit border-b-[1px] border-b-transparent py-3 hover:border-b-primary-blue focus-visible:border-b-primary-blue"
            onClick={async () => {
              await navigator.clipboard.writeText(`${window.location.href}&lang=${wikiLang}`);
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

interface Props {
  label: string;
  placeholder: string;
  required?: boolean;
  setArticle: (option: Article) => void;
  defaultValue: string;
  selectId: string;
  pageId: string;
  setModalData: React.Dispatch<React.SetStateAction<Article[] | null>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setModalFunction: React.Dispatch<
    React.SetStateAction<{
      fn: (article: Article) => void;
    }>
  >;
}
const SelectArticleSettings: React.FC<Props> = ({
  label,
  placeholder,
  required = false,
  setArticle,
  defaultValue,
  selectId,
  pageId,
  setModalData,
  setModalFunction,
  setModalOpen,
}) => {
  const { LL } = useI18nContext();
  const { increaseSingleRandomPressed } = useStatsStoreActions();
  const randomFailText = LL["Random failed, try again"]();

  return (
    <div className="flex flex-wrap items-end gap-2 sm:gap-0">
      <ArticleAutocomplete
        label={label}
        placeholder={placeholder}
        required={required}
        onSelect={setArticle}
        defaultValue={defaultValue}
        selectId={selectId}
      />
      <ArticlePreview pageid={pageId} />
      <RandomButton
        onSuccess={(data) => {
          increaseSingleRandomPressed();
          handleOnRandomSuccess({
            data,
            setArticle: setArticle,
            failText: randomFailText,
          });
        }}
      />
      <RandomButton
        randomCount={5}
        onSuccess={(data) => {
          setModalFunction({ fn: setArticle });
          setModalOpen(true);
          const articles = getNHighestLinksPages(data, 5);
          if (articles) {
            setModalData(articles);
          }
        }}
      />
    </div>
  );
};
