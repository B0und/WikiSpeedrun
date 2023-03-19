import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useGameStoreActions, useStartingArticle } from '../../GameStore';
import { useStopwatchActions } from '../StopwatchContext';
import { WikiApiArticle } from './Wiki.types';
import { usePauseWhileLoading } from './WikiDisplay.utils';
import useWikiLogic from './WikiLogic';

import './unreset.css';
import './vec2022-base.css';
import './vector2022.css';
import './overrides.css';

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
  const startingArticle = useStartingArticle();
  const { addHistoryArticle } = useGameStoreActions();
  const routeParams = useParams();
  const { handleWikiArticleClick } = useWikiLogic();

  const { getFormattedTime, start } = useStopwatchActions();

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
          <h2 className="border-b-[1px] border-secondary-border text-3xl font-serif">
            {data.title}
          </h2>
          <div className="unreset wiki-insert">
            <div
              id="wikiHtml"
              className="client-js vector-feature-language-in-header-enabled vector-feature-language-in-main-page-header-disabled vector-feature-language-alert-in-sidebar-enabled vector-feature-sticky-header-disabled vector-feature-page-tools-disabled vector-feature-page-tools-pinned-disabled vector-feature-toc-pinned-enabled vector-feature-main-menu-pinned-disabled vector-feature-limited-width-enabled vector-feature-limited-width-content-enabled vector-animations-ready ve-available"
            >
              <div
                id="wikiBody"
                className="skin-vector vector-body skin-vector-search-vue mediawiki ltr sitedir-ltr mw-hide-empty-elt ns-0 ns-subject  skin-vector-2022 action-view uls-dialog-sticky-hide vector-below-page-title"
              >
                <div
                  // isDarkTheme={colorMode === "dark"}
                  className=""
                  onClick={handleWikiArticleClick}
                  dangerouslySetInnerHTML={{ __html: data?.html }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default WikiDisplay;
