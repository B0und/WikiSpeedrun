import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useEndingArticle, useGameStoreActions, useStartingArticle } from "../GameStore";
import ArticleAutocomplete from "./ArticleAutocomplete/ArticleAutocomplete";
import RandomButton from "./RandomButton/RandomButton";
import { handleOnRandomSuccess } from "./Settings.helpers";
import { useStopwatchActions } from "./StopwatchContext";
import { useResetGame } from "../hooks/useResetGame";
import { useI18nContext } from "../i18n/i18n-react";
import { WikiLanguageSelect } from "./WikiLanguageSelect";

const Settings = () => {
  const { LL } = useI18nContext();
  const navigate = useNavigate();
  const { startStopwatch } = useStopwatchActions();
  const { setIsGameRunning, setStartingArticle, setEndingArticle } = useGameStoreActions();
  const startArticle = useStartingArticle();
  const endArticle = useEndingArticle();
  const resetGame = useResetGame();

  const startGameHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await resetGame();
    navigate("/wiki");
    startStopwatch();
    setIsGameRunning(true);
  };

  return (
    <div>
      <h3 className="border-b-[1px] border-secondary-border text-2xl ">{LL.SETTINGS()}</h3>
      <p className="pb-8 pt-4">{LL.SETTINGS_DESCRIPTION()}</p>

      <form className="flex flex-col gap-4" onSubmit={startGameHandler}>
        <WikiLanguageSelect />
        <div className="flex items-end gap-2">
          <ArticleAutocomplete
            label={LL.STARTING_ARTICLE_LABEL()}
            placeholder={LL.INPUT_PLACEHOLDER()}
            required={true}
            onSelect={setStartingArticle}
            defaultValue={startArticle}
            selectId="startArticle"
          />
          <RandomButton
            queryKey="startingArticle"
            onSuccess={(data) => {
              handleOnRandomSuccess({ data, setArticle: setStartingArticle });
            }}
          />
        </div>

        <div className="flex items-end gap-2">
          <ArticleAutocomplete
            label={LL.ENDING_ARTICLE_LABEL()}
            placeholder={LL.INPUT_PLACEHOLDER()}
            required={true}
            onSelect={setEndingArticle}
            defaultValue={endArticle}
            selectId="startArticle"
          />
          <RandomButton
            queryKey="endingArticle"
            onSuccess={(data) => {
              handleOnRandomSuccess({ data, setArticle: setEndingArticle });
            }}
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-fit bg-secondary-blue px-10 py-3 hover:bg-primary-blue"
        >
          {LL.PLAY()}
        </button>
      </form>
    </div>
  );
};

export default Settings;
