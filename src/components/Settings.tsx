import React, { FormEvent, FormEventHandler, useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSettingsStoreActions } from '../SettingsStore';
import ArticleAutocomplete from './ArticleAutocomplete/ArticleAutocomplete';
import { Autocomplete, AutocompleteOption } from './Autocomplete';
import { useStopwatchActions } from './StopwatchContext';

const Settings = () => {
  const navigate = useNavigate();
  const [startInput, setStartInput] = useState('');

  const [options, setOptions] = useState<AutocompleteOption[]>([]);
  const { start, pause } = useStopwatchActions();
  const { setIsGameRunning, setStartingArticle, setEndingArticle } = useSettingsStoreActions();

  const startGameHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/wiki');
    start();
    setIsGameRunning(true);
  };

  return (
    <div>
      <h3 className="border-b-[1px] border-secondary-border text-2xl">Settings</h3>
      <p className="pt-4 pb-8">
        Start typing and then select values from the dropdown list or press the random button.
      </p>

      <form className="flex flex-col gap-4" onSubmit={startGameHandler}>
        <ArticleAutocomplete
          label="Select starting article"
          placeholder="Start typing to see options"
          required={true}
          onSelect={(option) => setStartingArticle(option.text)}
        />
        <ArticleAutocomplete
          label="Select ending article"
          placeholder="Start typing to see options"
          required={true}
          onSelect={(option) => setEndingArticle(option.text)}
        />

        <button type="submit" className="w-fit bg-secondary-blue px-10 py-3 hover:bg-primary-blue">
          Play
        </button>
      </form>
    </div>
  );
};

export default Settings;
