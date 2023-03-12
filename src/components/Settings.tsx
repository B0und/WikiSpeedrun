import React, { FormEvent, FormEventHandler, useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ArticleAutocomplete from './ArticleAutocomplete/ArticleAutocomplete';
import { Autocomplete, AutocompleteOption } from './Autocomplete';
import { useStopwatchActions } from './StopwatchContext';

const Settings = () => {
  const navigate = useNavigate();
  const [startInput, setStartInput] = useState('');
  const [startArticle, setStartArticle] = useState<AutocompleteOption>();
  const [options, setOptions] = useState<AutocompleteOption[]>([]);

  const startHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/wiki');
  };

  const start = useStopwatchActions();
  // const stopwatchRef = useRef(useContext(StopwatchContext));

  console.log('rerender!');

  return (
    <div>
      <h3 className="border-b-[1px] border-secondary-border text-2xl">Settings</h3>
      <button onClick={start}>GOOO</button>
      <p className="pt-4 pb-8">
        Start typing and then select values from the dropdown list or press the random button.
      </p>

      <form className="flex flex-col gap-4" onSubmit={startHandler}>
        <ArticleAutocomplete
          label="Select starting article"
          placeholder="Start typing to see options"
          required={true}
        />
        <ArticleAutocomplete
          label="Select ending article"
          placeholder="Start typing to see options"
          required={true}
        />

        <button type="submit" className="w-fit bg-secondary-blue px-10 py-3 hover:bg-primary-blue">
          Play
        </button>
      </form>
    </div>
  );
};

export default Settings;
