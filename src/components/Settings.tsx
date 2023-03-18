import React, { FormEvent, FormEventHandler, useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Item, Section } from 'react-stately';
import { useEndingArticle, useGameStoreActions, useStartingArticle } from '../GameStore';
import ArticleAutocomplete from './ArticleAutocomplete/ArticleAutocomplete';
import { SearchAutocomplete } from './Autocomplete/Autocomplete';
import { Autocomplete, AutocompleteOption } from './AutocompleteOld';
import RandomButton from './RandomButton/RandomButton';
import { getHighestLinksPage, handleOnRandomSuccess } from './Settings.helpers';
import { useStopwatchActions } from './StopwatchContext';

const Settings = () => {
  const navigate = useNavigate();
  const { start, pause } = useStopwatchActions();
  const { setIsGameRunning, setStartingArticle, setEndingArticle } = useGameStoreActions();
  const startArticle = useStartingArticle();
  const endArticle = useEndingArticle();

  const startGameHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/wiki');
    start();
    setIsGameRunning(true);
  };

  return (
    <div>
      <h3 className="border-b-[1px] border-secondary-border text-2xl ">Settings</h3>
      <p className="pt-4 pb-8">
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
