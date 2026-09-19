import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { useUnlockAchievements } from "../../hooks/useUnlockAchievements";
import {
  type Article,
  useClicks,
  useEndingArticle,
  useGameStoreActions,
  useIsGameRunning,
  useStartingArticle,
} from "../../stores/GameStore";
import { useWikiLanguage } from "../../stores/SettingsStore";
import { useStatsStoreActions } from "../../stores/StatisticsStore";
import { useStopwatchActions } from "../StopwatchContext";
import { wikiRoute } from "./Wiki";
import { LANGUAGES } from "./wikiLanguages";
import { jsonAs } from "../../utils/json";
import type { WikiApiArticle, WikiArticleData, WikiLanguage } from "./Wiki.types";

export const findVisibleWinningLinks = (root: ParentNode, articleTitle: Article) => {
  const expectedTitle = articleTitle.title.replaceAll("_", " ");
  return Array.from(root.querySelectorAll<HTMLAnchorElement>('a[href*="/wiki/"]')).filter(
    (link) => {
      if (link.offsetWidth === 0 || !link.pathname.startsWith("/wiki/")) return false;

      try {
        return (
          decodeURIComponent(link.pathname.slice("/wiki/".length)).replaceAll("_", " ") ===
          expectedTitle
        );
      } catch {
        return false;
      }
    },
  );
};

export const getWikiArticleKey = (article: WikiArticleData) =>
  `${article.language}:${article.pageid}:${article.revid}:${article.styleUrls.join("|")}`;

const BASELINE_STYLE_MODULES = [
  "skins.vector.styles",
  "mediawiki.skinning.content.parsoid",
  "ext.cite.parsoid.styles",
] as const;

const EXCLUDED_CONDITIONAL_STYLE_MODULES: Record<string, true> = {
  "skins.vector.styles": true,
  "mediawiki.skinning.content.parsoid": true,
  "ext.cite.parsoid.styles": true,
  "site.styles": true,
  "user.styles": true,
  noscript: true,
  "skins.vector.icons": true,
  "skins.vector.search.codex.styles": true,
};
const RESOURCE_LOADER_MODULE_NAME = /^[A-Za-z0-9_.-]+$/;
const SUPPORTED_WIKI_LANGUAGES = new Set(LANGUAGES.map(({ value }) => value));

const buildResourceLoaderUrl = (language: WikiLanguage, modules: readonly string[]) => {
  const url = new URL(`https://${language}.wikipedia.org/w/load.php`);
  url.search = new URLSearchParams({
    modules: modules.join("|"),
    only: "styles",
    skin: "vector-2022",
    lang: language,
    debug: "false",
  }).toString();
  return url.toString();
};

export const buildWikipediaStyleUrls = (
  language: WikiLanguage,
  moduleStyles: readonly string[] = [],
): readonly string[] => {
  if (!SUPPORTED_WIKI_LANGUAGES.has(language)) {
    throw new Error(`Unsupported Wikipedia language: ${language}`);
  }

  const conditionalModules = Array.from(
    new Set(
      moduleStyles.filter(
        (moduleName) =>
          RESOURCE_LOADER_MODULE_NAME.test(moduleName) &&
          !EXCLUDED_CONDITIONAL_STYLE_MODULES[moduleName],
      ),
    ),
  ).toSorted();

  return [
    buildResourceLoaderUrl(language, [...BASELINE_STYLE_MODULES].toSorted()),
    ...(conditionalModules.length > 0
      ? [buildResourceLoaderUrl(language, conditionalModules)]
      : []),
    buildResourceLoaderUrl(language, ["site.styles"]),
  ];
};

export const getArticleData = async (
  language: WikiLanguage,
  title: string,
): Promise<WikiArticleData> => {
  if (!title) {
    throw new Error("A Wikipedia article title is required");
  }

  if (!SUPPORTED_WIKI_LANGUAGES.has(language)) {
    throw new Error(`Unsupported Wikipedia language: ${language}`);
  }

  const url = new URL(`https://${language}.wikipedia.org/w/api.php`);
  url.search = new URLSearchParams({
    action: "parse",
    page: title,
    prop: "text|displaytitle|revid|modules|jsconfigvars",
    useskin: "vector-2022",
    usearticle: "1",
    origin: "*",
    format: "json",
    disableeditsection: "true",
    redirects: "true",
  }).toString();

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Wikipedia request failed with status ${response.status}`);
  }

  const data = await jsonAs<WikiApiArticle>(response);
  if (data.error) {
    throw new Error(data.error.info ?? data.error.code ?? "Wikipedia returned an API error");
  }

  const { parse } = data;
  const html = parse?.text?.["*"];
  if (!parse || !html || !parse.title || parse.pageid === undefined || parse.revid === undefined) {
    throw new Error("Wikipedia returned an incomplete parse response");
  }

  return {
    html,
    title: parse.title,
    pageid: parse.pageid,
    revid: parse.revid,
    language,
    styleUrls: buildWikipediaStyleUrls(language, parse.modulestyles),
  };
};

export const useWikiQuery = () => {
  const startingArticle = useStartingArticle();
  const language = useWikiLanguage();
  const { _splat: wikiTitle } = wikiRoute.useParams();
  const wikiArticle = wikiTitle
    ? decodeURIComponent(wikiTitle).replace("/wiki/", "")
    : startingArticle.title;

  return useQuery({
    queryKey: ["article", wikiArticle, language],
    queryFn: () => getArticleData(language, wikiArticle),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    enabled: Boolean(wikiArticle),
  });
};

export const useWikiArticleLifecycle = (
  article: WikiArticleData | undefined,
  presentationReady: boolean,
) => {
  const isGameRunning = useIsGameRunning();
  const targetArticle = useEndingArticle();
  const { setIsGameRunning, setIsWin } = useGameStoreActions();
  const { startStopwatch, pauseStopwatch } = useStopwatchActions();
  const { increaseWins, addKnownLanguage, increaseArticlesClicked } = useStatsStoreActions();
  const clicks = useClicks();
  const checkAchievements = useUnlockAchievements();
  const processedArticleKeys = useRef(new Set<string>());

  const handleWin = useCallback(
    (readyArticle: WikiArticleData) => {
      if (
        readyArticle.title === targetArticle.title ||
        String(readyArticle.pageid) === targetArticle.pageid
      ) {
        pauseStopwatch();
        setIsGameRunning(false);
        setIsWin(true);
        increaseWins();
        addKnownLanguage(readyArticle.language);
        increaseArticlesClicked(clicks);
        checkAchievements();
        return true;
      }

      return false;
    },
    [
      addKnownLanguage,
      checkAchievements,
      clicks,
      increaseArticlesClicked,
      increaseWins,
      pauseStopwatch,
      setIsGameRunning,
      setIsWin,
      targetArticle.pageid,
      targetArticle.title,
    ],
  );

  useEffect(() => {
    if (isGameRunning && (!article || !presentationReady)) {
      pauseStopwatch();
    }
  }, [article, isGameRunning, pauseStopwatch, presentationReady]);

  useEffect(() => {
    if (!article || !isGameRunning || !presentationReady) return;

    const articleKey = getWikiArticleKey(article);
    if (!processedArticleKeys.current.has(articleKey)) {
      processedArticleKeys.current.add(articleKey);
      if (handleWin(article)) return;
    }

    // Resume timing whenever a ready article (re)renders in an active game,
    // including revisits of already-processed articles.
    startStopwatch();
  }, [article, handleWin, isGameRunning, presentationReady, startStopwatch]);
};
