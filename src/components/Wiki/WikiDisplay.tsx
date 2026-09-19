import { clsx } from "clsx";
import { useCallback, useState } from "react";
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
import useWikiLogic from "./WikiLogic";

const WikiDisplay = () => {
  const { colorMode } = useThemeContext();
  const { handleClickInsideWikiArticle, handleKeyDownInsideWikiArticle } = useWikiLogic();
  const { isFetching, data, isError } = useWikiQuery();
  const isGameRunning = useIsGameRunning();
  const endingArticle = useEndingArticle();
  const { setLastArticleWinningLinks } = useGameStoreActions();
  const articleWidth = useWikiArticleWidth();
  const articleFontSize = useWikiArticleFontSize();

  const articleKey = data ? getWikiArticleKey(data) : null;
  const [readyArticleKey, setReadyArticleKey] = useState<string | null>(null);
  const [trackedArticleKey, setTrackedArticleKey] = useState<string | null>(articleKey);
  // Readiness belongs to the surface instance for the current article. When the
  // article changes, that surface remounts (see the key below), so drop the
  // previous article's readiness until the new surface reports in.
  if (articleKey !== trackedArticleKey) {
    setTrackedArticleKey(articleKey);
    setReadyArticleKey(null);
  }
  const presentationReady = articleKey !== null && readyArticleKey === articleKey;
  useWikiArticleLifecycle(data, presentationReady);

  const handleArticleReady = useCallback(
    (contentRoot: HTMLElement) => {
      if (!data) return;

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

      setReadyArticleKey(getWikiArticleKey(data));
    },
    [data, endingArticle, isGameRunning, setLastArticleWinningLinks],
  );

  if (isError) return null;
  if (!data) return isFetching ? <Loader /> : null;

  return (
    <>
      {!presentationReady && <Loader />}
      <div
        className={clsx(
          "mx-auto w-full",
          articleWidth === "standard" && "max-w-[59.25rem]",
          !presentationReady && "invisible",
        )}
        data-wiki-article-width={articleWidth}
      >
        <h2 className="border-b-[1px] border-secondary-border font-serif text-3xl sm:mt-8">
          {data.title}
        </h2>
        <WikiArticleSurface
          key={articleKey}
          article={data}
          fontSize={articleFontSize}
          isDark={colorMode === "dark"}
          onReady={handleArticleReady}
          onClick={handleClickInsideWikiArticle}
          onKeyDown={handleKeyDownInsideWikiArticle}
        />
      </div>
    </>
  );
};

export default WikiDisplay;
