import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  Article,
  useEndingArticle,
  useGameStoreActions,
  useIsGameRunning,
  useStartingArticle,
} from "../../stores/GameStore";
import { useStopwatchActions } from "../StopwatchContext";
import { WikiApiArticle } from "./Wiki.types";
import { useWikiLanguage } from "../../stores/SettingsStore";
import { useStatsStoreActions } from "../../stores/StatisticsStore";
import { useUnlockAchievements } from "../../hooks/useUnlockAchievements";

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
      }).toString()
  );
  return resp.json() as Promise<WikiApiArticle>;
};

export const useWikiQuery = () => {
  const startingArticle = useStartingArticle();
  const language = useWikiLanguage();
  const routeParams = useParams();
  const isGameRunning = useIsGameRunning();
  const wikiArticle = routeParams.wikiTitle ?? startingArticle.title;
  const { addHistoryArticle, setIsGameRunning } = useGameStoreActions();

  const targetArticle = useEndingArticle();
  const { getFormattedTime, startStopwatch, pauseStopwatch } = useStopwatchActions();
  const { increaseWins } = useStatsStoreActions();

  const checkAchievements = useUnlockAchievements();

  const handleWin = useCallback(
    (article: NonNullable<(typeof query)["data"]>) => {
      if (article.title !== targetArticle.title) {
        return false;
      }

      pauseStopwatch();
      setIsGameRunning(false);
      increaseWins();
      // add new languages known
      //
      checkAchievements();

      return true;
    },
    [checkAchievements, increaseWins, pauseStopwatch, setIsGameRunning, targetArticle.title]
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
