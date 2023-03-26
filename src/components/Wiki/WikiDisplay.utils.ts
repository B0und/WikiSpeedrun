import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import {
  useEndingArticle,
  useGameStoreActions,
  useIsGameRunning,
  useStartingArticle,
} from '../../GameStore';
import { useStopwatchActions } from '../StopwatchContext';
import { WikiApiArticle } from './Wiki.types';

export const usePauseWhileLoading = (isLoading: boolean) => {
  const isGameRunning = useIsGameRunning();
  const { pause } = useStopwatchActions();
  useEffect(() => {
    if (isLoading && isGameRunning) {
      pause();
    }
  }, [isGameRunning, isLoading, pause]);
};

const getArticleData = async (title: string) => {
  if (!title) return;

  const resp = await fetch(
    'https://en.wikipedia.org/w/api.php?' +
      new URLSearchParams({
        page: title,
        origin: '*',
        action: 'parse',
        format: 'json',
        disableeditsection: 'true',
        redirects: 'true', // automatically redirects from plural form
      })
  );
  return resp.json() as Promise<WikiApiArticle>;
};

export const useWikiQuery = () => {
  const startingArticle = useStartingArticle();
  const routeParams = useParams();
  const wikiArticle = routeParams.wikiTitle || startingArticle;
  const { addHistoryArticle, setIsGameRunning } = useGameStoreActions();
  const isGameRunning = useIsGameRunning();
  const targetArticle = useEndingArticle();
  const { getFormattedTime, start, pause } = useStopwatchActions();

  const handleWin = useCallback(
    (article: NonNullable<(typeof query)['data']>) => {
      if (article.title !== targetArticle) {
        return false;
      }
      pause();
      setIsGameRunning(false);
      return true;
    },
    [pause, setIsGameRunning, targetArticle]
  );

  const query = useQuery({
    queryKey: ['article', wikiArticle],
    queryFn: () => getArticleData(wikiArticle),
    refetchOnWindowFocus: false,
    enabled: Boolean(wikiArticle),
    select: (data) => ({
      html: data?.parse?.text?.['*'],
      title: data?.parse?.title,
      pageid: data?.parse?.pageid,
    }),
    // onSuccess: (data) => {
    // }
  });

  useEffect(() => {
    if (!isGameRunning) return;

    const time = getFormattedTime();

    if (!query.data) return;
    const { min, ms, sec } = time;
    addHistoryArticle({
      title: query.data.title || '',
      time: { min, sec, ms },
    });

    if (handleWin(query.data)) {
      return;
    }

    start();
  }, [addHistoryArticle, getFormattedTime, handleWin, isGameRunning, query.data, start]);

  return query;
};
