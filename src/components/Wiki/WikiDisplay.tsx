import { clsx } from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { useEndingArticle, useGameStoreActions, useIsGameRunning } from "../../stores/GameStore";
import { useWikiArticleFontSize, useWikiArticleWidth } from "../../stores/SettingsStore";
import { Loader } from "../Loader";
import { useThemeContext } from "../ThemeContext";
import { WikiArticleSurface } from "./WikiArticleSurface";
import {
  findVisibleWinningLinks,
  getWikiArticleKey,
  useWikiArticleLifecycle,
  useWikiQuery,
} from "./WikiDisplay.utils";
import type { WikiArticleData } from "./Wiki.types";
import useWikiLogic from "./WikiLogic";

const WikiDisplay = () => {
  const { colorMode } = useThemeContext();
  const { handleClickInsideWikiArticle, handleKeyDownInsideWikiArticle } = useWikiLogic();
  const {
    isFetching,
    isPending,
    isPlaceholderData,
    data: queriedArticle,
    isError,
  } = useWikiQuery();
  const isGameRunning = useIsGameRunning();
  const endingArticle = useEndingArticle();
  const { setLastArticleWinningLinks } = useGameStoreActions();
  const articleWidth = useWikiArticleWidth();
  const articleFontSize = useWikiArticleFontSize();

  const [displayedArticle, setDisplayedArticle] = useState<WikiArticleData>();
  if (queriedArticle && !displayedArticle) {
    setDisplayedArticle(queriedArticle);
  }
  const visibleArticle = displayedArticle ?? queriedArticle;
  const visibleArticleKey = visibleArticle ? getWikiArticleKey(visibleArticle) : null;
  const queriedArticleKey = queriedArticle ? getWikiArticleKey(queriedArticle) : null;
  const pendingArticle =
    queriedArticle &&
    visibleArticle &&
    queriedArticleKey !== visibleArticleKey &&
    !isPlaceholderData
      ? queriedArticle
      : undefined;

  const [readyArticleKey, setReadyArticleKey] = useState<string | null>(null);
  const [trackedVisibleArticleKey, setTrackedVisibleArticleKey] = useState<string | null>(
    visibleArticleKey,
  );
  if (visibleArticleKey !== trackedVisibleArticleKey) {
    setTrackedVisibleArticleKey(visibleArticleKey);
    if (readyArticleKey !== visibleArticleKey) {
      setReadyArticleKey(null);
    }
  }

  const queriedArticleKeyRef = useRef<string | null>(null);
  const visibleArticleKeyRef = useRef<string | null>(null);
  const isPlaceholderDataRef = useRef(false);
  useEffect(() => {
    queriedArticleKeyRef.current = queriedArticleKey;
    visibleArticleKeyRef.current = visibleArticleKey;
    isPlaceholderDataRef.current = isPlaceholderData;
  }, [isPlaceholderData, queriedArticleKey, visibleArticleKey]);

  const presentationReady =
    visibleArticleKey !== null &&
    readyArticleKey === visibleArticleKey &&
    !isPending &&
    !isPlaceholderData &&
    !pendingArticle;
  useWikiArticleLifecycle(visibleArticle, presentationReady);

  const isArticleLoading =
    !isError &&
    (isFetching ||
      isPlaceholderData ||
      pendingArticle !== undefined ||
      (visibleArticle !== undefined && !presentationReady));

  const handleArticleReady = useCallback(
    (article: WikiArticleData, contentRoot: HTMLElement) => {
      const articleKey = getWikiArticleKey(article);
      const currentVisibleArticleKey = visibleArticleKeyRef.current;
      const currentQueriedArticleKey = queriedArticleKeyRef.current;

      // A late stylesheet event from an article that was superseded while
      // loading must not replace the article that is currently requested.
      if (articleKey !== currentVisibleArticleKey && articleKey !== currentQueriedArticleKey) {
        return;
      }

      const visibleWinningLinks = findVisibleWinningLinks(contentRoot, endingArticle);
      if (isGameRunning) {
        setLastArticleWinningLinks(visibleWinningLinks.length);
      } else {
        for (const link of visibleWinningLinks) {
          link.style.color = "#aa6600";
          // eslint-disable-next-line lingui/no-unlocalized-strings -- CSS color value, not user-facing copy
          link.style.border = "1px solid #aa6600";
          link.style.fontWeight = "bold";
        }
      }

      setReadyArticleKey(articleKey);

      if (
        articleKey === currentQueriedArticleKey &&
        articleKey !== currentVisibleArticleKey &&
        !isPlaceholderDataRef.current
      ) {
        setDisplayedArticle(article);
      } else if (articleKey === currentVisibleArticleKey) {
        setDisplayedArticle((currentArticle) => {
          if (currentArticle && getWikiArticleKey(currentArticle) === articleKey) {
            return currentArticle;
          }
          return article;
        });
      }
    },
    [endingArticle, isGameRunning, setLastArticleWinningLinks],
  );

  const articleContainerClassName = clsx(
    "relative mx-auto w-full",
    articleWidth === "standard" && "max-w-[59.25rem]",
  );

  if (!visibleArticle) {
    if (!isArticleLoading) return null;

    return (
      <div
        className={clsx(articleContainerClassName, "min-h-[18rem]")}
        data-wiki-article-width={articleWidth}
      >
        {isArticleLoading && <Loader overlay />}
      </div>
    );
  }

  const surfaceArticles = pendingArticle ? [visibleArticle, pendingArticle] : [visibleArticle];

  return (
    <div className={articleContainerClassName} data-wiki-article-width={articleWidth}>
      <h2 className="border-b-[1px] border-secondary-border font-serif text-3xl sm:mt-8">
        {visibleArticle.title}
      </h2>
      <div className="relative">
        {surfaceArticles.map((article) => {
          const articleKey = getWikiArticleKey(article);
          const isVisible = articleKey === visibleArticleKey;

          return (
            <div
              key={articleKey}
              className={
                isVisible
                  ? "relative"
                  : "pointer-events-none invisible absolute inset-x-0 top-0 w-full"
              }
              aria-hidden={!isVisible}
            >
              <WikiArticleSurface
                article={article}
                fontSize={articleFontSize}
                isDark={colorMode === "dark"}
                onReady={(contentRoot) => handleArticleReady(article, contentRoot)}
                onClick={handleClickInsideWikiArticle}
                onKeyDown={handleKeyDownInsideWikiArticle}
              />
            </div>
          );
        })}
      </div>
      {isArticleLoading && <Loader overlay />}
    </div>
  );
};

export default WikiDisplay;
