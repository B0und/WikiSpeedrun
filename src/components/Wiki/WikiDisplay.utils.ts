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
  const { pauseStopwatch } = useStopwatchActions();
  useEffect(() => {
    if (isLoading && isGameRunning) {
      pauseStopwatch();
    }
  }, [isGameRunning, isLoading, pauseStopwatch]);
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

  const targetArticle = useEndingArticle();
  const { getFormattedTime, startStopwatch, pauseStopwatch } = useStopwatchActions();

  const handleWin = useCallback(
    (article: NonNullable<(typeof query)['data']>) => {
      if (article.title !== targetArticle) {
        return false;
      }
      pauseStopwatch();
      setIsGameRunning(false);
      return true;
    },
    [pauseStopwatch, setIsGameRunning, targetArticle]
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
    onSuccess: (data) => {
      const time = getFormattedTime();

      const { min, ms, sec } = time;
      addHistoryArticle({
        title: data.title || '',
        time: { min, sec, ms },
      });

      if (handleWin(data)) {
        return;
      }

      startStopwatch();
    },
  });

  return query;
};
