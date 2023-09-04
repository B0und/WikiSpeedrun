import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  Article,
  useArticles,
  useGameStoreActions,
  useIsGameRunning,
  useIsWin,
  useTargetArticle,
} from "../../GameStore";
import { useStopwatchActions } from "../StopwatchContext";
import { WikiApiArticle } from "./Wiki.types";
import { useWikiLanguage } from "../../SettingsStore";

export const usePauseWhileLoading = (isLoading: boolean) => {
  const isGameRunning = useIsGameRunning();
  const { pauseStopwatch } = useStopwatchActions();
  useEffect(() => {
    if (isLoading && isGameRunning) {
      pauseStopwatch();
    }
  }, [isGameRunning, isLoading, pauseStopwatch]);
};

export const findVisibleWinningLinks = (articleTitle: Article) => {
  const winningLinks = document.querySelectorAll<HTMLElement>(
    `[href="/wiki/${articleTitle.title.replaceAll(" ", "_")}"]`
  );
  return Array.from(winningLinks).filter((link) => link.offsetWidth > 0);
};

const getArticleData = async (language: string, title: string) => {
  if (!title) return;

  const resp = await fetch(
    `https://${language}.wikipedia.org/w/api.php?` +
      new URLSearchParams({
        page: title,
        origin: "*",
        action: "parse",
        format: "json",
        disableeditsection: "true",
        redirects: "true", // automatically redirects from plural form
      })
  );
  return resp.json() as Promise<WikiApiArticle>;
};

export const useWikiQuery = () => {
  const startingArticle = useArticles()[0];
  const language = useWikiLanguage();
  const routeParams = useParams();
  const isGameRunning = useIsGameRunning();
  const isWin = useIsWin();
  const wikiArticle = routeParams.wikiTitle || startingArticle.title;
  const { addHistoryArticle, setIsGameRunning } = useGameStoreActions();

  const targetArticle = useArticles()[useArticles().length - 1];
  const { getFormattedTime, startStopwatch, pauseStopwatch } = useStopwatchActions();

  const handleWin = useCallback(
    (article: NonNullable<(typeof query)["data"]>) => {
      if (!isWin) {
        return false;
      }
      pauseStopwatch();
      setIsGameRunning(false);
      return true;
    },
    [pauseStopwatch, setIsGameRunning, targetArticle, isWin]
  );

  const query = useQuery({
    queryKey: ["article", wikiArticle, language],
    queryFn: () => getArticleData(language, wikiArticle),
    refetchOnWindowFocus: false,
    enabled: Boolean(wikiArticle),
    select: (data) => ({
      html: data?.parse?.text?.["*"],
      title: data?.parse?.title,
      pageid: data?.parse?.pageid,
    }),
  });

  useEffect(() => {
    if (!query.data) return;
    if (!isGameRunning) return;

    if (handleWin(query.data)) {
      return;
    }

    startStopwatch();
  }, [addHistoryArticle, getFormattedTime, handleWin, isGameRunning, query.data, startStopwatch]);

  return query;
};
