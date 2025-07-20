import { findVisibleWinningLinks, usePauseWhileLoading, useWikiQuery } from "./WikiDisplay.utils";
import useWikiLogic from "./WikiLogic";

import "./styles/unreset.css";
import "./styles/vec2022-base.css";
import "./styles/vector2022.css";
import "./styles/overrides.css";
import clsx from "clsx";
import purify from "dompurify";
import { useI18nContext } from "../../i18n/i18n-react";
import { useEndingArticle, useGameStoreActions, useIsGameRunning } from "../../stores/GameStore";
import { useThemeContext } from "../ThemeContext";
import { Loader } from "../Loader";

const WikiDisplay = () => {
  const { colorMode } = useThemeContext();
  const isDarkTheme = colorMode === "dark";

  const { LL } = useI18nContext();
  const { handleClickInsideWikiArticle } = useWikiLogic();
  const { isFetching, data, isError } = useWikiQuery();
  const isGameRunning = useIsGameRunning();
  const endingArticle = useEndingArticle();

  const { setLastArticleWinningLinks } = useGameStoreActions();

  usePauseWhileLoading(isFetching);

  const wikiRefCallback = (node: HTMLDivElement | null) => {
    if (!node || isFetching || isError) return;

    const visibleWinningLinks = findVisibleWinningLinks(endingArticle);
    if (isGameRunning) {
      setLastArticleWinningLinks(visibleWinningLinks.length);
    }

    if (!isGameRunning) {
      for (const link of visibleWinningLinks) {
        link.style.color = "#aa6600";
        link.style.border = "1px solid #aa6600";
        link.style.fontWeight = "bold";
      }
    }
  };

  if (isFetching) {
    return <Loader />;
  }

  return (
    <>
      {data?.html && (
        <>
          <h2 className="border-secondary-border border-b-[1px] font-serif text-3xl sm:mt-8">{data.title}</h2>
          <div className={clsx("unreset wiki-insert", isDarkTheme && "wiki-dark-theme")}>
            {/* todo delete unused classnames */}
            <div
              id="wikiHtml"
              className="client-js vector-feature-language-in-header-enabled vector-feature-language-in-main-page-header-disabled vector-feature-language-alert-in-sidebar-enabled vector-feature-sticky-header-disabled vector-feature-page-tools-disabled vector-feature-page-tools-pinned-disabled vector-feature-toc-pinned-enabled vector-feature-main-menu-pinned-disabled vector-feature-limited-width-enabled vector-feature-limited-width-content-enabled vector-animations-ready ve-available"
            >
              {/* todo delete unused classnames */}
              <div
                id="wikiBody"
                className="skin-vector vector-body skin-vector-search-vue mediawiki ltr sitedir-ltr mw-hide-empty-elt ns-0 ns-subject skin-vector-2022 action-view uls-dialog-sticky-hide vector-below-page-title"
              >
                <div
                  role="button"
                  tabIndex={0}
                  ref={(ref) => {
                    wikiRefCallback(ref);
                  }}
                  onClick={handleClickInsideWikiArticle}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleClickInsideWikiArticle(e as unknown as React.MouseEvent<HTMLDivElement>)
                  }
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: <>
                  dangerouslySetInnerHTML={{ __html: purify.sanitize(data.html) }}
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
