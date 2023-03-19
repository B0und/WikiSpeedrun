import { usePauseWhileLoading, useWikiQuery } from './WikiDisplay.utils';
import useWikiLogic from './WikiLogic';

import './unreset.css';
import './vec2022-base.css';
import './vector2022.css';
import './overrides.css';

const WikiDisplay = () => {
  const { handleWikiArticleClick } = useWikiLogic();
  const { isFetching, data } = useWikiQuery();

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
