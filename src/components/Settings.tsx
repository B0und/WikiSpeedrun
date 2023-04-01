import { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEndingArticle, useGameStoreActions, useStartingArticle } from '../GameStore';
import ArticleAutocomplete from './ArticleAutocomplete/ArticleAutocomplete';
import RandomButton from './RandomButton/RandomButton';
import { handleOnRandomSuccess } from './Settings.helpers';
import { useStopwatchActions } from './StopwatchContext';
import { useResetGame } from '../hooks/useResetGame';

const Settings = () => {
  const navigate = useNavigate();
  const { startStopwatch } = useStopwatchActions();
  const { setIsGameRunning, setStartingArticle, setEndingArticle } = useGameStoreActions();
  const startArticle = useStartingArticle();
  const endArticle = useEndingArticle();
  const resetGame = useResetGame();

  const startGameHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await resetGame();
    navigate('/wiki');
    startStopwatch();
    setIsGameRunning(true);
  };

  return (
    <div>
      <h3 className="border-b-[1px] border-secondary-border text-2xl ">Settings</h3>
      <p className="pb-8 pt-4">
        Start typing and then select values from the dropdown list or press the random button.
      </p>

      <form className="flex flex-col gap-4" onSubmit={startGameHandler}>
        <div className="flex items-end gap-2">
          <ArticleAutocomplete
            label="Select starting article"
            placeholder="Start typing to see options"
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
            label="Select ending article"
            placeholder="Start typing to see options"
            required={true}
            onSelect={setEndingArticle}
            defaultValue={endArticle}
            selectId="startArticle"
          />
          <RandomButton
            queryKey="endingArticle"
            onSuccess={(data) => {
              console.log(data.query?.pages);

              handleOnRandomSuccess({ data, setArticle: setEndingArticle });
            }}
          />
        </div>

        <button type="submit" className="w-fit bg-secondary-blue px-10 py-3 hover:bg-primary-blue">
          Play
        </button>
      </form>
    </div>
  );
};

export default Settings;
