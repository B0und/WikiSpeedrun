import clsx from "clsx";
import { useCallback, useState } from "react";
import { useEndingArticle, useGameStoreActions, useIsGameRunning } from "../../stores/GameStore";
import { Loader } from "../Loader";
import { useThemeContext } from "../ThemeContext";
import { WikiArticleSurface } from "./WikiArticleSurface";
import { findVisibleWinningLinks, getWikiArticleKey, useWikiArticleLifecycle, useWikiQuery } from "./WikiDisplay.utils";
import useWikiLogic from "./WikiLogic";

import "./styles/unreset.css";
import "./styles/vec2022base.css";
import "./styles/vector2022.css";
import "./styles/overrides.css";

const WikiDisplay = () => {
  const { colorMode } = useThemeContext();
  const { handleClickInsideWikiArticle, handleKeyDownInsideWikiArticle } = useWikiLogic();
  const { isFetching, data, isError } = useWikiQuery();
  const isGameRunning = useIsGameRunning();
  const endingArticle = useEndingArticle();
  const { setLastArticleWinningLinks } = useGameStoreActions();
  const [readyArticleKey, setReadyArticleKey] = useState<string | null>(null);

  const articleKey = data ? getWikiArticleKey(data) : null;
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
      <div className={clsx("w-full", !presentationReady && "invisible")}>
        <h2 className="border-secondary-border border-b-[1px] font-serif text-3xl sm:mt-8">{data.title}</h2>
        <WikiArticleSurface
          article={data}
          fontSize="standard"
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
