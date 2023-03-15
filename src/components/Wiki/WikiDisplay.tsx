import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHistory, useSettingsStoreActions, useStartingArticle } from '../../SettingsStore';
import { useStopwatchActions, useStopwatchValue } from '../StopwatchContext';
import { WikiApiArticle } from './Wiki.types';
import { usePauseWhileLoading } from './WikiDisplay.utils';
import useWikiLogic from './WikiLogic';

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


const WikiDisplay = () => {
  const articleHistory = useHistory();
  const startingArticle = useStartingArticle();
  const { addHistoryArticle } = useSettingsStoreActions();
  const routeParams = useParams();
  const { handleWikiArticleClick } = useWikiLogic();

  const { getFormattedTime, start } = useStopwatchActions();

  console.log('death');

  const wikiArticle = routeParams.wikiTitle || startingArticle;

  const { data, isFetching } = useQuery({
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
      // add to history
      const time = getFormattedTime();
      if (articleHistory.length === 0) {
        time.ms = '000';
      }
      addHistoryArticle({ title: data.title || '', time: `${time.min}:${time.sec}.${time.ms}` });
      start();
    },
    onSettled: () => {
      // do stuff
    },
  });

  usePauseWhileLoading(isFetching);

  if (isFetching) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {data?.html && (
        <>
          <h2 className="border-b-[1px] border-secondary-border text-3xl font-serif pt-3">
            {data.title}
          </h2>
          <div
            // isDarkTheme={colorMode === "dark"}
            className="wiki-insert"
            onClick={handleWikiArticleClick}
            dangerouslySetInnerHTML={{ __html: data?.html }}
          />
        </>
      )}
    </>
  );
};

export default WikiDisplay;
