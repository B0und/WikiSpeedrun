import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStartingArticle } from '../SettingsStore';
import { WikiApiArticle } from './Wiki.types';

interface WikiProps {
  startingArticle: string;
}

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

// const html = resp.data.parse.text['*'];
// const title = resp.data.parse.title;
// const pageid = resp.data.parse.pageid;

const Wiki = () => {
  const startingArticle = useStartingArticle();
  const routeParams = useParams();
  console.log('routeParams', routeParams);
  // routeParams.wikiTitle

  const wikiArticle = routeParams.wikiTitle || startingArticle;
  // const [wikiArticle, setWikiArticle] = useState(startingArticle);
  // fetch the article (prefetch?)
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
    onSuccess: () => {
      // add to history
    },
    onSettled: () => {
      // unpause
    },
  });

  console.log(data);

  if (isFetching) {
    return <p>Loading...</p>;
  }

  return (
    <div className="">
      Wiki
      {data?.html && (
        <div
          // isDarkTheme={colorMode === "dark"}
          // className="wiki-insert"
          // onClick={handleWikiArticleClick}
          dangerouslySetInnerHTML={{ __html: data?.html }}
        />
      )}
    </div>
  );
};

export default Wiki;
