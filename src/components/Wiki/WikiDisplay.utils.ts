import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
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
  const { getFormattedTime, start } = useStopwatchActions();

  const handleWin = (article: NonNullable<(typeof query)['data']>) => {
    if (article.title !== targetArticle) {
      return false;
    }
    setIsGameRunning(false);
    return true;
  };

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
      if (!isGameRunning) return;

      const time = getFormattedTime();
      addHistoryArticle({
        title: data.title || '',
        time: `${time.min}:${time.sec}.${time.ms}`,
      });

      if (handleWin(data)) {
        return;
      }

      start();
    },
  });
  return query;
};
