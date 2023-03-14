import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';
import { Autocomplete, AutocompleteOption } from '../Autocomplete';
import { WikiSearch } from './WikiSearch.types';

const getArticles = async (debouncedTerm: string) => {
  if (!debouncedTerm) return;

  const resp = await fetch(
    'https://en.wikipedia.org/w/api.php?' +
      new URLSearchParams({
        action: 'query',
        list: 'search',
        origin: '*',
        format: 'json',
        srsearch: debouncedTerm,
      })
  );
  return resp.json() as Promise<WikiSearch>;
};

interface ArticleAutocompleteProps {
  label: string;
  placeholder: string;
  required: boolean;
  onSelect: (option: AutocompleteOption) => void;
}
const ArticleAutocomplete = (props: ArticleAutocompleteProps) => {
  const { label, placeholder, required, onSelect } = props;
  // const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  // const [selectedArticle, setSelectedArticle] = useState<AutocompleteOption>();
  // const [options, setOptions] = useState<AutocompleteOption[]>([]);
  const debouncedInputText = useDebounce(inputText).toLowerCase();

  const { data } = useQuery({
    queryKey: ['selectOptions', debouncedInputText],
    queryFn: () => getArticles(debouncedInputText),
    refetchOnWindowFocus: false,
    enabled: Boolean(debouncedInputText),
    select: (data) =>
      data?.query.search.map((article) => ({
        text: article.title,
        id: article.pageid,
      })),
  });

  // console.log(selectedArticle);

  return (
    <Autocomplete
      onSelect={onSelect}
      options={data ?? []}
      setInputValue={setInputText}
      label={label}
      placeholder={placeholder}
      required={required}
    />
  );
};

export default ArticleAutocomplete;
